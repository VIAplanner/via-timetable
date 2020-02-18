from typing import List, Dict, Union


class Program:

    """
    A class for storing specific information regarding each specialization
    """

    name: str
    level: str
    code: str
    notes: List[str]
    degree: str
    credits: float
    courses: Dict[str, Union[List[str]]]

    def __init__(self):
        self.name = ""
        self.level = ""
        self.code = ""
        self.notes = []
        self.degree = ""
        self.credits = 0.0
        self.courses = {"first": [], "second": [], "third": [], "fourth": []}

    def set_name(self, name: str):
        self.name = name

    def set_level(self, level: str):
        self.level = level

    def set_code(self, code: str):
        self.code = code

    def add_notes(self, note: str):
        self.notes.append(note)

    def set_degree(self, degree: str):
        self.degree = degree

    def set_credits(self, credits: float):
        self.credits = credits
