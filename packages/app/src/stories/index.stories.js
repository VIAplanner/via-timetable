// /* eslint-disable import/no-extraneous-dependencies */
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

// import MyButton from '../components/MyButton.vue'
import Timetable from '../components/Timetable.vue'

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

// export const withJSX = () => ({
//   render() {
//     return <MyButton onClick={linkTo('Button', 'With Some Emoji')}>With JSX</MyButton>;
//   }
// })

// export const withSomeEmoji = () => ({
//   components: { MyButton },
//   template: '<my-button>😀 😎 👍 💯</my-button>'
// })
