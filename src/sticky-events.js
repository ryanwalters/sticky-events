/**
 * Sticky Events
 */

// Constants

const SentinelClassName = {
  TOP: 'sticky-sentinel-top',
  BOTTOM: 'sticky-sentinel-bottom',
};


/**
 * Initialize the intersection observers on `.sticky` elements within the specified container.
 * Container defaults to `document`.
 *
 * @export
 * @param {Element|HTMLDocument|Document} container
 */

export default function observeStickyEvents(container = document) {
  observeHeaders(container);
  observeFooters(container);
}


/**
 * Sets up an intersection observer to notify `document` when elements with the SentinelClassName.TOP become
 * visible/hidden at the top of the sticky container.
 *
 * @param {Element|HTMLDocument} container
 */

function observeHeaders(container) {
  const observer = new IntersectionObserver((records) => {
    records.forEach((record) => {
      const targetInfo = record.boundingClientRect;
      const stickyParent = record.target.parentElement;
      const stickyTarget = stickyParent.querySelector('.sticky');
      const rootBoundsInfo = record.rootBounds;

      stickyParent.style.position = 'relative';

      if (targetInfo.bottom < rootBoundsInfo.top) {
        fire(true, stickyTarget);
      }

      if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
        fire(false, stickyTarget);
      }
    });
  }, {
    threshold: [0],
    ...!(container instanceof HTMLDocument) && {
      root: container,
    },
  });

  const sentinels = addSentinels(container, SentinelClassName.TOP);

  sentinels.forEach(sentinel => observer.observe(sentinel));
}


/**
 * Sets up an intersection observer to notify `document` when elements with the SentinelClassName.BOTTOM become
 * visible/hidden at the bottom of the sticky container.
 *
 * @param {Element|HTMLDocument} container
 */

function observeFooters(container) {
  const observer = new IntersectionObserver((records) => {
    records.forEach((record) => {
      const targetInfo = record.boundingClientRect;
      const stickyTarget = record.target.parentElement.querySelector('.sticky');
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
  }, {
    threshold: [1],
    ...!(container instanceof HTMLDocument) && {
      root: container,
    },
  });

  // Add the bottom sentinels to each section and attach an observer.

  const sentinels = addSentinels(container, SentinelClassName.BOTTOM);

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
  stickyTarget.dispatchEvent(new CustomEvent('sticky-change', { detail: { isSticky } }));
  stickyTarget.dispatchEvent(new CustomEvent(isSticky ? 'sticky-stuck' : 'sticky-unstuck'));
}


/**
 * Add sticky sentinels
 *
 * @param {Element|HTMLDocument} container
 * @param {String} className
 * @returns {Array<Element>}
 */

function addSentinels(container, className) {
  return Array.from(container.querySelectorAll('.sticky')).map((stickyEl) => {
    const sentinel = document.createElement('div');

    sentinel.classList.add('sticky-sentinel', className);

    const appendedSentinel = stickyEl.parentElement.appendChild(sentinel);

    Object.assign(appendedSentinel.style, getSentinelPosition(stickyEl, appendedSentinel, className));

    return appendedSentinel;
  });
}


/**
 * Determine the position of the sentinel
 *
 * @param {Element} stickyEl
 * @param {Element} sentinel
 * @param {String} className
 * @returns {Object}
 */

function getSentinelPosition(stickyEl, sentinel, className) {
  const sentinelStyle = window.getComputedStyle(sentinel);
  const stickyStyle = window.getComputedStyle(stickyEl);
  const parentStyle = window.getComputedStyle(stickyEl.parentElement);

  const stickyTop = parseInt(stickyStyle.top);
  const parentPadding = parseInt(parentStyle.paddingTop);

  switch (className) {
    case SentinelClassName.TOP: {
      const sentinelHeight = parseInt(sentinelStyle.height);

      return {
        top: `${-((sentinelHeight - parentPadding) + stickyTop)}px`,
      };
    }

    case SentinelClassName.BOTTOM: {
      const stickyHeight = parseInt(stickyStyle.height);

      return {
        bottom: `${stickyTop}px`,
        height: `${stickyHeight + parentPadding}px`,
      };
    }

    default:
      return {};
  }
}
