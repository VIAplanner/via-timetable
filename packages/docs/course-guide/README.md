# Course Guide


A web app that gives students effective course guidance based on their program and year. 

## Components

### Course Search Bar 

__Data__ 

Query: The current search query 

__Methods__ 

_search(query)_:  

Searches the course DB for courses that match the query 

Triggered on every input event (with a small debounce value) 

__Sub-Components__

Course Card 