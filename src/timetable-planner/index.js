const sortCourseSection = require('./combinations/combinations');

/**
 * Search for the first index of course that has type section
 * @param {*} courseSection
 * @param {*} type
 */
const searchForSectionIndex = (courseSection, type) => {
  let index = -1;
  for (const section of courseSection) {
    if (section[type].length !== 0) {
      index = courseSection.indexOf(section);
      break;
    }
  }
  return index;
};
/**
 * Search for the next index of course that has type section
 * @param {*} courseSection
 * @param {*} type
 * @param {*} prevIndex
 */
const searchForSectionIndexAfterprevIndex = (
  courseSection,
  type,
  prevIndex,
) => {
  let index = -1;
  for (const section of courseSection) {
    const tempI = courseSection.indexOf(section);
    if (section[type].length !== 0 && tempI > prevIndex) {
      index = tempI;
      break;
    }
  }
  return index;
};
/**
 * Adds the section to the timetable
 * @param {*} sections
 * @param {*} timetable
 */
const addSectionToTimetable = (sections, timetable) => {
  for (const section of sections) {
    for (const time of section.times) {
      if (section.sectionCode.length === 3) {
        const timetableSection = {
          code: section.comboCode.substring(0, section.comboCode.length - 3),
          sectionCode: section.sectionCode,
          instructors: section.instructors,
          method: section.method,
          ...time,
        };
        timetable[time.day].push(timetableSection);
      } else {
        const timetableSection = {
          code: section.comboCode.substring(0, section.comboCode.length - 5),
          sectionCode: section.sectionCode,
          instructors: section.instructors,
          method: section.method,
          ...time,
        };
        timetable[time.day].push(timetableSection);
      }
    }
  }
};

const createCopyOfCourseSection = courseSections => {
  const copy = [];
  for (const courseSection of courseSections) {
    const temp = {};
    temp.code = courseSection.code;
    temp.lecture = [...courseSection.lecture];
    temp.practical = [...courseSection.practical];
    temp.tutorial = [...courseSection.tutorial];
    copy.push(temp);
  }
  return copy;
};

/**
 * Make a complete shallow copy of a timetable
 * @param {*} timetable
 */
const createShallowCopyOfTimetable = timetable => {
  const shallowCopy = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
  };
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  for (const day of days) {
    shallowCopy[day].push(...timetable[day]);
  }
  return shallowCopy;
};

/**
 *
 * Helper function for OverlapExist
 * @param {Timetable} timetable
 * @param {string} day
 * @returns
 */
const checkOverlapForDay = (timetable, day) => {
  let section = 0;
  while (section < timetable[day].length) {
    let section2 = +section + +1;
    while (section2 < timetable[day].length) {
      if (
        (timetable[day][section].start >= timetable[day][section2].start &&
          timetable[day][section].start < timetable[day][section2].end) ||
        (timetable[day][section].end > timetable[day][section2].start &&
          timetable[day][section].end <= timetable[day][section2].end) ||
        (timetable[day][section2].start >= timetable[day][section].start &&
          timetable[day][section2].start < timetable[day][section].end) ||
        (timetable[day][section2].end > timetable[day][section].start &&
          timetable[day][section2].end <= timetable[day][section].end)
      ) {
        return true;
      }
      section2 += 1;
    }
    section += 1;
  }
  return false;
};

/**
 *
 * Checks overlap of course times for each day in a timetable
 * @param {Timetable} timetable
 * @returns {boolean}
 */
const overlapExists = timetable => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  let exists = false;
  for (const day of days) {
    exists = exists || checkOverlapForDay(timetable, day);
  }
  return exists;
};

/**
 * Eliminates the section of the courses based on the locksections
 * @param {*} courseSections
 * @param {*} lockSection
 */
const lockSectionOfCourse = (courseSections, lockSections) => {
  for (const course of courseSections) {
    for (const section of lockSections) {
      if (course.code === section.slice(0, section.length - 5)) {
        if (section[section.length - 5] === 'L') {
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
 *
 * Creates timetable by parse the meetingSections into each day and check for validity
 * @param {MeetingSection[]} fallCourseSection
 * @returns {Timetable}
 */
const createTimetable = (fallCourseSection, winterCourseSection, state) => {
  let fallTimetable = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
  };
  let winterTimetable = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
  };

  /**
     * How the following recursive work: Take a (lecture/practical/tutorial) section from a course add to a list,
       take another section from next course add to a list, repeat until the last course.
       Add the sections to the current timetable out of the list and check for validity(if there is any conflict between sections)
       If there is a conflict:
            Revert the timetable to the previous state(the timetable without adding any new sections)
            and continue to for loop the remaining section of the courses
       If there is no conflict:  
            return true
        After lecture section, when there is a no conflict of the courses' lecture, it will move on to start appending practical sections
         if there are any course that has practical, or else move to tutorial section if there are any, or else return true
        After practical section, if there are any course with tutorial, it will move to tutorial after check for validity
    */
  /** lectureCombo.founded are used to terminate "some" function when it continues to loop because of recursion not functioning properly 
     but a valid timetable is already found
     */
  const fallLectureCombo = (courseSection, whichArray, output = []) => {
    fallLectureCombo.founded = 0;
    const lec2 = searchForSectionIndexAfterprevIndex(
      courseSection,
      'lecture',
      whichArray,
    );
    if (lec2 !== -1) {
      return courseSection[whichArray].lecture.some(arrayElement => {
        // Recursive case...
        // if the course is not the last one
        if (fallLectureCombo.founded === 1) {
          return true;
        }
        const temp = [...output];
        temp.push(arrayElement);
        fallLectureCombo(courseSection, lec2, temp);
      });
    } else {
      // Base case...
      return courseSection[whichArray].lecture.some(arrayElement => {
        const temp = [...output];
        temp.push(arrayElement);
        const tempLecList = temp;
        addSectionToTimetable(temp, fallTimetable);
        // if its invalid, clear the timetable and start again
        if (overlapExists(fallTimetable)) {
          fallTimetable = {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          };
        } else {
          // check if any course in the combo contains practical
          const pra = searchForSectionIndex(courseSection, 'practical');
          if (pra >= 0) {
            const prevTimetable = createShallowCopyOfTimetable(fallTimetable);
            const practicalCombo = (
              // eslint-disable-next-line no-shadow
              courseSection,
              whichArray2 = pra,
              output2 = [],
            ) => {
              const pra2 = searchForSectionIndexAfterprevIndex(
                courseSection,
                'practical',
                whichArray2,
              );
              if (pra2 !== -1) {
                return courseSection[whichArray2].practical.some(
                  arrayElement2 => {
                    // Recursive case...
                    if (fallLectureCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    practicalCombo(courseSection, pra2, temp);
                  },
                );
              } else {
                return courseSection[whichArray2].practical.some(
                  arrayElement2 => {
                    // Base case when reach until the last course that has practical
                    if (fallLectureCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    const tempPraList = temp;
                    addSectionToTimetable(temp, fallTimetable);
                    if (overlapExists(fallTimetable)) {
                      fallTimetable = createShallowCopyOfTimetable(
                        prevTimetable,
                      );
                      let j = -1;
                      for (let i = 0; i < temp.length; i += 1) {
                        if (
                          temp[i] ===
                          courseSection[i].practical[
                            courseSection[i].practical.length - 1
                          ]
                        ) {
                          j += 1;
                        }
                      }
                      if (j === temp.length - 1) {
                        return false;
                      }
                    } else {
                      const tut = searchForSectionIndex(
                        courseSection,
                        'tutorial',
                      );
                      if (tut >= 0) {
                        const prevTimetabletut = createShallowCopyOfTimetable(
                          fallTimetable,
                        );
                        const tutorialCombo = (
                          // eslint-disable-next-line no-shadow
                          courseSection,
                          // eslint-disable-next-line no-shadow
                          whichArray2 = tut,
                          // eslint-disable-next-line no-shadow
                          output2 = [],
                        ) => {
                          const tut2 = searchForSectionIndexAfterprevIndex(
                            courseSection,
                            'tutorial',
                            whichArray2,
                          );
                          if (tut2 !== -1) {
                            return courseSection[whichArray2].tutorial.some(
                              // eslint-disable-next-line no-shadow
                              arrayElement2 => {
                                // Recursive case...
                                if (fallLectureCombo.founded === 1) {
                                  return true;
                                }
                                // eslint-disable-next-line no-shadow
                                const temp = [...output2];
                                temp.push(arrayElement2);
                                tutorialCombo(courseSection, tut2, temp);
                              },
                            );
                          } else {
                            return courseSection[whichArray2].tutorial.some(
                              // eslint-disable-next-line no-shadow
                              arrayElement2 => {
                                // Base case when reach until the last course that has tutorial
                                if (fallLectureCombo.founded === 1) {
                                  return true;
                                }
                                // eslint-disable-next-line no-shadow
                                const temp = [...output2];
                                temp.push(arrayElement2);
                                addSectionToTimetable(temp, fallTimetable);
                                if (overlapExists(fallTimetable)) {
                                  fallTimetable = createShallowCopyOfTimetable(
                                    prevTimetabletut,
                                  );
                                  let j = -1;
                                  for (let i = 0; i < temp.length; i += 1) {
                                    if (
                                      temp[i] ===
                                      courseSection[i].tutorial[
                                        courseSection[i].tutorial.length - 1
                                      ]
                                    ) {
                                      j += 1;
                                    }
                                  }
                                  if (j === temp.length - 1) {
                                    return false;
                                  }
                                } else {
                                  const yearLocked = [];
                                  const tempList = [...output2];
                                  tempList.push(arrayElement2);
                                  tempList.push(...tempLecList);
                                  tempList.push(...tempPraList);
                                  for (const section of tempList) {
                                    if (
                                      section.comboCode.charAt(
                                        section.comboCode.length - 6,
                                      ) === 'Y'
                                    ) {
                                      yearLocked.push(section.comboCode);
                                    }
                                  }
                                  // eslint-disable-next-line no-shadow
                                  const temp = createCopyOfCourseSection(
                                    winterCourseSection,
                                  );
                                  lockSectionOfCourse(temp, yearLocked);
                                  [, winterTimetable] = createTimetable(
                                    fallCourseSection,
                                    temp,
                                    'W',
                                  );
                                  if (
                                    JSON.stringify(winterTimetable) ===
                                      JSON.stringify({
                                        MONDAY: [],
                                        TUESDAY: [],
                                        WEDNESDAY: [],
                                        THURSDAY: [],
                                        FRIDAY: [],
                                      }) &&
                                    winterCourseSection.length > 0
                                  ) {
                                    fallTimetable = createShallowCopyOfTimetable(
                                      prevTimetabletut,
                                    );
                                  } else {
                                    fallLectureCombo.founded = 1;
                                    // founds a valid timetable
                                    return true;
                                  }
                                }
                              },
                            );
                          }
                        };
                        const tutResult = tutorialCombo(courseSection);
                        if (tutResult) {
                          return true;
                        } else {
                          if (fallLectureCombo.founded === 1) {
                            return true;
                          }
                          fallTimetable = prevTimetable;
                        }
                        if (fallLectureCombo.founded === 1) {
                          return true;
                        }
                      } else {
                        const yearLocked = [];
                        const tempList = [...output2];
                        tempList.push(arrayElement2);
                        tempList.push(...tempLecList);
                        for (const section of tempList) {
                          if (
                            section.comboCode.charAt(
                              section.comboCode.length - 6,
                            ) === 'Y'
                          ) {
                            yearLocked.push(section.comboCode);
                          }
                        }
                        // eslint-disable-next-line no-shadow
                        const temp = createCopyOfCourseSection(
                          winterCourseSection,
                        );
                        lockSectionOfCourse(temp, yearLocked);
                        [, winterTimetable] = createTimetable(
                          fallCourseSection,
                          temp,
                          'W',
                        );
                        if (
                          JSON.stringify(winterTimetable) ===
                            JSON.stringify({
                              MONDAY: [],
                              TUESDAY: [],
                              WEDNESDAY: [],
                              THURSDAY: [],
                              FRIDAY: [],
                            }) &&
                          winterCourseSection.length > 0
                        ) {
                          fallTimetable = createShallowCopyOfTimetable(
                            prevTimetable,
                          );
                        } else {
                          fallLectureCombo.founded = 1;
                          // founds a valid timetable
                          return true;
                        }
                      }
                    }
                  },
                );
              }
            };
            const praResult = practicalCombo(courseSection);
            if (praResult) {
              fallLectureCombo.founded = 1;
              // founds a valid timetable
              return true;
            } else {
              if (fallLectureCombo.founded === 1) {
                return true;
              }
              fallTimetable = {
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
              };
            }
          } else {
            const tut = searchForSectionIndex(courseSection, 'tutorial');
            if (tut >= 0) {
              const prevTimetable = createShallowCopyOfTimetable(fallTimetable);
              const tutorialCombo = (
                // eslint-disable-next-line no-shadow
                courseSection,
                whichArray2 = tut,
                output2 = [],
              ) => {
                const tut2 = searchForSectionIndexAfterprevIndex(
                  courseSection,
                  'tutorial',
                  whichArray2,
                );
                if (tut2 !== -1) {
                  return courseSection[whichArray2].tutorial.some(
                    arrayElement2 => {
                      // Recursive case...
                      if (fallLectureCombo.founded === 1) {
                        return true;
                      }
                      // eslint-disable-next-line no-shadow
                      const temp = [...output2];
                      temp.push(arrayElement2);
                      tutorialCombo(courseSection, tut2, temp);
                    },
                  );
                } else {
                  return courseSection[whichArray2].tutorial.some(
                    arrayElement2 => {
                      // Base case when reach until the last course that has tutorial
                      if (fallLectureCombo.founded === 1) {
                        return true;
                      }
                      // eslint-disable-next-line no-shadow
                      const temp = [...output2];
                      temp.push(arrayElement2);
                      addSectionToTimetable(temp, fallTimetable);
                      if (overlapExists(fallTimetable)) {
                        fallTimetable = createShallowCopyOfTimetable(
                          prevTimetable,
                        );
                        let j = -1;
                        for (let i = 0; i < temp.length; i += 1) {
                          if (
                            temp[i] ===
                            courseSection[i].tutorial[
                              courseSection[i].tutorial.length - 1
                            ]
                          ) {
                            j += 1;
                          }
                        }
                        if (j === temp.length - 1) {
                          return false;
                        }
                      } else {
                        const yearLocked = [];
                        const tempList = [...output2];
                        tempList.push(arrayElement2);
                        tempList.push(...tempLecList);
                        for (const section of tempList) {
                          if (
                            section.comboCode.charAt(
                              section.comboCode.length - 6,
                            ) === 'Y'
                          ) {
                            yearLocked.push(section.comboCode);
                          }
                        }
                        // eslint-disable-next-line no-shadow
                        const temp = createCopyOfCourseSection(
                          winterCourseSection,
                        );
                        lockSectionOfCourse(temp, yearLocked);
                        [, winterTimetable] = createTimetable(
                          fallCourseSection,
                          temp,
                          'W',
                        );
                        if (
                          JSON.stringify(winterTimetable) ===
                            JSON.stringify({
                              MONDAY: [],
                              TUESDAY: [],
                              WEDNESDAY: [],
                              THURSDAY: [],
                              FRIDAY: [],
                            }) &&
                          winterCourseSection.length > 0
                        ) {
                          fallTimetable = createShallowCopyOfTimetable(
                            prevTimetable,
                          );
                        } else {
                          fallLectureCombo.founded = 1;
                          // founds a valid timetable
                          return true;
                        }
                      }
                    },
                  );
                }
              };
              const tutResult = tutorialCombo(courseSection);
              if (tutResult) {
                fallLectureCombo.founded = 1;
                // founds a valid timetable
                return true;
              } else {
                if (fallLectureCombo.founded === 1) {
                  return true;
                }
                fallTimetable = {
                  MONDAY: [],
                  TUESDAY: [],
                  WEDNESDAY: [],
                  THURSDAY: [],
                  FRIDAY: [],
                };
              }
            } else {
              const yearLocked = [];
              const tempList = [...output];
              tempList.push(arrayElement);
              for (const section of tempList) {
                if (
                  section.comboCode.charAt(section.comboCode.length - 6) === 'Y'
                ) {
                  yearLocked.push(section.comboCode);
                }
              }
              // eslint-disable-next-line no-shadow
              const temp = createCopyOfCourseSection(winterCourseSection);
              lockSectionOfCourse(temp, yearLocked);
              [, winterTimetable] = createTimetable(
                fallCourseSection,
                temp,
                'W',
              );
              if (
                JSON.stringify(winterTimetable) ===
                  JSON.stringify({
                    MONDAY: [],
                    TUESDAY: [],
                    WEDNESDAY: [],
                    THURSDAY: [],
                    FRIDAY: [],
                  }) &&
                winterCourseSection.length > 0
              ) {
                fallTimetable = {
                  MONDAY: [],
                  TUESDAY: [],
                  WEDNESDAY: [],
                  THURSDAY: [],
                  FRIDAY: [],
                };
              } else {
                fallLectureCombo.founded = 1;
                // founds a valid timetable
                return true;
              }
            }
            if (fallLectureCombo.founded === 1) {
              return true;
            }
          }
        }
        if (fallLectureCombo.founded === 1) {
          return true;
        }
      });
    }
  };
  // if the course selected dont have any lectures and have practicals and tutorials
  const fallPracticalCombo = (courseSection, whichArray2, output2 = []) => {
    fallPracticalCombo.founded = 0;
    const pra2 = searchForSectionIndexAfterprevIndex(
      courseSection,
      'practical',
      whichArray2,
    );
    if (pra2 !== -1) {
      return courseSection[whichArray2].practical.some(arrayElement2 => {
        // Recursive case...
        if (fallPracticalCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        fallPracticalCombo(courseSection, pra2, temp);
      });
    } else {
      return courseSection[whichArray2].practical.some(arrayElement2 => {
        // Base case when reach until the last course that has practical
        if (fallPracticalCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        const tempPraList = temp;
        addSectionToTimetable(temp, fallTimetable);
        if (overlapExists(fallTimetable)) {
          fallTimetable = {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          };
          let j = -1;
          for (let i = 0; i < temp.length; i += 1) {
            if (
              temp[i] ===
              courseSection[i].practical[courseSection[i].practical.length - 1]
            ) {
              j += 1;
            }
          }
          if (j === temp.length - 1) {
            return false;
          }
        } else {
          const tut = searchForSectionIndex(courseSection, 'tutorial');
          if (tut >= 0) {
            const prevTimetabletut = createShallowCopyOfTimetable(
              fallTimetable,
            );
            const tutorialCombo = (
              // eslint-disable-next-line no-shadow
              courseSection,
              // eslint-disable-next-line no-shadow
              whichArray2 = tut,
              // eslint-disable-next-line no-shadow
              output2 = [],
            ) => {
              const tut2 = searchForSectionIndexAfterprevIndex(
                courseSection,
                'tutorial',
                whichArray2,
              );
              if (tut2 !== -1) {
                return courseSection[whichArray2].tutorial.some(
                  // eslint-disable-next-line no-shadow
                  arrayElement2 => {
                    // Recursive case...
                    if (fallPracticalCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    tutorialCombo(courseSection, tut2, temp);
                  },
                );
              } else {
                return courseSection[whichArray2].tutorial.some(
                  // eslint-disable-next-line no-shadow
                  arrayElement2 => {
                    // Base case when reach until the last course that has tutorial
                    if (fallPracticalCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    addSectionToTimetable(temp, fallTimetable);
                    if (overlapExists(fallTimetable)) {
                      fallTimetable = createShallowCopyOfTimetable(
                        prevTimetabletut,
                      );
                      let j = -1;
                      for (let i = 0; i < temp.length; i += 1) {
                        if (
                          temp[i] ===
                          courseSection[i].tutorial[
                            courseSection[i].tutorial.length - 1
                          ]
                        ) {
                          j += 1;
                        }
                      }
                      if (j === temp.length - 1) {
                        return false;
                      }
                    } else {
                      const yearLocked = [];
                      const tempList = [...output2];
                      tempList.push(arrayElement2);
                      tempList.push(...tempPraList);
                      for (const section of tempList) {
                        if (
                          section.comboCode.charAt(
                            section.comboCode.length - 6,
                          ) === 'Y'
                        ) {
                          yearLocked.push(section.comboCode);
                        }
                      }
                      // eslint-disable-next-line no-shadow
                      const temp = createCopyOfCourseSection(
                        winterCourseSection,
                      );
                      lockSectionOfCourse(temp, yearLocked);
                      [, winterTimetable] = createTimetable(
                        fallCourseSection,
                        temp,
                        'W',
                      );
                      if (
                        JSON.stringify(winterTimetable) ===
                          JSON.stringify({
                            MONDAY: [],
                            TUESDAY: [],
                            WEDNESDAY: [],
                            THURSDAY: [],
                            FRIDAY: [],
                          }) &&
                        winterCourseSection.length > 0
                      ) {
                        fallTimetable = createShallowCopyOfTimetable(
                          prevTimetabletut,
                        );
                      } else {
                        fallPracticalCombo.founded = 1;
                        // founds a valid timetable
                        return true;
                      }
                    }
                  },
                );
              }
            };
            const tutResult = tutorialCombo(courseSection);
            if (tutResult) {
              return true;
            } else {
              if (fallPracticalCombo.founded === 1) {
                return true;
              }
              fallTimetable = {
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
              };
            }
            if (fallPracticalCombo.founded === 1) {
              return true;
            }
          } else {
            const yearLocked = [];
            const tempList = [...output2];
            tempList.push(arrayElement2);
            for (const section of tempList) {
              if (
                section.comboCode.charAt(section.comboCode.length - 6) === 'Y'
              ) {
                yearLocked.push(section.comboCode);
              }
            }
            // eslint-disable-next-line no-shadow
            const temp = createCopyOfCourseSection(winterCourseSection);
            lockSectionOfCourse(temp, yearLocked);
            [, winterTimetable] = createTimetable(fallCourseSection, temp, 'W');
            if (
              JSON.stringify(winterTimetable) ===
                JSON.stringify({
                  MONDAY: [],
                  TUESDAY: [],
                  WEDNESDAY: [],
                  THURSDAY: [],
                  FRIDAY: [],
                }) &&
              winterCourseSection.length > 0
            ) {
              fallTimetable = {
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
              };
            } else {
              fallPracticalCombo.founded = 1;
              // founds a valid timetable
              return true;
            }
          }
        }
      });
    }
  };
  // if the course selected dont have any lectures nor practicals and have only tutorials

  const fallTutorialCombo = (courseSection, whichArray2, output2 = []) => {
    fallTutorialCombo.founded = 0;
    const tut2 = searchForSectionIndexAfterprevIndex(
      courseSection,
      'tutorial',
      whichArray2,
    );
    if (tut2 !== -1) {
      return courseSection[whichArray2].tutorial.some(arrayElement2 => {
        // Recursive case...
        if (fallTutorialCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        fallTutorialCombo(courseSection, tut2, temp);
      });
    } else {
      return courseSection[whichArray2].tutorial.some(arrayElement2 => {
        // Base case when reach until the last course that has tutorial
        if (fallTutorialCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        addSectionToTimetable(temp, fallTimetable);
        if (overlapExists(fallTimetable)) {
          fallTimetable = {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          };
          let j = -1;
          for (let i = 0; i < temp.length; i += 1) {
            if (
              temp[i] ===
              courseSection[i].tutorial[courseSection[i].tutorial.length - 1]
            ) {
              j += 1;
            }
          }
          if (j === temp.length - 1) {
            return false;
          }
        } else {
          const yearLocked = [];
          const tempList = [...output2];
          tempList.push(arrayElement2);
          for (const section of tempList) {
            if (
              section.comboCode.charAt(section.comboCode.length - 6) === 'Y'
            ) {
              yearLocked.push(section.comboCode);
            }
          }
          // eslint-disable-next-line no-shadow
          const temp = createCopyOfCourseSection(winterCourseSection);
          lockSectionOfCourse(temp, yearLocked);
          [, winterTimetable] = createTimetable(fallCourseSection, temp, 'W');
          if (
            JSON.stringify(winterTimetable) ===
              JSON.stringify({
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
              }) &&
            winterCourseSection.length > 0
          ) {
            fallTimetable = {
              MONDAY: [],
              TUESDAY: [],
              WEDNESDAY: [],
              THURSDAY: [],
              FRIDAY: [],
            };
          } else {
            fallTutorialCombo.founded = 1;
            // founds a valid timetable
            return true;
          }
        }
      });
    }
  };
  const winterLectureCombo = (courseSection, whichArray, output = []) => {
    winterLectureCombo.founded = 0;
    const lec2 = searchForSectionIndexAfterprevIndex(
      courseSection,
      'lecture',
      whichArray,
    );
    if (lec2 !== -1) {
      return courseSection[whichArray].lecture.some(arrayElement => {
        // Recursive case...
        // if the course is not the last one
        if (winterLectureCombo.founded === 1) {
          return true;
        }
        const temp = [...output];
        temp.push(arrayElement);
        winterLectureCombo(courseSection, lec2, temp);
      });
    } else {
      return courseSection[whichArray].lecture.some(arrayElement => {
        if (winterLectureCombo.founded === 1) {
          return true;
        }
        // Base case: If the course is the last one

        // Base case...
        const temp = [...output];
        temp.push(arrayElement);
        addSectionToTimetable(temp, winterTimetable);
        // if its invalid, clear the timetable and start again
        if (overlapExists(winterTimetable)) {
          winterTimetable = {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          };
        } else {
          // check if any course in the combo contains practical
          const pra = searchForSectionIndex(courseSection, 'practical');
          if (pra >= 0) {
            const prevTimetable = createShallowCopyOfTimetable(winterTimetable);
            const practicalCombo = (
              // eslint-disable-next-line no-shadow
              courseSection,
              whichArray2 = pra,
              output2 = [],
            ) => {
              const pra2 = searchForSectionIndexAfterprevIndex(
                courseSection,
                'practical',
                whichArray2,
              );
              if (pra2 !== -1) {
                return courseSection[whichArray2].practical.some(
                  arrayElement2 => {
                    // Recursive case...
                    if (winterLectureCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    practicalCombo(courseSection, pra2, temp);
                  },
                );
              } else {
                return courseSection[whichArray2].practical.some(
                  arrayElement2 => {
                    // Base case when reach until the last course that has practical
                    if (winterLectureCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    addSectionToTimetable(temp, winterTimetable);
                    if (overlapExists(winterTimetable)) {
                      winterTimetable = createShallowCopyOfTimetable(
                        prevTimetable,
                      );
                      let j = -1;
                      for (let i = 0; i < temp.length; i += 1) {
                        if (
                          temp[i] ===
                          courseSection[i].practical[
                            courseSection[i].practical.length - 1
                          ]
                        ) {
                          j += 1;
                        }
                      }
                      if (j === temp.length - 1) {
                        return false;
                      }
                    } else {
                      const tut = searchForSectionIndex(
                        courseSection,
                        'tutorial',
                      );
                      if (tut >= 0) {
                        const prevTimetabletut = createShallowCopyOfTimetable(
                          winterTimetable,
                        );
                        const tutorialCombo = (
                          // eslint-disable-next-line no-shadow
                          courseSection,
                          // eslint-disable-next-line no-shadow
                          whichArray2 = tut,
                          // eslint-disable-next-line no-shadow
                          output2 = [],
                        ) => {
                          const tut2 = searchForSectionIndexAfterprevIndex(
                            courseSection,
                            'tutorial',
                            whichArray2,
                          );
                          if (tut2 !== -1) {
                            return courseSection[whichArray2].tutorial.some(
                              // eslint-disable-next-line no-shadow
                              arrayElement2 => {
                                // Recursive case...
                                if (winterLectureCombo.founded === 1) {
                                  return true;
                                }
                                // eslint-disable-next-line no-shadow
                                const temp = [...output2];
                                temp.push(arrayElement2);
                                tutorialCombo(courseSection, tut2, temp);
                              },
                            );
                          } else {
                            return courseSection[whichArray2].tutorial.some(
                              // eslint-disable-next-line no-shadow
                              arrayElement2 => {
                                // Base case when reach until the last course that has tutorial
                                if (winterLectureCombo.founded === 1) {
                                  return true;
                                }
                                // eslint-disable-next-line no-shadow
                                const temp = [...output2];
                                temp.push(arrayElement2);
                                addSectionToTimetable(temp, winterTimetable);
                                if (overlapExists(winterTimetable)) {
                                  winterTimetable = createShallowCopyOfTimetable(
                                    prevTimetabletut,
                                  );
                                  let j = -1;
                                  for (let i = 0; i < temp.length; i += 1) {
                                    if (
                                      temp[i] ===
                                      courseSection[i].tutorial[
                                        courseSection[i].tutorial.length - 1
                                      ]
                                    ) {
                                      j += 1;
                                    }
                                  }
                                  if (j === temp.length - 1) {
                                    return false;
                                  }
                                } else {
                                  winterLectureCombo.founded = 1;
                                  // founds a valid timetable
                                  return true;
                                }
                              },
                            );
                          }
                        };
                        const tutResult = tutorialCombo(courseSection);
                        if (tutResult) {
                          return true;
                        } else {
                          if (winterLectureCombo.founded === 1) {
                            return true;
                          }
                          winterTimetable = prevTimetable;
                        }
                        if (winterLectureCombo.founded === 1) {
                          return true;
                        }
                      } else {
                        winterLectureCombo.founded = 1;
                        return true;
                      }
                    }
                  },
                );
              }
            };
            const praResult = practicalCombo(courseSection);
            if (praResult) {
              winterLectureCombo.founded = 1;
              // founds a valid timetable
              return true;
            } else {
              if (winterLectureCombo.founded === 1) {
                return true;
              }
              winterTimetable = {
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
              };
            }
          } else {
            const tut = searchForSectionIndex(courseSection, 'tutorial');
            if (tut >= 0) {
              const prevTimetable = createShallowCopyOfTimetable(
                winterTimetable,
              );
              const tutorialCombo = (
                // eslint-disable-next-line no-shadow
                courseSection,
                whichArray2 = tut,
                output2 = [],
              ) => {
                const tut2 = searchForSectionIndexAfterprevIndex(
                  courseSection,
                  'tutorial',
                  whichArray2,
                );
                if (tut2 !== -1) {
                  return courseSection[whichArray2].tutorial.some(
                    arrayElement2 => {
                      // Recursive case...
                      if (fallLectureCombo.founded === 1) {
                        return true;
                      }
                      // eslint-disable-next-line no-shadow
                      const temp = [...output2];
                      temp.push(arrayElement2);
                      tutorialCombo(courseSection, tut2, temp);
                    },
                  );
                } else {
                  return courseSection[whichArray2].tutorial.some(
                    arrayElement2 => {
                      // Base case when reach until the last course that has tutorial
                      if (winterLectureCombo.founded === 1) {
                        return true;
                      }
                      // eslint-disable-next-line no-shadow
                      const temp = [...output2];
                      temp.push(arrayElement2);
                      addSectionToTimetable(temp, winterTimetable);
                      if (overlapExists(winterTimetable)) {
                        winterTimetable = createShallowCopyOfTimetable(
                          prevTimetable,
                        );
                        let j = -1;
                        for (let i = 0; i < temp.length; i += 1) {
                          if (
                            temp[i] ===
                            courseSection[i].tutorial[
                              courseSection[i].tutorial.length - 1
                            ]
                          ) {
                            j += 1;
                          }
                        }
                        if (j === temp.length - 1) {
                          return false;
                        }
                      } else {
                        winterLectureCombo.founded = 1;
                        return true;
                      }
                    },
                  );
                }
              };
              const tutResult = tutorialCombo(courseSection);
              if (tutResult) {
                winterLectureCombo.founded = 1;
                // founds a valid timetable
                return true;
              } else {
                if (winterLectureCombo.founded === 1) {
                  return true;
                }
                winterTimetable = {
                  MONDAY: [],
                  TUESDAY: [],
                  WEDNESDAY: [],
                  THURSDAY: [],
                  FRIDAY: [],
                };
              }
            } else {
              winterLectureCombo.founded = 1;
              // founds a valid timetable
              return true;
            }
            if (winterLectureCombo.founded === 1) {
              return true;
            }
          }
        }
        if (winterLectureCombo.founded === 1) {
          return true;
        }
      });
    }
  };
  const winterPracticalCombo = (courseSection, whichArray2, output2 = []) => {
    winterPracticalCombo.founded = 0;
    const pra2 = searchForSectionIndexAfterprevIndex(
      courseSection,
      'practical',
      whichArray2,
    );
    if (pra2 !== -1) {
      return courseSection[whichArray2].practical.some(arrayElement2 => {
        // Recursive case...
        if (winterPracticalCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        winterPracticalCombo(courseSection, pra2, temp);
      });
    } else {
      return courseSection[whichArray2].practical.some(arrayElement2 => {
        // Base case when reach until the last course that has practical
        if (winterPracticalCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        addSectionToTimetable(temp, winterTimetable);
        if (overlapExists(winterTimetable)) {
          winterTimetable = {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          };
          let j = -1;
          for (let i = 0; i < temp.length; i += 1) {
            if (
              temp[i] ===
              courseSection[i].practical[courseSection[i].practical.length - 1]
            ) {
              j += 1;
            }
          }
          if (j === temp.length - 1) {
            return false;
          }
        } else {
          const tut = searchForSectionIndex(courseSection, 'tutorial');
          if (tut >= 0) {
            const prevTimetabletut = createShallowCopyOfTimetable(
              winterTimetable,
            );
            const tutorialCombo = (
              // eslint-disable-next-line no-shadow
              courseSection,
              // eslint-disable-next-line no-shadow
              whichArray2 = tut,
              // eslint-disable-next-line no-shadow
              output2 = [],
            ) => {
              const tut2 = searchForSectionIndexAfterprevIndex(
                courseSection,
                'tutorial',
                whichArray2,
              );
              if (tut2 !== -1) {
                return courseSection[whichArray2].tutorial.some(
                  // eslint-disable-next-line no-shadow
                  arrayElement2 => {
                    // Recursive case...
                    if (winterPracticalCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    tutorialCombo(courseSection, tut2, temp);
                  },
                );
              } else {
                return courseSection[whichArray2].tutorial.some(
                  // eslint-disable-next-line no-shadow
                  arrayElement2 => {
                    // Base case when reach until the last course that has tutorial
                    if (winterPracticalCombo.founded === 1) {
                      return true;
                    }
                    // eslint-disable-next-line no-shadow
                    const temp = [...output2];
                    temp.push(arrayElement2);
                    addSectionToTimetable(temp, winterTimetable);
                    if (overlapExists(winterTimetable)) {
                      winterTimetable = createShallowCopyOfTimetable(
                        prevTimetabletut,
                      );
                      let j = -1;
                      for (let i = 0; i < temp.length; i += 1) {
                        if (
                          temp[i] ===
                          courseSection[i].tutorial[
                            courseSection[i].tutorial.length - 1
                          ]
                        ) {
                          j += 1;
                        }
                      }
                      if (j === temp.length - 1) {
                        return false;
                      }
                    } else {
                      winterPracticalCombo.founded = 1;
                      // founds a valid timetable
                      return true;
                    }
                  },
                );
              }
            };
            const tutResult = tutorialCombo(courseSection);
            if (tutResult) {
              return true;
            } else {
              if (winterPracticalCombo.founded === 1) {
                return true;
              }
              winterTimetable = {
                MONDAY: [],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: [],
              };
            }
            if (winterPracticalCombo.founded === 1) {
              return true;
            }
          } else {
            winterPracticalCombo.founded = 1;
            return true;
          }
        }
      });
    }
  };
  const winterTutorialCombo = (courseSection, whichArray2, output2 = []) => {
    winterTutorialCombo.founded = 0;
    const tut2 = searchForSectionIndexAfterprevIndex(
      courseSection,
      'tutorial',
      whichArray2,
    );
    if (tut2 !== -1) {
      return courseSection[whichArray2].tutorial.some(arrayElement2 => {
        // Recursive case...
        if (winterTutorialCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        winterTutorialCombo(courseSection, tut2, temp);
      });
    } else {
      return courseSection[whichArray2].tutorial.some(arrayElement2 => {
        // Base case when reach until the last course that has tutorial
        if (winterTutorialCombo.founded === 1) {
          return true;
        }
        const temp = [...output2];
        temp.push(arrayElement2);
        addSectionToTimetable(temp, winterTimetable);
        if (overlapExists(winterTimetable)) {
          winterTimetable = {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
          };
          let j = -1;
          for (let i = 0; i < temp.length; i += 1) {
            if (
              temp[i] ===
              courseSection[i].tutorial[courseSection[i].tutorial.length - 1]
            ) {
              j += 1;
            }
          }
          if (j === temp.length - 1) {
            return false;
          }
        } else {
          winterTutorialCombo.founded = 1;
          return true;
        }
      });
    }
  };

  if (fallCourseSection.length > 0 && state === 'F') {
    const lec = searchForSectionIndex(fallCourseSection, 'lecture');
    const pra = searchForSectionIndex(fallCourseSection, 'practical');
    const tut = searchForSectionIndex(fallCourseSection, 'tutorial');
    if (lec >= 0) {
      fallLectureCombo(fallCourseSection, lec);
    } else if (pra >= 0) {
      fallPracticalCombo(fallCourseSection, pra);
    } else if (tut >= 0) {
      fallTutorialCombo(fallCourseSection, tut);
    }
  } else if (fallCourseSection.length === 0 && state === 'F') {
    [, winterTimetable] = createTimetable(
      fallCourseSection,
      winterCourseSection,
      'W',
    );
  }
  if (winterCourseSection.length > 0 && state === 'W') {
    const lec = searchForSectionIndex(winterCourseSection, 'lecture');
    const pra = searchForSectionIndex(winterCourseSection, 'practical');
    const tut = searchForSectionIndex(winterCourseSection, 'tutorial');
    if (lec >= 0) {
      winterLectureCombo(winterCourseSection, lec);
    } else if (pra >= 0) {
      winterPracticalCombo(winterCourseSection, pra);
    } else if (tut >= 0) {
      winterTutorialCombo(winterCourseSection, tut);
    }
  }
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  if (state === 'F') {
    for (const day of days) {
      fallTimetable[day].sort((a, b) => a.start - b.start);
      winterTimetable[day].sort((a, b) => a.start - b.start);
    }
  }
  return [fallTimetable, winterTimetable];
};
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
  console.log(excludedConflictCourses);
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
  
  let timetables = createTimetable(
    fallCourseSections,
    winterCourseSections,
    'F',
  );
  if (
    (JSON.stringify(timetables[0]) ===
      JSON.stringify({
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
      }) &&
      fallCourses.length > 0) ||
    (JSON.stringify(timetables[1]) ===
      JSON.stringify({
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
      }) &&
      winterCourses.length > 0)
  ) {
    timetables = null;
  }
  return timetables;
};
// export { generateTimetables, createTimetable, overlapExists };
module.exports = { generateTimetables, createTimetable, overlapExists };
// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGdDQUFnQyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbkc7Ozs7OztHQU1HO0FBQ0gsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQW9CLEVBQUUsR0FBVyxFQUFFLEVBQUU7SUFDN0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsT0FBTyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUNwQyxJQUFJLFFBQVEsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM1QixPQUFPLFFBQVEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLO2dCQUNoRSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQzdELENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSztvQkFDekQsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2xFLE9BQU8sSUFBSSxDQUFBO2FBQ2Q7WUFDRCxRQUFRLEVBQUUsQ0FBQTtTQUNiO1FBQ0QsT0FBTyxFQUFFLENBQUE7S0FDWjtJQUNELE9BQU8sS0FBSyxDQUFBO0FBQ2hCLENBQUMsQ0FBQTtBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxhQUFhLEdBQUcsQ0FBQyxTQUFvQixFQUFXLEVBQUU7SUFDcEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDckUsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFBO0lBQ2xCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ3BCLE1BQU0sR0FBRyxNQUFNLElBQUksa0JBQWtCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0tBQ3hEO0lBQ0QsT0FBTyxNQUFNLENBQUE7QUFDakIsQ0FBQyxDQUFBO0FBR0Q7Ozs7O0dBS0c7QUFDSCxNQUFNLGVBQWUsR0FBRyxDQUFDLG1CQUFxQyxFQUFhLEVBQUU7SUFDekUsTUFBTSxTQUFTLEdBQWM7UUFDekIsTUFBTSxFQUFFLEVBQUU7UUFDVixPQUFPLEVBQUUsRUFBRTtRQUNYLFNBQVMsRUFBRSxFQUFFO1FBQ2IsUUFBUSxFQUFFLEVBQUU7UUFDWixNQUFNLEVBQUUsRUFBRTtLQUNiLENBQUE7SUFDRCxLQUFLLE1BQU0sY0FBYyxJQUFJLG1CQUFtQixFQUFFO1FBQzlDLEtBQUssTUFBTSxJQUFJLElBQUksY0FBYyxDQUFDLEtBQUssRUFBRTtZQUNyQyxNQUFNLGdCQUFnQixHQUFxQjtnQkFDdkMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUM7Z0JBQ3pDLFdBQVcsRUFBRSxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7Z0JBQzlDLFdBQVcsRUFBRSxjQUFjLENBQUMsV0FBVztnQkFDdkMsR0FBRyxJQUFJO2FBQ1YsQ0FBQTtZQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7U0FDN0M7S0FDSjtJQUNELElBQUksYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sSUFBSSxDQUFBO0tBQ2Q7SUFDRCxNQUFNLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNyRSxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUNwQixTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQzVCLENBQUMsQ0FBQyxDQUFBO0tBQ0w7SUFDRCxPQUFPLFNBQVMsQ0FBQTtBQUNwQixDQUFDLENBQUE7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxNQUFNLGtCQUFrQixHQUFHLENBQUMsT0FBaUIsRUFBZSxFQUFFO0lBRTFELGtFQUFrRTtJQUNsRSxNQUFNLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBRWxHLE1BQU0sbUJBQW1CLEdBQUcsa0JBQWtCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztJQUMzRSxNQUFNLFVBQVUsR0FBZ0IsRUFBRSxDQUFBO0lBRWxDLEtBQUssTUFBTSxZQUFZLElBQUksbUJBQW1CLEVBQUU7UUFDNUMsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQy9DLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtZQUNuQixVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQzdCO0tBQ0o7SUFFRCxPQUFPLFVBQVUsQ0FBQTtBQUNyQixDQUFDLENBQUE7QUFDRCxPQUFPLEVBQ0gsa0JBQWtCLEVBQ2xCLGVBQWUsRUFDZixhQUFhLEVBQ2hCLENBQUEifQ==
