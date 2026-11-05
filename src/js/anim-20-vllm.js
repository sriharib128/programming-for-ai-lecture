/* Guest lecture: animations for the vLLM half. Anything that plays by itself uses Deck.player, with render(t) a pure function of time. */
(function () {
  const U = Deck.util, H = (tag, cls, parent, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; parent && parent.appendChild(e); return e; };
  const once = (ctx, key, fn) => { if (!ctx.el[key]) { ctx.el[key] = 1; fn(); } };   // enter runs on every visit; build the DOM only once
  const done = (t, d) => t >= d ? 'finished' : '';

  /* ── a model produces one token at a time ── */
  Deck.on('vloop', {
    enter(ctx) {
      const P = ['The', ' capital', ' of', ' France', ' is'], G = [' Paris', ',', ' a', ' city', ' on', ' the', ' Se', 'ine', '.'];
      const box = ctx.q('#vl-toks');
      once(ctx, '__b', () => { P.forEach(x => H('b', 'p', box, x)); G.forEach(x => H('b', 'g off', box, x)); });
      const gs = [...box.querySelectorAll('.g')], TICK = 850, n = G.length;
      ctx.__pl = Deck.player(ctx, ctx.q('#vl-pl'), {
        dur: TICK * n + 500, mini: true, fmt: done,
        render: t => {
          const k = Math.min(n, Math.floor(t / TICK));
          gs.forEach((g, i) => { g.classList.toggle('off', i >= k); g.classList.toggle('cur', i === k - 1); });
          let s = 0; for (let j = 0; j < k; j++) s += P.length + j;
          ctx.q('#vl-n').textContent = k;
          ctx.q('#vl-l').textContent = k ? P.length + k - 1 : 0;
          ctx.q('#vl-s').textContent = s;
          ctx.qa('.l-a').forEach(l => l.classList.toggle('hl', t > 200 && t < TICK * n));
        },
      });
    },
  });

  /* ── KV cache: 45 computations against 10 ── */
  Deck.on('vcache', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const draw = (host, cached) => { for (let p = 0; p < 6; p++) {
          const r = H('div', 'r', host); H('small', '', r, 'Pass ' + (p + 1));
          for (let k = 0; k < 5 + p; k++) H('i', (!cached || k >= (p ? 4 + p : 0)) ? 'c' : 'r', r);
        } };
        draw(ctx.q('#vc-a'), false); draw(ctx.q('#vc-b'), true);
      });
    },
  });

  /* ── batching: fixed batches against a new decision on every pass ── */
  const L = [4, 9, 3, 6, 2, 7, 5, 3], NAMES = 'ABCDEFGH', SLOTS = 4;
  function simFixed() {
    const cells = []; let t0 = 0, fin = [];
    for (let i = 0; i < L.length; i += SLOTS) {
      const b = L.slice(i, i + SLOTS), m = Math.max(...b);
      b.forEach((l, s) => { for (let t = 0; t < m; t++) cells.push({ s, t: t0 + t, r: i + s, idle: t >= l, first: t === 0 }); fin.push(t0 + l); });
      t0 += m;
    }
    return { cells, T: t0, fin };
  }
  function simCont() {
    const cells = [], fin = [], left = [0, 0, 0, 0], who = [-1, -1, -1, -1]; let next = 0, t = 0;
    while (next < L.length || left.some(x => x > 0)) {
      for (let s = 0; s < SLOTS; s++) if (left[s] === 0 && next < L.length) { who[s] = next; left[s] = L[next]; cells.push({ s, t, r: next, idle: false, first: true }); next++; }
      else if (left[s] > 0) cells.push({ s, t, r: who[s], idle: false, first: false });
      else cells.push({ s, t, r: -1, idle: true });
      for (let s = 0; s < SLOTS; s++) if (left[s] > 0 && --left[s] === 0) fin.push(t + 1);
      t++;
    }
    return { cells, T: t, fin };
  }
  function batchPanel(host, title, sim, COLS) {
    host.innerHTML = '';
    const h = H('div', 'vb-h', host); H('h3', '', h, title); H('i', 'sp', h);
    const a = H('span', '', h, 'Finished '), af = H('b', '', a), b = H('span', '', h, 'Idle slots '), bi = H('b', 'bad', b), c = H('span', '', h, 'Passes '), cp = H('b', '', c);
    const g = H('div', 'vb-g', host), cw = 1628 / COLS, rh = 62;
    sim.cells.forEach(o => {
      const u = H('u', o.idle ? 'idle' : 'c' + (o.r % 4), g, !o.idle && o.first ? NAMES[o.r] : '');
      u.style.cssText = `left:${o.t * cw}px;top:${o.s * rh}px;width:${cw - 3}px;height:${rh - 4}px`;
      o.u = u;
    });
    const head = H('em', '', g);
    return tick => {
      let idle = 0; sim.cells.forEach(o => { const on = o.t < tick; o.u.style.opacity = on ? 1 : 0; if (on && o.idle) idle++; });
      const shown = Math.min(tick, sim.T);
      af.textContent = sim.fin.filter(f => f <= tick).length + ' / ' + L.length; bi.textContent = idle; cp.textContent = shown;
      head.style.left = (shown * cw - 2) + 'px'; head.style.opacity = tick > 0 && tick < sim.T ? 1 : 0;
    };
  }
  Deck.on('vbatch', {
    enter(ctx) {
      const s = simFixed(), c = simCont(), COLS = s.T;
      ctx.__ds = batchPanel(ctx.q('#vb-s'), 'One batch at a time', s, COLS);
      ctx.__dc = batchPanel(ctx.q('#vb-c'), 'Continuous batching', c, COLS);
      ctx.__T = COLS;
    },
    step(ctx, st, p) {
      const TICK = 480, render = t => { const k = Math.floor(t / TICK); ctx.__ds(k); ctx.__dc(k); };
      if (!ctx.__pl) ctx.__pl = Deck.player(ctx, ctx.q('#vb-pl'), { dur: TICK * ctx.__T + 300, mini: true, fmt: done, render });
      else if (st !== p) ctx.__pl.replay();
    },
  });

  Deck.on('vfixed', {
    enter(ctx) {
      const s = simFixed(), draw = batchPanel(ctx.q('#vb-f'), 'One batch at a time', s, s.T), TICK = 480;
      ctx.__pl && ctx.__pl.replay();
      if (!ctx.__pl) ctx.__pl = Deck.player(ctx, ctx.q('#vb-fl'), { dur: TICK * s.T + 300, mini: true, fmt: done, render: t => draw(Math.floor(t / TICK)) });
    },
  });

  /* ── reserved memory ── */
  Deck.on('vmem', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const bar = ctx.q('#vm-bar');
        for (let i = 0; i < 16; i++) H('i', i < 5 ? 'u' : 'r', bar);
        for (let i = 0; i < 16; i++) H('i', 'b ' + (i < 6 ? 'u' : 'r') + (i === 0 ? ' s' : ''), bar);
        for (let i = 0; i < 8; i++) H('i', 'f' + (i === 0 ? ' s' : ''), bar);
        const n = ctx.q('#vm-new'); for (let i = 0; i < 16; i++) H('i', '', n);
      });
    },
  });

  /* ── logical blocks onto physical blocks ── */
  Deck.on('vos', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const s = ctx.q('#vo-svg'), cell = (x, y, w, h, f, st) => U.svg('rect', { x, y, width: w, height: h, rx: 10, fill: f, stroke: st, 'stroke-width': 3 }, s);
        const txt = (x, y, t, o = {}) => { const e = U.svg('text', Object.assign({ x, y, 'font-family': 'IBM Plex Sans', 'font-size': 24, fill: '#42506B', 'text-anchor': 'middle' }, o), s); e.textContent = t; return e; };
        txt(0, 28, 'Request A sees one continuous range', { 'text-anchor': 'start', 'font-weight': 600, fill: '#0E1A3A' });
        [0, 1, 2].forEach(i => { cell(170 + i * 200, 46, 190, 66, '#FCE6CF', '#F28C28'); txt(265 + i * 200, 88, 'block ' + i, { fill: '#B85C0A', 'font-weight': 600 }); });
        txt(0, 244, 'Real GPU memory', { 'text-anchor': 'start', 'font-weight': 600, fill: '#0E1A3A' });
        const w = 950 / 10, own = { 2: 0, 7: 1, 4: 2 };
        for (let i = 0; i < 10; i++) { const m = i in own; cell(i * w + 2, 256, w - 8, 66, m ? '#F28C28' : '#fff', m ? '#F28C28' : '#DCE2EE'); txt(i * w + w / 2 - 2, 298, i, { fill: m ? '#fff' : '#6B7690', 'font-weight': 600 }); }
        Object.entries(own).forEach(([ph, lo]) => U.svg('path', { d: `M${265 + lo * 200} 112 C ${265 + lo * 200} 190, ${+ph * w + w / 2 - 2} 180, ${+ph * w + w / 2 - 2} 254`, fill: 'none', stroke: '#F28C28', 'stroke-width': 3 }, s));
      });
    },
  });

  /* ── allocate_slots ── */
  Deck.on('vslots', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const tk = ctx.q('#vz-tk'); for (let i = 0; i < 17; i++) H('i', i === 16 ? 'gap' : '', tk);
        const q = ctx.q('#vz-q'); for (let i = 0; i < 12; i++) H('b', '', q, i);
      });
    },
    step(ctx, s) {
      ctx.qa('#vz-q b').forEach((b, i) => {
        b.classList.toggle('a', s === 2 && i < 2);
        b.classList.toggle('x', s >= 3 && i < 10);
      });
    },
  });

  /* ── continuous batching on paged memory: simulated once, then replayed ── */
  const VR = [{ id: 'A', c: '#2A63C9', arr: 0, p: 6, g: 6 }, { id: 'B', c: '#F28C28', arr: 0, p: 9, g: 8 }, { id: 'C', c: '#0E7C61', arr: 0, p: 5, g: 3 }, { id: 'D', c: '#6B4BB8', arr: 4, p: 7, g: 6 }, { id: 'E', c: '#C93C3C', arr: 7, p: 6, g: 5 }];
  const BS = 4, NB = 12;
  function simPaged() {
    const free = [...Array(NB).keys()], blocks = Array(NB).fill(null), frames = [];
    const R = VR.map(r => Object.assign({}, r, { st: 'future', len: 0, made: 0, bl: [] }));
    const snap = s => frames.push({ s, free: free.length, blocks: blocks.map(b => b ? { o: b.o, n: b.n } : null), R: R.map(r => ({ st: r.st, len: r.len, made: r.made, g: r.g, bl: r.bl.slice() })) });
    const addTok = r => { if (r.len % BS === 0) { const b = free.shift(); r.bl.push(b); blocks[b] = { o: r.id, n: 0 }; } r.len++; blocks[r.bl[r.bl.length - 1]].n++; };
    snap(0);
    for (let s = 1; s < 60; s++) {
      R.forEach(r => { if (r.st === 'future' && s - 1 >= r.arr) r.st = 'waiting'; });
      R.filter(r => r.st === 'running').forEach(r => { if (free.length || r.len % BS) addTok(r), r.made++; });
      R.filter(r => r.st === 'waiting').forEach(r => { const need = Math.ceil(r.p / BS); if (free.length >= need) { for (let k = 0; k < r.p; k++) addTok(r); r.made = 1; r.st = 'running'; } });
      snap(s);
      R.filter(r => r.st === 'running' && r.made >= r.g).forEach(r => { r.st = 'finished'; r.bl.forEach(b => { blocks[b] = null; free.push(b); }); r.finAt = s; });
      if (R.every(r => r.st === 'finished')) { snap(s + 1); break; }
    }
    return frames;
  }
  Deck.on('vpaged', {
    enter(ctx) {
      const F = simPaged(), TICK = 800, rq = ctx.q('#vg-r'), gr = ctx.q('#vg-g');
      Deck.__pagedFrames = F;
      once(ctx, '__b', () => {
        VR.forEach(r => { const d = H('div', 'vg-q', rq); d.dataset.r = r.id; const b = H('b', '', d, r.id); b.style.background = r.c; const m = H('div', '', d); H('div', 't', m); H('div', 's', m); });
        for (let i = 0; i < NB; i++) { const b = H('div', 'vg-b', gr); const top = H('div', '', b); top.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start'; H('small', '', top, '#' + i); H('span', 'o', top); const ds = H('div', 'ds', b); for (let k = 0; k < BS; k++) H('i', '', ds); }
      });
      const rows = ctx.qa('.vg-q'), cells = ctx.qa('.vg-b');
      ctx.__pl = Deck.player(ctx, ctx.q('#vg-pl'), {
        dur: TICK * (F.length - 1) + 400, mini: true, fmt: done,
        render: t => {
          const f = F[Math.min(F.length - 1, Math.floor(t / TICK))];
          ctx.q('#vg-st').textContent = `pass ${f.s} · ${f.free} of ${NB} blocks free`;
          rows.forEach((d, i) => {
            const r = f.R[i], lab = { future: 'not arrived', waiting: 'waiting', running: 'running', finished: 'finished: blocks freed' }[r.st];
            d.className = 'vg-q' + (r.st === 'future' || r.st === 'waiting' ? ' w' : r.st === 'finished' ? ' d' : '');
            d.querySelector('.t').textContent = r.st === 'running' ? `running · ${r.made} of ${r.g} tokens` : lab;
            d.querySelector('.s').textContent = r.bl.length && r.st !== 'finished' ? 'blocks [' + r.bl.join(', ') + ']' : '';
          });
          cells.forEach((c, i) => {
            const b = f.blocks[i], r = b && VR.find(x => x.id === b.o);
            c.style.borderColor = r ? r.c : ''; c.style.background = r ? r.c + '14' : '';
            const o = c.querySelector('.o'); o.textContent = r ? r.id : ''; o.style.color = r ? r.c : '';
            c.querySelectorAll('.ds i').forEach((dot, k) => dot.style.background = b && k < b.n ? r.c : '');
          });
        },
      });
    },
  });

  /* ── the flat batch ── */
  Deck.on('vflat', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const rect = ctx.q('#vf-rect'), row = (n, cl, nt) => { H('span', '', rect, n); for (let i = 0; i < 5; i++) H('i', i < nt ? cl : 'pad', rect, i < nt ? n.toLowerCase() : 'PAD'); };
        row('A', 'a-c', 5); row('B', 'b-c', 1); row('C', 'c-c', 1);
        const R = ctx.q('#vf-rows'), ids = ['a', 'a', 'a', 'a', 'a', 'b', 'c'], cls = ['a-c', 'a-c', 'a-c', 'a-c', 'a-c', 'b-c', 'c-c'];
        H('span', '', R, 'input_ids'); ids.forEach((x, i) => H('div', 'vf-cell ' + cls[i], R, x));
        H('span', '', R, 'positions'); [0, 1, 2, 3, 4, 9, 4].forEach(x => H('div', 'vf-cell pl', R, x));
        const sl = H('span', 'sml', R, 'slot_mapping'); sl.setAttribute('data-s', 2);
        [12, 13, 14, 15, 28, 37, 24].forEach(x => { const c = H('div', 'vf-cell sm', R, x); c.setAttribute('data-s', 2); });
        const el = ctx.el; el.classList.add('instant'); [...el.querySelectorAll('[data-s]')].forEach(e => e.classList.toggle('on', +el.dataset.st >= +e.dataset.s)); void el.offsetWidth; el.classList.remove('instant');
      });
    },
  });

  /* ── guided decoding: a state machine masks the logits ── */
  const VOC = ['P', 'N', 'o', 'e', 's', 'g', 'i', 't'], LG = [52, 74, 36, 62, 44, 28, 58, 40], LG2 = [34, 26, 82, 48, 30, 38, 22, 44], LG3 = [20, 42, 30, 66, 88, 28, 50, 36];
  const GS = [{ allow: ['P', 'N'], lg: LG, pick: 'P', say: 'At the start only <b>P</b> or <b>N</b> can begin a valid answer. Every other logit becomes −∞.' }, { allow: ['o'], lg: LG2, pick: 'o', say: 'After <b>P</b>, the machine moves. Only <b>o</b> is allowed, whatever the model prefers.' }, { allow: ['s'], lg: LG3, pick: 's', say: 'After <b>Po</b>, only <b>s</b>. This continues until the word is complete. The output is always valid.' }];
  Deck.on('vguided', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const s = ctx.q('#vj-fsm');
        const node = (x, y, t, k) => { const g = U.svg('g', { class: 'jn', 'data-k': k }, s); U.svg('circle', { cx: x, cy: y, r: 30, fill: '#fff', stroke: '#9DB3DC', 'stroke-width': 3 }, g); const e = U.svg('text', { x, y: y + 9, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono', 'font-size': 26, 'font-weight': 600, fill: '#0E1A3A' }, g); e.textContent = t; };
        const edge = (x1, y1, x2, y2) => U.svg('line', { x1, y1, x2, y2, stroke: '#C9D3E6', 'stroke-width': 3 }, s);
        edge(70, 200, 180, 100); edge(70, 200, 180, 300);
        [[210, 100], [320, 100], [430, 100]].forEach((p, i, a) => { if (a[i + 1]) edge(p[0], p[1], a[i + 1][0], a[i + 1][1]); });
        edge(430, 100, 520, 100); edge(210, 300, 320, 300); edge(320, 300, 430, 300); edge(430, 300, 520, 300);
        node(50, 200, '•', 's'); node(210, 100, 'P', 'P'); node(320, 100, 'o', 'o'); node(430, 100, 's', 's'); node(210, 300, 'N', 'N'); node(320, 300, 'e', 'e'); node(430, 300, 'g', 'g');
        [[550, 100, '… Positive'], [550, 300, '… Negative']].forEach(([x, y, t]) => { const e = U.svg('text', { x: x - 20, y: y + 8, 'font-family': 'IBM Plex Mono', 'font-size': 22, fill: '#6B7690' }, s); e.textContent = t; });
        const b = ctx.q('#vj-bars'); VOC.forEach(v => { const d = H('div', '', b); H('em', '', d); H('i', '', d); H('b', '', d, v); });
      });
    },
    step(ctx, st) {
      const G = GS[st], path = ['s', 'P', 'o', 's'].slice(0, st + 1);
      ctx.qa('#vj-bars>div').forEach((d, i) => {
        const v = VOC[i], ok = G.allow.includes(v);
        d.className = (ok ? '' : 'jx') + (v === G.pick ? ' jp' : '');
        d.querySelector('i').style.height = G.lg[i] * 2.1 + 'px';
        d.querySelector('em').textContent = ok ? '' : '−∞';
      });
      ctx.q('#vj-bits').textContent = VOC.map(v => G.allow.includes(v) ? 1 : 0).join('');
      ctx.q('#vj-say').innerHTML = G.say;
      ctx.qa('#vj-fsm .jn').forEach((g, i) => {
        const k = g.dataset.k, row = g.querySelector('circle').getAttribute('cy') === '100';
        const now = (k === 's' && +g.querySelector('circle').getAttribute('cx') === 50 && st === 0) || (st >= 1 && row && ['P', 'o', 's'].indexOf(k) === st - 1);
        const next = row ? ['P', 'o', 's'].indexOf(k) === st : (st === 0 && k === 'N');
        const c = g.querySelector('circle'); c.setAttribute('fill', now ? '#0E1A3A' : next ? '#FCE6CF' : '#fff'); c.setAttribute('stroke', now ? '#0E1A3A' : next ? '#F28C28' : '#9DB3DC');
        g.querySelector('text').setAttribute('fill', now ? '#fff' : '#0E1A3A');
      });
    },
  });

  /* ── three kinds of parallelism: small drawings ── */
  Deck.on('vpar', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const LC = ['#2A63C9', '#6B4BB8', '#0E7C61', '#F28C28'];
        const box = (s, x, y, w, h, label, dash) => { U.svg('rect', { x, y, width: w, height: h, rx: 12, fill: '#fff', stroke: '#9DB3DC', 'stroke-width': 2.5, 'stroke-dasharray': dash ? '7 6' : '' }, s); if (label) { const e = U.svg('text', { x: x + w / 2, y: y + 22, 'text-anchor': 'middle', 'font-family': 'IBM Plex Sans', 'font-size': 18, 'font-weight': 600, fill: '#5B6785' }, s); e.textContent = label; } };
        const seg = (s, x, y, w, h, c) => U.svg('rect', { x, y, width: w, height: h, rx: 3, fill: c }, s);
        const nodeLabel = (s, x, y, t) => { const e = U.svg('text', { x, y, 'font-family': 'IBM Plex Sans', 'font-size': 20, 'font-weight': 600, fill: '#0E1A3A' }, s); e.textContent = t; };
        const tp = ctx.q('#vy-tp'); box(tp, 2, 2, 496, 262, '', true); nodeLabel(tp, 16, 30, 'One node');
        for (let g = 0; g < 4; g++) { const x = 16 + g * 119; box(tp, x, 44, 110, 206, 'GPU ' + g); LC.forEach((c, l) => seg(tp, x + 14, 78 + l * 40, 82, 32, c)); }
        const pp = ctx.q('#vy-pp');
        [0, 1].forEach(n => { const X = 2 + n * 252; box(pp, X, 2, 244, 262, '', true); nodeLabel(pp, X + 14, 30, 'Node ' + n); [0, 1].forEach(g => { const x = X + 12 + g * 112; box(pp, x, 44, 104, 206, 'GPU ' + (n * 2 + g)); const ls = n === 0 ? [0, 1] : [2, 3]; ls.forEach((l, i) => seg(pp, x + 12, 88 + i * 66, 80, 54, LC[l])); }); });
        const dp = ctx.q('#vy-dp');
        [0, 1, 2].forEach(r => { const x = 4 + r * 166; box(dp, x, 2, 158, 262, 'Replica ' + r); LC.forEach((c, l) => seg(dp, x + 18, 44 + l * 52, 122, 44, c)); });
      });
    },
  });

  /* ── one process per GPU ── */
  Deck.on('vmp', {
    enter(ctx) {
      once(ctx, '__b', () => { const w = ctx.q('#vn-w'); for (let i = 0; i < 8; i++) { const g = H('div', 'vn-g' + (i === 0 ? ' out' : ''), w); H('b', '', g, 'Process'); H('span', '', g, 'GPU ' + i + (i === 0 ? ' · output' : '')); } });
    },
  });

  /* ── two nodes ── */
  Deck.on('vserve', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const eng = (host, r, g0) => { const e = H('div', 'vv-g', host); H('small', '', e, 'Engine core · DP rank ' + r); const d = H('div', '', e); for (let k = 0; k < 4; k++) H('i', '', d, 'GPU ' + (g0 + k)); };
        eng(ctx.q('#vv-1'), 0, 0); eng(ctx.q('#vv-1'), 1, 4); eng(ctx.q('#vv-2'), 2, 0); eng(ctx.q('#vv-2'), 3, 4);
      });
    },
  });

  /* ── one curl: eight hops, one per step ── */
  const HOPS = [
    { n: 'curl', y: 'your terminal', h: 'You send one HTTP request', p: 'A POST to <code>/v1/completions</code> with the prompt and the sampling settings.' },
    { n: 'FastAPI', y: 'API server', h: 'The route receives it', p: '<code>create_completion</code> runs on the event loop, served by Uvicorn.' },
    { n: 'AsyncLLM', y: 'API server', h: 'Tokenize and prepare', p: 'Tokens, request ID, sampling settings and a timestamp go into one request object.' },
    { n: 'Load balancer', y: 'API server', h: 'Pick an engine', p: 'The lowest <code>waiting * 4 + running</code> wins. The request goes to that engine\'s input socket.' },
    { n: 'Input thread', y: 'engine core', h: 'The engine receives it', p: 'The thread unblocks, decodes the message and puts it on <code>input_queue</code>.' },
    { n: 'Main thread', y: 'engine core', h: 'The engine loop runs', p: 'It adds the request and calls <code>engine_core.step()</code> until a stop condition: schedule, forward pass, postprocess.' },
    { n: 'Output thread', y: 'engine core', h: 'Results go back', p: 'It takes results from <code>output_queue</code> and sends them through the output socket.' },
    { n: 'FastAPI', y: 'API server', h: 'You get your answer', p: 'Two asyncio tasks pass tokens to the route, which adds metadata and returns JSON to your terminal.' },
  ];
  Deck.on('vcurl', {
    enter(ctx) {
      once(ctx, '__b', () => {
        const s = U.svg('svg', { viewBox: '0 0 1680 360' }, ctx.q('#vx-rt'));
        const W = 360, Hh = 110, pos = [[0, 20], [440, 20], [880, 20], [1320, 20], [1320, 220], [880, 220], [440, 220], [0, 220]];
        ctx.el.__edges = [];
        for (let i = 0; i < 7; i++) {
          const [a, b] = [pos[i], pos[i + 1]];
          const d = a[1] === b[1] ? (b[0] > a[0] ? `M${a[0] + W} ${a[1] + Hh / 2} H${b[0]}` : `M${a[0]} ${a[1] + Hh / 2} H${b[0] + W}`) : `M${a[0] + W / 2} ${a[1] + Hh} V${b[1]}`;
          ctx.el.__edges.push(U.svg('path', { d, class: 'vx-e' }, s));
        }
        ctx.el.__nodes = HOPS.map((h, i) => {
          const g = U.svg('g', { class: 'vx-n' }, s), [x, y] = pos[i];
          U.svg('rect', { x, y, width: W, height: Hh, rx: 14 }, g);
          const t = U.svg('text', { x: x + W / 2, y: y + 48, 'text-anchor': 'middle' }, g); t.textContent = h.n;
          const u = U.svg('text', { x: x + W / 2, y: y + 80, 'text-anchor': 'middle', class: 'ty' }, g); u.textContent = h.y;
          return g;
        });
      });
    },
    step(ctx, st) {
      ctx.el.__nodes.forEach((g, i) => { g.setAttribute('class', 'vx-n' + (i === st ? ' cur' : i < st ? ' done' : '')); });
      ctx.el.__edges.forEach((e, i) => e.setAttribute('class', 'vx-e' + (i < st ? ' done' : '')));
      const h = HOPS[st]; ctx.q('#vx-d').innerHTML = `<i>${st + 1}</i><div><h3>${h.h}</h3><p>${h.p}</p></div>`;
    },
  });

  /* ── roofline: one sweep over batch size, shown on two charts with one axis each ── */
  const BSAT = 32, BMAX = 100;
  const lat = b => Math.max(1, b / BSAT), thr = b => Math.min(b, BSAT);
  function roofChart(sel, f, ymax, ylab) {
    const s = sel, X0 = 70, X1 = 730, Y0 = 380, Y1 = 30;
    const x = b => X0 + (b - 1) / (BMAX - 1) * (X1 - X0), y = v => Y0 - v / ymax * (Y0 - Y1);
    for (let k = 1; k <= 3; k++) U.svg('line', { x1: X0, x2: X1, y1: Y0 - k * (Y0 - Y1) / 3, y2: Y0 - k * (Y0 - Y1) / 3, stroke: '#E3E8F1', 'stroke-width': 1.5 }, s);
    U.svg('line', { x1: X0, x2: X1, y1: Y0, y2: Y0, stroke: '#9DB3DC', 'stroke-width': 2 }, s);
    U.svg('line', { x1: x(BSAT), x2: x(BSAT), y1: Y1, y2: Y0, stroke: '#9DB3DC', 'stroke-width': 2, 'stroke-dasharray': '6 6' }, s);
    const lab = (X, Y, t, o) => { const e = U.svg('text', Object.assign({ x: X, y: Y, 'font-family': 'IBM Plex Sans', 'font-size': 22, fill: '#5B6785' }, o), s); e.textContent = t; return e; };
    lab(x(BSAT), Y1 - 6, 'saturation point', { 'text-anchor': 'middle', 'font-weight': 600 });
    lab((X0 + X1) / 2, Y0 + 58, 'Batch size →', { 'text-anchor': 'middle' });
    lab(X0 - 14, Y0 + 6, 'low', { 'text-anchor': 'end' }); lab(X0 - 14, Y1 + 18, 'high', { 'text-anchor': 'end' });
    lab(x(BSAT) / 2 + X0 / 2, Y0 + 26, 'limited by memory', { 'text-anchor': 'middle', 'font-size': 20 }); lab((x(BSAT) + X1) / 2, Y0 + 26, 'limited by compute', { 'text-anchor': 'middle', 'font-size': 20 });
    let d = ''; for (let b = 1; b <= BMAX; b++) d += (b === 1 ? 'M' : 'L') + x(b).toFixed(1) + ' ' + y(f(b)).toFixed(1) + ' ';
    U.svg('path', { d, fill: 'none', stroke: '#2A63C9', 'stroke-width': 3, 'stroke-linejoin': 'round' }, s);
    const v = U.svg('line', { y1: Y1, y2: Y0, stroke: '#0E1A3A', 'stroke-width': 1.5, opacity: .35 }, s);
    const m = U.svg('circle', { r: 11, fill: '#F28C28', stroke: '#fff', 'stroke-width': 3 }, s);
    return b => { const X = x(b), Y = y(f(b)); m.setAttribute('cx', X); m.setAttribute('cy', Y); v.setAttribute('x1', X); v.setAttribute('x2', X); };
  }
  Deck.on('vroof', {
    enter(ctx) {
      const a = ctx.q('#vr-a'), b = ctx.q('#vr-b'); a.innerHTML = ''; b.innerHTML = '';
      const ra = roofChart(a, lat, BMAX / BSAT * 1.1), rb = roofChart(b, thr, BSAT * 1.3);
      ctx.__pl = Deck.player(ctx, ctx.q('#vr-pl'), {
        dur: 7000, mini: true, label: 'Batch size', fmt: t => 'B = ' + Math.round(1 + t / 7000 * (BMAX - 1)),
        render: t => { const B = 1 + t / 7000 * (BMAX - 1); ra(B); rb(B); },
      });
    },
  });
})();
