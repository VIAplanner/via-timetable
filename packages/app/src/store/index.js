import Vue from "vue";
import Vuex from "vuex";
import { generateTimetables } from "../timetable-planner";
import genColor from "color-generator";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        selectedCourses: {},
        timetable: {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
        },
        lockedSections: [],
        conflictPopup: false,
        searchBarValue: null,
        savedTimetable: {},
        savedSelectedCourses: {},
        savedLockedSections: [],
        semesterStatus: "S",
    },
    mutations: {
        setSemesterStatus(state, payload) {
            state.semesterStatus = payload;
        },
        setSearchBarValue(state, payload) {
            state.searchBarValue = payload;
        },
        setTimetable(state, payload) {
            state.timetable = payload;
        },
        setConflictPopup(state, payload) {
            state.conflictPopup = payload;
        },
        addCourse(state, payload) {
            state.selectedCourses[payload.course.courseCode] = payload.course;
        },
        removeCourse(state, payload) {
            Vue.delete(state.selectedCourses, payload.code);
        },
        setLockedSections(state, payload) {
            state.lockedSections = payload;
        },
        setSelectedCourses(state, payload) {
            state.selectedCourses = payload;
        },
        lockSection(state, payload) {
            state.lockedSections.push(payload);
        },
        unlockSection(state, payload) {
            const index = state.lockedSections.indexOf(payload);
            if (index != -1) {
                state.lockedSections.splice(index, 1);
            }
        },
    },
    actions: {
        saveTimetable(context) {
            context.state.savedTimetable = JSON.parse(
                JSON.stringify(context.state.timetable)
            );
            context.state.savedSelectedCourses = JSON.parse(
                JSON.stringify(context.state.selectedCourses)
            );
            context.state.savedLockedSections = [...context.state.lockedSections];
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
                context.commit("setConflictPopup", true);
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
            const courses = Object.keys(context.state.selectedCourses).map(
                (code) => context.state.selectedCourses[code]
            );
            const timetable = generateTimetables(
                courses,
                context.state.lockedSections
            );
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
            //Unlock all sections of deleted course
            for (var lockedSection of context.state.lockedSections) {
                if (lockedSection.includes(payload.code)) {
                    context.commit("unlockSection", lockedSection);
                }
            }
            const courses = Object.keys(context.state.selectedCourses).map(
                (code) => context.state.selectedCourses[code]
            );
            const timetable = generateTimetables(
                courses,
                context.state.lockedSections
            );
            context.commit("setTimetable", timetable);
        },
        resetTimetable(context) {
            const courses = Object.keys(context.state.selectedCourses).map(
                (code) => context.state.selectedCourses[code]
            );
            const timetable = generateTimetables(
                courses,
                context.state.lockedSections
            );
            context.dispatch("validateTimetable", timetable);
        },
        switchSection(context, payload) {
            //Remove old section from locked sections
            context.commit(
                "unlockSection",
                `${payload.old.courseCode}${payload.old.sectionCode}`
            );
            //Remove old section from timetable
            for (let d in context.state.timetable) {
                let day = context.state.timetable[d];
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
            for (var time of payload.new.times) {
                context.state.timetable[time.day].push({
                    code: payload.old.courseCode,
                    sectionCode: payload.new.sectionCode,
                    instructors: payload.new.instructors,
                    ...time,
                });
                context.state.timetable[time.day].sort((a, b) => {
                    return a.start - b.start;
                });
            }
        },
    },
    modules: {},
    getters: {
        getConflictPopup: (state) => {
            return state.conflictPopup;
        },
        selectedCourses: (state) => {
            return state.selectedCourses;
        },
        timetable: (state) => {
            return state.timetable;
        },
        getCourseColor: (state) => (code) => {
            return state.selectedCourses[code].color;
        },
        getLockedSections: (state) => {
            return state.lockedSections;
        },
        getSearchBarValue: (state) => {
            return state.searchBarValue;
        },
        getSemesterStatus: (state) => {
            return state.semesterStatus;
        },
    },
});
