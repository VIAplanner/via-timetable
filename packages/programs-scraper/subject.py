from typing import List
from program import Program

class Subject:

    """
    A class for storing general information about a program and it's specializations
    """

    name: str
    degrees:List[str]
    description: str
    program_type: int
    notes: List[str]
    programs: List[Program]


    def __init__ (self):
        self.degrees = []
        self.description = ""
        self.program_type = None
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
    
    def set_description(self, description:str):
        self.description = description

    def set_program_type(self, program_type: int):
        self.program_type = program_type
    
        