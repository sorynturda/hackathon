from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
from config import MONGODB_CONFIG

# Resume Models
@dataclass
class ProfessionalExperience:
    company: str
    role: str
    period: List[str]
    responsibilities: str
    professional_experience_embedding: List[float] = field(default_factory=list)


@dataclass
class ProjectExperience:
    name: str
    technologies: List[str]
    description: str
    outcome: str
    project_experience_embedding: List[float] = field(default_factory=list)


@dataclass
class Education:
    degree: str
    institution: str
    period: List[str]


@dataclass
class Language:
    language: str
    proficiency: Optional[str] = None


@dataclass
class ExtractedResumeInfo:
    NAME: str
    TECHNICAL_SKILLS: List[str] = field(default_factory=list)
    SOFT_SKILLS: List[str] = field(default_factory=list)
    DOMAIN_KNOWLEDGE: List[str] = field(default_factory=list)
    PROFESSIONAL_EXPERIENCE: List[ProfessionalExperience] = field(default_factory=list)
    PROJECT_EXPERIENCE: List[ProjectExperience] = field(default_factory=list)
    CERTIFICATIONS: List[str] = field(default_factory=list)
    EDUCATION: List[Education] = field(default_factory=list)
    LANGUAGES: List[Language] = field(default_factory=list)


@dataclass
class Resume:
    _id: int
    user_id: int
    full_text: str
    full_text_embedding: List[float]
    extracted_info: ExtractedResumeInfo


# Job Posting Models
@dataclass
class MinimumExperience:
    years: List[str]
    industry: str
    description: str


@dataclass
class RequiredQualifications:
    MINIMUM_EXPERIENCE: MinimumExperience
    EDUCATION: str
    TECHNICAL_SKILLS: List[str] = field(default_factory=list)
    SOFT_SKILLS: List[str] = field(default_factory=list)
    LANGUAGES: List[str] = field(default_factory=list)


@dataclass
class OptionalSkills:
    TECHNICAL_SKILLS: List[str] = field(default_factory=list)
    SOFT_SKILLS: List[str] = field(default_factory=list)
    LANGUAGES: List[str] = field(default_factory=list)


@dataclass
class ExtractedJobInfo:
    JOB_TITLE: str
    KEY_RESPONSIBILITIES: List[str] = field(default_factory=list)
    KEY_RESPONSIBILITIES_EMBEDDING: List[float] = field(default_factory=list)
    REQUIRED_QUALIFICATIONS: RequiredQualifications = None
    OPTIONAL_SKILLS: OptionalSkills = None


@dataclass
class JobPosting:
    _id: int
    user_id: int
    full_text: str
    full_text_embedding: List[float]
    extracted_info: ExtractedJobInfo


class MongoDBClient:
    _instance = None
    
    @classmethod
    def get_instance(cls):
        """Get or create the singleton instance"""
        if cls._instance is None:
            cls._instance = cls(
                connection_string=MONGODB_CONFIG["connection_string"],
                db_name=MONGODB_CONFIG["db_name"]
            )
        return cls._instance
    
    def __init__(self, connection_string=None, db_name=None):
        """Initialize the MongoDB client with optional parameters"""
        self.connection_string = connection_string or MONGODB_CONFIG["connection_string"]
        self.db_name = db_name or MONGODB_CONFIG["db_name"]
        self.client = MongoClient(self.connection_string)
        self.db = self.client[self.db_name]
        self.resumes_collection = self.db["cvs"]
        self.job_postings_collection = self.db["jds"]
    
    def close(self):
        if self.client:
            self.client.close()
    
    # Resume methods
    def get_resume_by_id(self, resume_id: int) -> Optional[Resume]:
        doc = self.resumes_collection.find_one({"_id": resume_id})
        if not doc:
            return None
        return self._document_to_resume(doc)
    
    def get_resumes_by_user_id(self, user_id: int) -> List[Resume]:
        docs = self.resumes_collection.find({"user_id": user_id})
        return [self._document_to_resume(doc) for doc in docs]
    
    # Job Posting methods
    def get_job_by_id(self, job_id: int) -> Optional[JobPosting]:
        doc = self.job_postings_collection.find_one({"_id": job_id})
        if not doc:
            return None
        return self._document_to_job_posting(doc)
    
    def get_jobs_by_user_id(self, user_id: int) -> List[JobPosting]:
        docs = self.job_postings_collection.find({"user_id": user_id})
        return [self._document_to_job_posting(doc) for doc in docs]
    
    def _document_to_resume(self, doc: Dict) -> Resume:
        # Process ProfessionalExperience items
        professional_exp = []
        for exp in doc["extracted_info"].get("PROFESSIONAL_EXPERIENCE", []):
            professional_exp.append(ProfessionalExperience(
                company=exp["company"],
                role=exp["role"],
                period=exp["period"],
                responsibilities=exp["responsibilities"],
                professional_experience_embedding=exp.get("professional_experience_embedding", [])
            ))
        
        # Process ProjectExperience items
        project_exp = []
        for proj in doc["extracted_info"].get("PROJECT_EXPERIENCE", []):
            project_exp.append(ProjectExperience(
                name=proj["name"],
                technologies=proj["technologies"],
                description=proj["description"],
                outcome=proj["outcome"],
                project_experience_embedding=proj.get("project_experience_embedding", [])
            ))
        
        # Process Education items
        education = []
        for edu in doc["extracted_info"].get("EDUCATION", []):
            education.append(Education(
                degree=edu["degree"],
                institution=edu["institution"],
                period=edu["period"]
            ))
        
        # Process Language items
        languages = []
        for lang in doc["extracted_info"].get("LANGUAGES", []):
            languages.append(Language(
                language=lang["language"],
                proficiency=lang.get("proficiency")
            ))
        
        # Create ExtractedResumeInfo
        extracted_info = ExtractedResumeInfo(
            NAME=doc["extracted_info"].get("NAME", ""),
            TECHNICAL_SKILLS=doc["extracted_info"].get("TECHNICAL_SKILLS", []),
            SOFT_SKILLS=doc["extracted_info"].get("SOFT_SKILLS", []),
            DOMAIN_KNOWLEDGE=doc["extracted_info"].get("DOMAIN_KNOWLEDGE", []),
            PROFESSIONAL_EXPERIENCE=professional_exp,
            PROJECT_EXPERIENCE=project_exp,
            CERTIFICATIONS=doc["extracted_info"].get("CERTIFICATIONS", []),
            EDUCATION=education,
            LANGUAGES=languages
        )
        
        # Create Resume
        return Resume(
            _id=doc["_id"],
            user_id=doc["user_id"],
            full_text=doc["full_text"],
            full_text_embedding=doc["full_text_embedding"],
            extracted_info=extracted_info
        )

    def _document_to_job_posting(self, doc: Dict) -> Any:
        min_exp = MinimumExperience(
            years=doc["extracted_info"]["REQUIRED_QUALIFICATIONS"].get("MINIMUM_EXPERIENCE", {}).get("years", []),
            industry=doc["extracted_info"]["REQUIRED_QUALIFICATIONS"].get("MINIMUM_EXPERIENCE", {}).get("industry", ""),
            description=doc["extracted_info"]["REQUIRED_QUALIFICATIONS"].get("MINIMUM_EXPERIENCE", {}).get("description", "")
        )
    
        required_quals = RequiredQualifications(
            MINIMUM_EXPERIENCE=min_exp,
            EDUCATION=doc["extracted_info"]["REQUIRED_QUALIFICATIONS"].get("EDUCATION", ""),
            TECHNICAL_SKILLS=doc["extracted_info"]["REQUIRED_QUALIFICATIONS"].get("TECHNICAL_SKILLS", []),
            SOFT_SKILLS=doc["extracted_info"]["REQUIRED_QUALIFICATIONS"].get("SOFT_SKILLS", []),
            LANGUAGES=doc["extracted_info"]["REQUIRED_QUALIFICATIONS"].get("LANGUAGES", [])
        )
    
        # Process OptionalSkills

        optional_skills = OptionalSkills(
            TECHNICAL_SKILLS=doc["extracted_info"].get("OPTIONAL_SKILLS", {}).get("TECHNICAL_SKILLS", []),
            SOFT_SKILLS=doc["extracted_info"].get("OPTIONAL_SKILLS", {}).get("SOFT_SKILLS", []),
            LANGUAGES=doc["extracted_info"].get("OPTIONAL_SKILLS", {}).get("LANGUAGES", [])
        )
    

        # Create ExtractedJobInfo
        extracted_info = ExtractedJobInfo(
            JOB_TITLE=doc["extracted_info"].get("JOB_TITLE", ""),
            KEY_RESPONSIBILITIES=doc["extracted_info"].get("KEY_RESPONSIBILITIES", []),
            KEY_RESPONSIBILITIES_EMBEDDING=doc["extracted_info"].get("KEY_RESPONSIBILITIES_EMBEDDING", []),
            REQUIRED_QUALIFICATIONS=required_quals,
            OPTIONAL_SKILLS=optional_skills
        )
    

        # Create JobPosting
        return JobPosting(
            _id=doc["_id"],
            user_id=doc["user_id"],
            full_text=doc["full_text"],
            full_text_embedding=doc["full_text_embedding"],
            extracted_info=extracted_info
        )