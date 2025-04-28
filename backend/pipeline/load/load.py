import pymongo

def load_cvs(data):
    mongo_client = pymongo.MongoClient("mongodb+srv://mihnea:1kZIOaKb9AXFVvTA@cluster0.ucqcya0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = mongo_client["syncv_mdb"]
    collection = db["cvs"]
    collection.insert_many(data)
    mongo_client.close()

def load_jds(data):
    mongo_client = pymongo.MongoClient("mongodb+srv://mihnea:1kZIOaKb9AXFVvTA@cluster0.ucqcya0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = mongo_client["syncv_mdb"]
    collection = db["jds"]
    collection.insert_many(data)
    mongo_client.close()

def delete_cvs(document_id):
    """
    Delete a CV document from MongoDB by its _id
    
    Args:
        document_id (int): The _id of the CV document to delete
    
    Returns:
        int: Number of documents deleted
    """
    mongo_client = pymongo.MongoClient("mongodb+srv://mihnea:1kZIOaKb9AXFVvTA@cluster0.ucqcya0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = mongo_client["syncv_mdb"]
    collection = db["cvs"]
    
    result = collection.delete_one({"_id": document_id})
    mongo_client.close()
    
    return result.deleted_count

def delete_jds(document_id):
    """
    Delete a JD document from MongoDB by its _id
    
    Args:
        document_id (int): The _id of the JD document to delete
    
    Returns:
        int: Number of documents deleted
    """
    mongo_client = pymongo.MongoClient("mongodb+srv://mihnea:1kZIOaKb9AXFVvTA@cluster0.ucqcya0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = mongo_client["syncv_mdb"]
    collection = db["jds"]
    
    result = collection.delete_one({"_id": document_id})
    mongo_client.close()
    
    return result.deleted_count