<p align="center">
  <a href="https://docs.viaplanner.ca/" target="_blank">
    <img alt="VIAplanner" width="300" src="./VIA-Planner-Blue.png">
  </a>
</p>

<p align="center"> 
   <a href="https://app.netlify.com/sites/viatimetable/deploys">
    <img alt="Build Status" src="https://api.netlify.com/api/v1/badges/3b870967-d243-450c-8672-3add3187a16f/deploy-status">
  </a>
  <a href="https://github.com/VIAplanner/VIAplanner/blob/master/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-GPL-green?style=flat">
  </a>
</p>


# VIAplanner

VIAplanner is a tool designed by students at the University of Toronto to help the community. Our goal is to improve the course selection and scheduling process by providing a suite of tools to browse courses and design personalized timetables on the go.

## Introduction

The fundamental problem we are trying to solve:
1. There is no automated process to create good timetables, instead requiring days of manual effort checking different combinations of courses and timeslots
2. The official University of Toronto timetable builder is unintuitive and not good for generating optimal timetables, often leaving large gaps and scattering classes across a very large time range
3. The official University of Toronto timetable builder only provides a single way to customize your timetable, through broad scheduling preferences such as 'Early' or 'Late'

# Documentation
[VIATimetable Documentation](https://docs.viaplanner.ca)

## Installation Using Yarn

```sh
git clone https://github.com/VIAplanner/via-timetable.git
cd via-timetable
yarn
yarn dev
```

## Local Deployment Using Docker
*Prerequisites:*
1. You have cloned and placed the following repos at the same directory as this repo, with folder names matching repo names
- via-api: https://github.com/VIAplanner/via-api
- UofT-Scraper: https://github.com/Kelexer1/UofT-Scraper

```sh
docker compose up --build
```

This will automatically start the frontend, backend, and set up scheduled scraping and database population

## .env Setup
**VITE_API_BASE_URL**: A string representation of the API endpoint, for example "http://127.0.0.1:3000"