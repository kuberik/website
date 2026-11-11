/* Landing sections below the hero (v4 behaviour, minimal):
   - .reveal fade-up on first view (everything shown at once under prefers-reduced-motion)
   - the isometric figs are still: the hero is the page's one animation
   - the three non-rollout YAML files fold on phones (same breakpoint as sections.css .mf-fold)
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
  var folds = [].slice.call(document.querySelectorAll('[data-mp-fold]'));
  var phone = matchMedia('(max-width: 1099px)');
  function apply() { folds.forEach(function (d) { if (phone.matches) d.removeAttribute('open'); else d.setAttribute('open', ''); }); }
  if (folds.length) { apply(); phone.addEventListener('change', apply); }
  folds.forEach(function (d) { d.querySelector('summary').addEventListener('click', function (e) { if (!phone.matches) e.preventDefault(); }); });
})();
