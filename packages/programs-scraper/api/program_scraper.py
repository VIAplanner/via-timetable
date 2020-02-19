import requests
import re
import json
from bs4 import BeautifulSoup
from subject import Subject
from typing import Tuple
from tqdm import tqdm # progress bar magic 


# test if a subject is no longer offered
def subject_exist(url: str) -> bool:
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    exist = soup.find('div', class_='centralpos').find('div', class_='contentpos').find(
        'dl', class_='title2')  # if the there are any program advisors
    return exist is not None

# finds all the subject ids
def all_subject_ids(url: str) -> Tuple[str]:
    ids = []
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    subject_groups = soup.find('div', class_='centralpos').find(
        'div', class_='contentpos').find_all('div', class_='normaltext')[1].find_all('ul')

    for subject_group in subject_groups:
        for subject in subject_group.find_all('li'):
            subject_id = subject.a['href'].split('=')[1]
            ids.append(subject_id)
    return tuple(ids)

    

subject_ids = all_subject_ids("https://student.utm.utoronto.ca/calendar//program_list.pl")

for subject_id in tqdm(subject_ids):

    url = "https://student.utm.utoronto.ca/calendar//program_group.pl?Group_Id=" + subject_id
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    all_degrees = ["HBA", "HBSc", "BBA", "BCom"]

    if subject_exist(url):
        subject = Subject()
        title = soup.find('p', class_='titlestyle')
        body = soup.find('div', class_='centralpos').find('div', class_='contentpos')
        notes = body.find('ol', class_="numbers")
        programs = body.find_all('p', class_="title_program")
        if notes is not None:
            notes = notes.find_all('li')


        subject.set_name(title.text.split(' (')[0])

        for degree in all_degrees:
            if degree in title.text:
                subject.add_degree(degree)

        if notes is not None:
            for note in notes:
                subject.add_note(note.text.replace("\r", "").strip())

        for program in programs:
            subject.add_program(program.text)

        with open('../output/subjects/' + subject.name + '.json', 'w') as file:
            json.dump(subject.__dict__, file)