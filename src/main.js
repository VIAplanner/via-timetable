import './index.css';

import { createApp } from 'vue';

import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import 'primeflex/primeflex.css';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import vueHtml2canvas from 'vue-html2canvas';
import VueMobileDetection from "vue-mobile-detection";

import 'regenerator-runtime/runtime';

import App from './App.vue'
import router from './router';

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'var(--primary-50)',
      100: 'var(--primary-100)',
      200: 'var(--primary-200)',
      300: 'var(--primary-300)',
      400: 'var(--primary-400)',
      500: 'var(--primary-500)',
      600: 'var(--primary-600)',
      700: 'var(--primary-700)',
      800: 'var(--primary-800)',
      900: 'var(--primary-900)',
      950: 'var(--primary-950)'
    },
    colorScheme: {
      light: {
        primary: {
          color: 'var(--color-primary)',
          inverseColor: 'var(--color-primary-inverse)',
          hoverColor: 'var(--color-primary-hover)',
          activeColor: 'var(--color-primary-active)'
        },
        highlight: {
          background: 'var(--color-highlight-background)',
          focusBackground: 'var(--color-highlight-focus-background)',
          color: 'var(--color-highlight)',
          focusColor: 'var(--color-highlight-focus)'
        }
      },
      dark: {
        primary: {
          color: 'var(--color-primary-dark)',
          inverseColor: 'var(--color-primary-inverse-dark)',
          hoverColor: 'var(--color-primary-hover-dark)',
          activeColor: 'var(--color-primary-active-dark)'
        },
        highlight: {
          background: 'var(--color-highlight-background-dark)',
          focusBackground: 'var(--color-highlight-focus-background-dark)',
          color: 'var(--color-highlight-dark)',
          focusColor: 'var(--color-highlight-focus-dark)'
        }
      }
    }
  }
});

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(PrimeVue, {
  unstyled: false,
  ptOptions: {
    mergeSections: true,
    mergeProps: true
  },
  theme: {
    preset: Noir,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark'
    }
  },
  ripple: true,
  inputVariant: 'filled'
});

app.use(ToastService);
app.use(pinia);
app.use(vueHtml2canvas);
app.use(router);

app.mount('#app');