/* Landing sections below the hero (v4 behaviour, minimal):
   - .reveal fade-up on first view (everything shown at once under prefers-reduced-motion)
   - the isometric figs animate only while on screen (.is-live on .fig-cell), never under reduced motion;
     the closing staircase (.closing-art) plays once and is never re-armed
   - the three non-rollout YAML files fold on phones (same breakpoint as sections.css .mf-fold, 1023)
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
  var cells = [].slice.call(document.querySelectorAll('.fig-cell'));
  if ('IntersectionObserver' in window) {
    var live = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        // --clk keeps every fig on one page clock (6 s cycle): the row plays as one sequence however each cell entered
        if (x.isIntersecting) x.target.style.setProperty('--clk', Math.round(performance.now() % 6000) + 'ms');
        x.target.classList.toggle('is-live', x.isIntersecting);
        // the closing staircase plays once: keep it live (finished, held by fill-mode both) and stop watching it
        if (x.isIntersecting && x.target.classList.contains('closing-art')) live.unobserve(x.target);
      });
    }, { rootMargin: '0px', threshold: 0.05 });
    cells.forEach(function (c) { live.observe(c); });
  }
  var folds = [].slice.call(document.querySelectorAll('[data-mp-fold]'));
  var phone = matchMedia('(max-width: 1023px)');
  function apply() { folds.forEach(function (d) { if (phone.matches) d.removeAttribute('open'); else d.setAttribute('open', ''); }); }
  if (folds.length) { apply(); phone.addEventListener('change', apply); }
  [].slice.call(document.querySelectorAll('.mf-fold')).forEach(function (d) { d.querySelector('summary').addEventListener('click', function (e) { if (!phone.matches) e.preventDefault(); }); });
})();
