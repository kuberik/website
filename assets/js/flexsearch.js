// Search functionality using FlexSearch.

// Change shortcut key to cmd+k on Mac, iPad or iPhone.
document.addEventListener("DOMContentLoaded", function () {
  if (/iPad|iPhone|Macintosh/.test(navigator.userAgent)) {
    // select the kbd element under the .hextra-search-wrapper class
    const keys = document.querySelectorAll(".hextra-search-wrapper kbd");
    keys.forEach(key => {
      key.innerHTML = '<span class="hx:text-xs">⌘</span>K';
    });
  }
});

// Render the search data as JSON.
// {{ $searchDataFile := printf "%s.search-data.json" .Language.Lang }}
// {{ $searchData := resources.Get "json/search-data.json" | resources.ExecuteAsTemplate $searchDataFile . }}
// {{ if hugo.IsProduction }}
//   {{ $searchData := $searchData | minify | fingerprint }}
// {{ end }}
// {{ $noResultsFound := (T "noResultsFound") | default "No results found." }}

(function () {
  const searchDataURL = '{{ $searchData.RelPermalink }}';

  const inputElements = document.querySelectorAll('.hextra-search-input');
  for (const el of inputElements) {
    el.addEventListener('focus', init);
    el.addEventListener('keyup', search);
    el.addEventListener('keydown', handleKeyDown);
    el.addEventListener('input', handleInputChange);
  }

  const shortcutElements = document.querySelectorAll('.hextra-search-wrapper kbd');

  function setShortcutElementsOpacity(opacity) {
    shortcutElements.forEach(el => {
      el.style.opacity = opacity;
    });
  }

  function handleInputChange(e) {
    const opacity = e.target.value.length > 0 ? 0 : 100;
    setShortcutElementsOpacity(opacity);
  }

  // The search box in use (R6-C-1). Pages can hold two (the 404 has the
  // header's and its own), so resolve it from the event target or the focused
  // element first, and only then fall back to the first visible one.
  function getActiveSearchElement(from) {
    const own = (el) => (el && el.closest ? el.closest('.hextra-search-wrapper') : null);
    let wrapper = own(from) || own(document.activeElement);
    if (!wrapper) {
      wrapper = Array.from(document.querySelectorAll('.hextra-search-wrapper')).find(el => el.clientHeight > 0);
    }
    if (!wrapper) return {};
    return {
      wrapper,
      inputElement: wrapper.querySelector('.hextra-search-input'),
      resultsElement: wrapper.querySelector('.hextra-search-results')
    };
  }

  const INPUTS = ['input', 'select', 'button', 'textarea']

  // Focus the search input when pressing ctrl+k/cmd+k or /.
  document.addEventListener('keydown', function (e) {
    const { inputElement } = getActiveSearchElement();
    if (!inputElement) return;

    const activeElement = document.activeElement;
    const tagName = activeElement && activeElement.tagName;
    if (
      inputElement === activeElement ||
      !tagName ||
      INPUTS.includes(tagName) ||
      (activeElement && activeElement.isContentEditable))
      return;

    if (
      e.key === '/' ||
      (e.key === 'k' &&
        (e.metaKey /* for Mac */ || /* for non-Mac */ e.ctrlKey))
    ) {
      e.preventDefault();
      inputElement.focus();
    } else if (e.key === 'Escape' && inputElement.value) {
      inputElement.blur();
    }
  });

  // Dismiss the search results when clicking outside the search box.
  document.addEventListener('mousedown', function (e) {
    for (const wrapper of document.querySelectorAll('.hextra-search-wrapper')) {
      const inputElement = wrapper.querySelector('.hextra-search-input');
      const resultsElement = wrapper.querySelector('.hextra-search-results');
      if (!inputElement || !resultsElement) continue;
      if (
        e.target !== inputElement &&
        e.target !== resultsElement &&
        !resultsElement.contains(e.target)
      ) {
        setShortcutElementsOpacity(100);
        hideSearchResults(resultsElement);
      }
    }
  });

  // Get the currently active result and its index.
  function getActiveResult() {
    const { resultsElement } = getActiveSearchElement();
    if (!resultsElement) return { result: undefined, index: -1 };

    const result = resultsElement.querySelector('.hextra-search-active');
    if (!result) return { result: undefined, index: -1 };

    const index = parseInt(result.dataset.index, 10);
    return { result, index };
  }

  // Set the active result by index.
  function setActiveResult(index) {
    const { resultsElement } = getActiveSearchElement();
    if (!resultsElement) return;

    const { result: activeResult } = getActiveResult();
    activeResult && activeResult.classList.remove('hextra-search-active');
    const result = resultsElement.querySelector(`[data-index="${index}"]`);
    if (result) {
      result.classList.add('hextra-search-active');
      result.focus();
    }
  }

  // Get the number of search results from the DOM.
  function getResultsLength() {
    const { resultsElement } = getActiveSearchElement();
    if (!resultsElement) return 0;
    return resultsElement.dataset.count;
  }

  // Finish the search by hiding the results and clearing the input.
  function finishSearch() {
    const { inputElement, resultsElement } = getActiveSearchElement();
    if (!inputElement) return;
    hideSearchResults(resultsElement);
    inputElement.value = '';
    inputElement.blur();
  }

  function hideSearchResults(resultsElement) {
    if (!resultsElement) resultsElement = getActiveSearchElement().resultsElement;
    if (!resultsElement) return;
    resultsElement.classList.add('hx:hidden');
  }

  // Handle keyboard events.
  function handleKeyDown(e) {
    const { inputElement, resultsElement } = getActiveSearchElement(e.target);
    if (!inputElement) return;

    const resultsLength = getResultsLength();
    const { result: activeResult, index: activeIndex } = getActiveResult();

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (activeIndex > 0) setActiveResult(activeIndex - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (activeIndex + 1 < resultsLength) setActiveResult(activeIndex + 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeResult) {
          activeResult.click();
        }
        finishSearch();
      case 'Escape':
        e.preventDefault();
        hideSearchResults(resultsElement);
        // Clear the input when pressing escape
        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input'));
        // Remove focus from the input
        inputElement.blur();
        break;
    }
  }

  // Initializes the search.
  function init(e) {
    e.target.removeEventListener('focus', init);
    if (!window.kdSections) {
      preloadIndex();
    }
  }

  // kuberik: our own ranking instead of FlexSearch's (R5-IA-1..4, R6-IA-3..6).
  // Why: FlexSearch scored every paragraph alike, so a blog post, an
  // API-reference type description or a body sentence beat the page the
  // reader meant. Here a title match beats a body match, a page title beats
  // a section title, generated reference pages carry no body weight, a
  // camelCase field name goes to its table row, words are stemmed, and a
  // typo falls back to the nearest word in the docs. On /docs/ pages the blog
  // is out of scope.
  const WORD = /[0-9a-zÀ-ſ]+/g;
  const IRREGULAR = { held: 'hold', built: 'build', ran: 'run', sent: 'send', kept: 'keep', left: 'leave', rolled: 'roll' };
  // Light stemmer: pinned -> pin, blocked -> block, approving -> approv,
  // approve -> approv, clusters -> cluster. Only needs to be consistent.
  function stem(w) {
    if (IRREGULAR[w]) return IRREGULAR[w];
    if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.length > 4 && w.endsWith('ied')) return w.slice(0, -3) + 'y';
    if (w.length > 5 && w.endsWith('ing')) w = w.slice(0, -3);
    else if (w.length > 4 && w.endsWith('ed')) w = w.slice(0, -2);
    else if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('us')) w = w.slice(0, -1);
    if (w.length > 3 && w[w.length - 1] === w[w.length - 2] && !/[lsz]/.test(w[w.length - 1])) w = w.slice(0, -1);
    if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
    return w;
  }
  // Operators write "rollback", "roll back" and "rolled back" for one thing;
  // HealthCheck is "health check".
  function norm(s) {
    return ('' + s).replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
      .replace(/\broll(?:s|ed|ing)?[\s-]?back(?:s)?\b/g, 'rollback');
  }
  // Index side: the camelCase word whole and in parts (bakeTime, bake, time).
  function words(s) {
    s = '' + s;
    const out = [];
    for (const tok of s.match(/[0-9A-Za-zÀ-ſ]+/g) || []) {
      if (/[a-z0-9][A-Z]/.test(tok)) out.push(stem(tok.toLowerCase()));
    }
    for (const w of norm(s).match(WORD) || []) out.push(stem(w));
    return out;
  }
  // Query side: parts only, so "HealthCheck" is the two words "health check".
  function queryTerms(q) { return (norm(q).match(WORD) || []).map(stem); }

  // One-way: a query word expands to the words an operator may mean by it
  // (stems). A synonym hit scores below a literal one (see hit()).
  const SYN = {};
  for (const [k, vs] of Object.entries({
    unblock: ['unblock', 'block', 'resume'],
    block: ['block', 'unblock'],
    approv: ['approv', 'approval', 'approver'],
    approval: ['approval', 'approv', 'approver'],
    install: ['install', 'installation'],
    upgrad: ['upgrad'],
    stuck: ['stuck', 'stall', 'hung'],
    multi: ['multi', 'several', 'multiple', 'many'],
  })) SYN[stem(k)] = vs.map(stem);
  function variants(t) { return SYN[t] || [t]; }
  // 2 literal word, 1 literal prefix (typing "dep"), 0.7 synonym word, 0.4 synonym prefix.
  function hit(ws, t) {
    let best = 0;
    for (const v of variants(t)) {
      const lit = v === t;
      for (const w of ws) {
        if (w === v) { if (lit) return 2; best = Math.max(best, 0.7); }
        else if (w.startsWith(v)) best = Math.max(best, lit ? 1 : 0.4);
      }
    }
    return best;
  }
  // R6-IA-6: titles keep no tags; excerpts are plain text and are escaped on display.
  const decoder = document.createElement('textarea');
  const decode = (x) => { decoder.innerHTML = x; return decoder.value; };
  // Headings arrive as HTML (<code>, &ldquo;): drop tags, decode entities.
  const strip = (x) => decode(('' + x).replace(/<[^>]*>/g, ''));
  function count(hay, needle) {
    let n = 0, i = -1;
    while (n < 10 && (i = hay.indexOf(needle, i + 1)) !== -1) n++;
    return n;
  }
  function editsWithinOne(a, b) {
    if (a === b) return true;
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    let i = 0;
    while (i < la && i < lb && a[i] === b[i]) i++;
    if (la === lb) {
      if (a.slice(i + 1) === b.slice(i + 1)) return true; // substitution
      return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2); // swap
    }
    return la > lb ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  }

  async function preloadIndex() {
    const resp = await fetch(searchDataURL);
    const data = await resp.json();
    const sections = [];
    const fields = [];
    const vocab = new Map();
    const seen = (ws) => { for (const w of ws) vocab.set(w, (vocab.get(w) || 0) + 1); };
    for (const route in data) {
      const urlParts = route.split('/').filter(x => x != "" && !x.startsWith('#'));
      let crumb = '';
      let searchUrl = '/';
      for (let i = 0; i < urlParts.length; i++) {
        searchUrl += urlParts[i] + '/';
        const cd = data[searchUrl];
        if (!cd) continue;
        let title = strip(cd.title);
        if (title == "_index") title = urlParts[i].split("-").join(" ");
        crumb += title;
        if (i < urlParts.length - 1) crumb += ' > ';
      }
      const pageTitle = strip(data[route].title);
      const generated = route.startsWith('/docs/reference/');
      for (const f of data[route].fields || []) fields.push({ route, crumb, ...f });
      let order = 0;
      for (const heading in data[route].data) {
        const [hash, text] = heading.split('#');
        // Closing link-card sections (Related, Next steps) are navigation, not answers.
        if (hash === 'related' || hash === 'next-steps') continue;
        const url = route.trimEnd('/') + (hash ? '#' + hash : '');
        const title = strip(text || pageTitle);
        const content = data[route].data[heading] || '';
        const paragraphs = content.split('\n').filter(Boolean);
        const sec = {
          route, url, title, crumb, pageTitle,
          isPage: !hash,
          order: order++,
          generated,
          display: paragraphs[0] || '',
          tw: words(title),
          pw: words(pageTitle),
          cw: words(crumb),
          bw: new Set(words(content)),
          body: norm(content),
        };
        seen(sec.tw); seen(sec.bw);
        sections.push(sec);
      }
    }
    const titleOf = new Map(sections.map(x => [x.url, x.title]));
    for (const f of fields) f.type = titleOf.get(f.route + '#' + f.type) || f.type;
    window.kdFields = fields;
    window.kdVocab = vocab;
    window.kdSections = sections;
    // The search box may have been used while the index loaded.
    const { inputElement } = getActiveSearchElement();
    if (inputElement && inputElement.value) inputElement.dispatchEvent(new Event('keyup'));
  }

  // R7-IA-3: the words the dashboard itself shows for a state. A reader who
  // types one (or the banner, "production is held") wants the table that maps
  // it to the fix, ahead of the concept pages that explain the state.
  const STATE_WORDS = /\b(held|pinned|stuck|paused)\b/i; // as typed: "pin" is the task, "pinned" is the state
  const DASHBOARD_WORDS = '/docs/operate/troubleshooting/#what-the-dashboard-shows';

  function scoreSection(s, terms, phrase, ident, stateQuery) {
    let score = 0;
    let titleHits = 0;
    // Generated reference pages carry no body weight, except for an exact
    // field name (camelCase query), where the definition is what is wanted.
    const gen = s.generated && !ident;
    for (const t of terms) {
      const th = hit(s.tw, t);
      const ph = s.isPage ? 0 : hit(s.pw, t);
      let bh = 0;
      if (!th && !ph) {
        for (const v of variants(t)) {
          for (const w of s.bw) { if (w === v || w.startsWith(v)) { bh = 1; break; } }
          if (bh) break;
        }
      }
      if (!th && !ph && !bh) {
        if (hit(s.cw, t)) { score += 0.5; continue; }
        return 0; // every word must be somewhere
      }
      if (th) { score += th >= 2 ? 10 : th >= 1 ? 6 : th >= 0.7 ? 7 * 0.7 + 2 : 3; if (th >= 1) titleHits++; }
      else if (ph) score += ph >= 1 ? 2 : 1;
      else {
        // Body hit: more mentions rank higher, so ties are not index order.
        const n = Math.max(...variants(t).map(v => count(s.body, v)));
        score += gen ? 0.1 : 1 + Math.min(n, 10) * 0.12 + (ident && s.generated ? 3 : 0);
      }
    }
    if (terms.length > 1 && norm(s.title).includes(phrase)) score += 12;
    else if (terms.length > 1 && s.body.includes(phrase)) score += gen ? 0 : 4;
    if (titleHits === terms.length) score += 6;
    // A page's own entry (its title and summary) outranks its sections.
    if (s.isPage && titleHits) score += 8;
    if (s.url === DASHBOARD_WORDS && stateQuery) score += 26;
    if (gen) score *= 0.5;
    return score;
  }

  // The nearest word in the docs within one edit, for each term nothing matches.
  function correct(terms) {
    const vocab = window.kdVocab;
    let changed = false;
    const out = terms.map(t => {
      if (vocab.has(t) || SYN[t] || t.length < 4) return t;
      let best = null, bestN = 0;
      for (const [w, n] of vocab) {
        if (n > bestN && editsWithinOne(t, w)) { best = w; bestN = n; }
      }
      if (best) { changed = true; return best; }
      return t;
    });
    return changed ? out : null;
  }

  function rank(terms, ident, query) {
    const stateQuery = STATE_WORDS.test(query);
    const phrase = terms.join(' ');
    const inDocs = location.pathname.startsWith('/docs/');
    const inBlog = location.pathname.startsWith('/blog/');
    const pages = new Map();
    for (const s of window.kdSections) {
      // On /docs/ pages the blog (old release notes) is out of scope; on blog
      // pages it stays in; elsewhere docs lead.
      let w = 1;
      if (s.route.startsWith('/blog/')) {
        if (inDocs) continue;
        w = inBlog ? 1 : 0.6;
      } else if (inBlog) w = 0.6;
      const sc = scoreSection(s, terms, phrase, ident, stateQuery) * w;
      if (sc <= 0) continue;
      let p = pages.get(s.route);
      if (!p) pages.set(s.route, p = { best: 0, items: [], crumb: s.crumb, order: pages.size });
      p.items.push({ s, sc });
      p.best = Math.max(p.best, sc);
    }
    return [...pages.values()].sort((a, b) => b.best - a.best || a.order - b.order).slice(0, 12);
  }

  function search(e) {
    const query = e.target.value;
    const { resultsElement } = getActiveSearchElement(e.target);
    if (!resultsElement) return;
    if (!query) {
      hideSearchResults(resultsElement);
      return;
    }
    while (resultsElement.firstChild) {
      resultsElement.removeChild(resultsElement.firstChild);
    }
    resultsElement.classList.remove('hx:hidden');
    if (!window.kdSections) return;

    let terms = queryTerms(query);
    if (!terms.length) { displayResults([], [], resultsElement); return; }
    const ident = /[a-z][A-Z]/.test(query);
    let ranked = rank(terms, ident, query);
    if (!ranked.length) {
      const fixed = correct(terms);
      if (fixed) { terms = fixed; ranked = rank(terms, ident, query); }
    }
    const results = [];
    // R6-IA-3: an exact camelCase field name goes to its table row, with the
    // field's own description as the snippet.
    const q1 = query.trim().toLowerCase();
    const hits = /^[A-Za-z]+$/.test(query.trim()) ? window.kdFields.filter(f => /[a-z][A-Z]/.test(f.name) && f.name === query.trim()) : [];
    hits.slice(0, 3).forEach((f, j) => {
      results.push({
        id: `f_${j}`,
        route: `${f.route}#${f.id}`,
        prefix: j === 0 ? f.crumb : undefined,
        children: { title: `${f.type}.${f.name}`, content: f.desc },
      });
    });
    ranked.forEach((p, i) => {
      p.items.sort((a, b) => b.sc - a.sc || a.s.order - b.s.order);
      p.items.filter((it, j) => j === 0 || it.sc >= p.best * 0.5).slice(0, 4).forEach((it, j) => {
        results.push({
          id: `${i}_${j}`,
          route: it.s.url,
          prefix: j === 0 ? p.crumb : undefined,
          children: { title: it.s.title, content: it.s.display },
        });
      });
    });
    displayResults(results, terms, resultsElement);
  }

  /**
   * Displays the search results on the page.
   */
  function displayResults(results, query, resultsElement) {
    if (!resultsElement) return;

    if (!results.length) {
      // A typo is not a dead end: say where to go next (R6-IA-5).
      resultsElement.innerHTML = `<span class="hextra-search-no-result">{{ $noResultsFound | safeHTML }}<span class="hextra-search-no-result-next">Try <a href="/docs/operate/troubleshooting/">Troubleshoot</a> or the <a href="/docs/">docs home</a>.</span></span>`;
      resultsElement.dataset.count = 0;
      return;
    }

    // Highlight the query words (stems and synonyms) in plain text, then escape.
    const esc = (x) => ('' + x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const qTerms = query;
    const TOKEN = /roll(?:s|ed|ing)?[\s-]?back(?:s)?|[0-9A-Za-zÀ-ſ]+/gi;
    function highlightMatches(text) {
      text = '' + text;
      let out = '', last = 0, m;
      TOKEN.lastIndex = 0;
      while ((m = TOKEN.exec(text))) {
        const raw = m[0];
        const w = /^roll(?:s|ed|ing)?[\s-]?back/i.test(raw) ? 'rollback' : stem(raw.toLowerCase());
        if (qTerms.some(t => hit([w], t) > 0)) {
          out += esc(text.slice(last, m.index)) + '<span class="hextra-search-match">' + esc(raw) + '</span>';
          last = m.index + raw.length;
        }
      }
      return out + esc(text.slice(last));
    }

    // Create a DOM element from the HTML string.
    function createElement(str) {
      const div = document.createElement('div');
      div.innerHTML = str.trim();
      return div.firstChild;
    }

    function handleMouseMove(e) {
      const target = e.target.closest('a');
      if (target) {
        const active = resultsElement.querySelector('a.hextra-search-active');
        if (active) {
          active.classList.remove('hextra-search-active');
        }
        target.classList.add('hextra-search-active');
      }
    }

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.prefix) {
        fragment.appendChild(createElement(`
          <div class="hextra-search-prefix">${esc(result.prefix)}</div>`));
      }
        let li = createElement(`
        <li>
          <a data-index="${i}" href="${result.route}" class=${i === 0 ? "hextra-search-active" : ""}>
            <div class="hextra-search-title">`+ highlightMatches(result.children.title) + `</div>` +
        (result.children.content ?
            `<div class="hextra-search-excerpt">` + highlightMatches(result.children.content) + `</div>` : '') + `
          </a>
        </li>`);
      li.addEventListener('mousemove', handleMouseMove);
      li.addEventListener('keydown', handleKeyDown);
      li.querySelector('a').addEventListener('click', finishSearch);
      fragment.appendChild(li);
    }
    resultsElement.appendChild(fragment);
    resultsElement.dataset.count = results.length;
  }
})();
