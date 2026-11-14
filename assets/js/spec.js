/* Everything-you-write window: below 641px the four files are tabs (WAI-ARIA tabs, automatic activation).
   CSS does the hiding (html.js .pane:not(.is-active) at <= 640), so the first paint is already one pane: no shift.
   Above 640 the tabs are display:none and every pane shows; this script only keeps the state consistent. */
(function () {
  var w = document.getElementById('spec-win'); if (!w) return;
  var tabs = Array.prototype.slice.call(w.querySelectorAll('[data-tab]'));
  var panes = Array.prototype.slice.call(w.querySelectorAll('.pane'));
  var mq = window.matchMedia('(max-width:640px)');
  function select(i, focus) {
    tabs.forEach(function (t, j) {
      var on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panes[j].classList.toggle('is-active', on);
    });
    if (focus) tabs[i].focus();
    if (tabs[i].scrollIntoView) tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function roles() {
    panes.forEach(function (p) {
      /* a named generic div is not allowed (ARIA 1.2): the label goes with the tabpanel role */
      if (!p.dataset.lb) p.dataset.lb = p.getAttribute('aria-labelledby') || '';
      if (mq.matches) { p.setAttribute('role', 'tabpanel'); if (p.dataset.lb) p.setAttribute('aria-labelledby', p.dataset.lb); }
      else { p.removeAttribute('role'); p.removeAttribute('aria-labelledby'); }
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i, false); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length, k = e.key, j = -1;
      if (k === 'ArrowRight') j = (i + 1) % n;
      else if (k === 'ArrowLeft') j = (i + n - 1) % n;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = n - 1;
      if (j < 0) return;
      e.preventDefault(); select(j, true);
    });
  });
  roles();
  if (mq.addEventListener) mq.addEventListener('change', roles); else if (mq.addListener) mq.addListener(roles);
})();
