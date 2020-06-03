import Vue from "vue";
import Vuex from "vuex";
import { generateTimetables } from "../timetable-planner";
import genColor from "color-generator";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        fallSelectedCourses: {},
        fallLockedSections: [],
        fallTimetable: {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
        },
        winterTimetable: {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
        },
        winterSelectedCourses: {},
        winterLockedSections: [],
        conflictPopup: false,
        searchBarValue: null,
        savedTimetable: {},
        savedSelectedCourses: {},
        savedLockedSections: [],
        semesterStatus: "F",
        noTimetablePopup: false,
        overwriteLockedSectionPopup: false
    },
    mutations: {
        setSemesterStatus(state, payload) {
            state.semesterStatus = payload;
        },
        setSearchBarValue(state, payload) {
            state.searchBarValue = payload;
        },
        setTimetable(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallTimetable = payload;
            } else {
                state.winterTimetable = payload;
            }
        },
        setNoTimetablePopup(state, payload) {
            state.noTimetablePopup = payload;
        },
        setOverwriteLockedSectionPopup(state, payload) {
            state.overwriteLockedSectionPopup = payload
        },
        addCourse(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallSelectedCourses[payload.course.courseCode] =
                    payload.course;
            } else {
                state.winterSelectedCourses[payload.course.courseCode] =
                    payload.course;
            }
        },
        removeCourse(state, payload) {
            if (state.semesterStatus === "F") {
                Vue.delete(state.fallSelectedCourses, payload.code);
            } else {
                Vue.delete(state.winterSelectedCourses, payload.code);
            }
        },
        setLockedSections(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallLockedSections = payload;
            } else {
                state.winterLockedSections = payload;
            }
        },
        setSelectedCourses(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallSelectedCourses = payload;
            } else {
                state.winterSelectedCourses = payload;
            }
        },
        lockSection(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallLockedSections.push(payload);
            } else {
                state.winterLockedSections.push(payload);
            }
        },
        unlockSection(state, payload) {
            if (state.semesterStatus === "F") {
                const index = state.fallLockedSections.indexOf(payload);
                if (index != -1) {
                    state.fallLockedSections.splice(index, 1);
                }
            } else {
                const index = state.winterLockedSections.indexOf(payload);
                if (index != -1) {
                    state.winterLockedSections.splice(index, 1);
                }
            }
        },
    },
    actions: {
        saveTimetable(context) {
            if (context.state.semesterStatus === "F") {
                context.state.savedTimetable = JSON.parse(
                    JSON.stringify(context.state.fallTimetable)
                );
                context.state.savedSelectedCourses = JSON.parse(
                    JSON.stringify(context.state.fallSelectedCourses)
                );
                context.state.savedLockedSections = [
                    ...context.state.fallLockedSections,
                ];
            } else {
                context.state.savedTimetable = JSON.parse(
                    JSON.stringify(context.state.winterTimetable)
                );
                context.state.savedSelectedCourses = JSON.parse(
                    JSON.stringify(context.state.winterSelectedCourses)
                );
                context.state.savedLockedSections = [
                    ...context.state.winterLockedSections,
                ];
            }
        },
        revertTimetable(context) {
            context.commit("setTimetable", context.state.savedTimetable);
            context.commit("setSelectedCourses", context.state.savedSelectedCourses);
            context.commit("setLockedSections", context.state.savedLockedSections);
        },
        validateTimetable(context, payload) {
            if (
                JSON.stringify(payload) ===
                JSON.stringify({
                    MONDAY: [],
                    TUESDAY: [],
                    WEDNESDAY: [],
                    THURSDAY: [],
                    FRIDAY: [],
                })
            ) {
                context.commit("setNoTimetablePopup", true);
                context.dispatch("revertTimetable");
            } else {
                context.commit("setTimetable", payload);
            }
        },
        selectCourse(context, payload) {
            // save the previous timetable by default
            if (!payload.noSave) {
                context.dispatch("saveTimetable");
            }

            // generate a color
            const color = genColor(0.7, 0.85).hexString();
            context.commit("addCourse", {
                course: {
                    color,
                    ...payload.course,
                },
            });

            let timetable;
            if (context.state.semesterStatus === "F") {
                const courses = Object.keys(context.state.fallSelectedCourses).map(
                    (code) => context.state.fallSelectedCourses[code]
                );
                timetable = generateTimetables(
                    courses,
                    context.state.fallLockedSections
                );
            } else {
                const courses = Object.keys(context.state.winterSelectedCourses).map(
                    (code) => context.state.winterSelectedCourses[code]
                );
                timetable = generateTimetables(
                    courses,
                    context.state.winterLockedSections
                );
            }

            context.dispatch("validateTimetable", timetable);
        },
        deleteCourse(context, payload) {
            // resets search bar value if the deleted course is the last searched course
            if (
                context.state.searchBarValue != null &&
                context.state.searchBarValue.includes(payload.code)
            ) {
                context.commit("setSearchBarValue", null);
            }
            context.commit("removeCourse", payload);

            let timetable;
            //Unlock all sections of deleted course
            if (context.state.semesterStatus === "F") {
                for (let lockedSection of context.state.fallLockedSections) {
                    if (lockedSection.includes(payload.code)) {
                        context.commit("unlockSection", lockedSection);
                    }
                }
                const courses = Object.keys(context.state.fallSelectedCourses).map(
                    (code) => context.state.fallSelectedCourses[code]
                );
                timetable = generateTimetables(
                    courses,
                    context.state.fallLockedSections
                );
            } else {
                for (let lockedSection of context.state.winterLockedSections) {
                    if (lockedSection.includes(payload.code)) {
                        context.commit("unlockSection", lockedSection);
                    }
                }
                const courses = Object.keys(context.state.winterSelectedCourses).map(
                    (code) => context.state.winterSelectedCourses[code]
                );
                timetable = generateTimetables(
                    courses,
                    context.state.winterLockedSections
                );
            }

            context.commit("setTimetable", timetable);
        },
        //Recalculate timetable when switching sections with conflict
        resetTimetable(context) {
            // Save the timetable before it gets reset
            context.dispatch("saveTimetable");
            let timetable;
            
            if (context.state.semesterStatus === "F") {
                const courses = Object.keys(context.state.fallSelectedCourses).map(
                    (code) => context.state.fallSelectedCourses[code]
                );
                timetable = generateTimetables(
                    courses,
                    context.state.fallLockedSections
                );
            } else {
                const courses = Object.keys(context.state.winterSelectedCourses).map(
                    (code) => context.state.winterSelectedCourses[code]
                );
                timetable = generateTimetables(
                    courses,
                    context.state.winterLockedSections
                );
            }

            context.dispatch("validateTimetable", timetable);
        },
        //Switch a section of a course when there is no conflict
        switchSection(context, payload) {
            //Remove old section from locked sections
            context.commit(
                "unlockSection",
                `${payload.old.courseCode}${payload.old.sectionCode}`
            );

            if (context.state.semesterStatus === "F") {
                //Remove old section from timetable
                for (let d in context.state.fallTimetable) {
                    let day = context.state.fallTimetable[d];
                    for (let event of day) {
                        if (
                            `${event.code}${event.sectionCode}` ==
                            `${payload.old.courseCode}${payload.old.sectionCode}`
                        ) {
                            day.splice(day.indexOf(event), 1);
                        }
                    }
                }
                //Add new section into timetable
                for (let time of payload.new.times) {
                    context.state.fallTimetable[time.day].push({
                        code: payload.old.courseCode,
                        sectionCode: payload.new.sectionCode,
                        instructors: payload.new.instructors,
                        ...time,
                    });
                    context.state.fallTimetable[time.day].sort((a, b) => {
                        return a.start - b.start;
                    });
                }
            } else {
                //Remove old section from timetable
                for (let d in context.state.winterTimetable) {
                    let day = context.state.winterTimetable[d];
                    for (let event of day) {
                        if (
                            `${event.code}${event.sectionCode}` ==
                            `${payload.old.courseCode}${payload.old.sectionCode}`
                        ) {
                            day.splice(day.indexOf(event), 1);
                        }
                    }
                }
                //Add new section into timetable
                for (let time of payload.new.times) {
                    context.state.winterTimetable[time.day].push({
                        code: payload.old.courseCode,
                        sectionCode: payload.new.sectionCode,
                        instructors: payload.new.instructors,
                        ...time,
                    });
                    context.state.winterTimetable[time.day].sort((a, b) => {
                        return a.start - b.start;
                    });
                }
            }
        },
    },
    modules: {},
    getters: {
        getNoTimetablePopup: (state) => {
            return state.noTimetablePopup;
        },
        getOverwriteLockedSectionPopup:(state) => {
            return state.overwriteLockedSectionPopup;
        },
        timetable: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallTimetable;
            } else {
                return state.winterTimetable;
            }
        },
        selectedCourses: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallSelectedCourses;
            } else {
                return state.winterSelectedCourses;
            }
        },
        getLockedSections: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallLockedSections;
            } else {
                return state.winterLockedSections;
            }
        },
        getCourseColor: (state) => (code) => {
            if (state.semesterStatus === "F") {
                return state.fallSelectedCourses[code].color;
            } else {
                return state.winterSelectedCourses[code].color;
            }
        },
        getSearchBarValue: (state) => {
            return state.searchBarValue;
        },
        getSemesterStatus: (state) => {
            return state.semesterStatus;
        },
    },
});
