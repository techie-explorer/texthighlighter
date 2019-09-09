/* global jQuery TextHighlighter */

if (typeof jQuery !== "undefined") {
  (function($) {
    "use strict";

    const PLUGIN_NAME = "textHighlighter";

    function wrap(fn, wrapper) {
      return function() {
        wrapper.call(this, fn);
      };
    }

    /**
     * The jQuery plugin namespace.
     * @external "jQuery.fn"
     * @see {@link http://docs.jquery.com/Plugins/Authoring The jQuery Plugin Guide}
     */

    /**
     * Creates TextHighlighter instance and applies it to the given jQuery object.
     * @param {object} options Same as {@link TextHighlighter} options.
     * @returns {jQuery}
     * @example $('#sandbox').textHighlighter({ color: 'red' });
     * @function external:"jQuery.fn".textHighlighter
     */
    $.fn.textHighlighter = function(options) {
      return this.each(function() {
        let el = this,
          hl;

        if (!$.data(el, PLUGIN_NAME)) {
          hl = new TextHighlighter(el, options);

          hl.destroy = wrap(hl.destroy, function(destroy) {
            destroy.call(hl);
            $(el).removeData(PLUGIN_NAME);
          });

          $.data(el, PLUGIN_NAME, hl);
        }
      });
    };

    $.fn.getHighlighter = function() {
      return this.data(PLUGIN_NAME);
    };
  })(jQuery);
}
