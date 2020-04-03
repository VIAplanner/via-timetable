
import CourseSearchBar from '../../src/components/CourseSearchBar.vue'
import { array } from '@storybook/addon-knobs';


export default {
  component: CourseSearchBar,
  title: 'Course Search Bar'
}

export const withComputerScienceCourses = () => ({
  components: { CourseSearchBar },
  data() {
    return { courses: ["CSC108H5F: Introduction to Computer Programming", "CSC108H5S: Introduction to Computer Programming", "CSC148H5S: Introduction to Computer Science", "CSC148H5Y: Introduction to Computer Science", "CSC207H5F: Software Design", "CSC209H5S: Software Tools and Systems Programming", "CSC236H5F: Introduction to the Theory of Computation", "CSC258H5S: Computer Organization", "CSC263H5S: Data Structures and Analysis", "CSC290H5F: Communication Skills for Computer Scientists", "CSC290H5S: Communication Skills for Computer Scientists", "CSC299Y5Y: Research Opportunity Program", "CSC299Y5Y: Research Opportunity Program", "CSC301H5S: Introduction to Software Engineering", "CSC309H5S: Programming on the Web", "CSC318H5F: The Design of Interactive Computational Media", "CSC318H5S: The Design of Interactive Computational Media", "CSC321H5S: Introduction to Neural Networks and Machine Learning", "CSC324H5F: Principles of Programming Languages", "CSC333H5F: Forensic Computing", "CSC338H5S: Numerical Methods", "CSC338H5Y: Numerical Methods", "CSC343H5F: Introduction to Databases", "CSC343H5S: Introduction to Databases", "CSC347H5F: Introduction to Information Security", "CSC358H5S: Principles of Computer Networks", "CSC363H5S: Computational Complexity and Computability", "CSC367H5F: Parallel Programming", "CSC369H5F: Operating Systems", "CSC373H5F: Algorithm Design and Analysis", "CSC375H5S: Programming Mechatronic Systems", "CSC376H5F: Fundamentals of Robot Design", "CSC384H5S: Introduction to Artificial Intelligence", "CSC398H5F: Topics in Computer Science", "CSC398H5S: Topics in Computer Science", "CSC398H5Y: Topics in Computer Science", "CSC399Y5Y: Research Opportunity Program", "CSC399Y5Y: Research Opportunity Program", "CSC409H5F: Scalable Computing", "CSC411H5F: Machine Learning and Data Mining", "CSC420H5F: Introduction to Image Understanding", "CSC420H5S: Introduction to Image Understanding", "CSC423H5S: Computer Forensics", "CSC427H5S: Computer Security", "CSC477H5F: Introduction to Mobile Robotics", "CSC490H5S: Capstone Design Course", "CSC492H5F: Computer Science Implementation Project", "CSC492H5S: Computer Science Implementation Project", "CSC492H5Y: Computer Science Implementation Project", "CSC493H5F: Computer Science Expository Work", "CSC493H5S: Computer Science Expository Work", "CSC493H5Y: Computer Science Expository Work", "CSC498H5F: Topics in Computer Science", "CSC498H5S: Topics in Computer Science", "CSC498H5Y: Topics in Computer Science", "CSC499Y5S: Research Opportunity Program", "CSC499Y5Y: Research Opportunity Program", "CSC499Y5Y: Research Opportunity Program"] }
  },
  template: '<course-search-bar :courses="courses"/>',
})

