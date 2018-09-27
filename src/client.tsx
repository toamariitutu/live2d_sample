import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Container from './components/Container';

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window['mozRequestAnimationFrame'] ||
  window['webkitRequestAnimationFrame'] ||
  window.requestAnimationFrame;

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

const root = document.getElementById('reactRoot');
ReactDOM.render(<Container {...JSON.parse(root.dataset['props'])} />, root);
