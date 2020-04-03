
import OptimizationSettings from '../../src/components/OptimizationSettings.vue'


export default {
  component: OptimizationSettings,
  title: 'Optimization Settings'
}

export const withComputerScienceCourses = () => ({
  components: { OptimizationSettings },
  template: '<optimization-settings />',
})

