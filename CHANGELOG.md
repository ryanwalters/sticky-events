## 3.1.0

#### New Features

- Add `addSticky`, `addStickies` methods

## 3.0.0

#### Breaking changes

- The `StickyEvents` class is now the only method of enabling and disabling sticky elements
- Previously deprecated elements have been removed. See v2.3.0 `Deprecations` notes for list.


## v2.3.0

#### New Features

- The new `StickyEvents` class is now the preferred method of enabling and disabling sticky elements.
- Add `container` option. Defaults to `document`
- Add `enabled` option. Defaults to `true`
- Add `stickySelector` option. Defaults to `.sticky-events`
  
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
