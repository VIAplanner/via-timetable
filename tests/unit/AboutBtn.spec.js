/* eslint-disable no-undef */
import { shallowMount } from '@vue/test-utils';
import   AboutBtn from '../../src/components/FloatingBtns/AboutBtn.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(AboutBtn, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch("About")
  })
})
