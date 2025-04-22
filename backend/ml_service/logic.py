from monog_client import MongoDBClient




def get_matches_for_resume(id: int, userId: int, limit: int = 5):

    mongo_client = MongoDBClient(
        connection_string="SORIN",
        db_name="syncv_mdb"
    )
    
    try:
        # Get the resume
        resume = mongo_client.get_resume_by_id(id)
        if not resume:
            raise ValueError(f"Resume with ID {id} not found")
        
        # Get the resume's embedding
        resume_embedding = resume.full_text_embedding
        
        # Use MongoDB's $vectorSearch (requires MongoDB Atlas with vector search enabled)
        pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index",  # Your actual index name from the screenshot
                "queryVector": resume_embedding,
                "path": "full_text_embedding",
                "numCandidates": 100,
                "limit": limit * 10  # Get more than needed for filtering
            }
        },
        {
            "$match": {
                "user_id": userId  # Filter by userId
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
            "$limit": limit
        }
    ]
        
        results = list(mongo_client.job_postings_collection.aggregate(pipeline))
        
        return [
            {
                "job_id": doc["_id"],
                "similarity_score": round(doc["score"] * 10, 2)
            }
            for doc in results
        ]
    
    finally:
        # Always close the connection when done
        mongo_client.close()

def get_matches_for_jd(id: int, userId: int, limit: int = 5):

    mongo_client = MongoDBClient(
        connection_string="SORIN",
        db_name="syncv_mdb"
    )
    
    try:
        # Get the job posting
        job = mongo_client.get_job_by_id(id)
        if not job:
            raise ValueError(f"Job posting with ID {id} not found")
        
        # Get the job's embedding
        job_embedding = job.full_text_embedding
        
        # Use MongoDB's $vectorSearch with vector_index
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "queryVector": job_embedding,
                    "path": "full_text_embedding",
                    "numCandidates": 100,
                    "limit": limit * 10
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
                "$limit": limit
            }
        ]
        
        results = list(mongo_client.resumes_collection.aggregate(pipeline))
        
        return [
            {
                "resume_id": doc["_id"],
                "similarity_score": round(doc["score"] * 10, 2)
            }
            for doc in results
        ]
    
    finally:
        # Always close the connection when done
        mongo_client.close()