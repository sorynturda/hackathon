from monog_client import MongoDBClient
import numpy as np
import re
from difflib import SequenceMatcher
from datetime import datetime

def fuzzy_similarity(str1, str2):
        """Calculate fuzzy string similarity using SequenceMatcher"""
        return SequenceMatcher(None, str1.lower(), str2.lower()).ratio()
    
def find_best_skill_match(skill, skill_list, threshold=0.85):
        """Find the best matching skill from the list using fuzzy matching"""
        best_match = None
        best_score = 0
        
        for s in skill_list:
            similarity = fuzzy_similarity(skill, s)
            if similarity >= threshold and similarity > best_score:
                best_score = similarity
                best_match = s
                
        return best_match, best_score
    
def find_skill_matches(required_skills, resume_skills, threshold=0.85):
        """Find which skills match and which don't using fuzzy matching"""
        matched = []
        unmatched = []
        
        for req_skill in required_skills:
            best_match, score = find_best_skill_match(req_skill, resume_skills, threshold)
            if best_match:
                matched.append({
                    "job_skill": req_skill,
                    "resume_skill": best_match,
                    "match_score": round(score, 2)
                })
            else:
                unmatched.append(req_skill)
                
        return matched, unmatched

def cosine_similarity(vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        if not vec1 or not vec2:
            return 0
        dot_product = np.dot(vec1, vec2)
        norm_a = np.linalg.norm(vec1)
        norm_b = np.linalg.norm(vec2)
        if norm_a == 0 or norm_b == 0:
            return 0
        return dot_product / (norm_a * norm_b)

def compute_language_match_score(resume_languages, job_languages):
        """Compute language match score (0-1) based on required languages"""
        if not job_languages:
            return 1.0  # If job doesn't specify languages, consider it a perfect match
        
        resume_lang_names = [lang.language.lower() for lang in resume_languages]
        job_lang_names = [lang.lower() for lang in job_languages]
        
        matched_count = 0
        for job_lang in job_lang_names:
            for resume_lang in resume_lang_names:
                if fuzzy_similarity(job_lang, resume_lang) >= 0.9:
                    matched_count += 1
                    break
        
        # Calculate match percentage
        match_score = matched_count / len(job_lang_names) if job_lang_names else 1.0
        return match_score

def extract_years_from_text(text):
        """Extract years of experience from text using various patterns"""
        if not text:
            return []
        
        # Pattern for X-Y years or X to Y years
        range_pattern = r'(\d+)[\s-]*(?:to|-)[\s-]*(\d+)\s*(?:years|yrs)'
        # Pattern for X years
        single_pattern = r'(\d+)\s*(?:years|yrs|\+\s*years|\+\s*yrs|years\+|yrs\+)'
        
        years = []
        
        # Check for range pattern
        range_matches = re.findall(range_pattern, text, re.IGNORECASE)
        for match in range_matches:
            try:
                min_years = int(match[0])
                max_years = int(match[1])
                years.extend([min_years, max_years])
            except (ValueError, IndexError):
                pass
        
        # Check for single pattern if no range was found
        if not years:
            single_matches = re.findall(single_pattern, text, re.IGNORECASE)
            for match in single_matches:
                try:
                    years.append(int(match))
                except ValueError:
                    pass
                    
        return years

def calculate_experience_years(professional_experiences):
        """Calculate total years of experience from professional experience entries"""
        total_years = 0
        current_year = datetime.now().year
        
        for exp in professional_experiences:
            if hasattr(exp, 'period') and len(exp.period) >= 2:
                # Try to extract start and end years
                try:
                    start_text = exp.period[0]
                    end_text = exp.period[1].lower()
                    
                    # Extract start year
                    start_year = None
                    if re.search(r'\d{4}', start_text):
                        # Format: MM/YYYY or MM-YYYY or YYYY
                        match = re.search(r'(\d{4})', start_text)
                        if match:
                            start_year = int(match.group(1))
                    elif re.search(r'\d{2}/\d{2}', start_text):
                        # Format: MM/YY
                        match = re.search(r'\d{2}/(\d{2})', start_text)
                        if match:
                            year = int(match.group(1))
                            start_year = 2000 + year if year < 50 else 1900 + year
                            
                    # Extract end year
                    end_year = None
                    if end_text in ['present', 'current', 'now', 'ongoing']:
                        end_year = current_year
                    elif re.search(r'\d{4}', end_text):
                        match = re.search(r'(\d{4})', end_text)
                        if match:
                            end_year = int(match.group(1))
                    elif re.search(r'\d{2}/\d{2}', end_text):
                        match = re.search(r'\d{2}/(\d{2})', end_text)
                        if match:
                            year = int(match.group(1))
                            end_year = 2000 + year if year < 50 else 1900 + year
                    
                    # Calculate duration if both years are available
                    if start_year and end_year and start_year <= end_year:
                        duration = end_year - start_year
                        total_years += duration
                except (ValueError, IndexError):
                    pass
        
        return total_years

def compute_experience_match_score(resume_experience_years, job_min_years, job_max_years):
        """
        Compute experience match score (0-1) based on job requirements
        
        Perfect match (1.0): Experience >= required minimum but not excessive (not > max + 3)
        Good match (0.8): Experience slightly below minimum (min - 1)
        Fair match (0.6): Experience slightly below minimum (min - 2)
        Poor match (0.4): Experience far below minimum (min - 3 or more)
        Overqualified (0.7): Experience significantly above maximum (max + 3 or more)
        """
        if job_min_years is None:
            return 1.0  # If job doesn't specify experience, consider it a perfect match
        
        # Default max years if only minimum is specified
        if job_max_years is None:
            job_max_years = job_min_years + 5
            
        if resume_experience_years >= job_min_years:
            if resume_experience_years <= job_max_years + 3:
                # Perfect match - meets or exceeds requirements but not excessively
                return 1.0
            else:
                # Overqualified
                return 0.7
        elif resume_experience_years >= job_min_years - 1:
            # Good match - slightly below minimum
            return 0.8
        elif resume_experience_years >= job_min_years - 2:
            # Fair match - below minimum
            return 0.6
        else:
            # Poor match - far below minimum
            return 0.4
        
def extract_job_experience_years(job):
    job_min_years = None
    job_max_years = None
    
    # Try to extract from MINIMUM_EXPERIENCE
    if hasattr(job.extracted_info.REQUIRED_QUALIFICATIONS, 'MINIMUM_EXPERIENCE'):
        min_exp = job.extracted_info.REQUIRED_QUALIFICATIONS.MINIMUM_EXPERIENCE
        if hasattr(min_exp, 'years') and min_exp.years:
            try:
                # Try to handle different formats
                if len(min_exp.years) >= 2:
                    job_min_years = int(min_exp.years[0])
                    job_max_years = int(min_exp.years[1])
                elif len(min_exp.years) == 1:
                    job_min_years = int(min_exp.years[0])
            except (ValueError, TypeError):
                pass
                
    return job_min_years, job_max_years


def extract_resume_skills(resume):
   
    resume_tech_skills = resume.extracted_info.TECHNICAL_SKILLS.copy()
    resume_soft_skills = resume.extracted_info.SOFT_SKILLS.copy()
    
  
    project_technologies = []
    for project in resume.extracted_info.PROJECT_EXPERIENCE:
        project_technologies.extend(project.technologies)
    
    for tech in project_technologies:
        if not any(fuzzy_similarity(tech, skill) > 0.8 for skill in resume_tech_skills):
            resume_tech_skills.append(tech)
    
    return resume_tech_skills, resume_soft_skills

def calculate_skills_score(required_tech_skills, nice_to_have_tech_skills, 
                          required_soft_skills, nice_to_have_soft_skills,
                          resume_tech_skills, resume_soft_skills):
    
    matched_req_tech, unmatched_req_tech = find_skill_matches(required_tech_skills, resume_tech_skills)
    matched_nice_tech, unmatched_nice_tech = find_skill_matches(nice_to_have_tech_skills, resume_tech_skills)
    matched_req_soft, unmatched_req_soft = find_skill_matches(required_soft_skills, resume_soft_skills)
    matched_nice_soft, unmatched_nice_soft = find_skill_matches(nice_to_have_soft_skills, resume_soft_skills)
    
    # Calculate skills percentages
    req_tech_score = len(matched_req_tech) / len(required_tech_skills) if required_tech_skills else 0
    req_soft_score = len(matched_req_soft) / len(required_soft_skills) if required_soft_skills else 0
    
    nice_tech_bonus = 0.2 * (len(matched_nice_tech) / len(nice_to_have_tech_skills) if nice_to_have_tech_skills else 0)
    nice_soft_bonus = 0.1 * (len(matched_nice_soft) / len(nice_to_have_soft_skills) if nice_to_have_soft_skills else 0)
    
    skills_score = 0.8 * req_tech_score + 0.2 * req_soft_score + nice_tech_bonus + nice_soft_bonus
    skills_score = min(skills_score, 1.0)
    
    skills_matching = [e['job_skill'].replace(' ', '_') for e in matched_req_tech] + \
                     [e['job_skill'].replace(' ', '_') for e in matched_nice_tech] + \
                     [e['job_skill'].replace(' ', '_') for e in matched_req_soft] + \
                     [e['job_skill'].replace(' ', '_') for e in matched_nice_soft]
    
    unmatched_skills = {
        'required_tech': [skill for skill in unmatched_req_tech],
        'nice_to_have_tech': [skill for skill in unmatched_nice_tech],
        'required_soft': [skill for skill in unmatched_req_soft],
        'nice_to_have_soft': [skill for skill in unmatched_nice_soft]
    }
    
    return skills_score, skills_matching, unmatched_skills




def generate_match_reasoning(candidate_name, vector_score, skills_score, language_score, 
                           experience_score, custom_skills_score,
                           skills_matching, unmatched_skills,
                           candidate_years, job_min_years, job_max_years,
                           custom_skills_matches, custom_skills_missing):
    """Generate human-readable reasoning for the match score"""
    
    reasons = []
    
    # Experience reasoning
    if job_min_years is not None:
        if candidate_years >= job_min_years:
            if job_max_years is not None and candidate_years <= job_max_years:
                reasons.append(f"{candidate_name} has {candidate_years} years of experience, which perfectly matches the job requirement of {job_min_years}-{job_max_years} years.")
            elif job_max_years is not None and candidate_years > job_max_years:
                reasons.append(f"{candidate_name} has {candidate_years} years of experience, which exceeds the job requirement of {job_min_years}-{job_max_years} years.")
            else:
                reasons.append(f"{candidate_name} has {candidate_years} years of experience, which meets the minimum requirement of {job_min_years} years.")
        else:
            years_short = job_min_years - candidate_years
            reasons.append(f"{candidate_name} has {candidate_years} years of experience, which is {years_short} years short of the minimum requirement of {job_min_years} years.")
    
    # Skills reasoning
    matching_count = len(skills_matching)
    missing_required_count = len(unmatched_skills["required_tech"]) + len(unmatched_skills["required_soft"])
    
    if matching_count > 0:
        if matching_count <= 3:
            skill_text = ", ".join(skills_matching[:3])
            reasons.append(f"Matches {matching_count} required skills including {skill_text}.")
        else:
            skill_text = ", ".join(skills_matching[:3])
            reasons.append(f"Matches {matching_count} required skills including {skill_text} and others.")
    
    if missing_required_count > 0:
        missing_skills = unmatched_skills["required_tech"] + unmatched_skills["required_soft"]
        if missing_required_count <= 3:
            skill_text = ", ".join(missing_skills[:3])
            reasons.append(f"Missing {missing_required_count} required skills: {skill_text}.")
        else:
            skill_text = ", ".join(missing_skills[:3])
            reasons.append(f"Missing {missing_required_count} required skills including {skill_text} and others.")
    
    # Custom skills reasoning
    if custom_skills_matches:
        if len(custom_skills_matches) <= 3:
            skill_text = ", ".join(custom_skills_matches)
            reasons.append(f"Matches custom priority skills: {skill_text}.")
        else:
            skill_text = ", ".join(custom_skills_matches[:3])
            reasons.append(f"Matches multiple custom priority skills including {skill_text} and others.")
    
    if custom_skills_missing:
        if len(custom_skills_missing) <= 3:
            skill_text = ", ".join(custom_skills_missing)
            reasons.append(f"Missing custom priority skills: {skill_text}.")
        else:
            skill_text = ", ".join(custom_skills_missing[:3])
            reasons.append(f"Missing several custom priority skills including {skill_text} and others.")
    
    # Overall assessment
    if vector_score >= 8:
        reasons.append("Resume shows strong semantic similarity to the job requirements.")
    elif vector_score >= 6:
        reasons.append("Resume shows moderate semantic similarity to the job requirements.")
    else:
        reasons.append("Resume shows limited semantic similarity to the job requirements.")
    
    return " ".join(reasons)