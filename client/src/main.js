import './assets/main.css'

import { createApp } from 'vue'
import { applyPolyfills, defineCustomElements } from '@cscfi/csc-ui/loader';
import { vControl } from '@cscfi/csc-ui-vue';
import App from './App.vue'

const app = createApp(App);
app.directive('control', vControl);

applyPolyfills().then(() => {
  defineCustomElements();
});

createApp(App).mount('#app')
