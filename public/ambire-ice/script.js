(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const NS = 'http://www.w3.org/2000/svg';
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  $$('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });

  /* count-up: final values are in the HTML, animation only runs when seen */
  function countUp(el, dur = 1300) {
    const target = +el.dataset.count;
    if (reduce || !target) return;
    const t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* hero */
  const stamp = $('#stamp');
  if (!reduce) {
    stamp.style.visibility = 'hidden';
    setTimeout(() => countUp($('.hero .count'), 1600), 200);
    setTimeout(() => { stamp.style.visibility = ''; stamp.classList.add('pop'); }, 1900);
  }

  /* on-view triggers */
  const below = el => el.getBoundingClientRect().top > window.innerHeight * 0.9;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.remove('pre');
      $$('.pre', el).forEach(x => x.classList.remove('pre'));
      $$('[data-count]', el).forEach(c => { if (!c.dataset.done) { c.dataset.done = 1; countUp(c); } });
      if (el.id === 'split') hintSplit();
      if (el._draw) el._draw();
      io.unobserve(el);
    });
  }, { threshold: 0.25 });
  if (!reduce) {
    $$('.reveal').forEach(el => { if (below(el)) el.classList.add('pre'); io.observe(el); });
    $$('.funnel i').forEach(i => { if (below(i)) i.classList.add('pre'); });
    $$('.list, .tiles, .combined, .retention, #split').forEach(el => io.observe(el));
  }

  $$('.funnel').forEach(f => {
    const max = +f.dataset.max;
    $$('i', f).forEach(i => { i.style.width = Math.max(0.6, (+i.dataset.v / max) * 100) + '%'; });
  });

  /* progress, active chapter, timeline */
  const prog = $('#progress'), now = $('#now');
  const chapters = $$('.chapter'), links = $$('.rail a');
  const meter = $('#meter'), meterBar = $('#meterBar'), meterCount = $('#meterCount');
  const tlWrap = $('.tl-wrap'), tlFill = $('.tl-wrap .fill'), tlItems = $$('#timeline li');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    prog.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    const mid = window.innerHeight * 0.4;
    let active = null;
    chapters.forEach(c => { if (c.getBoundingClientRect().top < mid) active = c; });
    links.forEach(a => a.classList.toggle('is-active', !!active && a.getAttribute('href') === '#' + active.id));
    now.textContent = active ? active.dataset.label : 'Case study';
    const r = tlWrap.getBoundingClientRect(), center = window.innerHeight * 0.6;
    tlFill.style.height = Math.max(0, Math.min(r.height - 16, center - r.top)) + 'px';
    tlItems.forEach(li => li.classList.toggle('is-past', li.getBoundingClientRect().top + 10 < center));
    // horizontal bar fills as the meter scrolls from the bottom of the screen towards the middle
    const m = meter.getBoundingClientRect(), vh = window.innerHeight;
    const p = reduce ? 1 : Math.max(0, Math.min(1, (vh - m.top) / (vh * 0.45)));
    meterBar.style.transform = `scaleX(${p})`;
    const n = Math.round(p * 200);
    meterCount.textContent = n >= 200 ? '200 / 200 · Sold out' : `${n} / 200`;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* board explorer */
  const hots = $$('.hot'), parts = $$('#parts li');
  function setPart(i) {
    parts.forEach((li, k) => { li.classList.toggle('is-on', k === i); $('button', li).setAttribute('aria-expanded', k === i); });
    hots.forEach((h, k) => h.classList.toggle('is-on', k === i));
  }
  hots.forEach((h, k) => { h.addEventListener('click', () => setPart(k)); h.addEventListener('mouseenter', () => setPart(k)); });
  parts.forEach((li, k) => { $('button', li).addEventListener('click', () => setPart(k)); li.addEventListener('mouseenter', () => setPart(k)); });
  setPart(0);

  /* fire / ice split */
  const split = $('#split'), handle = $('#splitHandle');
  let pos = 50, dragging = false, hinted = false;
  function setX(v) { pos = Math.max(4, Math.min(96, v)); split.style.setProperty('--x', pos + '%'); handle.setAttribute('aria-valuenow', Math.round(pos)); }
  function fromEvent(e) { const r = split.getBoundingClientRect(); setX(((e.clientX - r.left) / r.width) * 100); }
  split.addEventListener('pointerdown', e => { dragging = true; hinted = true; split.setPointerCapture(e.pointerId); fromEvent(e); });
  split.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
  split.addEventListener('pointerup', () => { dragging = false; });
  split.addEventListener('pointercancel', () => { dragging = false; });
  handle.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { setX(pos - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setX(pos + 5); e.preventDefault(); }
  });
  function hintSplit() {
    if (hinted || reduce) return; hinted = true;
    const keys = [50, 32, 68, 50], seg = 600, t0 = performance.now();
    const step = t => {
      if (dragging) return;
      const k = Math.floor((t - t0) / seg);
      if (k >= keys.length - 1) { setX(50); return; }
      const p = ((t - t0) % seg) / seg, e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setX(keys[k] + (keys[k + 1] - keys[k]) * e); requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* hero device: click to cycle case colours */
  const dev = $('#heroDevice'), tap = $('#tap'), devImgs = $$('img', dev);
  let ci = 0;
  if (window.matchMedia('(hover: none)').matches) tap.textContent = 'Tap me to explore colours';
  dev.addEventListener('click', () => {
    devImgs[ci].classList.remove('is-on');
    ci = (ci + 1) % devImgs.length;
    const im = devImgs[ci];
    im.classList.add('is-on');
    tap.textContent = im.dataset.name;
    dev.setAttribute('aria-label', 'Change case colour. Current: ' + im.dataset.name);
    dev.classList.remove('squish'); void dev.offsetWidth; dev.classList.add('squish');
  });

  /* moodboard lightbox */
  const lb = $('#lightbox');
  function openLb(src, cap) { $('#lbImg').src = src; $('#lbImg').alt = cap; $('#lbCap').textContent = cap; if (lb.showModal) lb.showModal(); }
  $$('.mb-img').forEach(b => b.addEventListener('click', () => openLb(b.dataset.src, $('img', b).alt)));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  /* press filter */
  $$('[data-press]').forEach(c => c.addEventListener('click', () => {
    $$('[data-press]').forEach(x => x.setAttribute('aria-pressed', x === c));
    $('#wall').hidden = c.dataset.press === 'wire';
    $('#wireGroup').hidden = c.dataset.press === 'earned';
  }));

  /* replies carousel */
  const track = $('#rTrack'), cardsR = $$('.reply', track), dots = $('#rDots');
  cardsR.forEach((c, i) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Go to reply ' + (i + 1)); b.addEventListener('click', () => { go(i); stopAuto(); }); dots.appendChild(b); });
  const dotBtns = $$('button', dots);
  const step = () => cardsR[1] ? cardsR[1].offsetLeft - cardsR[0].offsetLeft : track.clientWidth;
  const perView = () => Math.max(1, Math.round(track.clientWidth / step()));
  const current = () => Math.round(track.scrollLeft / step());
  function go(i) { const max = cardsR.length - perView(); if (i > max) i = 0; if (i < 0) i = max; track.scrollTo({ left: i * step(), behavior: reduce ? 'auto' : 'smooth' }); }
  function syncDots() { const k = current(), max = cardsR.length - perView(); dotBtns.forEach((b, i) => { b.setAttribute('aria-current', i === k); b.hidden = i > max; }); }
  window.addEventListener('resize', syncDots);
  track.addEventListener('scroll', () => requestAnimationFrame(syncDots), { passive: true });
  $('#rNext').addEventListener('click', () => { go(current() + 1); stopAuto(); });
  $('#rPrev').addEventListener('click', () => { go(current() - 1); stopAuto(); });
  let rAuto = null, rStopped = false;
  function stopAuto() { rStopped = true; clearInterval(rAuto); }
  function startAuto() { if (reduce || rStopped || rAuto) return; rAuto = setInterval(() => go(current() + 1), 3500); }
  function pauseAuto() { clearInterval(rAuto); rAuto = null; }
  const rBox = $('#replies');
  rBox.addEventListener('mouseenter', pauseAuto); rBox.addEventListener('mouseleave', startAuto);
  rBox.addEventListener('focusin', pauseAuto);
  track.addEventListener('touchstart', stopAuto, { passive: true });
  new IntersectionObserver(([en]) => en.isIntersecting ? startAuto() : pauseAuto(), { threshold: .4 }).observe(rBox);
  syncDots();

  /* video shots */
  const BEATS = [
    [4, 'f6', 'Built for Safe'],
    [12, 'f13', 'Every Safe action decoded'],
    [16, 'f17', 'Unknown code blocked'],
    [20, 'f21', 'Airgap switch'],
    [24, 'f25', 'Post-quantum ready'],
    [32, 'f33', 'Two secure elements'],
    [40, 'f41', 'Battery pack'],
    [48, 'f49', 'Four colourways'],
    [52, 'f53', 'End card: first 200 at $119'],
  ];
  const video = $('#video-el'), beatsEl = $('#beats');
  BEATS.forEach(([t, img, title]) => {
    const li = document.createElement('li');
    li.innerHTML = `<button><img src="assets/video/${img}.jpg" width="600" height="600" alt="" loading="lazy"><span class="ts">0:${String(t).padStart(2, '0')}</span><span class="bt">${title}</span></button>`;
    $('button', li).addEventListener('click', () => { video.currentTime = t; video.play().catch(() => {}); });
    beatsEl.appendChild(li);
  });
  const beatLis = $$('li', beatsEl);
  video.addEventListener('timeupdate', () => {
    let k = -1; BEATS.forEach((b, i) => { if (video.currentTime >= b[0] - 0.3) k = i; });
    beatLis.forEach((li, i) => li.classList.toggle('is-on', i === k));
  });

  /* charts */
  function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function tipFor(box) { let t = $('.tip', box); if (!t) { t = document.createElement('div'); t.className = 'tip'; box.appendChild(t); } return t; }

  function barChart(box, data, opt) {
    const W = box.clientWidth; if (!W) return;
    const H = opt.height, pad = { t: 24, r: 4, b: 26, l: 40 };
    box.querySelector('svg')?.remove();
    const svg = el('svg', { class: 'chart', viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': opt.label });
    box.prepend(svg);
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b, y = v => pad.t + ih - (v / opt.max) * ih;
    opt.ticks.forEach(v => {
      el('line', { class: 'grid', x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v) }, svg);
      el('text', { x: pad.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, svg).textContent = opt.yFmt(v);
    });
    const slot = iw / data.length, bw = Math.min(opt.maxBar, slot * 0.6), tip = tipFor(box);
    data.forEach((d, i) => {
      const cx = pad.l + slot * i + slot / 2, h = Math.max(2, (d.v / opt.max) * ih), x = cx - bw / 2, top = pad.t + ih - h, r = Math.min(4, bw / 2, h);
      const p = el('path', { class: 'm', d: `M${x},${pad.t + ih} V${top + r} Q${x},${top} ${x + r},${top} H${x + bw - r} Q${x + bw},${top} ${x + bw},${top + r} V${pad.t + ih} Z` }, svg);
      p.style.fill = d.color;
      el('text', { x: cx, y: H - 7, 'text-anchor': 'middle' }, svg).textContent = d.k;
      if (d.label) el('text', { x: cx, y: top - 7, 'text-anchor': 'middle', class: 'lbl-strong' }, svg).textContent = d.label;
      const hit = el('rect', { x: pad.l + slot * i, y: pad.t, width: slot, height: ih, fill: 'transparent' }, svg);
      const show = () => { tip.innerHTML = d.tip; tip.style.left = cx + 'px'; tip.style.top = top + 'px'; tip.classList.add('show'); svg.querySelectorAll('.m').forEach(m => m.style.opacity = m === p ? 1 : .45); };
      const hide = () => { tip.classList.remove('show'); svg.querySelectorAll('.m').forEach(m => m.style.opacity = 1); };
      hit.addEventListener('mouseenter', show); hit.addEventListener('mouseleave', hide);
      hit.addEventListener('touchstart', show, { passive: true });
    });
  }

  function lineChart(box, data, opt) {
    const W = box.clientWidth; if (!W) return;
    const H = 230, pad = { t: 16, r: 10, b: 26, l: 42 };
    box.querySelector('svg')?.remove();
    const svg = el('svg', { class: 'chart', viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': opt.label });
    box.prepend(svg);
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const x = i => pad.l + (i / (data.length - 1)) * iw, y = v => pad.t + ih - (v / opt.max) * ih;
    opt.ticks.forEach(v => { el('line', { class: 'grid', x1: pad.l, x2: W - pad.r, y1: y(v), y2: y(v) }, svg); el('text', { x: pad.l - 8, y: y(v) + 4, 'text-anchor': 'end' }, svg).textContent = fmt(v); });
    const every = W < 520 ? 3 : 2;
    data.forEach((d, i) => { if (i % every === 0 || i === data.length - 1) el('text', { x: x(i), y: H - 7, 'text-anchor': i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle' }, svg).textContent = d.k; });
    const c = opt.color, pts = data.map((d, i) => `${x(i)},${y(d.v)}`).join(' L');
    const area = el('path', { d: `M${x(0)},${y(0)} L${pts} L${x(data.length - 1)},${y(0)} Z`, 'fill-opacity': .1 }, svg); area.style.fill = c;
    const line = el('path', { d: `M${pts}`, fill: 'none', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg); line.style.stroke = c;
    if (!reduce && !box.dataset.drawn) {
      const L = line.getTotalLength(); line.style.strokeDasharray = L; line.style.strokeDashoffset = L;
      box._draw = () => { box.dataset.drawn = 1; line.getBoundingClientRect(); line.style.transition = 'stroke-dashoffset 1.4s ease'; requestAnimationFrame(() => line.style.strokeDashoffset = 0); };
      if (below(box)) io.observe(box); else box._draw();
    }
    const d0 = el('circle', { cx: x(0), cy: y(data[0].v), r: 4.5, stroke: '#fff', 'stroke-width': 2 }, svg); d0.style.fill = c;
    el('text', { x: x(0) + 10, y: y(data[0].v) + 4, class: 'lbl-strong' }, svg).textContent = `≈${fmt(data[0].v)} in the first hour`;
    const cross = el('line', { y1: pad.t, y2: pad.t + ih, stroke: css('--muted'), 'stroke-dasharray': '3 3', opacity: 0 }, svg);
    const dot = el('circle', { r: 4.5, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg); dot.style.fill = c;
    const tip = tipFor(box), hit = el('rect', { x: pad.l, y: pad.t, width: iw, height: ih, fill: 'transparent' }, svg);
    const move = e => {
      const r = svg.getBoundingClientRect(), cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const i = Math.max(0, Math.min(data.length - 1, Math.round(((cx - pad.l) / iw) * (data.length - 1)))), d = data[i];
      cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', 1);
      dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(d.v)); dot.setAttribute('opacity', 1);
      tip.innerHTML = `${d.k} · ≈${fmt(d.v)} opens`; tip.style.left = x(i) + 'px'; tip.style.top = y(d.v) + 'px'; tip.classList.add('show');
    };
    hit.addEventListener('mousemove', move); hit.addEventListener('touchmove', move, { passive: true });
    hit.addEventListener('mouseleave', () => { tip.classList.remove('show'); cross.setAttribute('opacity', 0); dot.setAttribute('opacity', 0); });
  }

  function drawCharts() {
    const blue = css('--blue'), tint = css('--blue-tint');
    barChart($('#xChart'), [['Oct 27', 10500], ['Oct 28', 11500], ['Oct 29', 13000], ['Oct 30', 94724], ['Oct 31', 57000], ['Nov 1', 17500], ['Nov 2', 4500]].map(([k, v]) => ({
      k, v, color: k === 'Oct 30' ? blue : tint, label: k === 'Oct 30' ? '94,724' : null,
      tip: `${k} · ${k === 'Oct 30' ? '94,724' : '≈' + fmt(v)} impressions`
    })), { max: 100000, ticks: [0, 25000, 50000, 75000, 100000], yFmt: v => v ? v / 1000 + 'K' : '0', height: 260, maxBar: 56, label: 'Daily impressions for @ambire, Oct 27 to Nov 2. Launch day Oct 30: 94,724.' });

    barChart($('#retentionChart'), [['0:00', 100], ['0:13', 33], ['0:27', 15], ['0:41', 9], ['0:55', 6]].map(([k, v], i) => ({
      k, v, color: i === 0 ? blue : tint, label: (i ? '≈' : '') + v + '%', tip: `${k} · ${i ? '≈' : ''}${v}% still watching`
    })), { max: 100, ticks: [0, 50, 100], yFmt: v => v + '%', height: 200, maxBar: 60, label: 'Video retention: 100% at start, about 33% at 13 seconds, about 6% at the end.' });

    lineChart($('#emailChart'), ['Sent', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h'].map((k, i) => ({ k, v: [1270, 460, 200, 175, 220, 120, 120, 130, 95, 90, 80, 78, 75][i] })),
      { max: 1400, ticks: [0, 350, 700, 1050, 1400], color: css('--heat'), label: 'Web3 on Fire unique opens by hour, about 1,270 in the first hour, falling to about 75 by hour 12.' });
  }
  drawCharts();
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(drawCharts, 150); });
})();
