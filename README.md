# Sticky Events

Event listeners for `position: sticky`.

Events:
- `sticky-change`  Fired when an element becomes stuck or unstuck
- `sticky-stuck`   Fired only when an element becomes stuck
- `sticky-unstuck` Fired only when an element becomes unstuck

Relies on `position: sticky` and `IntersectionObserver` support. No other dependencies.



| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" /></br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| No IE / Edge 16+ | 55+ | 56+ | [Polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) | 43+ |


### Usage

*CSS*
```css
/* Import the styles. In CSS/JS, whatever floats your boat */

@import "~sticky-events/sticky-events.css";
```

*Javascript*
```javascript
import observeStickyEvents from 'sticky-events';

// Passing no arguments makes the default container the current `document` and adds listeners to all `.sticky-events` elements on the page

observeStickyEvents();


// You can optionally pass an element, making that the container for your sticky items. This will only add listeners to `.sticky-events` elements inside of this container

const container = document.querySelector('#my-container');

observeStickyChange(container);


// Events are dispatched on elements with the `.sticky-events` class
// Note: jQuery is not required, but used simply for readability

const $stickies = $('.sticky-events');

$stickies.on('sticky-change', e => $(e.target).css('background-color', e.detail.isSticky ? 'blue' : ''));
$stickies.on('sticky-stuck', e => console.log(e.target, 'stuck'));
$stickies.on('sticky-unstuck', e => console.log(e.target, 'unstuck'));
```
