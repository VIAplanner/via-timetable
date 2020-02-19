import requests
import re
import json
from bs4 import BeautifulSoup
from subject import Subject

source = requests.get(
    "https://student.utm.utoronto.ca/calendar//program_group.pl?Group_Id=9").text
soup = BeautifulSoup(source, 'lxml')
all_degrees = ["HBA", "HBSc", "BBA", "BCom"]

subject = Subject()
title = soup.find('p', class_='titlestyle')
body = soup.find('div', class_='centralpos').find('div', class_='contentpos')
notes = body.find('ol', class_="numbers").find_all('li')
programs = body.find_all('p', class_="title_program")

subject_name = title.text.split(' (')[0]
subject_degrees = []
subject_notes = [] 
subject_programs = []

subject.set_name(subject_name)

for degree in all_degrees:
    if degree in title.text:
        subject.add_degree(degree)

for note in notes:
    subject.add_note(note.text.replace("\r", "").strip())

for program in programs:
    subject.add_program(program.text)


subject_json = json.dumps(subject.__dict__, indent=4)
print(subject_json)
