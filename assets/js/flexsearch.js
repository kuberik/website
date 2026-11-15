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

  // Get the search wrapper, input, and results elements.
  function getActiveSearchElement() {
    const inputs = Array.from(document.querySelectorAll('.hextra-search-wrapper')).filter(el => el.clientHeight > 0);
    if (inputs.length === 1) {
      return {
        wrapper: inputs[0],
        inputElement: inputs[0].querySelector('.hextra-search-input'),
        resultsElement: inputs[0].querySelector('.hextra-search-results')
      };
    }
    return undefined;
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
    const { inputElement, resultsElement } = getActiveSearchElement();
    if (!inputElement || !resultsElement) return;
    if (
      e.target !== inputElement &&
      e.target !== resultsElement &&
      !resultsElement.contains(e.target)
    ) {
      setShortcutElementsOpacity(100);
      hideSearchResults();
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
    const { inputElement } = getActiveSearchElement();
    if (!inputElement) return;
    hideSearchResults();
    inputElement.value = '';
    inputElement.blur();
  }

  function hideSearchResults() {
    const { resultsElement } = getActiveSearchElement();
    if (!resultsElement) return;
    resultsElement.classList.add('hx:hidden');
  }

  // Handle keyboard events.
  function handleKeyDown(e) {
    const { inputElement } = getActiveSearchElement();
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
        hideSearchResults();
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

  // kuberik: our own ranking instead of FlexSearch's (R5-IA-1..4).
  // Why: FlexSearch scored every paragraph alike, so a blog post, an
  // API-reference type description or a body sentence beat the page the
  // reader meant. Here a title match beats a body match, a page title beats
  // a section title, generated reference pages carry no body weight, and on
  // /docs/ pages the blog is out of scope.
  const WORD = /[0-9a-zÀ-ſ]+/g;
  // Operators write "rollback", "roll back" and "rolled back" for one thing.
  function norm(s) {
    return ('' + s).toLowerCase().replace(/\broll(?:s|ed|ing)?[\s-]?back(?:s)?\b/g, 'rollback');
  }
  function words(s) { return norm(s).match(WORD) || []; }
  // Words an operator uses for the same task. Each group is symmetric.
  // One-way: a query word expands to the words an operator may mean by it.
  // A synonym hit scores below a literal one (see hit()).
  const SYN = {
    unblock: ['unblock', 'unblocked', 'blocked', 'blocks', 'blocking', 'resume'],
    blocked: ['blocked', 'blocks', 'blocking', 'unblock'],
    approve: ['approve', 'approval', 'approvals', 'approved', 'approving', 'approver', 'approvers'],
    approval: ['approval', 'approvals', 'approve', 'approved', 'approver', 'approvers'],
    install: ['install', 'installing', 'installation', 'installed'],
    upgrade: ['upgrade', 'upgrading', 'upgraded'],
    stuck: ['stuck', 'stalled', 'hung'],
    pin: ['pin', 'pinned', 'pinning'],
  };
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
  const strip = (x) => ('' + x).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  function count(hay, needle) {
    let n = 0, i = -1;
    while (n < 10 && (i = hay.indexOf(needle, i + 1)) !== -1) n++;
    return n;
  }

  async function preloadIndex() {
    const resp = await fetch(searchDataURL);
    const data = await resp.json();
    const sections = [];
    const crumbs = {};
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
      crumbs[route] = crumb;
      const pageTitle = strip(data[route].title);
      const generated = route.startsWith('/docs/reference/');
      let order = 0;
      for (const heading in data[route].data) {
        const [hash, text] = heading.split('#');
        // Closing link-card sections (Related, Next steps) are navigation, not answers.
        if (hash === 'related' || hash === 'next-steps') continue;
        const url = route.trimEnd('/') + (hash ? '#' + hash : '');
        const title = strip(text || pageTitle);
        const content = data[route].data[heading] || '';
        const paragraphs = content.split('\n').filter(Boolean);
        sections.push({
          route, url, title, crumb, pageTitle,
          isPage: !hash,
          order: order++,
          generated,
          display: strip(paragraphs[0] || ''),
          tw: words(title),
          pw: words(pageTitle),
          cw: words(crumb),
          bw: new Set(words(content)),
          body: norm(content),
        });
      }
    }
    window.kdSections = sections;
    // The search box may have been used while the index loaded.
    const { inputElement } = getActiveSearchElement() || {};
    if (inputElement && inputElement.value) inputElement.dispatchEvent(new Event('keyup'));
  }

  function scoreSection(s, terms, phrase, ident) {
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
    if (gen) score *= 0.5;
    return score;
  }

  function search(e) {
    const query = e.target.value;
    if (!query) {
      hideSearchResults();
      return;
    }

    const { resultsElement } = getActiveSearchElement();
    while (resultsElement.firstChild) {
      resultsElement.removeChild(resultsElement.firstChild);
    }
    resultsElement.classList.remove('hx:hidden');
    if (!window.kdSections) return;

    const terms = words(query);
    const phrase = terms.join(' ');
    const ident = /[a-z][A-Z]/.test(query);
    if (!terms.length) { displayResults([], query); return; }
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
      const sc = scoreSection(s, terms, phrase, ident) * w;
      if (sc <= 0) continue;
      let p = pages.get(s.route);
      if (!p) pages.set(s.route, p = { best: 0, items: [], crumb: s.crumb, order: pages.size });
      p.items.push({ s, sc });
      p.best = Math.max(p.best, sc);
    }
    const ranked = [...pages.values()].sort((a, b) => b.best - a.best || a.order - b.order).slice(0, 12);
    const results = [];
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
    displayResults(results, query);
  }

  /**
   * Displays the search results on the page.
   *
   * @param {Array} results - The array of search results.
   * @param {string} query - The search query.
   */
  function displayResults(results, query) {
    const { resultsElement } = getActiveSearchElement();
    if (!resultsElement) return;

    if (!results.length) {
      resultsElement.innerHTML = `<span class="hextra-search-no-result">{{ $noResultsFound | safeHTML }}</span>`;
      return;
    }

    // Highlight the query words (and their synonyms) in plain text, then escape.
    const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const alts = [];
    for (const t of words(query)) {
      for (const v of variants(t)) {
        const e = v.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
        alts.push(v === 'rollback' ? 'roll(?:s|ed|ing)?[\\s-]?back' : e);
      }
    }
    const hlRe = alts.length ? new RegExp('(?<![0-9a-z\\u00C0-\\u017F])(?:' + alts.join('|') + ')', 'gi') : null;
    function highlightMatches(text, query) {
      text = strip(text);
      if (!hlRe) return esc(text);
      let out = '', last = 0, m;
      hlRe.lastIndex = 0;
      while ((m = hlRe.exec(text))) {
        if (!m[0]) { hlRe.lastIndex++; continue; }
        out += esc(text.slice(last, m.index)) + '<span class="hextra-search-match">' + esc(m[0]) + '</span>';
        last = m.index + m[0].length;
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
            <div class="hextra-search-title">`+ highlightMatches(result.children.title, query) + `</div>` +
        (result.children.content ?
            `<div class="hextra-search-excerpt">` + highlightMatches(result.children.content, query) + `</div>` : '') + `
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
