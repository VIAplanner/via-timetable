from typing import List
from program import Program

class Subject:

    """
    A class for storing general information about a program and it's specializations
    """

    name: str
    degrees:List[str]
    notes: List[str]
    programs: List[Program]


    def __init__ (self):
        self.name = ""
        self.degrees = []
        self.description = ""
        self.notes = []
        self.programs = []
    
    def add_degree(self, degree:str):
        self.degrees.append(degree)
    
    def add_note(self, note:str):
        self.notes.append(note)

    def add_program(self, program: Program):
        self.programs.append(program)
    
    def set_name(self, name:str):
        self.name = name