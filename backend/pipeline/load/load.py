import pymongo

def load_cvs(data):
    mongo_client = pymongo.MongoClient("SORIN")
    db = mongo_client["syncv_mdb"]
    collection = db["cvs"]
    collection.insert_many(data)

def load_jds(data):
    mongo_client = pymongo.MongoClient("SORIN")
    db = mongo_client["syncv_mdb"]
    collection = db["jds"]
    collection.insert_many(data)