// /* eslint-disable import/no-extraneous-dependencies */
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

// import MyButton from '../components/MyButton.vue'
import Timetable from '../../src/components/Timetable.vue'

// export default {
//   component: MyButton,
//   title: 'Button'
// }

export default {
  component: Timetable,
  title: 'Timetable'
}

export const defaultView = () => ({
  components: { Timetable },
  template: '<timetable />>',
})


