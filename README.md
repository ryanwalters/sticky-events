# Sticky Events

Fire events on `.sticky` elements when an it becomes sticky or unsticky.

Events:
- `sticky-change`  Fired on both stuck and unstuck events
- `sticky-stuck`   Fired only when an element becomes stuck
- `sticky-unstuck` Fired only when an element becomes unstuck

Relies on `position: sticky` and `IntersectionObserver` support.



| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| No IE / Edge 16+ | 55+ | 56+ | [Polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) | 43+ |


### Usage

```
import observeStickyEvents from 'sticky-events';

// Passing no arguments makes the default container the current `document`

observeStickyEvents();


// You can optionally pass an element, making that the container for your sticky items

const container = document.querySelector('#my-container');
const stickySelector = '.sticky';

observeStickyChange(container, stickySelector);


// Events are dispatched on elements with the `.sticky` class
// Note: jQuery is not required, but used simply for readability

const $stickies = $(stickySelector);

$stickies.on('sticky-change', e => $(e.target).css('background-color', e.detail.isSticky ? 'blue' : ''));
$stickies.on('sticky-stuck', e => console.log(e.target, 'stuck'));
$stickies.on('sticky-unstuck', e => console.log(e.target, 'unstuck'));
```
