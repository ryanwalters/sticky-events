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

ES2015+:
```javascript
import { observeStickyEvents, StickyEvent } from 'sticky-events';
```

Minified ES5-compatible:
```javascript
import { observeStickyEvents, StickyEvent } from 'sticky-events/sticky-events.es5';
```


### Installation

`npm install sticky-events --save`

If you use Babel, you will need to include the `babel-plugin-transform-object-rest-spread` plugin. Your `.babelrc` should look something like:
```json
{
  "presets": ["env"],
  "plugins": ["transform-object-rest-spread"]
}
```


### Usage

*HTML*
```html
<div id="#sticky-container">
    <div>
        <h2 class="sticky-events">Sticky Heading 1</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
    <div>
        <h2 class="sticky-events">Sticky Heading 2</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
    <div>
        <h2 class="sticky-events">Sticky Heading 3</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
    <div>
        <h2 class="sticky-events">Sticky Heading 4</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
    <div>
        <h2 class="sticky-events">Sticky Heading 5</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
</div>
```

*CSS*
```css
/* Import or copy the styles into your code */

@import "~sticky-events/sticky-events.css";
```

*Javascript*
```javascript
import { observeStickyEvents, StickyEvent } from 'sticky-events';

// Passing no arguments makes the default container the current `document` and adds listeners to all `.sticky-events` elements on the page

observeStickyEvents();


// You can optionally pass an element, making that the container for your sticky items. This will only add listeners to `.sticky-events` elements inside of this container

const container = document.querySelector('#my-container');

observeStickyEvents(container);


// Events are dispatched on elements with the `.sticky-events` class
// Note: jQuery is not required, but used simply for readability

const $stickies = $('.sticky-events');

$stickies.on(StickyEvent.CHANGE, e => $(e.target).css('background-color', e.detail.isSticky ? 'blue' : ''));
$stickies.on(StickyEvent.STUCK, e => console.log(e.target, 'stuck'));
$stickies.on(StickyEvent.UNSTUCK, e => console.log(e.target, 'unstuck'));
```
