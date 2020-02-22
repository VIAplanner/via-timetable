import requests, re
from bs4 import BeautifulSoup
from tqdm import tqdm  # progress bar magic
from typing import List, Dict, Tuple


# test if a subject is no longer offered
def program_exist(cnl: List[str], all_program_types: Dict[str, str]) -> bool:
    return all_program_types.get(cnl[0]) is not None


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



ids = all_subject_ids("https://student.utm.utoronto.ca/calendar//program_list.pl")
all_program_types = find_all_types() # gets the type of every program


for subject_id in tqdm(ids):
    url = "https://student.utm.utoronto.ca/calendar//program_group.pl?Group_Id=" + subject_id
    source = requests.get(url).text
    soup = BeautifulSoup(source, 'lxml')
    body = soup.find('div', class_='centralpos').find('div', class_='contentpos')

    if subject_exist(url):
        programs = body.find_all('p', class_="title_program")
        
        for program_soup in programs:
            cnl = code_name_level_finder(program_soup.text)

            # if program doesn't exist, don't include it
            if not program_exist(cnl, all_program_types):
                with open('../output/dead_programs.txt', 'a') as file:
                    file.write(cnl[1] + '\n')