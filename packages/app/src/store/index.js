import Vue from "vue";
import Vuex from "vuex";
import { generateTimetables } from "../timetable-planner";
import genColor from "color-generator";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        fallLockedHourStatus: {
            "8 AM": false,
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
        fallSelectedCourses: !localStorage.fallSelectedCourses ? {} : JSON.parse(localStorage.fallSelectedCourses),
        fallLockedSections: !localStorage.fallLockedSections ? [] : JSON.parse(localStorage.fallLockedSections),
        fallTimetable: !localStorage.fallTimetable ? {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
        } : JSON.parse(localStorage.fallTimetable),
        winterLockedHourStatus: {
            "8 AM": false,
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
        winterSelectedCourses: !localStorage.winterSelectedCourses ? {} : JSON.parse(localStorage.winterSelectedCourses),
        winterLockedSections: !localStorage.winterLockedSections ? [] : JSON.parse(localStorage.winterLockedSections),
        winterTimetable: !localStorage.winterTimetable ? {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
        } : JSON.parse(localStorage.winterTimetable),
        exportOverlay: false,
        conflictPopup: false,
        searchBarValue: null,
        savedFallTimetable: {},
        savedWinterTimetable: {},
        savedFallSelectedCourses: {},
        savedWinterSelectedCourses: {},
        savedFallLockedSections: [],
        savedWinterLockedSections: [],
        savedLockedHourStatus: {
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
        savedLockedDayStatus: {
            MONDAY: false,
            TUESDAY: false,
            WEDNESDAY: false,
            THURSDAY: false,
            FRIDAY: false,
        },
        semesterStatus: "F",
        noTimetablePopup: false,
        overwriteLockedSectionPopup: false,
        tutorialPopup: !localStorage.visited,
        deliveryMethod: "Mixed"
    },
    mutations: {
        setExportOverlay(state, payload) {
            state.exportOverlay = payload;
        },
        setLockedHourStatus(state, payload) {
            if (state.semesterStatus === "F") {
                state.fallLockedHourStatus[payload] = !state.fallLockedHourStatus[
                    payload
                ];
            } else {
                state.winterLockedHourStatus[payload] = !state
                    .winterLockedHourStatus[payload];
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
            state.fallTimetable = payload[0];
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
                let whichDay = payload.course.meeting_sections[0].times[0].day;

                if (state.semesterStatus === "F") {

                    // already in the timetable
                    if (payload.course.courseCode in state.fallSelectedCourses) {
                        return
                    }

                    state.fallSelectedCourses[payload.course.courseCode] =
                        payload.course;

                    //Add new section into timetable
                    state.fallTimetable[whichDay].push({
                        code: payload.course.courseCode,
                        sectionCode: payload.course.meeting_sections[0].sectionCode,
                        instructors:
                            payload.course.meeting_sections[0].instructors[0],
                        ...payload.course.meeting_sections[0].times[0],
                    });

                    // sort it
                    state.fallTimetable[whichDay].sort((a, b) => {
                        return a.start - b.start;
                    });
                } else {

                    // already in the timetable
                    if (payload.course.courseCode in state.winterSelectedCourses) {
                        return
                    }

                    state.winterSelectedCourses[payload.course.courseCode] =
                        payload.course;

                    //Add new section into timetable
                    state.winterTimetable[whichDay].push({
                        code: payload.course.courseCode,
                        sectionCode: payload.course.meeting_sections[0].sectionCode,
                        instructors:
                            payload.course.meeting_sections[0].instructors[0],
                        ...payload.course.meeting_sections[0].times[0],
                    });

                    // sort it
                    state.winterTimetable[whichDay].sort((a, b) => {
                        return a.start - b.start;
                    });
                }
            } else if (payload.course.courseCode[8] === "F") {
                state.fallSelectedCourses[payload.course.courseCode] =
                    payload.course;
            } else if (payload.course.courseCode[8] === "S") {
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
                    Vue.delete(state.fallSelectedCourses, payload.code);
                } else {
                    Vue.delete(state.winterSelectedCourses, payload.code);
                }
            } else if (payload.code[8] === "F") {
                Vue.delete(state.fallSelectedCourses, payload.code);
            } else if (payload.code[8] === "S") {
                Vue.delete(state.winterSelectedCourses, payload.code);
            } else if (payload.code[8] === "Y") {
                Vue.delete(state.fallSelectedCourses, payload.code);
                Vue.delete(state.winterSelectedCourses, payload.code);
            }
        },
        //Todo
        setLockedSections(state, payload) {
            state.fallLockedSections = payload[0];
            state.winterLockedSections = payload[1];
        },
        //Todo
        setSelectedCourses(state, payload) {
            state.fallSelectedCourses = payload[0];
            state.winterSelectedCourses = payload[1];
        },
        lockSection(state, payload) {
            let index;
            if (payload.slice(0, 4) === "Lock") {
                if (state.semesterStatus === "F") {
                    index = state.fallLockedSections.indexOf(payload);
                    if (index == -1) {
                        state.fallLockedSections.push(payload);
                    }
                } else {
                    index = state.winterLockedSections.indexOf(payload);
                    if (index == -1) {
                        state.winterLockedSections.push(payload);
                    }
                }
            } else if (payload[8] === "F") {
                index = state.fallLockedSections.indexOf(payload);
                if (index === -1) {
                    state.fallLockedSections.push(payload);
                }
            } else if (payload[8] === "S") {
                index = state.winterLockedSections.indexOf(payload);
                if (index === -1) {
                    state.winterLockedSections.push(payload);
                }
            } else if (payload[8] === "Y") {
                index = state.fallLockedSections.indexOf(payload);
                if (index === -1) {
                    state.fallLockedSections.push(payload);
                    state.winterLockedSections.push(payload);
                }
            }
        },
        unlockSection(state, payload) {
            let index;
            if (payload.slice(0, 4) === "Lock") {
                //Block hour
                if (state.semesterStatus === "F") {
                    index = state.fallLockedSections.indexOf(payload);
                    if (index != -1) {
                        state.fallLockedSections.splice(index, 1);
                    }
                } else {
                    index = state.winterLockedSections.indexOf(payload);
                    if (index != -1) {
                        state.winterLockedSections.splice(index, 1);
                    }
                }
            } else if (payload[8] === "F") {
                //Fall
                index = state.fallLockedSections.indexOf(payload);
                if (index != -1) {
                    state.fallLockedSections.splice(index, 1);
                }
            } else if (payload[8] === "S") {
                //Winter
                index = state.winterLockedSections.indexOf(payload);
                if (index != -1) {
                    state.winterLockedSections.splice(index, 1);
                }
            } else if (payload[8] === "Y") {
                //Year
                index = state.fallLockedSections.indexOf(payload);
                if (index != -1) {
                    state.fallLockedSections.splice(index, 1);
                    index = state.winterLockedSections.indexOf(payload);
                    state.winterLockedSections.splice(index, 1);
                }
            }
        },
        setPreferredDeliveryMethod(state, payload) {
            state.deliveryMethod = payload
        }
    },
    actions: {
        saveTimetable(context) {
            context.state.savedFallTimetable = JSON.parse(
                JSON.stringify(context.state.fallTimetable)
            );
            context.state.savedWinterTimetable = JSON.parse(
                JSON.stringify(context.state.winterTimetable)
            );
            context.state.savedFallSelectedCourses = JSON.parse(
                JSON.stringify(context.state.fallSelectedCourses)
            );
            context.state.savedWinterSelectedCourses = JSON.parse(
                JSON.stringify(context.state.winterSelectedCourses)
            );
            context.state.savedFallLockedSections = [
                ...context.state.fallLockedSections,
            ];
            context.state.savedWinterLockedSections = [
                ...context.state.winterLockedSections,
            ];
        },
        saveLockedDayStatus(context){
            if (context.state.semesterStatus === "F") {
                context.state.savedLockedDayStatus = JSON.parse(
                    JSON.stringify(context.state.fallLockedDayStatus))
            }
            else{
                context.state.savedLockedDayStatus = JSON.parse(
                    JSON.stringify(context.state.winterLockedDayStatus))
            }
        },
        saveLockedHourStatus(context) {
            if (context.state.semesterStatus === "F") {
                context.state.savedLockedHourStatus = JSON.parse(
                    JSON.stringify(context.state.fallLockedHourStatus))
            }
            else{
                context.state.savedLockedHourStatus = JSON.parse(
                    JSON.stringify(context.state.winterLockedHourStatus))
            }
        },
        revertTimetable(context) {
            context.commit("setTimetables", [
                context.state.savedFallTimetable,
                context.state.savedWinterTimetable,
            ]);
            context.commit("setSelectedCourses", [
                context.state.savedFallSelectedCourses,
                context.state.savedWinterSelectedCourses,
            ]);
            context.commit("setLockedSections", [
                context.state.savedFallLockedSections,
                context.state.savedWinterLockedSections,
            ]);
            if (context.state.semesterStatus === "F") {
                context.state.fallLockedHourStatus = context.state.savedLockedHourStatus
                context.state.fallLockedDayStatus = context.state.savedLockedDayStatus
            }
            else{
                context.state.winterLockedHourStatus = context.state.savedLockedHourStatus
                context.state.winterLockedDayStatus = context.state.savedLockedDayStatus
            }
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
            const winterCourses = Object.keys(
                context.state.winterSelectedCourses
            ).map((code) => context.state.winterSelectedCourses[code]);

            let timetables = generateTimetables(
                fallCourses,
                context.state.fallLockedSections,
                winterCourses,
                context.state.winterLockedSections,
                context.state.deliveryMethod
            );

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
                        let dayEvents = context.state.fallTimetable[day];
                        for (let i = dayEvents.length - 1; i >= 0; i--) {
                            if (dayEvents[i].code === payload.code) {
                                dayEvents.splice(i, 1);
                                break;
                            }
                        }
                    }
                } else {
                    for (let day in context.state.winterTimetable) {
                        let dayEvents = context.state.winterTimetable[day];
                        for (let i = dayEvents.length - 1; i >= 0; i--) {
                            if (dayEvents[i].code === payload.code) {
                                dayEvents.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            } else {
                for (let day in context.state.fallTimetable) {
                    let dayEvents = context.state.fallTimetable[day];
                    for (let i = dayEvents.length - 1; i >= 0; i--) {
                        if (dayEvents[i].code === payload.code) {
                            dayEvents.splice(i, 1);
                        }
                    }
                }
                for (let day in context.state.winterTimetable) {
                    let dayEvents = context.state.winterTimetable[day];
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
            if (!payload) {
                context.dispatch("saveTimetable");
            }

            const fallCourses = Object.keys(context.state.fallSelectedCourses).map(
                (code) => context.state.fallSelectedCourses[code]
            );
            const winterCourses = Object.keys(
                context.state.winterSelectedCourses
            ).map((code) => context.state.winterSelectedCourses[code]);

            let bothTimetables = generateTimetables(
                fallCourses,
                context.state.fallLockedSections,
                winterCourses,
                context.state.winterLockedSections,
                context.state.deliveryMethod
            );

            context.dispatch("validateTimetable", bothTimetables);
        },
        //Switch a section of a course when there is no conflict
        switchSection(context, payload) {
            //Remove old section from locked sections
            context.commit(
                "unlockSection",
                `${payload.old.courseCode}${payload.old.sectionCode}`
            );

            let whichSemesters = [];
            if (payload.old.courseCode[8] === "F") {
                whichSemesters.push(context.state.fallTimetable);
            } else if (payload.old.courseCode[8] === "S") {
                whichSemesters.push(context.state.winterTimetable);
            } else {
                whichSemesters.push(context.state.fallTimetable);
                whichSemesters.push(context.state.winterTimetable);
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
            return state.exportOverlay;
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
            return state.winterTimetable;
        },
        selectedCourses: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallSelectedCourses;
            } else {
                return state.winterSelectedCourses;
            }
        },
        fallSelectedCourses: (state) => {
            return state.fallSelectedCourses;
        },
        winterSelectedCourses: (state) => {
            return state.winterSelectedCourses;
        },
        getLockedSections: (state) => {
            if (state.semesterStatus === "F") {
                return state.fallLockedSections;
            } else {
                return state.winterLockedSections;
            }
        },
        fallLockedSections: (state) => {
            return state.fallLockedSections;
        },
        winterLockedSections: (state) => {
            return state.winterLockedSections;
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
