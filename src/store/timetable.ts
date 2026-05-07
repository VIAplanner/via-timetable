import { defineStore } from 'pinia';
import axios from 'axios';
// @ts-ignore
import genColor from 'color-generator';
import { getViaBuilderManager } from '../builder/builder';
import {
    FETCH_CACHE_EXPIRY,
    MAX_HISTORY,
    blockedTimesCourseCodePlaceholder,
    DARK_LIGHTNESS,
    DARK_SATURATION,
    DAYS,
    LIGHT_LIGHTNESS,
    LIGHT_SATURATION,
    SEMESTER_CODES,
    ActivityType,
    BlockedTimeData,
    DivisionData,
    SemesterCode,
    SemesterEventsData,
    SelectedCourseData,
    SessionData,
    Weekday,
    FIRST_SEM,
    SECOND_SEM,
    BOTH_SEM
} from './timetable.shared';

const createTimetableState = () => ({
    /** Debug to clear site storage for users in the event of a formatting change etc. */
    clearStorage: '3' as string,

    /** Whether the user is using dark mode or not */
    darkMode: false as boolean,

    /** The divisions that are available to filter by when searching courses */
    divisions: null as { data: Array<DivisionData>, expiry: number } | null,

    /** The sessions that are available to filter by when searching courses */
    sessions: null as { data: Array<SessionData>, expiry: number } | null,

    /** The values of the divisions selected */
    selectedDivisions: [] as Array<string>,

    /** The group of the selected session group */
    selectedSessionGroup: null as string | null,

    /** The values of the selected subsessions */
    selectedSubsessions: [] as Array<string>,

    /**
     * The currently selected session/semester, either FIRST_SEM or SECOND_SEM corresponsing to first and second
     * respectively
     */
    selectedSession: FIRST_SEM as SemesterCode,

    // Divisional Data (Legends etc.) TODO
    divisionalLegends: null as any,
    divisionalEnrolmentIndicators: null as any,

    /** The preferred minimum start hour */
    prefferedStart: 9 as number,

    /** The preferred maximum end hour */
    prefferedMaxEnd: 15 as number,

    /** The maximum hours any day should be */
    maxDayLength: 6 as number,

    /** The minimum hours any day should be */
    minDayLength: 2 as number,

    /** The maximum number of hours that should be empty between any two classes */
    maxGap: 2 as number,

    /** The maximum number of hours that should have some activity without a break */
    maxHours: 3 as number,

    /** The preference for online classes, either 'Avoid', 'Neutral', or 'Prefer' */
    onlinePreference: 'Neutral' as string,

    /** Whether to include activities that are marked as full or otherwise unavailable in timetable generation */
    includeUnavailable: true as boolean,

    /** Whether to avoid hours that typically see increased commute traffic */
    avoidRushHour: false as boolean,

    /** Whether a timetable is currently being generated, since the algorithm does not take negligible time */
    currentlyBuildingTimetable: false as boolean,

    // Detail Cards TODO
    cards: [] as Array<{ course: string, visible: boolean, props: any }>,

    /**
     * The timeslots that are currently blocked in each semester in the current session group, including blocked by hour
     * and blocked by day
     */
    blockedTimes: {
        [FIRST_SEM]: [] as Array<BlockedTimeData>,
        [SECOND_SEM]: [] as Array<BlockedTimeData>
    },

    /** Blocked times placeholder course formatted for use with the timetable generator */
    blockedTimesPlaceholderCourse: {
        "code": blockedTimesCourseCodePlaceholder as string,
        "campus": "" as string,
        "type": "" as string,
        "sections": [{
            "name": "" as string,
            "meetingTimes": [] as Array<Record<string, any>>
        }]
    },

    /** The courses selected for each semester, keyed by course code (ex. 'CSC108H5') */
    selectedCourses: {
        [FIRST_SEM]: {} as Record<string, SelectedCourseData>,
        [SECOND_SEM]: {} as Record<string, SelectedCourseData>
    },

    /** All the events for each day of each semester */
    timetables: {
        [FIRST_SEM]: {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        } as SemesterEventsData,
        [SECOND_SEM]: {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        } as SemesterEventsData
    },

    /** The locked activity codes for each course, keyed by course code (ex. 'CSC108H5') */
    lockedSections: {
        [FIRST_SEM]: {} as Record<string, Array<string>>,
        [SECOND_SEM]: {} as Record<string, Array<string>>
    },

    /** Whether the export overlay is currently opened */
    exportOverlay: false as boolean,

    /** Whether the about overlay is currently opened */
    aboutOverlay: false as boolean,

    /** Whether the no timetable found popup is currently opened */
    noTimetablePopup: false as boolean,

    /** Whether the changing session groups popup is currently opened */
    sessionChangeWarning: false as boolean,

    /** Whether the tutorial overlay is currently opened */
    tutorialPopup: true as boolean,

    /** All the cached search bar suggestions that will be shown when the search bar is opened */
    searchBarSuggestions: [] as Array<string>,

    /** All the past store states (size bounded above by MAX_HISTORY) */
    history: [] as Array<Object>,

    /** The current index into the history snapshot array that is being used */
    historyIndex: 0 as number
});

type TimetableState = ReturnType<typeof createTimetableState>;
type TimetableStore = TimetableState & Record<string, any>;

const timetableActions: ThisType<TimetableStore> & Record<string, (...args: any[]) => any> = {
    /**
     * @brief Cycles between light mode and dark mode
     */
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        this.regenerateColors();
        if (this.darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    },

    /**
     * @brief Locks an hour for all days
     * @param hour The hour
     * @param lock The lock status to apply
     */
    async setLockedHourStatus(hour: number, lock: boolean) {
        const start = hour * 3600; // Convert to seconds
        const end = start + 3600; // Blocker lasts 1 hour

        for (let day = 0; day < DAYS.length; day++) {
            this.setBlockedTime(this.selectedSession, DAYS[day], start, end, lock);
        }

        // Regenerate the timetable
        const manager = await getViaBuilderManager();
        manager.removeCourse(blockedTimesCourseCodePlaceholder, "");
        manager.addCourse(this.blockedTimesPlaceholderCourse);
        this.generateTimetable();
    },

    /**
     * @brief Locks all hours of a day
     * @param day The day to lock
     * @param lock The lock status to apply
     */
    async setLockedDayStatus(day: Weekday, lock: boolean) {
        for (let hour = 8; hour <= 22; hour++) {
            const start = hour * 3600; // Convert to seconds
            const end = start + 3600; // Blocker lasts 1 hour
            this.setBlockedTime(this.selectedSession, day, start, end, lock);
        }

        // Regenerate the timetable
        const manager = await getViaBuilderManager();
        manager.removeCourse(blockedTimesCourseCodePlaceholder, "");
        manager.addCourse(this.blockedTimesPlaceholderCourse);
        this.generateTimetable();
    },

    /**
     * @brief Locks a time range
     * @param semester The semester the blocker is in
     * @param day The day the blocker is in
     * @param start The start time in seconds after midnight
     * @param end The end time in seconds after midnight
     * @param lock The lock status to apply
     */
    async setLockedTimeStatus(semester: SemesterCode, day: Weekday, start: number, end: number, lock: boolean) {
        this.setBlockedTime(semester, day, start, end, lock);
        const manager = await getViaBuilderManager();
        manager.removeCourse(blockedTimesCourseCodePlaceholder, "");
        manager.addCourse(this.blockedTimesPlaceholderCourse);
    },

    /**
     * @brief Modifies the blocked times placeholder course to add a new blocker, or remove an existing blocker
     * @param semester The semester the blocker is in
     * @param day The day the blocker is in
     * @param start The start time in seconds after midnight
     * @param end The end time in seconds after midnight
     * @param block The lock status to apply
     */
    setBlockedTime(semester: SemesterCode, day: Weekday, start: number, end: number, block: boolean) {
        if (block) {
            // Add a new blocker to blockedTimes if none already exist for persisting
            if (!this.blockedTimes[semester].some((blocker) => (
                blocker.day === day &&
                blocker.start === start &&
                blocker.end === end
            ))) {
                this.blockedTimes[semester].push({
                    day,
                    start,
                    end
                });
            }
            // Now sync that blocker to the placeholder course
            const placeholderSection = this.blockedTimesPlaceholderCourse.sections?.[0];
            if (placeholderSection && !placeholderSection.meetingTimes?.some(blocker => (
                blocker.day === DAYS.indexOf(day) &&
                blocker.start === start &&
                blocker.end === end
            ))) {
                placeholderSection.meetingTimes.push({
                    start,
                    end,
                    day: DAYS.indexOf(day),
                    "online": false,
                    "zz": true,
                    "semester": this.getSemesterIndex(semester)
                });
            }
        } else {
            // Remove the all matching blockers from blockedTimes
            this.blockedTimes[semester] = this.blockedTimes[semester].filter(blocker => !(
                blocker.day === day && blocker.start === start && blocker.end === end
            ));
            // Now remove all matching blockers from the placeholder course
            const placeholderSection = this.blockedTimesPlaceholderCourse.sections?.[0];
            if (placeholderSection)
                placeholderSection.meetingTimes =
                    placeholderSection.meetingTimes.filter(blocker => !(
                        blocker.day === DAYS.indexOf(day) && blocker.start === start && blocker.end === end
                    ));
        }
    },

    /**
     * @brief Fills the blocked times placeholder course with data from the blockedTimes object, augmenting with
     * additional data required to be a well-formatted course. Basically only useful on site load
     */
    syncBlockedTimesPlaceholderCourse() {
        const meetingTimes = [];

        for (const [semester, blockers] of Object.entries(this.blockedTimes)) {
            const semesterIndex = this.getSemesterIndex(semester);

            for (const blocker of blockers) {
                const dayIndex = DAYS.indexOf(blocker.day);
                if (dayIndex < 0) continue;

                meetingTimes.push({
                    start: blocker.start,
                    end: blocker.end,
                    day: dayIndex,
                    online: false,
                    zz: false,
                    semester: semesterIndex
                });
            }
        }

        this.blockedTimesPlaceholderCourse = {
            ...this.blockedTimesPlaceholderCourse,
            sections: [{
                ...this.blockedTimesPlaceholderCourse.sections[0]!,
                meetingTimes
            }]
        };
    },

    /**
     * @brief Loads the blocked times placeholder course into the timetable generator to be used on next generation.
     * Deletes any previously loaded instances of the placeholder course in the timetable generator
     */
    async loadBlockedTimesToBuilder() {
        this.syncBlockedTimesPlaceholderCourse();

        const manager = await getViaBuilderManager();
        manager.removeCourse(blockedTimesCourseCodePlaceholder, "");
        manager.addCourse(this.blockedTimesPlaceholderCourse);
    },

    /**
     * Locks a specific activity section for a course
     * @param course The course code
     * @param activity The activity code
     * @param lock The lock status to apply
     */
    async setLockedSectionStatus(course: string, activity: string, lock: boolean) {
        const sessionData = this.lockedSections[this.selectedSession];
        const lockedActivities = Array.isArray(sessionData[course]) ? sessionData[course] : [];
        const activityType = activity.slice(0, 3).toUpperCase();

        if (lock) {
            // Remove any existing locks for the same activity type
            const nextLockedActivities = [
                ...lockedActivities.filter(
                    (lockedActivity) => lockedActivity.slice(0, 3).toUpperCase() !== activityType
                ),
                activity
            ];

            // Update the locked status for the course
            if (JSON.stringify(nextLockedActivities) !== JSON.stringify(lockedActivities)) {
                this.lockedSections[this.selectedSession] = {
                    ...sessionData,
                    [course]: nextLockedActivities
                };
            }
        } else {
            // Remove the locked activity
            const updatedActivities = lockedActivities.filter((lockedActivity) => lockedActivity !== activity);
            const nextLockedSections = {...sessionData};

            // Delete the locked sections entry if empty otherwise update the entry
            if (updatedActivities.length === 0) delete nextLockedSections[course];
            else nextLockedSections[course] = updatedActivities;

            this.lockedSections[this.selectedSession] = {
                ...nextLockedSections
            };
        }

        const courseData = this.selectedCourses[this.selectedSession][course];
        if (!courseData) return;
        const manager = await getViaBuilderManager();
        manager.removeCourse(course, activityType);
        await this.addCourseToBuilder(courseData.courseData);
    },

    /**
     * @brief Adds a new course to the internal state and optionally rebuilds the timetable
     * @param course The course code
     * @param lec The lecture code, null if none
     * @param tut The tutorial code, null if none
     * @param pra The practical code, null if none
     * @param courseData The course data. Check SelectedCourseData inferface for more info
     * @param shouldGenerate Whether to regenerate the timetable after adding the course
     */
    async addCourse(
        course: string,
        lec: string | null,
        tut: string | null,
        pra: string | null,
        courseData: any,
        shouldGenerate = true
    ) {
        // Add the course to F or S (or both)
        const color = genColor(
            this.darkMode ? DARK_SATURATION : LIGHT_SATURATION,
            this.darkMode ? DARK_LIGHTNESS : LIGHT_LIGHTNESS
        ).hexString();

        for (const sessionCode of courseData.sessions) {
            for (const session of this.resolveSubsessionSemesters(sessionCode) as Array<SemesterCode>) {
                this.selectedCourses[session][course] = {
                    lec,
                    tut,
                    pra,
                    color,
                    courseData
                };
            }
        }

        await this.addCourseToBuilder(courseData);
        if (shouldGenerate) this.generateTimetable();
    },

    /**
     * @brief Parse a raw course data JSON into a formatted course entry and add it to the builder
     * @param courseData The course data
     */
    async addCourseToBuilder(courseData: any) {
        const manager = await getViaBuilderManager();

        // Check if any activity type is locked, if so then we know to filter out any other activity of the same type
        const lockedSectionsByType: Record<ActivityType, string | null> = {
            LEC: null,
            TUT: null,
            PRA: null
        };

        for (const session of SEMESTER_CODES) {
            const sessionLockedSections = this.lockedSections[session][courseData.code] || [];

            for (const lockedSection of sessionLockedSections) {
                const type = lockedSection.slice(0, 3).toUpperCase() as ActivityType;
                if (!lockedSectionsByType[type]) lockedSectionsByType[type] = lockedSection;
            }
        }

        const lecturesJSON: Record<string, any> = {};
        const tutorialsJSON: Record<string, any> = {};
        const practicalsJSON: Record<string, any> = {};

        // Initialize common metadata
        for (const courseJSON of [lecturesJSON, tutorialsJSON, practicalsJSON]) {
            courseJSON["code"] = courseData["code"];
            courseJSON["campus"] = courseData["campus"];
            courseJSON["sections"] = [];
        }

        // Find out what session codes map to what semester code
        const sessionsToSemester: Record<string, number> = {};
        const match = this.selectedSessionGroup?.match(/-(\d+)-(\d+)/);
        if (match) {
            sessionsToSemester[match[1] as string] = 0;
            sessionsToSemester[match[2] as string] = 1;
        } else {
            courseData.sessions.forEach((sessionCode: string, index: number) => {
                sessionsToSemester[sessionCode] = index;
            });
        }

        // Parse each section
        for (const sectionData of courseData["sections"]) {
            const sectionJSON: Record<string, any> = {};

            sectionJSON["name"] = sectionData["name"];
            sectionJSON["meetingTimes"] = [] as Array<Record<string, any>>;

            // Parse the meeting times for the section
            let hasMeetingTime = false;
            const meetingTimes = Array.isArray(sectionData["meetingTimes"]) ?
                sectionData["meetingTimes"] :
                Object.values(sectionData["meetingTimes"] || {});
            for (const meetingTimeData of meetingTimes) {
                const buildingCode = meetingTimeData["building"]["buildingCode"];
                const fallbackSemesters = this.resolveSubsessionSemesters(meetingTimeData["sessionCode"])
                    .map((semester: SemesterCode) => this.getSemesterIndex(semester));
                const mappedSemester = sessionsToSemester[meetingTimeData["sessionCode"]];
                const semesterIndexes = typeof mappedSemester === 'number' ? [mappedSemester] : fallbackSemesters;

                for (const semesterIndex of semesterIndexes) {
                    const meetingTimeJSON: Record<string, any> = {};
                    meetingTimeJSON["start"] = meetingTimeData["start"];
                    meetingTimeJSON["end"] = meetingTimeData["end"];
                    meetingTimeJSON["day"] = meetingTimeData["day"] - 1;
                    meetingTimeJSON["online"] = (buildingCode === "");
                    meetingTimeJSON["zz"] = (buildingCode === "ZZ");
                    meetingTimeJSON["semester"] = semesterIndex;
                    sectionJSON["meetingTimes"].push(meetingTimeJSON);
                    hasMeetingTime = true;
                }
            }

            if (!hasMeetingTime) continue;

            // Sort the section by activity type
            const sectionName = String(sectionData["name"] || '').toUpperCase();
            if (sectionName.startsWith('LEC')) {
                if (lockedSectionsByType.LEC && sectionName !== String(lockedSectionsByType.LEC).toUpperCase())
                    continue;
                lecturesJSON["sections"].push(sectionJSON);
            } else if (sectionName.startsWith('TUT')) {
                if (lockedSectionsByType.TUT && sectionName !== String(lockedSectionsByType.TUT).toUpperCase())
                    continue;
                tutorialsJSON["sections"].push(sectionJSON);
            } else if (sectionName.startsWith('PRA')) {
                if (lockedSectionsByType.PRA && sectionName !== String(lockedSectionsByType.PRA).toUpperCase())
                    continue;
                practicalsJSON["sections"].push(sectionJSON);
            }
        }

        // Update subcourses for each activity type
        manager.removeCourse(lecturesJSON["code"], "LEC");
        if (lecturesJSON["sections"].length > 0) {
            lecturesJSON["type"] = "LEC";

            manager.addCourse(lecturesJSON);
        }

        manager.removeCourse(tutorialsJSON["code"], "TUT");
        if (tutorialsJSON["sections"].length > 0) {
            tutorialsJSON["type"] = "TUT";
            manager.addCourse(tutorialsJSON);
        }

        manager.removeCourse(practicalsJSON["code"], "PRA");
        if (practicalsJSON["sections"].length > 0) {
            practicalsJSON["type"] = "PRA";
            manager.addCourse(practicalsJSON);
        }
    },

    /**
     * @brief Remove a course from all internal states, including any required cleanup
     * @param course The course code
     */
    async removeCourse(course) {
        for (const session of SEMESTER_CODES) {
            // Remove course from selectedCourses
            delete this.selectedCourses[session][course];

            // Remove course from lockedSections
            delete this.lockedSections[session][course];

            // Remove course from timetable
            for (const day of DAYS) {
                this.timetables[session][day] = this.timetables[session][day]
                    .filter(event => {
                        return event.course !== course;
                    });
            }
        }

        const manager = await getViaBuilderManager();

        for (const type of ["LEC", "TUT", "PRA"]) manager.removeCourse(course, type);

        this.removeUnusedCards();
        this.generateTimetable();
    },

    /**
     * @brief Calls the builder API to generate a new timetable using courses that have already been added to it,
     * and either applies it or warns the user that a timetable was not found
     */
    async generateTimetable() {
        if (this.currentlyBuildingTimetable) return;
        this.currentlyBuildingTimetable = true;
        const manager = await getViaBuilderManager();
        const timetable = manager.build();
        this.applyBuiltTimetable(timetable);
        this.currentlyBuildingTimetable = false;
    },

    /**
     * @brief Parses the timetable returned by the builder and applies it to the internal state
     * @param timetable The timetable encoded as JSON returned by the builder (ex. used in generateTimetable())
     */
    applyBuiltTimetable(timetable) {
        // Failiures to place are indicated by an empty string in the section
        const hasBuildFailure = timetable.some((entry: any) => {
            return entry["code"] !== blockedTimesCourseCodePlaceholder && entry["section"] === '';
        });

        if (hasBuildFailure) {
            this.noTimetablePopup = true;
            return;
        }

        this.noTimetablePopup = false;

        const normalizedTimetable = this.normalizeBuiltTimetable(timetable);

        // Assign all the activities to the selected courses
        for (const session of Object.keys(normalizedTimetable) as Array<SemesterCode>) {
            for (const course of normalizedTimetable[session]) {
                if (course["code"] === blockedTimesCourseCodePlaceholder) continue;
                const courseData = this.selectedCourses[session][course["code"]];
                if (!courseData) continue;
                switch (course["type"]) {
                case "LEC":
                    courseData["lec"] = course["section"];
                    break;
                case "TUT":
                    courseData["tut"] = course["section"];
                    break;
                case "PRA":
                    courseData["pra"] = course["section"];
                    break;
                default:
                    continue;
                }

                this.timetableModifyActivity(courseData["courseData"], course["section"]);
            }
        }
    },

    normalizeBuiltTimetable(timetable) {
        const normalized: Record<SemesterCode, Array<any>> = { F: [], S: [] };

        for (const entry of timetable) {
            if (!entry || entry["code"] === blockedTimesCourseCodePlaceholder) {
                continue;
            }

            // Find all sessions containing the course code
            const candidateSessions = SEMESTER_CODES;
            const matchingCandidateSessions = candidateSessions.filter((session): session is SemesterCode => {
                return !!this.selectedCourses[session][entry["code"]];
            });

            // Easy case, just add it to the one session
            if (matchingCandidateSessions.length === 1) {
                normalized[matchingCandidateSessions[0]!].push(entry);
                continue;
            }

            // If there is more than one possible session, check meeting data
            if (matchingCandidateSessions.length > 1) {
                // Keep sessions that contain that course and also have meeting times in that session
                const matchedSessions = matchingCandidateSessions.filter((session) => {
                    // Find the course and section in each session
                    const selectedCourse = this.selectedCourses[session][entry["code"]];
                    const sectionData = selectedCourse?.courseData?.sections?.find(
                        (section: any) => section.name === entry["section"]
                    );
                    if (!sectionData) return false;

                    // Keep only if there is at least one meeting time matching sessions
                    const meetingTimes = Array.isArray(sectionData.meetingTimes)
                        ? sectionData.meetingTimes
                        : Object.values(sectionData.meetingTimes || {});

                    return meetingTimes.some(
                        (meetingTime: any) => this.resolveSubsessionSemesters(meetingTime.sessionCode).includes(session)
                    );
                });

                // Add to all kept sessions
                for (const session of (matchedSessions.length > 0 ? matchedSessions : matchingCandidateSessions)) {
                    normalized[session].push(entry);
                }
            }
        }

        return normalized;
    },

    /**
     * @brief Regenerates the assigned colors for all courses, useful if dark mode has been toggled/untoggled
     */
    regenerateColors() {
        for (const semester of SEMESTER_CODES) {
            Object.values(this.selectedCourses[semester]).forEach(course => {
                course.color = genColor(
                    this.darkMode ? DARK_SATURATION : LIGHT_SATURATION,
                    this.darkMode ? DARK_LIGHTNESS : LIGHT_LIGHTNESS
                );
            });
        }
    },

    /**
     * @brief Saves important state data into history and clears old states, ensuring states are ordered chronologically
     */
    saveStateHistory() {
        // Delete all future entries if making changes while not on present snapshot, this prevents branching
        if (this.historyIndex < this.history.length - 1)
            this.history = this.history.slice(0, this.historyIndex + 1);

        const newHistory = {
            blockedTimes: JSON.parse(JSON.stringify(this.blockedTimes)),
            selectedCourses: JSON.parse(JSON.stringify(this.selectedCourses)),
            timetables: JSON.parse(JSON.stringify(this.timetables)),
            lockedSections: JSON.parse(JSON.stringify(this.lockedSections))
        };

        this.history.push(newHistory);
        this.historyIndex++;

        // Delete old snapshots
        if (this.history.length > MAX_HISTORY) {
            this.history.shift();
            this.historyIndex--;
        }
    },

    /**
     * @brief Initializes the history with the current state
     */
    initializeHistory() {
        this.history = [{
            blockedTimes: JSON.parse(JSON.stringify(this.blockedTimes)),
            selectedCourses: JSON.parse(JSON.stringify(this.selectedCourses)),
            timetables: JSON.parse(JSON.stringify(this.timetables)),
            lockedSections: JSON.parse(JSON.stringify(this.lockedSections))
        }];
        this.historyIndex = 0;
    },

    /**
     * @brief Goes to older states and loads them
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(this.history[this.historyIndex]);
        }
    },

    /**
     * @brief Goes to newer states and loads them
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(this.history[this.historyIndex]);
        }
    },

    /**
     * @brief Sets a state snapshot to be the actual state being used by the site
     * @param newState The snapshot to apply
     */
    loadState(newState) {
        this.blockedTimes = newState.blockedTimes;
        this.selectedCourses = newState.selectedCourses;
        this.timetables = newState.timetables;
        this.lockedSections = newState.lockedSections;
    },

    /**
     * @brief Caches a course detail card, does nothing if its already been registered
     * @param course The course code
     * @param sectionCode The section code
     * @param props Any applicable data for the card, such as course data or divisional data
     */
    registerDetailCard(course, sectionCode, props) {
        if (!this.cards.find(card => card.course === `${course} ${sectionCode}`))
            this.cards.push({ course: `${course} ${sectionCode}`, visible: false, props });
    },

    /**
     * @brief Removes all course detail cards tied to a course
     * @param course The course code
     */
    removeDetailsCard(course) {
        this.cards = this.cards.filter(card => card.course !== course);
    },

    /**
     * @brief Scans all registered detail cards and deletes them if they are not in use
     */
    removeUnusedCards() {
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            if (!card) continue;
            const cardCode = card.course.split(' ');

            // Delete if the card isnt being used by the search bar or any of the selected course menus
            if (!(this.searchBarSuggestions.includes(card.course) ||
                Object.keys(this.selectedCourses[FIRST_SEM]).some(
                    course => this.selectedCourses?.[FIRST_SEM]?.[course]?.courseData?.code === cardCode[0]
                ) ||
                Object.keys(this.selectedCourses[SECOND_SEM]).some(
                    course => this.selectedCourses[SECOND_SEM]?.[course]?.courseData?.sectionCode === cardCode[1]
                ))
            ) {
                this.cards.splice(i, 1); // Delete the card from the list
            }
        }
    },

    /**
     * @brief Toggles visibility for a detail card
     * @param course The course code
     * @param visible Whether the card should be visible
     */
    setDetailCardVisibility(course, visible) {
        const card = this.cards.find(card => card.course === course);
        if (card) card.visible = visible;
        else console.error(`No card for ${course} was found`);
    },

    /**
     * @brief Returns the global divisional legends, refetching as needed
     * @returns The divisional legends
     */
    async getDivisionalLegends(): Promise<any> {
        if (!this.divisionalLegends || this.divisionalLegends.expiry < Date.now()) {
            try {
                const newDivisionalLegends = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/divisionalLegends`);
                this.divisionalLegends = {
                    expiry: Date.now() + FETCH_CACHE_EXPIRY,
                    data: newDivisionalLegends
                };
            } catch (error: any) {
                console.error('Failed to retrieve divisional legends:', error.message);
                return null;
            }
        }

        return this.divisionalLegends.data;
    },

    /**
     * @brief Returns the global divisional enrolment indicators, refetching as needed
     * @returns The divisional enrolment indicators
     */
    async getDivisionalEnrolmentIndicators(): Promise<any> {
        if (!this.divisionalEnrolmentIndicators || this.divisionalEnrolmentIndicators.expiry < Date.now()) {
            try {
                const newDivisionalEnrolmentIndicators = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/divisionalEnrolmentIndicators`
                );
                this.divisionalEnrolmentIndicators = {
                    expiry: Date.now() + FETCH_CACHE_EXPIRY,
                    data: newDivisionalEnrolmentIndicators
                };
            } catch (error: any) {
                console.error('Failed to retrieve divisional enrolment indicators:', error.message);
                return null;
            }
        }

        return this.divisionalEnrolmentIndicators.data;
    },

    /**
     * @brief Returns the global divisions, refetching as needed
     * @returns The divisions
     */
    async getDivisions(): Promise<any> {
        if (!this.divisions || this.divisions.expiry < Date.now()) {
            try {
                const newDivisions = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/referenceData`);
                this.divisions = {
                    expiry: Date.now() + FETCH_CACHE_EXPIRY,
                    data: newDivisions.data.divisions,
                };
            } catch (error: any) {
                console.error('Failed to retrieve divisions:', error.message);
                return null;
            }
        }

        return this.divisions.data;
    },

    /**
     * @brief Returns all active session groups, refetching as needed
     * @returns All active session groups
     */
    async getSessions(): Promise<any> {
        if (!this.sessions || this.sessions.expiry < Date.now()) {
            try {
                const newSessions = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/referenceData`);
                this.sessions = {
                    expiry: Date.now() + FETCH_CACHE_EXPIRY,
                    data: newSessions.data.sessions
                };
            } catch (error: any) {
                console.error('Failed to retrieve sessions:', error.message);
                return null;
            }
        }

        return this.sessions.data;
    },

    /**
     * @brief Fills in all events for a particular course activity into the timetable. Also changes the current session
     * being viewed for a more intuitive visual confirmation that there is a new course added
     * @param courseData The course data. See SelectedCourseData inferface for more information
     * @param activityName The name of the activity
     */
    timetableRegisterActivity(courseData, activityName) {
        let selectedSessionFromActivity: SemesterCode | null = null;

        const activity = courseData.sections.find((section: any) => section.name === activityName);
        if (activity) {
            for (const meetingTime of activity.meetingTimes) {
                const day = DAYS[meetingTime.day - 1];
                if (!day) continue;

                const sessions = this.resolveSubsessionSemesters(meetingTime.sessionCode);
                if (!selectedSessionFromActivity && sessions.length > 0) selectedSessionFromActivity = sessions[0] as SemesterCode;

                for (const session of sessions as Array<SemesterCode>) {
                    // Add events that are not already present
                    if (!this.timetables[session][day].some((timeslot) => (
                        timeslot.course === courseData.code &&
                        timeslot.activity === activityName &&
                        timeslot.start === meetingTime.start &&
                        timeslot.end === meetingTime.end
                    ))) {
                        this.timetables[session][day].push({
                            course: courseData.code,
                            activity: activityName,
                            day: meetingTime.day,
                            start: meetingTime.start,
                            end: meetingTime.end
                        });
                    }
                }
            }

            if (selectedSessionFromActivity) this.selectedSession = selectedSessionFromActivity;
        }
    },

    /**
     * @brief Removes the old activity corresponding to the activity type (if it exists) and then adds the new activity
     * @param courseData The course data. See the SelectedCourseData interface for more information
     * @param newActivityName The activity code
     * @param lockAndGenerate Whether to lock the activity and regenerate the table (ex. manually selected the activity)
     */
    async timetableModifyActivity(courseData, newActivityName, lockAndGenerate = false) {
        const activityMatch = newActivityName.match(/^[^\d]+/);
        const activityType = activityMatch ? activityMatch[0] : null;

        if (!activityType) return;

        const courseExists = SEMESTER_CODES.some(
            (session) => Object.prototype.hasOwnProperty.call(this.selectedCourses[session], courseData.code)
        );
        if (!courseExists) await this.addCourse(courseData.code, null, null, null, courseData, false);

        for (const session of SEMESTER_CODES) {
            const selectedCourse = this.selectedCourses[session][courseData.code];
            if (!selectedCourse) continue;

            if (activityType === 'LEC') selectedCourse.lec = newActivityName;
            else if (activityType === 'TUT') selectedCourse.tut = newActivityName;
            else if (activityType === 'PRA') selectedCourse.pra = newActivityName;
        }

        // Remove current activity type from timetable
        for (const session of SEMESTER_CODES) {
            if (!this.selectedCourses[session][courseData.code]) continue;

            for (const day of DAYS) {
                this.timetables[session][day] = this.timetables[session][day].filter((event) => {
                    // Skip non-matching courses early
                    if (event.course !== courseData.code) return true;

                    // Check if the activity type matches
                    const eventMatch = event.activity.match(/^[^\d]+/);

                    // Exclude if the types match
                    if (eventMatch) return eventMatch[0] !== activityType

                    return true;
                });
            }
        }

        // Add new activity
        this.timetableRegisterActivity(courseData, newActivityName);

        if (lockAndGenerate) {
            await this.setLockedSectionStatus(courseData.code, newActivityName, true);
            await this.generateTimetable();
        }
    },

    /**
     * @brief Converts a subsession code into the semester code, ex '20259' to FIRST_SEM
     * @param subsessionCode The subsession code
     * @returns The semester code
     */
    subsessionCodeToSession(subsessionCode): SemesterCode | typeof BOTH_SEM | undefined {
        if (!this.sessions || !this.sessions.data) return undefined;

        for (const sessionGroup of this.sessions.data) {
            for (const subsession of sessionGroup.subsessions) {
                if (subsession.value === subsessionCode) {
                    const match = subsession.label.match(/\((.)\)/);
                    if (match) return match[1] as SemesterCode;
                }
            }
        }

        return undefined;
    },

    /**
     * @brief Converts a semester code into an integer index, where FIRST_SEM is 0 and SECOND_SEM is 1
     * @param semester The semester code
     * @returns The integer index
     */
    getSemesterIndex(semester): 0 | 1 {
        return semester === FIRST_SEM ? 0 : 1;
    },

    /**
     * @brief Resolves which semesters a subsession code belongs to; Y spans both F and S
     * @param subsessionCode The subsession code
     * @returns One or two semester codes
     */
    resolveSubsessionSemesters(subsessionCode: string): Array<SemesterCode> {
        const session = this.subsessionCodeToSession(subsessionCode);
        if (session === BOTH_SEM) return [FIRST_SEM, SECOND_SEM];
        if (session === FIRST_SEM || session === SECOND_SEM) return [session];
        return [];
    },

    /**
     * @brief Converts seconds after midnight into a 12 hour clock format
     * @param seconds The seconds after midnight
     * @returns The time in 12 hour clock format
     */
    parseTime(seconds): string {
        const totalMins = Math.floor(seconds / 60);
        const hours = Math.floor(totalMins / 60);
        const mins = String(totalMins % 60).padStart(2, '0');

        const extension = hours < 12 ? 'AM' : 'PM';

        return `${hours % 12 === 0 ? 12 : hours % 12}:${mins} ${extension}`;
    },

    /**
     * @brief Resets the timetable to a blank state, including selected courses and locked sections, but not blocked
     * times
     */
    resetTimetable() {
        this.selectedCourses = {
            [FIRST_SEM]: {},
            [SECOND_SEM]: {}
        };

        this.timetables = {
            [FIRST_SEM]: {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            },
            [SECOND_SEM]: {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            }
        };

        this.lockedSections = {
            [FIRST_SEM]: {},
            [SECOND_SEM]: {}
        };
    },

    /**
     * @brief Updates the preferences the builder should try to satisfy based on the stored preferences
     */
    async updatePreferences() {
        const manager = await getViaBuilderManager();
        // More info on formatting available at https://github.com/Kelexer1/via-builder
        manager.setPreferences({
            "MAX_GAP": this.maxGap,
            "MAX_DAY_LENGTH": this.maxDayLength,
            "MIN_DAY_LENGTH": this.minDayLength,
            "MAX_CONTINUOUS_CLASSES": this.maxHours,
            "PREFFERED_MIN_START": this.prefferedStart * 3600,
            "PREFFERED_MAX_END": this.prefferedMaxEnd * 3600,
            "GUARANTEE_CROSS_CAMPUS_GAP": true,
            "AVOID_RUSH_HOURS": this.avoidRushHour,
            "ONLINE_PREFERENCE": this.onlinePreference === "Avoid" ? 0 : this.onlinePreference === "Prefer" ? 1 : 2
        })
    }
};

export const useTimetableStore = defineStore('timetable', {
    state: createTimetableState,
    actions: timetableActions,
    persist: {
        key: 'timetable',
        storage: localStorage,
        serializer: {
            serialize: (state: any) => {
                const {
                    cards,
                    history,
                    historyIndex,
                    currentlyBuildingTimetable,
                    ...rest
                } = state;
                return JSON.stringify(rest);
            },
            deserialize: (value: any) => JSON.parse(value)
        }
    }
} as any);