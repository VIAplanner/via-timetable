---
sidebar: auto
---

# Course Guide

## Vision
The Course Guide component helps students have a better understanding of what the right courses for them are.

The Course Guide generates a list of recommend courses based on the student's year and programs from students.

## Overview

The course guide covers the program and course selection of the user's journey through our system. 

![User Joruney](./user-journey.png)


### Program Selection

After a user selects their year, they're able to browse through the list of programs available to them, adding programs to their program cart as they see fit. 

__User Journey Statechart__
![program-selecting-chart](./Program_Choosing_state.png)

__Program Selection Concept Design__
![program-selecting-figma](./figma_pic.png)

### Course Selection

With the programs selected, the user now moves to the course selection stage. Here, the user can add courses to their course cart by exploring courses via the search bar or consulting our _Recommended Courses_ UI component's suggestions. 

__User Journey Statechart__
 ![course-selecting-chart](./Course_Selecting_State.png)

__Course Selection Concept Design__
![course-selecting-figma](./figma_course_pic.png)


## Component Breakdowns

The course guide involves the most UI interaction with the user, thus it is important to keep track of the abstract design. 

The followings are the detailed of state chart:

[User Journey Statechart](#_User-Journey-Statechart)
### ProgramSearchBar
* Data:
    * Query: The current search query 

* Methods:

    * searchProgram()
        * Searches the subject names for programs that is under the query subject

        * Output the subjects of the searched name

### SubjectSearchResult

This component is rendered to the SubjectSearchResultList after the results from the ProgramSearchBar appear. 

```js
SubjectSearchResult {
    data: {
        title: String,
    },
    components: {
        ProgramUnderSubject,
    }
}

```

### ProgramUnderSubject


* Data:
    * name of the program: String
    * POSTS: String

* Method:
    * clickProgram()
        * When user clicked on the subject name, it will populate a list of program cards at the other side of the frame 

### Program Cards