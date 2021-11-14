import sortCourseSection from './combinations/combinations';
import cspSolve from './csp';

/**
 * Helper functions
 */

/**
 * Eliminates the section of the courses based on the locksections
 * @param {*} courseSections
 * @param {*} lockSection
 */
const lockSectionOfCourse = (courseSections, lockSections) => {
  for (const course of courseSections) {
    for (const section of lockSections) {
      // const lockedSection = section.slice()
      if (course.code === section.slice(0, section.length - 5)) {
        if (section[section.length - 5] === 'L') {
          // const lecture = course.lecture.find(lec => lec.sectionCode === section.slice(section.length - 5));
          for (const lecture of course.lecture) {
            if (lecture.sectionCode === section.slice(section.length - 5)) {
              course.lecture = [lecture];
            }
          }
        }
        if (section[section.length - 5] === 'T') {
          for (const tutorial of course.tutorial) {
            if (tutorial.sectionCode === section.slice(section.length - 5)) {
              course.tutorial = [tutorial];
            }
          }
        }
        if (section[section.length - 5] === 'P') {
          for (const practical of course.practical) {
            if (practical.sectionCode === section.slice(section.length - 5)) {
              course.practical = [practical];
            }
          }
        }
      } else if (course.code === section.slice(0, section.length - 3)) {
        if (section[section.length - 3] === 'L') {
          for (const lecture of course.lecture) {
            if (lecture.sectionCode === section.slice(section.length - 3)) {
              course.lecture = [lecture];
            }
          }
        }
      }
    }
  }
};

/**
 * sort course's sections based on the user's preference
 * 0 == in person sections has higher priority
 * 1 == online sections has higher priority
 * 2 == no preference
 */
const sortCourseSections = (course, online) => {
  if (online === 'InPerson') {
    course.lecture.sort((a, b) => (a.sectionCode > b.sectionCode ? 1 : -1));
    course.practical.sort((a, b) => (a.sectionCode > b.sectionCode ? 1 : -1));
    course.tutorial.sort((a, b) => (a.sectionCode > b.sectionCode ? 1 : -1));
  } else if (online === 'Online') {
    course.lecture.sort((a, b) => (a.sectionCode < b.sectionCode ? 1 : -1));
    course.practical.sort((a, b) => (a.sectionCode < b.sectionCode ? 1 : -1));
    course.tutorial.sort((a, b) => (a.sectionCode < b.sectionCode ? 1 : -1));
  }
};

/**
 * sort courses' sections based on the user's preference
 * @param {*} courses
 * @param {*} online
 */
const sortCourses = (courses, online) => {
  for (const course of courses) {
    sortCourseSections(course, online);
  }
  courses.sort((a, b) => (a.practical.length > b.lecture.length ? 1 : -1));
  courses.sort((a, b) => (a.practical.length > b.tutorial.length ? 1 : -1));
  courses.sort((a, b) => (a.practical.length > b.practical.length ? 1 : -1));
};

/**
 * Get all times that a single offering is offered for.
 * Returns an array of times that this offering is offered.
 * Each time is an object storing the day, start, end and term that it occurs in.
 */
const getOfferingTime = (offering, term) => {
  const times = [];
  for (const { day, start, end } of offering.times) {
    times.push({
      day,
      end,
      start,
      term,
    });
  }
  return times;
};

/**
 * Get all offering times for {offerings}.
 * {offerings} is either an array of lectures, practicals or tutorials.
 */
const getAllOfferingTimes = (offerings, term) => {
  const times = [];
  let counter = 0;
  for (const offering of offerings) {
    times.push({ time: getOfferingTime(offering, term), index: counter });
    counter += 1;
  }
  return times;
};

/**
 * Get all unique courses and locks from both terms course sections.
 * @param fallCourses
 * @param winterCourses
 * are arrays containing {code, lecture, tutorial, practical}
 *
 * @return an object containing {uniqueCourses, locks}.
 * Each time stores {start, end, day, term}
 * @uniqueCourses is an object of the following format:
 * {'CSC108PRA': [[...times for PRA9101], [...times for PRA9102]],
 * 'CSC108LEC': [...],
 * 'CSC108TUT': [...],
 * 'MAT102LEC': [...],
 * ...
 * }
 *
 * @lock is an array of times containing all times which are blocked off.
 */

const getUniqueCourses = (fallCourses, winterCourses) => {
  const uniqueCourses = {};
  const locks = [];
  const [LOCK_STRING, LOCK_TERM_INDEX, COURSE_TERM_INDEX, LEC, PRA, TUT] = [
    'Lock',
    4,
    8,
    'LEC',
    'PRA',
    'TUT',
  ];

  /**
   * Add this course's offering to the uniqueCourses array if needed.
   */
  const addToUniqueCourses = (offering, code, type, term) => {
    if (offering.length !== 0 && !(code + type in uniqueCourses)) {
      uniqueCourses[code + type] = getAllOfferingTimes(offering, term);
    }
  };
  /**
   * For each "course" (really, it's either a course or a lock).
   * Filter out the duplicate courses and add their times.
   * If it is a course then add it in uniqueCourses.
   * If it is a lock, then add it to the lock array.
   */
  const filter = course => {
    // Add to the time to locks array.
    if (course.code.startsWith(LOCK_STRING)) {
      locks.push(
        getOfferingTime(course.lecture[0], course.code[LOCK_TERM_INDEX]),
      );
    }
    // Add the course to the unique courses
    else {
      const term = course.code[COURSE_TERM_INDEX];
      // Add lecture, practical, tutorials to uniqueCourses if needed.
      addToUniqueCourses(course.lecture, course.code, LEC, term);
      addToUniqueCourses(course.practical, course.code, PRA, term);
      addToUniqueCourses(course.tutorial, course.code, TUT, term);
    }
  };
  fallCourses.forEach(course => {
    filter(course);
  });
  winterCourses.forEach(course => {
    filter(course);
  });
  return { uniqueCourses, locks };
};

/**
 * Checks if two course timings have no overlaps.
 * @returns true if no overlap, false otherwise.
 */
const checkNoOverlap = (courseTimings1, courseTimings2) => {
  const YEAR = 'Y';
  // Check if (start, end) is in between (start2, end2).
  const existsOverlap = (start, end, start2, end2) =>
    (start >= start2 && start <= end2) || (end >= start2 && end <= end2) || (start2 <= start && end <= end2) || (start <= start2 && end2 <= end);
  // Get all times for courseTimings1
  for (const time1 of courseTimings1.time) {
    for (const time2 of courseTimings2.time) {
      if (
        time1.day === time2.day &&
        (time1.term === time2.term ||
          time1.term === YEAR || time2.term === YEAR)
      ) {
        if (existsOverlap(time1.start, time1.end, time2.start, time2.end))
          return false;
      }
    }
  }
  return true;
};
/**
 * Maps course sections to dictionary
 * @returns a dicitonary of course Code to section
 */
const mapCourseSections = courseSections =>
  courseSections.reduce((oldSections, curCourseSection) => 
    ({ ...oldSections, [curCourseSection.code]: curCourseSection })
  , {});

  /**
   * adds a course to the approriate timetable
   * @param {*} course - the course to be added
   * @param {*} mapping - a mapping from course to it's metadata
   * @param {*} timingIndex - the index at which the selected time was chosen
   * @param {*} type - the current type, LEC, PRA, TUT
   * @param {*} curTimeTable - the current working timetable
   */
const addCourseToTimetable = (course,mapping, timingIndex, type, curTimeTable) => {
  const {code, lecture, practical, tutorial } = mapping[course];
  let sectionInformation;
  if (type === 'LEC'){
    sectionInformation = lecture[timingIndex];
 }else if (type === 'PRA'){
  sectionInformation = practical[timingIndex];
 }else {
  sectionInformation = tutorial[timingIndex];
 }
 const { method, sectionCode, times, instructors } = sectionInformation;
 const newCourseSection = { method, sectionCode, code, instructors };
 for (const time of times){
   curTimeTable[time.day].push({...time, ...newCourseSection});
 }
}
/**
 *
 * The main function.
 * Starts from produce all section combinations of each course
 * Produce the combinations of the courses' section combinations
 * Create Timetable for each combinations of section combinations
 * Returns the master list of Timetables
 * @param {Course[]} courses
 * @returns {Timetable[]}
 */
const generateTimetables = (
  fallCourses,
  fallLockSections,
  winterCourses,
  winterLockSections,
  online,
  excludedConflictCourses = [],
) => {
  // Generate all valid combinations of MeetingSections for a course
  const fallCourseSections = fallCourses.map(course =>
    sortCourseSection(course),
  );
  const winterCourseSections = winterCourses.map(course =>
    sortCourseSection(course),
  );
  lockSectionOfCourse(fallCourseSections, fallLockSections);
  lockSectionOfCourse(winterCourseSections, winterLockSections);
  sortCourses(fallCourseSections, online);
  sortCourses(winterCourseSections, online);
  // Have unique courses.
  //
  // right here
  // For every unique course we need this:
  // CSC108 -> {'CSC108Prac': [...timings], 'CSC108Lec'[...]], 'CSC108Tut': [...timings]}
  const { uniqueCourses, locks } = getUniqueCourses(
    fallCourseSections,
    winterCourseSections,
  );
  const constraints = [];
  const uniqueCoursesList = Object.keys(uniqueCourses);
  // Generate constraints for no overlapping
  const mapExcludedCourses = mapCourseSections(excludedConflictCourses);
  for (
    let courseOneIndex = 0;
    courseOneIndex < uniqueCoursesList.length;
    courseOneIndex += 1
  ) {
    for (
      let courseTwoIndex = courseOneIndex + 1;
      courseTwoIndex < uniqueCoursesList.length;
      courseTwoIndex += 1
    ) {
      const uniqueCourseOne = uniqueCoursesList[courseOneIndex];
      const uniqueCourseTwo = uniqueCoursesList[courseTwoIndex];
      const courseCodeOne = uniqueCourseOne.slice(0,9);
      const courseCodeTwo = uniqueCourseTwo.slice(0,9);
      if (mapExcludedCourses[courseCodeOne] === undefined && mapExcludedCourses[courseCodeTwo] === undefined){
        constraints.push([uniqueCourseOne, uniqueCourseTwo, checkNoOverlap]);
      }
    }
  }

  const newUniqueCourses = {};
  for (const [course, timings] of Object.entries(uniqueCourses)) {
    let newTimes = timings;
    for (const lock of locks) {
      newTimes = newTimes.filter(timing => checkNoOverlap({ time: lock }, timing));
    }
    newUniqueCourses[course] = newTimes;
  }
  const csp = { variables: newUniqueCourses, constraints };
  // console.log(csp);
  const cspResult = cspSolve(csp);

  // Checks if it failed to create one
  if (cspResult === 'FAILURE') {
    return null;
  }

  // convert this to time table
  const winterTimetable = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
  };

  const fallTimetable = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
  };

  const fallMapping = mapCourseSections(fallCourseSections);
  const winterMapping = mapCourseSections(winterCourseSections);
  for (const [course, { index: timeIndex }] of Object.entries(cspResult)) {
    const courseCode = course.slice(0, 9);
    const term = course.charAt(8);
    const type = course.slice(9);

    if (term === 'Y' || term === 'F') {
      addCourseToTimetable(courseCode,fallMapping,timeIndex,type,fallTimetable);
    }
    if (term === 'Y' || term === 'S') {
      addCourseToTimetable(courseCode,winterMapping,timeIndex,type,winterTimetable);
    }
  }

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  for (const day of days) {
    fallTimetable[day].sort((a, b) => a.start - b.start);
    winterTimetable[day].sort((a, b) => a.start - b.start);
  }
  return [fallTimetable, winterTimetable];
};
export { generateTimetables };
export default generateTimetables;
