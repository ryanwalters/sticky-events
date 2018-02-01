(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["observeStickyEvents"] = factory();
	else
		root["observeStickyEvents"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = observeStickyEvents;
/**
 * Sticky Events
 */

// Constants

var SentinelClassName = {
  TOP: 'sticky-sentinel-top',
  BOTTOM: 'sticky-sentinel-bottom'
};

/**
 * Initialize the intersection observers on `.sticky` elements within the specified container.
 * Container defaults to `document`.
 *
 * @export
 * @param {Element|HTMLDocument|Document} container
 */

function observeStickyEvents() {
  var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

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
  var observer = new IntersectionObserver(function (records) {
    records.forEach(function (record) {
      var targetInfo = record.boundingClientRect;
      var stickyParent = record.target.parentElement;
      var stickyTarget = stickyParent.querySelector('.sticky');
      var rootBoundsInfo = record.rootBounds;

      stickyParent.style.position = 'relative';

      if (targetInfo.bottom < rootBoundsInfo.top) {
        fire(true, stickyTarget);
      }

      if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
        fire(false, stickyTarget);
      }
    });
  }, _extends({
    threshold: [0]
  }, !(container instanceof HTMLDocument) && {
    root: container
  }));

  var sentinels = addSentinels(container, SentinelClassName.TOP);

  sentinels.forEach(function (sentinel) {
    return observer.observe(sentinel);
  });
}

/**
 * Sets up an intersection observer to notify `document` when elements with the SentinelClassName.BOTTOM become
 * visible/hidden at the bottom of the sticky container.
 *
 * @param {Element|HTMLDocument} container
 */

function observeFooters(container) {
  var observer = new IntersectionObserver(function (records) {
    records.forEach(function (record) {
      var targetInfo = record.boundingClientRect;
      var stickyTarget = record.target.parentElement.querySelector('.sticky');
      var rootBoundsInfo = record.rootBounds;
      var ratio = record.intersectionRatio;
      var bottomIntersectionLikelihood = Math.round(targetInfo.top / rootBoundsInfo.height);

      if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1 && bottomIntersectionLikelihood === 0) {
        fire(true, stickyTarget);
      }

      if (targetInfo.top < rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
        fire(false, stickyTarget);
      }
    });
  }, _extends({
    threshold: [1]
  }, !(container instanceof HTMLDocument) && {
    root: container
  }));

  // Add the bottom sentinels to each section and attach an observer.

  var sentinels = addSentinels(container, SentinelClassName.BOTTOM);

  sentinels.forEach(function (sentinel) {
    return observer.observe(sentinel);
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

function fire(isSticky, stickyTarget) {
  stickyTarget.dispatchEvent(new CustomEvent('sticky-change', { detail: { isSticky: isSticky } }));
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
  return Array.from(container.querySelectorAll('.sticky')).map(function (stickyEl) {
    var sentinel = document.createElement('div');

    sentinel.classList.add('sticky-sentinel', className);

    var appendedSentinel = stickyEl.parentElement.appendChild(sentinel);

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
  var sentinelStyle = window.getComputedStyle(sentinel);
  var stickyStyle = window.getComputedStyle(stickyEl);
  var parentStyle = window.getComputedStyle(stickyEl.parentElement);

  var stickyTop = parseInt(stickyStyle.top);
  var parentPadding = parseInt(parentStyle.paddingTop);

  switch (className) {
    case SentinelClassName.TOP:
      {
        var sentinelHeight = parseInt(sentinelStyle.height);

        return {
          top: -(sentinelHeight - parentPadding + stickyTop) + 'px'
        };
      }

    case SentinelClassName.BOTTOM:
      {
        var stickyHeight = parseInt(stickyStyle.height);

        return {
          bottom: stickyTop + 'px',
          height: stickyHeight + parentPadding + 'px'
        };
      }

    default:
      return {};
  }
}

/***/ })
/******/ ])["default"];
});