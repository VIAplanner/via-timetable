module.exports = {
    title: 'UofT Course Tools',
    description: "We're unifying UofT's course data, and using it to build tools such as a course guide and timetable planner.",
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Course API', link: '/course-api/' },
            { text: 'Timetable Planner', link: '/timetable-planner/' },
            { text: 'Course Guide', link: '/course-guide/' }
        ]
    },
    dest: "./docs",
}