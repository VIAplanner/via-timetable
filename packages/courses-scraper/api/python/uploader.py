import pymongo
import json
from pymongo import MongoClient
import os
from tqdm import tqdm  # progress bar magic


# the mongodb server
# the url is deprecated
cluster = MongoClient(
    "mongodb+srv://user_1:coursetools@coursetoolscluster-wjb51.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["UofT"]
collection = db["Courses"]
courses_directory = "output/"

# adding all JSON from local to server
for course in tqdm(os.listdir(courses_directory)):
    with open(courses_directory + course) as f:
        file_data = json.load(f)
    collection.insert_one(file_data)