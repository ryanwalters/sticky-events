# Sticky Events

> Events for `position: sticky`, without the need for an `onscroll` listener.

### Events

The `StickyEvents` class has constants we can use to listen for events:

- `StickyEvents.CHANGE`  Fired when an element becomes stuck or unstuck
- `StickyEvents.STUCK`   Fired only when an element becomes stuck
- `StickyEvents.UNSTUCK` Fired only when an element becomes unstuck

*See the Javascript section of [Usage](#user-content-usage) for examples.*


### Browser support

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" /></br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| No IE / Edge 16+ | 55+ | 56+ | [Polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) | 43+ |



### Installation

`npm install sticky-events`


### Usage

[View demo](https://ryanwalters.github.io/sticky-events/)

*HTML*
```html
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
```

*Javascript*
```javascript
import StickyEvents, { observeStickyEvents, unobserveStickyEvents, StickyEvent } from "./sticky-events.js";

// --- This is the new, recommended way of enabling/disabling sticky events --- //

// Create new StickyEvents instance, this enables sticky events automatically

const stickyEvents = new StickyEvents({
  container: document.querySelector('.my-sticky-container'),
  enabled: false,
  stickySelector: '.custom-sticky-selector'
});


// Enable events

stickyEvents.enableEvents();


// Add event listeners

const { stickyElements } = stickyEvents;

stickyElements.forEach(sticky => {
  sticky.addEventListener(StickyEvents.CHANGE, (event) => {
    sticky.classList.toggle('bg-dark', event.detail.isSticky);
  });
});


// Disable events

stickyEvents.disableEvents();


// --- This is the older, deprecated method --- //
// NOTE: observeStickyEvents, unobserveStickyEvents, and StickyEvent are DEPRECATED, they will be removed in v3.0

// Add listeners to all `.sticky-events` elements on the page

observeStickyEvents();


// Events are dispatched on elements with the `.sticky-events` class

const stickies = Array.from(document.querySelectorAll('.sticky-events'));

stickies.forEach((sticky) => {
  sticky.addEventListener(StickyEvent.CHANGE, (event) => {
    sticky.classList.toggle('bg-dark', event.detail.isSticky);
  });

  sticky.addEventListener(StickyEvent.STUCK, (event) => {
    console.log('stuck');
  });

  sticky.addEventListener(StickyEvent.UNSTUCK, (event) => {
    console.log('unstuck');
  });
});


// After you're all done with your stickies, you can clean them up

unobserveStickyEvents();
```
