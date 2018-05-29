
/**
 * Sticky Events
 */

// Constants

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


/**
 * Initialize the intersection observers on `.sticky` elements within the specified container.
 * Container defaults to `document`.
 *
 * @export
 * @param {Element|HTMLDocument|Document} container
 */

export function observeStickyEvents(container = document) {
  if (window.self !== window.top) {
    console.warn('StickyEvents: There are issues with using IntersectionObservers in an iframe, canceling initialization. Please see https://github.com/w3c/IntersectionObserver/issues/183');

    return;
  }

  window.requestAnimationFrame(() => {
    observeHeaders(container);
    observeFooters(container);
  });
}


/**
 * Sets up an intersection observer to notify `document` when elements with the `ClassName.SENTINEL_TOP` become
 * visible/hidden at the top of the sticky container.
 *
 * @param {Element|HTMLDocument} container
 */

function observeHeaders(container) {
  const observer = new IntersectionObserver((records) => {
    records.forEach((record) => {
      const { boundingClientRect, rootBounds } = record;
      const stickyParent = record.target.parentElement;
      const stickyTarget = stickyParent.querySelector(STICKY_SELECTOR);

      stickyParent.style.position = 'relative';

      if (boundingClientRect.bottom >= rootBounds.top && boundingClientRect.bottom < rootBounds.bottom) {
        fire(false, stickyTarget);
      }

      else if (boundingClientRect.bottom < rootBounds.top) {
        fire(true, stickyTarget);
      }
    });
  }, Object.assign({
    threshold: [0],
  }, !(container instanceof HTMLDocument) && {
    root: container
  }));

  const sentinels = addSentinels(container, ClassName.SENTINEL_TOP);

  sentinels.forEach(sentinel => observer.observe(sentinel));
}


/**
 * Sets up an intersection observer to notify `document` when elements with the `ClassName.SENTINEL_BOTTOM` become
 * visible/hidden at the bottom of the sticky container.
 *
 * @param {Element|HTMLDocument} container
 */

function observeFooters(container) {
  const observer = new IntersectionObserver((records) => {
    records.forEach((record) => {
      const { boundingClientRect, rootBounds } = record;
      const stickyTarget = record.target.parentElement.querySelector(STICKY_SELECTOR);

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

  const sentinels = addSentinels(container, ClassName.SENTINEL_BOTTOM);

  sentinels.forEach(sentinel => observer.observe(sentinel));
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
  stickyTarget.dispatchEvent(new CustomEvent(StickyEvent.CHANGE, { detail: { isSticky } }));
  stickyTarget.dispatchEvent(new CustomEvent(isSticky ? StickyEvent.STUCK : StickyEvent.UNSTUCK));
}


/**
 * Add sticky sentinels
 *
 * @param {Element|HTMLDocument} container
 * @param {String} className
 * @returns {Array<Element>}
 */

function addSentinels(container, className) {
  return Array.from(container.querySelectorAll(STICKY_SELECTOR)).map((stickyElement) => {
    const sentinel = document.createElement('div');
    const stickyParent = stickyElement.parentElement;

    sentinel.classList.add(ClassName.SENTINEL, className);

    switch (className) {
      case ClassName.SENTINEL_TOP: {
        stickyParent.insertBefore(sentinel, stickyElement);
        
        Object.assign(sentinel.style, getSentinelPosition(stickyElement, sentinel, className));

        break;
      }

      case ClassName.SENTINEL_BOTTOM: {
        stickyParent.appendChild(sentinel);

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
