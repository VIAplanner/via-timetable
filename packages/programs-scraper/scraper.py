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

subject_name = title.text
subject_degrees = []
subject_notes = []
subject_programs = []

for degree in all_degrees:
    if degree in title.text:
        # subject_degrees.append(degree)
        subject.add_degree(degree)

for note in notes:
    # subject_notes.append(note.text.replace("\r", "").strip())
    subject.add_note(note.text.replace("\r", "").strip())

for program in programs:
    # subject_programs.append(program.text)
    subject.add_program(program.text)


# print(title.text)
# print(subject_degrees)
# print(subject_notes)
# print(subject_programs)

subject_json = json.dumps(subject.__dict__, indent=4, sort_keys=True)
print(subject_json)
