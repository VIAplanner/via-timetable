import pymongo
import json
from pymongo import MongoClient
import os

# the mongodb server
cluster = MongoClient(
    "mongodb+srv://user_1:coursetools@coursetoolscluster-wjb51.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["UofT"]
collection = db["Courses"]
courses_directory = "courses/"

# adding all JSON from local to server
count = 0
for course in os.listdir(courses_directory):
    with open(courses_directory + course) as f:
        file_data = json.load(f)
    count += 1
    collection.insert_one(file_data)
    print(count)
