import { h, render } from './vendor/preact-10.27.2.module.js';
import { Component, defaultProps } from './component.js';

render(h(Component, defaultProps), document.getElementById('root'));
