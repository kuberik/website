// Kuberik landing — interactive carousels (model loop + dashboard views).
// Vanilla. No framework. Auto-advance with click-to-focus pause.

(function () {
  const PHASES = [
    { id: 'release', label: 'release' },
    { id: 'guard',   label: 'guard' },
    { id: 'gates',   label: 'gates' },
    { id: 'update',  label: 'update' },
    { id: 'health',  label: 'health' },
  ];
  const N = PHASES.length;

  // ----- Model loop -----
  function initModel() {
    const root = document.querySelector('[data-component="model"]');
    if (!root) return;

    const svg = root.querySelector('.m6-svg');
    const segments = Array.from(root.querySelectorAll('.m6-seg'));
    const segNums  = Array.from(root.querySelectorAll('.m6-segnum'));
    const pills    = Array.from(root.querySelectorAll('.m6-pill'));
    const spills   = Array.from(root.querySelectorAll('.m6-spill'));
    const cards    = Array.from(root.querySelectorAll('.m6-card'));
    const progress = Array.from(root.querySelectorAll('.m6-progress span'));
    const centerLbl  = root.querySelector('.m6-center .lbl');
    const centerName = root.querySelector('.m6-center .name');
    const btnPlay = root.querySelector('[data-action="play"]');
    const btnPrev = root.querySelector('[data-action="prev"]');
    const btnNext = root.querySelector('[data-action="next"]');

    let step = 0;
    let paused = false;
    let timer = null;

    function render() {
      segments.forEach((el, i) => {
        const op = i === step ? 1 : i < step ? 0.55 : 0.18;
        const w  = i === step ? 7 : 2;
        el.setAttribute('stroke-opacity', String(op));
        el.setAttribute('stroke-width', String(w));
      });
      segNums.forEach((el, i) => {
        el.dataset.active = String(i === step);
        el.dataset.done   = String(i < step);
      });
      pills.forEach((el, i) => {
        el.dataset.active = String(i === step);
        el.dataset.done   = String(i < step);
      });
      spills.forEach((el, i) => {
        el.dataset.active = String(i === step);
        el.dataset.done   = String(i < step);
      });
      cards.forEach((el, i) => {
        el.dataset.active = String(i === step);
      });
      progress.forEach((el, i) => {
        el.dataset.state = i < step ? 'done' : i === step ? 'active' : '';
      });
      if (centerLbl)  centerLbl.textContent  = 'phase ' + String(step + 1).padStart(2, '0');
      if (centerName) centerName.textContent = PHASES[step].label;
      if (btnPlay) btnPlay.textContent = paused ? 'play' : 'pause';
    }

    function schedule() {
      clearTimeout(timer);
      if (paused) return;
      timer = setTimeout(() => { step = (step + 1) % N; render(); schedule(); }, 4000);
    }

    function focus(i) { paused = true; step = i; render(); schedule(); }

    segments.forEach((el, i) => {
      el.addEventListener('click', () => focus(i));
      el.addEventListener('mouseenter', () => focus(i));
    });
    pills.forEach((el, i) => {
      el.addEventListener('click', () => focus(i));
      el.addEventListener('mouseenter', () => focus(i));
    });
    spills.forEach((el, i) => {
      el.addEventListener('click', () => focus(i));
    });
    cards.forEach((el, i) => {
      el.addEventListener('click', () => focus(i));
      el.addEventListener('mouseenter', () => focus(i));
    });
    if (btnPlay) btnPlay.addEventListener('click', () => { paused = !paused; render(); schedule(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { paused = true; step = (step - 1 + N) % N; render(); schedule(); });
    if (btnNext) btnNext.addEventListener('click', () => { paused = true; step = (step + 1) % N; render(); schedule(); });

    render();
    schedule();
  }

  // ----- Dashboard view carousel -----
  function initDash() {
    const root = document.querySelector('[data-component="dash"]');
    if (!root) return;

    const views = Array.from(root.querySelectorAll('.dash-img'));
    const dots  = Array.from(root.querySelectorAll('.dash-carouseldots button'));
    const VN = views.length;

    let view = 0;
    let paused = false;
    let timer = null;

    function render() {
      views.forEach((el, i) => { el.dataset.active = String(i === view); });
      dots.forEach((el, i)  => { el.dataset.active = String(i === view); });
    }
    function schedule() {
      clearTimeout(timer);
      if (paused) return;
      timer = setTimeout(() => { view = (view + 1) % VN; render(); schedule(); }, 6000);
    }
    function focus(i, lock) {
      if (lock) paused = true;
      view = i; render(); schedule();
    }

    dots.forEach((el, i)  => el.addEventListener('click', () => focus(i, true)));

    render();
    schedule();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initModel(); initDash(); });
  } else {
    initModel(); initDash();
  }
})();
