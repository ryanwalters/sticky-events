/**
 * Todo:
 * - Allow adding new stickies to a set of stickies
 * - Improve README (at least describe options)
 */

/**
 * @deprecated
 * @type {{CHANGE: string, STUCK: string, UNSTUCK: string}}
 */

export const StickyEvent = {
  CHANGE: 'sticky-change',
  STUCK: 'sticky-stuck',
  UNSTUCK: 'sticky-unstuck',
};

const ClassName = {
  SENTINEL: 'sticky-events--sentinel',
  SENTINEL_TOP: 'sticky-events--sentinel-top',
  SENTINEL_BOTTOM: 'sticky-events--sentinel-bottom',
};

const STICKY_SELECTOR = '.sticky-events';


// StickyEvents class

export default class StickyEvents {
  /**
   * Initialize a set of sticky elements with events
   *
   * @param {Element|Document} container
   * @param {boolean} enabled
   * @param {string} stickySelector
   */

  constructor({ container = document, enabled = true, stickySelector = STICKY_SELECTOR } = {}) {
    this.container = container;
    this.observers = [];
    this.stickyElements = document.querySelectorAll(stickySelector);
    this.stickySelector = stickySelector;

    if (enabled) {
      this.enableEvents();
    }
  }

  enableEvents() {
    observeStickyEvents(this.container, this.observers, this.stickySelector);
  }

  disableEvents(resetStickies = true) {
    unobserveStickyEvents(resetStickies, this.observers, this.stickySelector);
  }
}

// Events

StickyEvents.CHANGE = StickyEvent.CHANGE;
StickyEvents.STUCK = StickyEvent.STUCK;
StickyEvents.UNSTUCK = StickyEvent.UNSTUCK;


// Collection of all observers, used when needing to `unobserve` stickies

const globalObservers = [];


/**
 * Reset the DOM to it's pre-sticky state.
 * This function stops observing sticky sentinels before removing them from the DOM.
 *
 * @deprecated
 * @param {boolean} resetStickies     Optionally fire one last `sticky-unstick` event to reset the sticky to it's pre-sticky state
 * @param {array<object>} observers   A collection of the elements being observed, along with their containers and sentinels (see what `observeHeaders` and `observeFooters` returns)
 * @param {string} stickySelector     The CSS selector applied to the sticky DOM elements
 */

export function unobserveStickyEvents(resetStickies = true, observers = globalObservers, stickySelector = STICKY_SELECTOR) {
  observers.forEach(({ container, observer, sentinels }) => {
    if (resetStickies) {
      Array.from(container.querySelectorAll(stickySelector)).forEach(sticky => fire(false, sticky));
    }

    sentinels.forEach(sentinel => sentinel.remove());

    observer.disconnect();

    observer = null;
  });

  observers.length = 0;
}


/**
 * Initialize the intersection observers on `.sticky` elements within the specified container.
 * Container defaults to `document`.
 *
 * @deprecated
 * @param {Element|Document} container
 * @param {string} stickySelector       The CSS selector applied to the sticky DOM elements
 * @param {array<object>} observers     A collection of the elements being observed, along with their containers and sentinels (see what `observeHeaders` and `observeFooters` returns)
 */

export function observeStickyEvents(container = document, observers = globalObservers, stickySelector = STICKY_SELECTOR) {
  if (window.self !== window.top) {
    console.warn('StickyEvents: There are issues with using IntersectionObservers in an iframe, canceling initialization. Please see https://github.com/w3c/IntersectionObserver/issues/183');

    return;
  }

  observers.push(observeHeaders(container, stickySelector));
  observers.push(observeFooters(container, stickySelector));
}


/**
 * Sets up an intersection observer to notify `document` when elements with the `ClassName.SENTINEL_TOP` become
 * visible/hidden at the top of the sticky container.
 *
 * @param {Element|HTMLDocument} container
 * @param {string} stickySelector     The CSS selector applied to the sticky DOM elements
 * @returns {{container: *, observer: IntersectionObserver, sentinels: Array<Element>}}
 */

function observeHeaders(container, stickySelector = STICKY_SELECTOR) {
  const observer = new IntersectionObserver((records) => {
    records.forEach((record) => {
      const { boundingClientRect, rootBounds } = record;
      const stickyParent = record.target.parentElement;
      const stickyTarget = stickyParent.querySelector(stickySelector);

      stickyParent.style.position = 'relative';

      if (boundingClientRect.bottom > rootBounds.top && boundingClientRect.bottom < rootBounds.bottom) {
        fire(false, stickyTarget);
      }

      else if (boundingClientRect.bottom <= rootBounds.top) {
        fire(true, stickyTarget);
      }
    });
  }, Object.assign({
    threshold: [0],
  }, !(container instanceof HTMLDocument) && {
    root: container
  }));

  const sentinels = addSentinels(container, ClassName.SENTINEL_TOP, stickySelector);

  sentinels.forEach(sentinel => observer.observe(sentinel));

  return {
    container,
    observer,
    sentinels,
  };
}


/**
 * Sets up an intersection observer to notify `document` when elements with the `ClassName.SENTINEL_BOTTOM` become
 * visible/hidden at the bottom of the sticky container.
 *
 * @param {Element|HTMLDocument} container  The DOM element that contains your sticky elements
 * @param {string} stickySelector           The CSS selector applied to the sticky DOM elements
 * @returns {{container: *, observer: IntersectionObserver, sentinels: Array<Element>}}
 */

function observeFooters(container, stickySelector = STICKY_SELECTOR) {
  const observer = new IntersectionObserver((records) => {
    records.forEach((record) => {
      const { boundingClientRect, rootBounds } = record;
      const stickyTarget = record.target.parentElement.querySelector(stickySelector);

      if (boundingClientRect.top < rootBounds.top && boundingClientRect.bottom < rootBounds.bottom) {
        fire(false, stickyTarget);
      }

      else if (boundingClientRect.bottom > rootBounds.top && isSticking(stickyTarget)) {
        fire(true, stickyTarget);
      }
    });
  }, Object.assign({
    threshold: [1],
  }, !(container instanceof HTMLDocument) && {
    root: container
  }));

  // Add the bottom sentinels to each section and attach an observer.

  const sentinels = addSentinels(container, ClassName.SENTINEL_BOTTOM, stickySelector);

  sentinels.forEach(sentinel => observer.observe(sentinel));

  return {
    container,
    observer,
    sentinels,
  };
}


/**
 * Dispatch the following events:
 * - `sticky-change`
 * - `sticky-stuck` or `sticky-unstuck`
 *
 * @param {Boolean} isSticky
 * @param {Element} stickyTarget
 */

function fire(isSticky, stickyTarget) {
  stickyTarget.dispatchEvent(new CustomEvent(StickyEvent.CHANGE, { detail: { isSticky }, bubbles: true }));
  stickyTarget.dispatchEvent(new CustomEvent(isSticky ? StickyEvent.STUCK : StickyEvent.UNSTUCK, { bubbles: true }));
}


/**
 * Add sticky sentinels
 *
 * @param {Element|HTMLDocument} container
 * @param {String} className
 * @param {string} stickySelector     The CSS selector applied to the sticky DOM elements
 * @returns {Array<Element>}
 */

function addSentinels(container, className, stickySelector = STICKY_SELECTOR) {
  return Array.from(container.querySelectorAll(stickySelector)).map((stickyElement) => {
    const sentinel = document.createElement('div');
    const stickyParent = stickyElement.parentElement;

    // Apply styles to the sticky element

    stickyElement.style.cssText = `
      position: -webkit-sticky;
      position: sticky;
    `;

    // Apply default sentinel styles

    sentinel.classList.add(ClassName.SENTINEL, className);

    Object.assign(sentinel.style,{
      left: 0,
      position: 'absolute',
      right: 0,
      visibility: 'hidden',
    });

    switch (className) {
      case ClassName.SENTINEL_TOP: {
        stickyParent.insertBefore(sentinel, stickyElement);

        // Apply styles specific to the top sentinel

        Object.assign(
          sentinel.style,
          getSentinelPosition(stickyElement, sentinel, className),
          { position: 'relative' },
        );

        break;
      }

      case ClassName.SENTINEL_BOTTOM: {
        stickyParent.appendChild(sentinel);

        // Apply styles specific to the bottom sentinel

        Object.assign(sentinel.style, getSentinelPosition(stickyElement, sentinel, className));

        break;
      }
    }

    return sentinel;
  });
}


/**
 * Determine the position of the sentinel
 *
 * @param {Element|Node} stickyElement
 * @param {Element|Node} sentinel
 * @param {String} className
 * @returns {Object}
 */

function getSentinelPosition(stickyElement, sentinel, className) {
  const stickyStyle = window.getComputedStyle(stickyElement);
  const parentStyle = window.getComputedStyle(stickyElement.parentElement);

  switch (className) {
    case ClassName.SENTINEL_TOP:
      return {
        top: `calc(${stickyStyle.getPropertyValue('top')} * -1)`,
        height: 0,
      };

    case ClassName.SENTINEL_BOTTOM:
      const parentPadding = parseInt(parentStyle.paddingTop);

      return {
        bottom: stickyStyle.top,
        height: `${stickyElement.getBoundingClientRect().height + parentPadding}px`,
      };
  }
}


/**
 * Determine if the sticky element is currently sticking in the browser
 *
 * @param {Element} stickyElement
 * @returns {boolean}
 */

function isSticking(stickyElement) {
  const topSentinel = stickyElement.previousElementSibling;

  const stickyOffset = stickyElement.getBoundingClientRect().top;
  const topSentinelOffset = topSentinel.getBoundingClientRect().top;
  const difference = Math.round(Math.abs(stickyOffset - topSentinelOffset));

  const topSentinelTopPosition = Math.abs(parseInt(window.getComputedStyle(topSentinel).getPropertyValue('top')));

  return difference !== topSentinelTopPosition;
}
