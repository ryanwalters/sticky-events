/**
 * Todo:
 * - Allow adding new stickies to a set of stickies
 */

const ClassName = {
  SENTINEL: 'sticky-events--sentinel',
  SENTINEL_TOP: 'sticky-events--sentinel-top',
  SENTINEL_BOTTOM: 'sticky-events--sentinel-bottom',
};


// StickyEvents class

export default class StickyEvents {
  /**
   * Initialize a set of sticky elements with events
   *
   * @param {Element|Document} container
   * @param {boolean} enabled
   * @param {string} stickySelector
   */

  constructor({ container = document, enabled = true, stickySelector = '.sticky-events' } = {}) {
    this.container = container;
    this.observers = [];
    this.stickyElements = document.querySelectorAll(stickySelector);
    this.stickySelector = stickySelector;

    if (enabled) {
      this.enableEvents();
    }
  }


  /**
   * Initialize the intersection observers on `.sticky` elements within the specified container.
   * Container defaults to `document`.
   */

  enableEvents() {
    if (window.self !== window.top) {
      console.warn('StickyEvents: There are issues with using IntersectionObservers in an iframe, canceling initialization. Please see https://github.com/w3c/IntersectionObserver/issues/183');

      return;
    }

    this.observers.push(this.observeHeaders());
    this.observers.push(this.observeFooters());
  }


  /**
   * Reset the DOM to it's pre-sticky state.
   * This function stops observing sticky sentinels before removing them from the DOM.
   *
   * @param {boolean} resetStickies     Optionally fire one last `sticky-unstick` event to reset the sticky to it's pre-sticky state
   */

  disableEvents(resetStickies = true) {
    this.observers.forEach(({ observer, sentinels }) => {
      if (resetStickies) {
        this.stickyElements.forEach(sticky => this.fire(false, sticky));
      }

      sentinels.forEach(sentinel => sentinel.remove());

      observer.disconnect();

      observer = null;
    });

    this.observers.length = 0;
  }


  /**
   * Sets up an intersection observer to notify `document` when elements with the `ClassName.SENTINEL_TOP` become
   * visible/hidden at the top of the sticky container.
   *
   * @returns {{observer: IntersectionObserver, sentinels: Array<Element>}}
   */

  observeHeaders() {
    const observer = new IntersectionObserver((records) => {
      records.forEach((record) => {
        const { boundingClientRect, rootBounds } = record;
        const stickyParent = record.target.parentElement;
        const stickyTarget = stickyParent.querySelector(this.stickySelector);

        stickyParent.style.position = 'relative';

        if (boundingClientRect.bottom > rootBounds.top && boundingClientRect.bottom < rootBounds.bottom) {
          this.fire(false, stickyTarget);
        }

        else if (boundingClientRect.bottom <= rootBounds.top) {
          this.fire(true, stickyTarget);
        }
      });
    }, Object.assign({
      threshold: [0],
    }, !(this.container instanceof HTMLDocument) && {
      root: this.container
    }));

    const sentinels = this.addSentinels(ClassName.SENTINEL_TOP);

    sentinels.forEach(sentinel => observer.observe(sentinel));

    return {
      observer,
      sentinels,
    };
  }


  /**
   * Sets up an intersection observer to notify `document` when elements with the `ClassName.SENTINEL_BOTTOM` become
   * visible/hidden at the bottom of the sticky container.
   *
   * @returns {{container: *, observer: IntersectionObserver, sentinels: Array<Element>}}
   */

  observeFooters() {
    const observer = new IntersectionObserver((records) => {
      records.forEach((record) => {
        const { boundingClientRect, rootBounds } = record;
        const stickyTarget = record.target.parentElement.querySelector(this.stickySelector);

        if (boundingClientRect.top < rootBounds.top && boundingClientRect.bottom < rootBounds.bottom) {
          this.fire(false, stickyTarget);
        }

        else if (boundingClientRect.bottom > rootBounds.top && this.isSticking(stickyTarget)) {
          this.fire(true, stickyTarget);
        }
      });
    }, Object.assign({
      threshold: [1],
    }, !(this.container instanceof HTMLDocument) && {
      root: this.container
    }));

    // Add the bottom sentinels to each section and attach an observer.

    const sentinels = this.addSentinels(ClassName.SENTINEL_BOTTOM);

    sentinels.forEach(sentinel => observer.observe(sentinel));

    return {
      observer,
      sentinels,
    };
  }


  /**
   * Add sticky sentinels
   *
   * @param {String} className
   * @returns {Array<Element>}
   */

  addSentinels(className) {
    return Array.from(this.stickyElements).map((stickyElement) => {
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
            this.getSentinelPosition(stickyElement, sentinel, className),
            { position: 'relative' },
          );

          break;
        }

        case ClassName.SENTINEL_BOTTOM: {
          stickyParent.appendChild(sentinel);

          // Apply styles specific to the bottom sentinel

          Object.assign(sentinel.style, this.getSentinelPosition(stickyElement, sentinel, className));

          break;
        }
      }

      return sentinel;
    });
  }


  /**
   * Dispatch the following events:
   * - `sticky-change`
   * - `sticky-stuck` or `sticky-unstuck`
   *
   * @param {Boolean} isSticky
   * @param {Element} stickyTarget
   */

  fire(isSticky, stickyTarget) {
    stickyTarget.dispatchEvent(new CustomEvent(StickyEvents.CHANGE, { detail: { isSticky }, bubbles: true }));
    stickyTarget.dispatchEvent(new CustomEvent(isSticky ? StickyEvents.STUCK : StickyEvents.UNSTUCK, { bubbles: true }));
  }


  /**
   * Determine the position of the sentinel
   *
   * @param {Element|Node} stickyElement
   * @param {Element|Node} sentinel
   * @param {String} className
   * @returns {Object}
   */

  getSentinelPosition(stickyElement, sentinel, className) {
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

  isSticking(stickyElement) {
    const topSentinel = stickyElement.previousElementSibling;

    const stickyOffset = stickyElement.getBoundingClientRect().top;
    const topSentinelOffset = topSentinel.getBoundingClientRect().top;
    const difference = Math.round(Math.abs(stickyOffset - topSentinelOffset));

    const topSentinelTopPosition = Math.abs(parseInt(window.getComputedStyle(topSentinel).getPropertyValue('top')));

    return difference !== topSentinelTopPosition;
  }
}

// Events

StickyEvents.CHANGE = 'sticky-change';
StickyEvents.STUCK = 'sticky-stuck';
StickyEvents.UNSTUCK = 'sticky-unstuck';
