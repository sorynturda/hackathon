import pymongo

def load_cvs(data):
    mongo_client = pymongo.MongoClient("mongodb+srv://mihnea:1kZIOaKb9AXFVvTA@cluster0.ucqcya0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = mongo_client["syncv_mdb"]
    collection = db["cvs"]
    collection.insert_many(data)

def load_jds(data):
    mongo_client = pymongo.MongoClient("mongodb+srv://mihnea:1kZIOaKb9AXFVvTA@cluster0.ucqcya0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = mongo_client["syncv_mdb"]
    collection = db["jds"]
    collection.insert_many(data)