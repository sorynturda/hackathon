
from monog_client import MongoDBClient
import numpy as np
import re
from difflib import SequenceMatcher
from datetime import datetime
from logic_helper import generate_match_reasoning_with_llm,generate_match_reasoning,extract_resume_skills, calculate_skills_score, extract_job_experience_years, fuzzy_similarity, find_best_skill_match, find_skill_matches, extract_years_from_text, compute_experience_match_score, calculate_experience_years, compute_language_match_score, cosine_similarity


def get_matches_for_resume(id: int, userId: int, limit: int = 5):
    mongo_client = MongoDBClient.get_instance()
    try:
        # Get the resume
        resume = mongo_client.get_resume_by_id(id)
        if not resume:
            raise ValueError(f"Resume with ID {id} not found")
        
        # Step 1: Extract available embeddings
        query_vectors = []
        weights = []
        
        # Try to get professional experience embeddings (most recent first)
        prof_experiences = resume.extracted_info.PROFESSIONAL_EXPERIENCE
        if prof_experiences:
            k = 0.4
            for exp in prof_experiences[:2]:
                if hasattr(exp, 'professional_experience_embedding') and exp.professional_experience_embedding:
                    query_vectors.append(exp.professional_experience_embedding)
                    weights.append(k)  
                    k -= 0.05
        # Try to get project experience embeddings
        proj_experiences = resume.extracted_info.PROJECT_EXPERIENCE
        remaining_slots = 3 - len(query_vectors)  
        
        if proj_experiences and remaining_slots > 0:
            for proj in proj_experiences[:remaining_slots]:
                if hasattr(proj, 'project_experience_embedding') and proj.project_experience_embedding:
                    query_vectors.append(proj.project_experience_embedding)
                    weights.append(0.3)  # Slightly lower weight for projects
        
        # Determine which path and query vector to use
        use_full_embedding = len(query_vectors) < 2  # Use full embedding if we have less than 2 specific embeddings
        
        if use_full_embedding:
            # Use the full resume embedding
            search_vector = resume.full_text_embedding
            search_path = "full_text_embedding"
        else:
            # Combine experience embeddings with weights
            combined_vector = np.zeros(len(query_vectors[0]))  # Assuming all vectors have same dimension
            for vec, weight in zip(query_vectors, weights):
                combined_vector += np.array(vec) * weight
            
            # Normalize the combined vector
            norm = np.linalg.norm(combined_vector)
            if norm > 0:
                combined_vector = combined_vector / norm
            
            search_vector = combined_vector.tolist()
            search_path = "extracted_info.KEY_RESPONSIBILITIES_EMBEDDING"  # Use job responsibilities embedding
        
        # Step 3: Perform vector search with appropriate vector and path
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "queryVector": search_vector,
                    "path": search_path,
                    "numCandidates": limit * 50,
                    "limit": limit * 20
                }
            },
            {
                "$match": {
                    "user_id": userId
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "extracted_info.JOB_TITLE": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            },
            {
                "$limit": 3 * limit
            }
        ]
        
        results = list(mongo_client.job_postings_collection.aggregate(pipeline))
        
        # Step 4: Return results with similarity scores
        return [
            {
                "job_id": doc["_id"],
                "job_title": doc["extracted_info"]["JOB_TITLE"],
                "similarity_score": round(doc["score"] * 10, 2)
            }
            for doc in results
        ]
    except Exception as e:
        print(e)
        return []

def get_matches_for_jd(id: int, userId: int, limit: int = 5):
    # Get initial data
    mongo_client = MongoDBClient.get_instance()
    
    try:
        # Get the job posting
        job = mongo_client.get_job_by_id(id)
        if not job:
            raise ValueError(f"Job posting with ID {id} not found")
        
        # Step 1: Extract available embeddings
        query_vectors = []
        weights = []
        
        use_full_embedding = True
        # Try to get key responsibilities embedding
        if hasattr(job.extracted_info, 'KEY_RESPONSIBILITIES_EMBEDDING') and job.extracted_info.KEY_RESPONSIBILITIES_EMBEDDING:
            qvec = job.extracted_info.KEY_RESPONSIBILITIES_EMBEDDING
        else:
            use_full_embedding = False
        
       
        if use_full_embedding:
            # Use the full job posting embedding
            search_vector = job.full_text_embedding
            search_path = "full_text_embedding"
        else:
            search_vector = qvec
            search_path = "extracted_info.PROFESSIONAL_EXPERIENCE.professional_experience_embedding"
        
        # Step 3: Perform vector search with appropriate vector and path
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "queryVector": search_vector,
                    "path": search_path,
                    "numCandidates": limit * 50,
                    "limit": limit * 20
                }
            },
            {
                "$match": {
                    "user_id": userId
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "extracted_info.NAME": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            },
            {
                "$limit": 3 * limit
            }
        ]
        
        results = list(mongo_client.resumes_collection.aggregate(pipeline))
        
        # Step 4: Return results with similarity scores
        return [
            {
                "resume_id": doc["_id"],
                "candidate_name": doc["extracted_info"]["NAME"],
                "similarity_score": round(doc["score"] * 10, 2)
            }
            for doc in results
        ]
    except Exception as e:
        print(e)
        return []


def get_comprehensive_matches_for_resume(id: int, userId: int, limit: int = 10, 
                                         vector_weight=0.35, skills_weight=0.35,
                                         language_weight=0.10, experience_weight=0.20):
    mongo_client = MongoDBClient.get_instance()
    try:
        # Get the resume
        resume = mongo_client.get_resume_by_id(id)
        if not resume:
            raise ValueError(f"Resume with ID {id} not found")
       
        # Step 1: Get initial candidates using vector similarity (experience-based matching)
        initial_matches = get_matches_for_resume(id, userId, limit * 5)
        job_ids = [match["job_id"] for match in initial_matches]

        vector_scores = {match["job_id"]: match["similarity_score"] for match in initial_matches}
        
        if not job_ids:
            return {"candidate_name": resume.extracted_info.NAME, "jobs": []}
        
        # Step 2: Extract resume skills using the helper function
        resume_tech_skills, resume_soft_skills = extract_resume_skills(resume)
        
        # Calculate candidate's years of experience
        resume_experience_years = calculate_experience_years(resume.extracted_info.PROFESSIONAL_EXPERIENCE)
        
        # Calculate scores for each job
        combined_scores = []
        
        for job_id in job_ids:
            # Get the job posting
            job = mongo_client.get_job_by_id(job_id)
            if not job:
                continue
            
            # Get job skills
            required_tech_skills = job.extracted_info.REQUIRED_QUALIFICATIONS.TECHNICAL_SKILLS
            nice_to_have_tech_skills = job.extracted_info.OPTIONAL_SKILLS.TECHNICAL_SKILLS
            required_soft_skills = job.extracted_info.REQUIRED_QUALIFICATIONS.SOFT_SKILLS
            nice_to_have_soft_skills = job.extracted_info.OPTIONAL_SKILLS.SOFT_SKILLS
            
            # Get job languages
            required_languages = job.extracted_info.REQUIRED_QUALIFICATIONS.LANGUAGES
            
            # Get job required experience
            job_min_years, job_max_years = extract_job_experience_years(job)
            
            # Use helper function to calculate skills score and get matching details
            skills_score, skills_matching, unmatched_skills = calculate_skills_score(
                required_tech_skills, nice_to_have_tech_skills, 
                required_soft_skills, nice_to_have_soft_skills,
                resume_tech_skills, resume_soft_skills
            )
            
            # Step 3: Calculate language match score
            language_score = compute_language_match_score(resume.extracted_info.LANGUAGES, required_languages)
            
            # Step 4: Calculate experience years match score
            experience_score = compute_experience_match_score(resume_experience_years, job_min_years, job_max_years)
            
            # Step 5: Scale all scores to 0-10 to match vector similarity scale
            skills_score_scaled = skills_score * 10
            language_score_scaled = language_score * 10
            experience_score_scaled = experience_score * 10
            
            # Normalize vector score (assuming 0-10 scale)
            vector_score = vector_scores[job_id]
            
            # Calculate composite score with all weights
            composite_score = (
                (vector_weight * vector_score) + 
                (skills_weight * skills_score_scaled) + 
                (language_weight * language_score_scaled) + 
                (experience_weight * experience_score_scaled)
            )
            
            # Generate reasoning text using the LLM function
            reasoning = generate_match_reasoning_with_llm(
                resume.extracted_info.NAME,
                vector_score, skills_score_scaled, language_score_scaled, 
                experience_score_scaled, 0,  # No custom skills score for resume matching
                skills_matching, unmatched_skills,
                resume_experience_years, job_min_years, job_max_years,
                [], []  # No custom skills for resume matching
            )
            
            # Format job match in the required structure
            job_match = {
                "job_id": job_id,
                "job_position": job.extracted_info.JOB_TITLE,
                "overall_match": round(composite_score, 2),
                "missing_skills_req": unmatched_skills["required_tech"],  # Using just technical required skills
                "matching_skills_req": skills_matching,
                "reasoning": reasoning
            }
            
            combined_scores.append(job_match)
        
        # Sort by composite score and return top results
        combined_scores.sort(key=lambda x: x["overall_match"], reverse=True)
        top_jobs = combined_scores[:limit]
        
        # Format final response
        response = {
            "candidate_name": resume.extracted_info.NAME,
            "jobs": top_jobs
        }
        
        return response
        
    except Exception as e:
        print(e)
        return {"candidate_name": "Unknown", "jobs": []}


def get_comprehensive_matches_for_job(id: int, userId: int, limit: int = 10,
                                     vector_weight=0.50, skills_weight=0.20,
                                     language_weight=0.10, experience_weight=0.20,
                                     custom_skills_inputs=None):
    mongo_client = MongoDBClient.get_instance()
    
    # Check if custom skills are provided
    has_custom_skills = custom_skills_inputs and len(custom_skills_inputs) > 0
    
    if has_custom_skills:
        # If custom skills are provided, adjust weights to represent 60% of the total score
        original_total = vector_weight + skills_weight + language_weight + experience_weight
        adjusted_vector_weight = (vector_weight / original_total) * 0.6
        adjusted_skills_weight = (skills_weight / original_total) * 0.6
        adjusted_language_weight = (language_weight / original_total) * 0.6
        adjusted_experience_weight = (experience_weight / original_total) * 0.6
        
        # Custom skills account for 40% of the total score
        custom_skills_weight = 0.4
    else:
        # If no custom skills are provided, use the original weights as 100%
        adjusted_vector_weight = vector_weight
        adjusted_skills_weight = skills_weight
        adjusted_language_weight = language_weight
        adjusted_experience_weight = experience_weight
        custom_skills_weight = 0  # No weight for custom skills
    
    try:
        job = mongo_client.get_job_by_id(id)
        if not job:
            raise ValueError(f"Job posting with ID {id} not found")
        
        job_title = job.extracted_info.JOB_TITLE
        
        # Extract job required experience
        job_min_years, job_max_years = extract_job_experience_years(job)

        # Get job skills
        required_tech_skills = job.extracted_info.REQUIRED_QUALIFICATIONS.TECHNICAL_SKILLS
        nice_to_have_tech_skills = job.extracted_info.OPTIONAL_SKILLS.TECHNICAL_SKILLS
        required_soft_skills = job.extracted_info.REQUIRED_QUALIFICATIONS.SOFT_SKILLS
        nice_to_have_soft_skills = job.extracted_info.OPTIONAL_SKILLS.SOFT_SKILLS
        required_languages = job.extracted_info.REQUIRED_QUALIFICATIONS.LANGUAGES
        
        # Get initial candidates using vector similarity
        from logic import get_matches_for_jd
        initial_matches = get_matches_for_jd(id, userId, limit * 5)
        
        # Initial list and vector scores
        resume_ids = [match["resume_id"] for match in initial_matches]
        vector_scores = {match["resume_id"]: match["similarity_score"] for match in initial_matches}
        
        if not resume_ids:
            return {"job_position": job_title, "candidates": []}
        
        combined_scores = []
        
        # Process custom skills inputs - default to empty list if None
        custom_skills = custom_skills_inputs or []
        
        for resume_id in resume_ids:
            resume = mongo_client.get_resume_by_id(resume_id)
            if not resume:
                continue
            
            # Get resume skills using the helper function
            resume_tech_skills, resume_soft_skills = extract_resume_skills(resume)
            all_resume_skills = resume_tech_skills + resume_soft_skills
            
            # Calculate candidate's years of experience
            resume_experience_years = calculate_experience_years(resume.extracted_info.PROFESSIONAL_EXPERIENCE)
            
            # Calculate skills match scores using the helper function
            skills_score, skills_matching, unmatched_skills = calculate_skills_score(
                required_tech_skills, nice_to_have_tech_skills, 
                required_soft_skills, nice_to_have_soft_skills,
                resume_tech_skills, resume_soft_skills
            )
            
            # Calculate language match score
            language_score = compute_language_match_score(resume.extracted_info.LANGUAGES, required_languages)
            
            # Calculate experience years match score
            experience_score = compute_experience_match_score(resume_experience_years, job_min_years, job_max_years)
            
            # Scale all scores to 0-10 to match vector similarity scale
            skills_score_scaled = skills_score * 10
            language_score_scaled = language_score * 10
            experience_score_scaled = experience_score * 10 
            
            # Get vector score (assuming 0-10 scale)
            vector_score = vector_scores[resume_id]
            
            # Calculate custom skills match score (only if custom skills are provided)
            custom_skills_score = 0
            custom_skills_matches = []
            custom_skills_missing = []
            
            if has_custom_skills:
                total_weight = sum(item["weight"] for item in custom_skills)
                normalized_weights = {item["skill"]: (item["weight"] / total_weight if total_weight > 0 else 0) 
                                      for item in custom_skills}
                
                # For each custom skill, find the best match in resume skills
                for skill_item in custom_skills:
                    skill_name = skill_item["skill"]
                    normalized_weight = normalized_weights[skill_name]
                    
                    # Find best match
                    best_match, score = find_best_skill_match(skill_name, all_resume_skills)
                    
                    if best_match and score >= 0.85:
                        custom_skills_score += normalized_weight * score * 10  # Scale to 0-10
                        custom_skills_matches.append(skill_name)
                    else:
                        custom_skills_missing.append(skill_name)
            
            # Calculate composite score with weights
            composite_score = (
                (adjusted_vector_weight * vector_score) + 
                (adjusted_skills_weight * skills_score_scaled) + 
                (adjusted_language_weight * language_score_scaled) + 
                (adjusted_experience_weight * experience_score_scaled)
            )
            
            # Only add custom skills component if it exists
            if has_custom_skills:
                composite_score += (custom_skills_weight * custom_skills_score)
            
            # Generate reasoning text using LLM
            reasoning = generate_match_reasoning_with_llm(
                resume.extracted_info.NAME,
                vector_score, skills_score_scaled, language_score_scaled, 
                experience_score_scaled, custom_skills_score if has_custom_skills else None,
                skills_matching, unmatched_skills,
                resume_experience_years, job_min_years, job_max_years,
                custom_skills_matches, custom_skills_missing
            )
            
            # Prepare detailed match info (for internal use)
            detailed_match_info = {
                "resume_id": resume_id,
                "candidate_name": resume.extracted_info.NAME,
                "vector_score": round(vector_score, 2),
                "skills_score": round(skills_score_scaled, 2),
                "language_score": round(language_score_scaled, 2),
                "experience_score": round(experience_score_scaled, 2),
                "custom_skills_score": round(custom_skills_score, 2) if has_custom_skills else None,
                "composite_score": round(composite_score, 2),
                "skills_matching": skills_matching,
                "skills_missing": unmatched_skills,
                "language_matching": [lang.language for lang in resume.extracted_info.LANGUAGES 
                                     if any(fuzzy_similarity(lang.language, job_lang) >= 0.9 
                                           for job_lang in required_languages)],
                "experience_summary": {
                    "candidate_years": resume_experience_years,
                    "job_required_min": job_min_years,
                    "job_required_max": job_max_years
                },
                "custom_skills_matching": custom_skills_matches,
                "custom_skills_missing": custom_skills_missing
            }
            
            # Prepare response object format - include custom skills in matching/missing skills
            all_matching_skills = skills_matching.copy()
            all_missing_skills = unmatched_skills["required_tech"].copy()
            
            # Add custom skills to matching/missing if they exist
            if has_custom_skills:
                for skill in custom_skills_matches:
                    if skill not in all_matching_skills:
                        all_matching_skills.append(skill.replace(' ', '_'))
                        
                for skill in custom_skills_missing:
                    if skill not in all_missing_skills:
                        all_missing_skills.append(skill)
            
            response_match = {
                "cv_id": resume_id,
                "candidate_name": resume.extracted_info.NAME,
                "overall_match": round(composite_score, 2),
                "missing_skills_req": all_missing_skills,
                "matching_skills_req": all_matching_skills,
                "reasoning": reasoning
            }
            
            # Store both formats for sorting
            combined_scores.append({
                "detailed": detailed_match_info,
                "response": response_match
            })
        
        # Sort by composite score and return top results
        combined_scores.sort(key=lambda x: x["detailed"]["composite_score"], reverse=True)
        top_results = combined_scores[:limit]
        
        # Format the final response
        response = {
            "job_position": job_title,
            "candidates": [match["response"] for match in top_results]
        }
        
        return response
    except Exception as e:
        print(f"Error in get_comprehensive_matches_for_job: {e}")
        return {"job_position": "Unknown", "candidates": []}


