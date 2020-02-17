# Course API

The Course API provides unified access to UofT course data scattered across UofT's web services. Apps published by UofT Course Tools will use 

## Overview

![Backend Architecture](./backend-architecture.png)

## Data Sources

### 1. UofT Course Finder:

__Data Provided:__ Information regarding every course in all 3 UofT campuses. Information such as lecture time, professors, pre-requisite etc are provided (refer to **Data Structures 1-3** for details). 

__Link:__  http://coursefinder.utoronto.ca/course-search/search/courseSearch?viewId=CourseSearch-FormView&methodToCall=start

### 2. UTM Academic Calendar:

__Data Provided:__ Information regarding every program in UTM. Information such as post requirement, required courses, program level (minor, major, specialist) etc are provided (refer to **Data Structures 4-5** for details). 

__Link:__  https://student.utm.utoronto.ca/calendar//program_group.pl?Group_Id=9

### 3. UTM Program Selection Guide:

__Data Provided:__ Program type (1, 2, 3) for every UTM program. This information is stored as a attribute in **Data Structures 5, Program**

__Link:__  https://www.utm.utoronto.ca/registrar/office-registrar-publications/program-selection-guide

## Data Structures

### 1. Course

```json
{ 
   "id":String,
   "code":String,
   "name":String,
   "description":String,
   "division":String,
   "department":String,
   "prerequisites":String,
   "exclusions":String,
   "level":Number,
   "campus":String,
   "term":String,
   "breadths":String,
   "meeting_sections":[ 
      MeetingSection
   ]
}
```

### 2. Meeting Section

```json
{
    "code": String,
    "instructors": [String],
    "times": [Time],
    "size": Number,
    "enrolment": Number
}
```

### 3. Time

```json
{
   "day": String,
   "start": Number,
   "end": Number,
   "duration": Number,
   "location": String
}
```

### 4. Subject

```json
{ 
   "name":String,
   "degree":[String],
   "description":String,
   "notes":[string],
   "programs":[Program],
}
```

### 5. Program

```json
{ 
   "name":String,
   "level":String,
   "code":String,
   "program_type":int,
   "notes":[string],
   "degree":string,
   "credits":float,
   "courses":{
      "first":[string],
      "second":[string],
      "third":[string],
      "fourth":[string]
   }
}
```