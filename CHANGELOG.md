# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.3.0](https://github.com/ryanwalters/sticky-events/compare/v3.1.2...v3.3.0) (2020-03-31)

### Features

- Pass sticky position back in event ([1e7e04f](https://github.com/ryanwalters/sticky-events/commit/1e7e04f6c5141a7f4f0ef8e2dd80b040a3b591d4))
- Normalize event data ([1e7e04f](https://github.com/ryanwalters/sticky-events/commit/1e7e04f6c5141a7f4f0ef8e2dd80b040a3b591d4))

The data passed back in `StickyEvents.CHANGE`, `StickyEvents.STUCK`, and `StickyEvents.UNSTUCK` is now consistent.

The `event.detail` now looks like:

```
{
  isSticky: Boolean,
  position: StickyEvents.POSITION_BOTTOM|StickyEvents.POSITION_TOP,
}
```

### [3.1.3](https://github.com/ryanwalters/sticky-events/compare/v3.1.2...v3.1.3) (2020-02-22)

Testing out semi-automated releases!

### Refactor

- Remove unnecessary `forEach` from sentinel observers

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
import StickyEvents from "sticky-events";

// Create new StickyEvents instance, this enables sticky events automatically

const stickyEvents = new StickyEvents({
  container: document.querySelector(".my-sticky-container"),
  enabled: false,
  stickySelector: ".custom-sticky-selector",
});

// Enable events

stickyEvents.enableEvents();

// Add event listeners

const { stickyElements } = stickyEvents;

stickyElements.forEach((sticky) => {
  sticky.addEventListener(StickyEvents.CHANGE, (event) => {
    sticky.classList.toggle("bg-dark", event.detail.isSticky);
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
