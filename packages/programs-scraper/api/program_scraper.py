import requests
import re
import json
from bs4 import BeautifulSoup, element
from subject import Subject
from program import Program
from typing import Tuple
from tqdm import tqdm  # progress bar magic


# test if a subject is no longer offered
def subject_exist(url: str) -> bool:
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    exist = soup.find('div', class_='centralpos').find('div', class_='contentpos').find(
        'dl', class_='title2')  # if the there are any program advisors
    return exist is not None


def program_exist(title_soup) -> bool:
    test_soup = title_soup.next_sibling
    if repr(test_soup) == repr('\n'):
        test_soup = test_soup.next_sibling

    if isinstance(test_soup, element.NavigableString):
        if "discontinued" in test_soup.string:
            return False
    elif isinstance(test_soup, element.Tag):
        if "discontinued" in test_soup.text:
            return False

    return True


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


# subject_ids = all_subject_ids("https://student.utm.utoronto.ca/calendar//program_list.pl")
subject_ids = ('9',)

for subject_id in tqdm(subject_ids):

    url = "https://student.utm.utoronto.ca/calendar//program_group.pl?Group_Id=" + subject_id
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    all_degrees = ["HBA", "HBSc", "BBA", "BCom"]

    if subject_exist(url):
        subject = Subject()
        title = soup.find('p', class_='titlestyle')
        body = soup.find('div', class_='centralpos').find(
            'div', class_='contentpos')
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

        for program_soup in programs:
            curr_program = Program()
            if not program_exist(program_soup):
                continue
            
            curr_program.set_name(program_soup.text.split(' ')[2][9:] + ' ' + ' '.join(program_soup.text.split(' ')[3:]))
            curr_program.set_code(''.join(program_soup.text.split(' ')[2][0:8]))
            curr_program.set_level(program_soup.text.split(' ')[0])

            limited_enrollment_courses = program_soup.find_next_sibling(
                'div', class_='lim_enrol')

            if limited_enrollment_courses is not None:
                limited_enrollment_courses = limited_enrollment_courses.find_all(
                    'a')
                if limited_enrollment_courses is not None:
                    for course_soup in limited_enrollment_courses:
                        if len(course_soup.text) == 8:
                            curr_program.add_course(course_soup.text)

            table_courses = program_soup.find_next_sibling(
                'table', class_='tab_adm')

            if table_courses is not None:
                table_courses = table_courses.find_all('a')
                if table_courses is not None:
                    for course_soup in table_courses:
                        if len(course_soup.text) == 8:
                            curr_program.add_course(course_soup.text)

            subject.add_program(curr_program)


        with open('../output/subjects/' + subject.name + '.json', 'w') as file:
            json.dump(subject.to_json(), file)
