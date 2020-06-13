---
home: true
heroImage: /logo-with-text.png
heroText: 
tagline: VIAplanner is a tool designed by students at the University of Toronto to help the community. We desire to enhance the course selection process.
footer: MIT Licensed
--- 

<CBtn></CBtn>

## Vision

When you enter a well-run tech organization like Google, you’re met with a suite of software tools that allow you to do things like :

- Optimize your diet at their cafeterias
- Find interns close to your desk
- Create a roadmap for your growth as a professional

These tools were created by Googlers for Googlers. UofT students could make use of tools made by other UofT students that would allow them to do things like:

- Suggest timetables that optimize for their preferred timings 
- Plan for courses based on course evaluation metrics that they care about
- Write plugins to expand the core functionality with their creative ideas

Fundamental problem we are trying to solve : 

The current process to choose your courses and manually create a schedule without any conflicts that fits your preferences can take days to perfect.
 
With the help of this tool, we are making this process much **faster** and **easier** than before. 

Futhermore, this will improve UofT's reputation since this tool will modernize a crucial part of a student's life.

## Implementation

The first areas of student experience we're looking to enhance are course selection and timetable planning.

We envision the following user journey for a student:

![User Journey](./course-guide/user-journey.png)

The two components we identified to build this system are the [Course Guide](/course-guide/) and the [Timetable Planner](/timetable-planner/)

We then identified that the two components in our system required data that was scattered across various UofT web services. Some of this data had to be scraped, while others were available through APIs. 

The third component that emerged was the [Unified Backend](/unified-backend/). This API would provide our apps with unified access to the scattered UofT course data. This API would also allow students to make use of the data to write plugins to expand the core functionality with their creative ideas. 