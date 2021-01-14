"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bindEvents = bindEvents;
exports.unbindEvents = unbindEvents;

function bindEvents(el, scope) {
  el.addEventListener("mouseup", scope.highlightHandler);
  el.addEventListener("touchend", scope.highlightHandler);
}

function unbindEvents(el, scope) {
  el.removeEventListener("mouseup", scope.highlightHandler);
  el.removeEventListener("touchend", scope.highlightHandler);
}
