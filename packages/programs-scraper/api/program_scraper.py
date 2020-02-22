import requests, re, json
from bs4 import BeautifulSoup, element
from subject import Subject
from program import Program
from typing import Tuple, Dict, List
from tqdm import tqdm  # progress bar magic


# test if a subject is no longer offered
def subject_exist(url: str) -> bool:
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    exist = soup.find('div', class_='centralpos').find('div', class_='contentpos').find(
        'dl', class_='title2')  # if the there are any program advisors
    return exist is not None

# test if a subject is no longer offered
def program_exist(cnl: List[str], all_program_types: Dict[str, str]) -> bool:
    return all_program_types.get(cnl[0]) is not None


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


# test if a program title is reached
def title_reached(test_soup) -> bool:
    return isinstance(test_soup, element.Tag) and test_soup.name == 'p' and test_soup['class'][0] == "title_program"


# return a dictionary with the name of the program as the key and its type as the value
def find_all_types() -> Dict[str, str]:
    url = "https://www.utm.utoronto.ca/registrar/office-registrar-publications/program-selection-guide"
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    program_list_soup = soup.find(
        'table', cellpadding="0").tbody.find_all('tr')[1:]
    type_dict = {}

    for type_soup in program_list_soup:
        type_soup = type_soup.find_all('td')[3:5]
        type_dict[type_soup[0].text.strip(
            '\n')] = type_soup[1].text.strip('\n')

    return type_dict


# finds the program name, code and its level
def code_name_level_finder(title: str) -> List[str]:

    normal_pattern = "[A-Z]{5}[0-9]{4}"
    weird_pattern = "[A-Z]{9}[0-9A-Z]"
    curr_pattern = normal_pattern
    all_values = []

    if len(re.findall(curr_pattern, title)) == 0:
        curr_pattern = weird_pattern

    all_values.append(re.findall(curr_pattern, title)[0])
    all_values.append(re.split(curr_pattern, title)[1])
    level_section = re.split(curr_pattern, title)[0]

    if "Specialist" in level_section:
        all_values.append("Specialist")
    elif "Major" in level_section:
        all_values.append("Major")
    elif "Minor" in level_section:
        all_values.append("Minor")

    return all_values

# this is the group id of every subject in UTM
subject_ids = all_subject_ids(
    "https://student.utm.utoronto.ca/calendar//program_list.pl")

all_program_types = find_all_types() # gets the type of every program

for subject_id in tqdm(subject_ids):

    url = "https://student.utm.utoronto.ca/calendar//program_group.pl?Group_Id=" + subject_id
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    all_degrees = ["HBA", "HBSc", "BBA", "BCom"]

    if subject_exist(url):
        curr_subject = Subject()
        title = soup.find('p', class_='titlestyle')
        body = soup.find('div', class_='centralpos').find(
            'div', class_='contentpos')
        notes = body.find('ol', class_="numbers")
        programs = body.find_all('p', class_="title_program")

        if notes is not None:
            notes = notes.find_all('li')

        curr_subject.set_name(title.text.split(' (')[0])

        for degree in all_degrees:
            if degree in title.text:
                curr_subject.add_degree(degree)

        if notes is not None:
            for note in notes:
                curr_subject.add_note(note.text.replace("\r", "").strip())

        for program_soup in programs:
            curr_program = Program()
            cnl = code_name_level_finder(program_soup.text)

            # if program doesn't exist, don't include it
            if not program_exist(cnl, all_program_types):
                continue

            cnl = code_name_level_finder(program_soup.text)

            # setting subject code, name, level and type
            curr_program.set_code(cnl[0])
            curr_program.set_name(cnl[1])
            curr_program.set_level(cnl[2])
            curr_program.set_program_type(all_program_types[curr_program.code])


            next_line_soup = program_soup.next_sibling
            while(not title_reached(next_line_soup)):

                if isinstance(next_line_soup, element.Tag):

                    # notes of the program
                    if next_line_soup.name == 'div' and next_line_soup['class'][0] == "lim_enrol":
                        all_notes = next_line_soup.find_all('li')

                        if all_notes is not None:
                            for note_soup in all_notes:
                                curr_program.add_note(note_soup.text.replace(
                                    "\r", "").replace("\t", "").strip())

                    # courses of the program
                    all_courses = next_line_soup.find_all('a')
                    if all_courses is not None:
                        for course_soup in all_courses:
                            if len(course_soup.text) == 8:
                                curr_program.add_course(course_soup.text)

                # reached the end of the page
                if next_line_soup is None:
                    break
                else: # keep going
                    next_line_soup = next_line_soup.next_sibling

            curr_subject.add_program(curr_program)

        # write data to json file
        with open('../output/subjects/' + curr_subject.name + '.json', 'w') as file:
            json.dump(curr_subject.to_json(), file)
