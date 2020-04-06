import pymongo
import json
from pymongo import MongoClient
import os
from tqdm import tqdm  # progress bar magic


# the mongodb server
cluster = MongoClient(
    "mongodb+srv://user_1:coursetools@coursetoolscluster-wjb51.mongodb.net/test?retryWrites=true&w=majority")
db = cluster["UofT"]
collection = db["Subjects"]
subjects_directory = "../output/subjects/"

# adding all JSON from local to server
for subject in tqdm(os.listdir(subjects_directory)):
    with open(subjects_directory + subject) as f:
        print(f)
        file_data = json.load(f)
    collection.insert_one(file_data)