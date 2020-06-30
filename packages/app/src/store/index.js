import Vue from "vue";
import Vuex from "vuex";
import { generateTimetables } from "../timetable-planner";
import genColor from "color-generator";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        fallLockedHourStatus: {
            "9 AM": false,
            "10 AM": false,
            "11 AM": false,
            "12 PM": false,
            "1 PM": false,
            "2 PM": false,
            "3 PM": false,
            "4 PM": false,
            "5 PM": false,
            "6 PM": false,
            "7 PM": false,
            "8 PM": false,
            "9 PM": false,
        },
        fallLockedDayStatus: {
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
        },
        fallSelectedCourses: {},
        fallLockedSections: [],
        fallTimetable: {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
        },
        winterLockedHourStatus: {
            "9 AM": false,
            "10 AM": false,
            "11 AM": false,
            "12 PM": false,
            "1 PM": false,
            "2 PM": false,
            "3 PM": false,
            "4 PM": false,
            "5 PM": false,
            "6 PM": false,
            "7 PM": false,
            "8 PM": false,
            "9 PM": false,
        },
        winterLockedDayStatus: {
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
        },
        winterSelectedCourses: {},
        winterLockedSections: [],
        winterTimetable: {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
        },
        exportOverlay: false,
        conflictPopup: false,
        searchBarValue: null,
        savedFallTimetable: {},
        savedWinterTimetable: {},
        savedSelectedCourses: {},
        savedLockedSections: [],
        savedLockedDayStatus: {},
        semesterStatus: "F",
        noTimetablePopup: false,
        overwriteLockedSectionPopup: false,
        tutorialPopup: !localStorage.visited,
    },
    mutations: {
        setExportOverlay(state, payload) {
            state.exportOverlay = payload
        },
        setLockedHourStatus(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallLockedHourStatus[payload] = !state.fallLockedHourStatus[
                    payload
                ];
            } else {
                state.winterLockedHourStatus[payload] = !state.winterLockedHourStatus[
                    payload
                ];
            }
        },
        setLockedDayStatus(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallLockedDayStatus[payload] = !state.fallLockedDayStatus[
                    payload
                ];
            } else {
                state.winterLockedDayStatus[payload] = !state.winterLockedDayStatus[
                    payload
                ];
            }
        },
        setTutorialPopup(state, payload) {
            state.tutorialPopup = payload;
        },
        setSemesterStatus(state, payload) {
            state.semesterStatus = payload;
        },
        setSearchBarValue(state, payload) {
            state.searchBarValue = payload;
        },
        setTimetables(state, payload) {
            state.fallTimetable = payload[0]
            state.winterTimetable = payload[1];
        },
        setNoTimetablePopup(state, payload) {
            state.noTimetablePopup = payload;
        },
        setOverwriteLockedSectionPopup(state, payload) {
            state.overwriteLockedSectionPopup = payload;
        },
        addCourse(state, payload) {
            if (payload.course.courseCode.slice(0, 4) === "Lock") {
                if (state.semesterStatus === "F") {
                    state.fallSelectedCourses[payload.course.courseCode] =
                        payload.course;
                } else {
                    state.winterSelectedCourses[payload.course.courseCode] =
                        payload.course;
                }
            }
            else if (payload.course.courseCode[8] === "F") {
                state.fallSelectedCourses[payload.course.courseCode] =
                    payload.course;
            }
            else if (payload.course.courseCode[8] === "S") {
                state.winterSelectedCourses[payload.course.courseCode] =
                    payload.course;
            } else if (payload.course.courseCode[8] === "Y") {
                state.fallSelectedCourses[payload.course.courseCode] =
                    payload.course;
                state.winterSelectedCourses[payload.course.courseCode] =
                    payload.course;
            }
        },
        removeCourse(state, payload) {
            if (payload.code.slice(0, 4) === "Lock") {
                if (state.semesterStatus === "F") {
                    Vue.delete(state.fallSelectedCourses, payload.code)
                } else {
                    Vue.delete(state.winterSelectedCourses, payload.code)
                }
            }
            else if (payload.code[8] === "F") {
                Vue.delete(state.fallSelectedCourses, payload.code)
            }
            else if (payload.code[8] === "S") {
                Vue.delete(state.winterSelectedCourses, payload.code)
            } else if (payload.code[8] === "Y") {
                Vue.delete(state.fallSelectedCourses, payload.code)
                Vue.delete(state.winterSelectedCourses, payload.code)
            }
        },
        //Todo
        setLockedSections(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallLockedSections = payload;
            } else {
                state.winterLockedSections = payload;
            }
        },
        setSavedLockedDayStatus(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallLockedSections = payload;
            } else {
                state.winterLockedSections = payload;
            }
        },
        //Todo
        setSelectedCourses(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallSelectedCourses = payload;
            } else {
                state.winterSelectedCourses = payload;
            }
        },
        lockSection(state, payload) {
            if (payload.slice(0, 4) === "Lock") {
                if (state.semesterStatus === "F") {
                    state.fallLockedSections.push(payload);
                }
                else {
                    state.winterLockedSections.push(payload);
                }
            }
            else if (payload[8] === "F") {
                state.fallLockedSections.push(payload);
            } else if (payload[8] === "S") {
                state.winterLockedSections.push(payload);
            } else if (payload[8] === "Y") {
                state.fallLockedSections.push(payload);
                state.winterLockedSections.push(payload);
            }
        },
        unlockSection(state, payload) {
            let index;
            if (payload.slice(0, 4) === "Lock") { //Block hour
                if (state.semesterStatus === "F") {
                    index = state.fallLockedSections.indexOf(payload);
                    if (index != -1) {
                        state.fallLockedSections.splice(index, 1);
                    }
                }
                else {
                    index = state.winterLockedSections.indexOf(payload);
                    if (index != -1) {
                        state.winterLockedSections.splice(index, 1);
                    }
                }
            }
            if (payload[8] === "F") { //Fall
                index = state.fallLockedSections.indexOf(payload);
                if (index != -1) {
                    state.fallLockedSections.splice(index, 1);
                }
            } else if (payload[8] === "S") { //Winter
                index = state.winterLockedSections.indexOf(payload);
                if (index != -1) {
                    state.winterLockedSections.splice(index, 1);
                }
            } else if (payload[8] === "Y") { //Year
                index = state.fallLockedSections.indexOf(payload);
                if (index != -1) {
                    state.fallLockedSections.splice(index, 1);
                    index = state.winterLockedSections.indexOf(payload)
                    state.winterLockedSections.splice(index, 1);
                }
            }
        },
    },
    actions: {
        saveTimetable(context) {
            context.state.savedFallTimetable = JSON.parse(
                JSON.stringify(context.state.fallTimetable)
            );
            context.state.savedWinterTimetable = JSON.parse(
                JSON.stringify(context.state.winterTimetable)
            );
            if (context.state.semesterStatus === "F") {
                context.state.savedSelectedCourses = JSON.parse(
                    JSON.stringify(context.state.fallSelectedCourses)
                );
                context.state.savedLockedSections = [
                    ...context.state.fallLockedSections,
                ];
                context.state.savedLockedDayStatus = JSON.parse(
                    JSON.stringify(context.state.fallLockedDayStatus)
                );
            } else {
                context.state.savedSelectedCourses = JSON.parse(
                    JSON.stringify(context.state.winterSelectedCourses)
                );
                context.state.savedLockedSections = [
                    ...context.state.winterLockedSections,
                ];
                context.state.savedLockedDayStatus = JSON.parse(
                    JSON.stringify(context.state.winterLockedDayStatus)
                );
            }
        },
        revertTimetable(context) {
            context.commit("setTimetables", [context.state.savedFallTimetable, context.state.savedWinterTimetable]);
            context.commit("setSelectedCourses", context.state.savedSelectedCourses);
            context.commit("setLockedSections", context.state.savedLockedSections);
            //context.commit("setSavedLockedDayStatus", context.state.savedLockedDayStatus);
        },
        validateTimetable(context, payload) {
            if (payload === null) {
                context.commit("setSearchBarValue", null);
                context.commit("setNoTimetablePopup", true);
                context.dispatch("revertTimetable");
            } else {
                context.commit("setTimetables", payload);
            }
        },
        selectCourse(context, payload) {
            // save the previous timetable by default
            if (!payload.noSave) {
                context.dispatch("saveTimetable");
            }

            // generate a color
            const color = genColor(0.7, 0.85).hexString();

            //Add the course
            context.commit("addCourse", {
                course: {
                    color,
                    ...payload.course,
                },
            });

            const fallCourses = Object.keys(context.state.fallSelectedCourses).map(
                (code) => context.state.fallSelectedCourses[code]
            );
            const winterCourses = Object.keys(context.state.winterSelectedCourses).map(
                (code) => context.state.winterSelectedCourses[code]
            );

            let timetables = generateTimetables(fallCourses, context.state.fallLockedSections,
                winterCourses, context.state.winterLockedSections)

            context.dispatch("validateTimetable", timetables);
        },
        deleteCourse(context, payload) {
            // resets search bar value if the deleted course is the last searched course
            if (
                context.state.searchBarValue != null &&
                context.state.searchBarValue.includes(payload.code)
            ) {
                context.commit("setSearchBarValue", null);
            }

            //Remove course
            context.commit("removeCourse", payload);

            //Unlock all sections of the deleted course           
            for (let lockedSection of context.state.fallLockedSections) {
                if (lockedSection.includes(payload.code)) {
                    context.commit("unlockSection", lockedSection);
                }
            }
            for (let lockedSection of context.state.winterLockedSections) {
                if (lockedSection.includes(payload.code)) {
                    context.commit("unlockSection", lockedSection);
                }
            }

            //Remove all sections of the deleted course from the correct timetable   
            if (payload.code.includes("Lock")) {
                if (context.state.semesterStatus === "F") {
                    for (let day in context.state.fallTimetable) {
                        let dayEvents = context.state.fallTimetable[day]
                        for (let i = dayEvents.length - 1; i >= 0; i--) {
                            if (dayEvents[i].code === payload.code) {
                                dayEvents.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
                else {
                    for (let day in context.state.winterTimetable) {
                        let dayEvents = context.state.winterTimetable[day]
                        for (let i = dayEvents.length - 1; i >= 0; i--) {
                            if (dayEvents[i].code === payload.code) {
                                dayEvents.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }
            else {
                for (let day in context.state.fallTimetable) {
                    let dayEvents = context.state.fallTimetable[day]
                    for (let i = dayEvents.length - 1; i >= 0; i--) {
                        if (dayEvents[i].code === payload.code) {
                            dayEvents.splice(i, 1);
                        }
                    }
                }
                for (let day in context.state.winterTimetable) {
                    let dayEvents = context.state.winterTimetable[day]
                    for (let i = dayEvents.length - 1; i >= 0; i--) {
                        if (dayEvents[i].code === payload.code) {
                            dayEvents.splice(i, 1);
                        }
                    }
                }
            }
        },
        //Recalculate timetable when switching sections with conflict
        resetTimetable(context, payload) {
            // Save the timetable before it gets reset

            if (!payload) {
                context.dispatch("saveTimetable");
            }

            const fallCourses = Object.keys(context.state.fallSelectedCourses).map(
                (code) => context.state.fallSelectedCourses[code]
            );
            const winterCourses = Object.keys(context.state.winterSelectedCourses).map(
                (code) => context.state.winterSelectedCourses[code]
            );

            let bothTimetables = generateTimetables(fallCourses, context.state.fallLockedSections,
                winterCourses, context.state.winterLockedSections)

            context.dispatch("validateTimetable", bothTimetables);
        },
        //Switch a section of a course when there is no conflict
        switchSection(context, payload) {
            //Remove old section from locked sections
            context.commit(
                "unlockSection",
                `${payload.old.courseCode}${payload.old.sectionCode}`
            );

            let whichSemesters = []
            if (payload.old.courseCode[8] === "F") {
                whichSemesters.push(context.state.fallTimetable)
            }
            else if (payload.old.courseCode[8] === "S") {
                whichSemesters.push(context.state.winterTimetable)
            }
            else {
                whichSemesters.push(context.state.fallTimetable)
                whichSemesters.push(context.state.winterTimetable)
            }

            for (let semester of whichSemesters) {
                //Remove old section from timetable
                for (let d in semester) {
                    let day = semester[d];
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
                    semester[time.day].push({
                        code: payload.old.courseCode,
                        sectionCode: payload.new.sectionCode,
                        instructors: payload.new.instructors,
                        ...time,
                    });
                    semester[time.day].sort((a, b) => {
                        return a.start - b.start;
                    });
                }
            }
        },
    },
    modules: {},
    getters: {
        getExportOverlay: (state) => {
            return state.exportOverlay
        },
        getNoTimetablePopup: (state) => {
            return state.noTimetablePopup;
        },
        getOverwriteLockedSectionPopup: (state) => {
            return state.overwriteLockedSectionPopup;
        },
        getTutorialPopup(state) {
            return state.tutorialPopup;
        },
        timetable: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallTimetable;
            } else {
                return state.winterTimetable;
            }
        },
        fallTimetable: (state) => {
            return state.fallTimetable;
        },
        winterTimetable: (state) => {
            return state.winterTimetable
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
        fallLockedSections: (state) => {
            return state.fallLockedSections
        },
        winterLockedSections: (state) => {
            return state.winterLockedSections
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
        getLockedDayStatus: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallLockedDayStatus;
            } else {
                return state.winterLockedDayStatus;
            }
        },
        getLockedHourStatus: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallLockedHourStatus;
            } else {
                return state.winterLockedHourStatus;
            }
        },
    },
});
