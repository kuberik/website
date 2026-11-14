/* Landing sections below the hero (v4 behaviour, minimal):
   - .reveal fade-up on first view (everything shown at once under prefers-reduced-motion)
   - the thesis loop runs on one 12 s page clock only while its row is on screen (.is-live on .figs), never under
     reduced motion; the install staircase (.stair) plays once and is never re-armed
   The hero window has its own loader (islands/); nothing here touches it. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var els = [].slice.call(document.querySelectorAll('.reveal'));
  if (!('IntersectionObserver' in window) || reduce.matches) {
    els.forEach(function (e) { e.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }
  // THE LOOP (thesis): one 12 s page clock for the row. --clk = where the page clock stands when the row comes on
  // screen, so the five figs (and the rail's nodes) stay one sequence however often the row leaves and returns.
  // Off screen the row drops .is-live and every fig holds its rest pose. THE STAIRCASE (install) plays once at 40%.
  if ('IntersectionObserver' in window && !reduce.matches) {
    var rows = [].slice.call(document.querySelectorAll('.figs'));
    var live = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) x.target.style.setProperty('--clk', Math.round(performance.now() % 12000) + 'ms');
        x.target.classList.toggle('is-live', x.isIntersecting);
      });
    }, { threshold: 0.05 });
    rows.forEach(function (r) { live.observe(r); });
    var once = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-live'); once.unobserve(x.target); } });
    }, { threshold: 0.4 });
    [].slice.call(document.querySelectorAll('.stair')).forEach(function (s) { once.observe(s); });
  }
})();
