## v2.3

#### New Features

- The new `StickyEvents` class is now the preferred method of enabling and disabling sticky elements.
- Added `container` option. Defaults to `document`
- Added `enabled` option. Defaults to `true`
- Added `stickySelector` option. Defaults to `.sticky-events`
  
Example:
```js
import StickyEvents from 'sticky-events';

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
```


#### Deprecations

- `sticky-events.css` is no longer required, this file will be removed in v3.0.
- `observeStickyEvents` function is now deprecated, it will be removed in v3.0.
- `unobserveStickyEvents` function is now deprecated, it will be removed in v3.0.
- `StickyEvent` export is now deprecated, it will be removed in v3.0.
