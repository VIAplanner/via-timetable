
import CourseSearchBar from '../../src/components/CourseSearchBar.vue'

export default {
  component: CourseSearchBar,
  title: 'Course Search Bar'
}

export const defaultView = () => ({
  components: { CourseSearchBar },
  template: '<course-search-bar />',
})

