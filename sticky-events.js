
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
      const targetInfo = record.boundingClientRect;
      const stickyParent = record.target.parentElement;
      const stickyTarget = stickyParent.querySelector(STICKY_SELECTOR);
      const rootBoundsInfo = record.rootBounds;

      stickyParent.style.position = 'relative';

      if (targetInfo.bottom < rootBoundsInfo.top) {
        fire(true, stickyTarget);
      }

      if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
        fire(false, stickyTarget);
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
      const targetInfo = record.boundingClientRect;
      const stickyTarget = record.target.parentElement.querySelector(STICKY_SELECTOR);
      const rootBoundsInfo = record.rootBounds;
      const ratio = record.intersectionRatio;
      const bottomIntersectionLikelihood = Math.round(targetInfo.top / rootBoundsInfo.height);

      if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1 && bottomIntersectionLikelihood === 0) {
        fire(true, stickyTarget);
      }

      if (targetInfo.top < rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
        fire(false, stickyTarget);
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
  return Array.from(container.querySelectorAll(STICKY_SELECTOR)).map((stickyEl) => {
    const sentinel = document.createElement('div');

    sentinel.classList.add(ClassName.SENTINEL, className);

    const appendedSentinel = stickyEl.parentElement.appendChild(sentinel);

    Object.assign(appendedSentinel.style, getSentinelPosition(stickyEl, appendedSentinel, className));

    return appendedSentinel;
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

  const parentPadding = parseInt(parentStyle.paddingTop);

  switch (className) {
    case ClassName.SENTINEL_TOP: {
      return {
        top: `calc(${-(sentinel.scrollHeight - parentPadding)}px + ${stickyStyle.top})`,
      };
    }

    case ClassName.SENTINEL_BOTTOM: {
      return {
        bottom: stickyStyle.top,
        height: `${stickyElement.scrollHeight + parentPadding}px`,
      };
    }

    default:
      return {};
  }
}
