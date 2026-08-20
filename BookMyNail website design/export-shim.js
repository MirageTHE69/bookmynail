// Standalone-export shim. Lives in its own file because the DC template
// compiler rewrites identifiers inside inline <script> text.
//
// When the page is bundled by super_inline_html, window.__resources holds blob
// URLs for resources referenced from JS rather than HTML attributes. No-ops in
// the live project, where those resources load normally.
(function () {
  var R = window.__resources;
  if (!R) return;

  if (R.imgSlotState) {
    var nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (String(url).indexOf('.image-slots.state.json') !== -1) {
        return nativeFetch(R.imgSlotState, init);
      }
      return nativeFetch(input, init);
    };
  }

  if (R.heroVideo) {
    var apply = function () {
      var el = document.getElementById('hero-video');
      if (el) {
        el.setAttribute('src', R.heroVideo);
        return true;
      }
      return false;
    };
    if (!apply()) {
      var mo = new MutationObserver(function () {
        if (apply()) mo.disconnect();
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  }
})();
