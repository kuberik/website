#!/usr/bin/env python3
"""Check internal links and anchors in a built Hugo public/ dir.

Usage: linkcheck.py <public> [--external] [--all] [--fail]
  --external  also GET every external URL and print non-200s
  --all       check every page, not only docs/ and blog/
  --fail      exit 1 when an internal link or anchor is broken
"""
import sys, os, re, html.parser, urllib.parse, urllib.request
root = os.path.abspath(sys.argv[1]); ext = '--external' in sys.argv
class P(html.parser.HTMLParser):
    def __init__(s): super().__init__(); s.links=[]; s.ids=set()
    def handle_starttag(s, t, a):
        a=dict(a)
        if 'id' in a: s.ids.add(a['id'])
        if t=='a' and a.get('name'): s.ids.add(a['name'])
        for k in ('href','src'):
            if a.get(k) and t in ('a','img','link','script','source','video'): s.links.append((t,a[k]))
pages={}
for d,_,fs in os.walk(root):
    for f in fs:
        if f.endswith('.html'):
            p=os.path.join(d,f); x=P()
            try: x.feed(open(p,encoding='utf-8',errors='ignore').read())
            except Exception: pass
            pages[p]=x
def resolve(src,url):
    u=urllib.parse.urlparse(url)
    path=u.path
    if not path: tgt=src
    else:
        if path.startswith('/'): tgt=os.path.join(root,path.lstrip('/'))
        else: tgt=os.path.normpath(os.path.join(os.path.dirname(src),path))
        if os.path.isdir(tgt) or path.endswith('/'): tgt=os.path.join(tgt,'index.html')
    return tgt,u.fragment
bad=[]; exts=set()
if not any(os.path.relpath(p,root).startswith('docs') for p in pages):
    print(f'BROKEN {root}: no docs/ pages found (missing or empty build output)'); sys.exit(1)
only_docs='--all' not in sys.argv
for p,x in pages.items():
    rel=os.path.relpath(p,root)
    if only_docs and not (rel.startswith('docs') or rel.startswith('blog')): continue
    for t,l in x.links:
        if l.startswith(('mailto:','javascript:','data:','tel:')): continue
        if re.match(r'https?://',l):
            if not re.search(r'(kuberik\.com|example\.org)', l):
                if t != 'link': exts.add(l)
                continue
            l=re.sub(r'https?://(www\.)?(kuberik\.com|example\.org)','',l) or '/'
        if l.startswith('//'): continue
        tgt,frag=resolve(p,urllib.parse.unquote(l))
        if not os.path.exists(tgt): bad.append((rel,l,'missing')); continue
        if frag and tgt.endswith('.html'):
            y=pages.get(tgt)
            if y is not None and frag not in y.ids: bad.append((rel,l,'no-anchor'))
for b in sorted(set(bad)): print('BROKEN',*b)
print(f'# {len(set(bad))} broken internal; {len(exts)} external')
if ext:
    for u in sorted(exts):
        try:
            r=urllib.request.Request(u,method='GET',headers={'User-Agent':'Mozilla/5.0 linkcheck'}); c=urllib.request.urlopen(r,timeout=15).status
        except urllib.error.HTTPError as e: c=e.code
        except Exception as e: c=type(e).__name__
        if c!=200: print('EXT',c,u)

if '--fail' in sys.argv and bad: sys.exit(1)
