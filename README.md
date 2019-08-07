# Sticky Events

> Events for `position: sticky`, without the need for an `onscroll` listener.


### Installation

`npm install sticky-events`


### Browser support

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" /></br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| No IE / Edge 16+ | 55+ | 56+ | 12.1+ | 43+ |

A Polyfill for IntersectionObserver is [available here](https://github.com/w3c/IntersectionObserver/tree/master/polyfill).

## Options

| Option Name      | Type                    | Default          | Description                                                                                       |
| ---------------- | ----------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `container`      | `Element` or `Document` | `document`       | The element that contains your sticky elements. Grabs all sticky elements on the page by default. |                      |
| `enabled`        | `boolean`               | `true`           | Enable sticky events immediately.                                                                 |
| `stickySelector` | `string`                | `.sticky-events` | The selector to use to find your sticky elements within `container`.                              |


## Events

The `StickyEvents` class has constants we can use to listen for events.

| Event Name             | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `StickyEvents.CHANGE`  | Fired when an element becomes stuck or unstuck |
| `StickyEvents.STUCK`   | Fired only when an element becomes stuck       |
| `StickyEvents.UNSTUCK` | Fired only when an element becomes unstuck     |


## Methods

| Method Name       | Arguments             | Description                                               |
| ----------------- | --------------------- | --------------------------------------------------------- |
| `addSticky`       | `Node` or `Element`   | Add a single sticky to the existing set of stickies       |
| `addStickies`     | `NodeList` or `array` | Add a list of stickies to the existing set of stickies    |
| `disableEvents`   | `boolean`             | Stop firing events on the set of stickies. By default, this will fire a `StickyEvents.UNSTUCK` event on the sticky elements, resetting them to their original state. Pass `false` to leave the stickies alone. |
| `enableEvents`    | *none*                | Start firing events on the set of stickies                |


## How to use

### [View demo](https://ryanwalters.github.io/sticky-events/)

Given the following HTML:
```html
<div class="my-sticky-container">
    <div>
        <h2 class="custom-sticky-selector">Sticky Heading 1</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
    <div>
        <h2 class="custom-sticky-selector">Sticky Heading 2</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
    <div>
        <h2 class="custom-sticky-selector">Sticky Heading 3</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div>
</div>
```

We could configure `StickyEvents` like this:
```javascript
import StickyEvents from 'sticky-events';


// Create new StickyEvents instance

const stickyEvents = new StickyEvents({
  container: document.querySelector('.my-sticky-container'),
  enabled: false,
  stickySelector: '.custom-sticky-selector'
});


// Enable events

stickyEvents.enableEvents();


// Add event listeners

const { stickyElements, stickySelector } = stickyEvents;

stickyElements.forEach(sticky => {
  sticky.addEventListener(StickyEvents.CHANGE, (event) => {
    sticky.classList.toggle('bg-dark', event.detail.isSticky);
  });
});


// Add stickies at some point after initialization

fetch('/api/gimme-divs')
  .then(response => response.text())
  .then(html => letsPretendToCreateADocument(html))
  .then((document) => {
    const stickies = document.querySelectorAll(stickySelector);

    stickies.forEach(sticky => {
      sticky.addEventListener(StickyEvents.CHANGE, (event) => {
        sticky.classList.toggle('bg-dark', event.detail.isSticky);
      });
    });  

    stickyEvents.addStickies(stickies);
  });

// Disable events

stickyEvents.disableEvents();
```
