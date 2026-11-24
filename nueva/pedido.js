/* Pedido Mangini: carrito compartido entre páginas (se guarda en el navegador),
   animación de "volar al pedido", barra "Ver pedido" y panel con sugerencias. */
(function () {
  const IMG = '/nueva/img/';
  const DESC_TRANSFERENCIA = 0.05;
  const VARIEDADES = {
    tradicional: { nombre: 'Tradicional', img: IMG + 'cut-tradicional.webp', precios: { 500: 21860, 1000: 42360 } },
    frutos: { nombre: 'Frutos secos', img: IMG + 'cut-frutos.webp', precios: { 500: 24890, 1000: 46845 } },
  };
  const peso = (s) => (s === 1000 ? '1 kg' : '500 g');

  // Todo lo que se puede sumar al pedido, por id
  const SKUS = {};
  Object.entries(VARIEDADES).forEach(([v, d]) => [500, 1000].forEach((s) => {
    SKUS[`${v}-${s}`] = { nombre: `${d.nombre} ${peso(s)}`, img: d.img, precio: d.precios[s] };
  }));
  SKUS['pack-mesa'] = { nombre: 'Pack Mesa Familiar', img: IMG + 'cut-tradicional.webp', precio: 132906, detalle: '2 Tradicional 1 kg, 1 Tradicional 500 g y 2 Frutos secos 500 g' };
  SKUS['pack-degustacion'] = { nombre: 'Pack Degustación', img: IMG + 'cut-frutos.webp', precio: 46750, detalle: 'Tradicional y Frutos secos de 500 g' };

  // Producto y variante de cada uno en Tiendanube (la etiqueta de GTM de la tienda arma el carrito con esto).
  // online:false = todavía no se puede comprar en la tienda (producto oculto); se bloquea el pago con aviso.
  const TIENDA = 'https://manginiconfiteria.mitiendanube.com/';
  const TN = {
    'tradicional-500': { p: 301465458, v: ['500 g'] },
    'tradicional-1000': { p: 301465458, v: ['1 kg'] },
    'frutos-500': { p: 303353732, v: ['500 g'] },
    'frutos-1000': { p: 303353732, v: ['1 kg'] },
    'pack-mesa': { p: 383018642, online: false },
    'pack-degustacion': { p: 383018784, online: false },
  };
  function linkDePago() {
    const lista = items.map((i) => {
      const t = TN[i.id];
      const it = { p: t.p, q: i.q };
      if (t.v) it.v = t.v;
      return it;
    });
    const json = JSON.stringify(lista);
    const b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${TIENDA}?mgc=${b64}`;
  }

  const KEY = 'mangini-pedido-v2';
  const fmt = (n) => '$' + n.toLocaleString('es-AR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { items = []; }
  items = (Array.isArray(items) ? items : [])
    .map((i) => ({ id: String(i && i.id), q: Math.min(99, Math.floor(Number(i && i.q))) }))
    .filter((i) => Object.prototype.hasOwnProperty.call(SKUS, i.id) && i.q > 0);
  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} };

  const total = () => items.reduce((t, i) => t + SKUS[i.id].precio * i.q, 0);
  const cantidad = () => items.reduce((t, i) => t + i.q, 0);

  // ---------- DOM ----------
  const root = document.createElement('div');
  root.innerHTML = `
    <div class="pd-scrim" data-pd-close></div>
    <aside class="pd-sheet" role="dialog" aria-modal="true" aria-labelledby="pd-title" tabindex="-1">
      <div class="pd-grip" aria-hidden="true"></div>
      <div class="pd-head"><h2 id="pd-title">Tu pedido</h2><button type="button" class="pd-x" data-pd-close aria-label="Cerrar">×</button></div>
      <div class="pd-body">
        <ul class="pd-items" data-pd-items></ul>
        <div class="pd-upsell" data-pd-upsell>
          <p class="pd-upsell-t">Sumale</p>
          <div class="pd-upsell-row" data-pd-sugs></div>
        </div>
      </div>
      <div class="pd-foot">
        <div class="pd-line"><span>Total</span><b data-pd-sub>$0</b></div>
        <div class="pd-line pd-tr"><span>Pagando por transferencia, 5% off</span><b data-pd-tr>$0</b></div>
        <div class="pd-line pd-muted"><span>Envío</span><span>Lo calculás con tu código postal al pagar</span></div>
        <p class="pd-nota" data-pd-nota hidden></p>
        <a class="btn btn-bordo btn-wide pd-pay" href="#" data-pd-pay>Ir a pagar</a>
        <p class="pd-pays">Pagás en la tienda segura de Mangini en Tiendanube. Mercado Pago o transferencia con 5% off.</p>
      </div>
    </aside>
    <button type="button" class="pd-bar" data-pd-bar>
      <span class="pd-bar-n" data-pd-bar-n>0</span>
      <span class="pd-bar-t">Ver pedido</span>
      <span class="pd-bar-p" data-pd-bar-p>$0</span>
    </button>
    <div class="pd-toast" data-pd-toast role="status" aria-live="polite"></div>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const sheet = $('.pd-sheet');
  const bar = $('[data-pd-bar]');
  const toast = $('[data-pd-toast]');
  let antes = null;

  function abrir() {
    pintar();
    antes = document.activeElement;
    document.documentElement.classList.add('pd-open');
    setTimeout(() => sheet.focus(), 60);
  }
  function cerrar() {
    if (!document.documentElement.classList.contains('pd-open')) return;
    document.documentElement.classList.remove('pd-open');
    if (antes && antes.focus) antes.focus();
  }

  function sugerencias() {
    const en = new Set(items.map((i) => i.id));
    const orden = ['frutos-1000', 'tradicional-1000', 'pack-degustacion', 'tradicional-500', 'frutos-500', 'pack-mesa'];
    return orden.filter((id) => !en.has(id) && !(TN[id] && TN[id].online === false)).slice(0, 4);
  }

  const tacho = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function pintar() {
    const ul = $('[data-pd-items]');
    if (!items.length) {
      ul.innerHTML = `<li class="pd-empty"><img src="${IMG}cut-tradicional.webp" alt=""><p>Tu pedido está vacío.</p><a class="btn btn-bordo" href="/nueva/pan-dulce.html#elegir" data-pd-close>Elegir pan dulce</a></li>`;
    } else {
      ul.innerHTML = items.map((i, k) => {
        const p = SKUS[i.id];
        return `<li class="pd-item">
          <img src="${p.img}" alt="">
          <div class="pd-item-t"><strong>${p.nombre}</strong>${p.detalle ? `<span class="pd-item-d">${p.detalle}</span>` : ''}<span class="pd-item-p">${fmt(p.precio)}${i.q > 1 ? ' <small>c/u</small>' : ''}</span></div>
          <div class="pd-step"><button type="button" data-pd-d="-1" data-pd-k="${k}" aria-label="${i.q === 1 ? 'Quitar' : 'Uno menos de'} ${p.nombre}">${i.q === 1 ? tacho : '−'}</button><output>${i.q}</output><button type="button" data-pd-d="1" data-pd-k="${k}" aria-label="Uno más de ${p.nombre}">+</button></div>
        </li>`;
      }).join('');
    }
    const sugs = items.length ? sugerencias() : [];
    $('[data-pd-upsell]').hidden = !sugs.length;
    $('[data-pd-sugs]').innerHTML = sugs.map((id) => {
      const p = SKUS[id];
      return `<button type="button" class="pd-sug" data-pd-add="${id}" aria-label="Sumar ${p.nombre}">
        <img src="${p.img}" alt=""><span class="pd-sug-n">${p.nombre}</span><span class="pd-sug-p">${fmt(p.precio)}</span><span class="pd-sug-plus" aria-hidden="true">+</span></button>`;
    }).join('');
    const t = total(), n = cantidad();
    $('[data-pd-sub]').textContent = fmt(t);
    $('[data-pd-tr]').textContent = fmt(Math.round(t * (1 - DESC_TRANSFERENCIA) * 100) / 100);
    $('.pd-tr').hidden = !n;
    const pay = $('[data-pd-pay]');
    pay.textContent = n ? `Ir a pagar ${fmt(t)}` : 'Ir a pagar';
    pay.classList.toggle('is-off', !n);
    pay.href = n ? linkDePago() : '#';
    const bloqueados = items.filter((i) => TN[i.id] && TN[i.id].online === false);
    const nota = $('[data-pd-nota]');
    nota.hidden = !bloqueados.length;
    nota.textContent = bloqueados.length ? `${bloqueados.map((i) => SKUS[i.id].nombre).join(' y ')}: todavía no se puede pagar online. Sacalo del pedido para seguir o pedilo por WhatsApp.` : '';
    $('[data-pd-bar-n]').textContent = n;
    $('[data-pd-bar-p]').textContent = fmt(t);
    bar.classList.toggle('show', n > 0);
    document.documentElement.classList.toggle('pd-has', n > 0);
    document.querySelectorAll('[data-count]').forEach((e) => (e.textContent = n));
  }

  function volar(desde) {
    const destino = cantidad() > 1 && bar.classList.contains('show') ? bar : document.querySelector('[data-open-cart]');
    if (reduce || !desde || !destino) return Promise.resolve();
    const a = desde.getBoundingClientRect(), b = destino.getBoundingClientRect();
    if (!a.width || a.bottom < 0 || a.top > innerHeight) return Promise.resolve();
    const img = document.createElement('img');
    img.src = desde.currentSrc || desde.src;
    img.className = 'pd-fly';
    img.alt = '';
    const size = Math.min(a.width, 200);
    Object.assign(img.style, { width: size + 'px', height: size + 'px', left: a.left + a.width / 2 - size / 2 + 'px', top: a.top + a.height / 2 - size / 2 + 'px' });
    document.body.appendChild(img);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = img.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: `translate(${dx * 0.4}px,${Math.min(dy * 0.4, 0) - 110}px) scale(.62) rotate(-14deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px,${dy}px) scale(.12) rotate(12deg)`, opacity: 0.5 },
    ], { duration: 700, easing: 'cubic-bezier(.5,0,.4,1)' });
    return anim.finished.then(() => img.remove(), () => img.remove());
  }

  function rebote() {
    if (reduce) return;
    const btn = document.querySelector('[data-open-cart]');
    if (btn) btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
    if (bar.classList.contains('show')) bar.animate([{ transform: 'translateX(-50%) scale(1)' }, { transform: 'translateX(-50%) scale(1.06)' }, { transform: 'translateX(-50%) scale(1)' }], { duration: 380, easing: 'ease-out' });
  }

  let tt;
  function avisar(html) {
    toast.innerHTML = html;
    toast.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function agregar(id, q, desdeImg) {
    if (!SKUS[id]) return;
    q = Math.max(1, Math.floor(q || 1));
    const f = items.find((i) => i.id === id);
    if (f) f.q = Math.min(99, f.q + q); else items.push({ id, q });
    guardar();
    const p = SKUS[id];
    volar(desdeImg).then(() => { pintar(); rebote(); });
    avisar(`<img src="${p.img}" alt=""> Sumaste ${q > 1 ? q + ' × ' : ''}<b>${p.nombre}</b>`);
  }

  root.addEventListener('click', (e) => {
    const c = e.target.closest('[data-pd-close]');
    if (c) { cerrar(); if (c.tagName !== 'A') e.preventDefault(); return; }
    const d = e.target.closest('[data-pd-d]');
    if (d) {
      const k = +d.dataset.pdK, it = items[k];
      if (!it) return;
      it.q += +d.dataset.pdD;
      if (it.q < 1) items.splice(k, 1);
      guardar(); pintar(); return;
    }
    const a = e.target.closest('[data-pd-add]');
    if (a) { agregar(a.dataset.pdAdd, 1, null); pintar(); return; }
    if (e.target.closest('[data-pd-bar]')) { abrir(); return; }
    if (e.target.closest('[data-pd-pay]')) {
      e.preventDefault();
      if (!cantidad()) return;
      if (items.some((i) => TN[i.id] && TN[i.id].online === false)) { avisar('Los packs todavía no se pueden pagar online.'); return; }
      $('[data-pd-pay]').textContent = 'Te llevamos al pago...';
      location.href = linkDePago();
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-cart]')) { e.preventDefault(); abrir(); return; }
    const qk = e.target.closest('[data-quick]');
    if (qk) {
      e.preventDefault();
      const card = qk.closest('.card');
      agregar(`${qk.dataset.quick}-1000`, 1, card && card.querySelector('.card-prod'));
      return;
    }
    const pk = e.target.closest('[data-add-pack]');
    if (pk) {
      const art = pk.closest('[data-pack]');
      if (art) agregar(`pack-${art.dataset.pack}`, 1, art.querySelector('.pack-vis img'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrar();
    if (e.key === 'Tab' && document.documentElement.classList.contains('pd-open')) {
      const f = [...sheet.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // arrastrar hacia abajo para cerrar en el celular
  let y0 = null;
  sheet.addEventListener('touchstart', (e) => { if (e.target.closest('.pd-grip, .pd-head')) y0 = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchmove', (e) => { if (y0 !== null) sheet.style.transform = `translateY(${Math.max(0, e.touches[0].clientY - y0)}px)`; }, { passive: true });
  sheet.addEventListener('touchend', (e) => { if (y0 === null) return; const dy = e.changedTouches[0].clientY - y0; sheet.style.transform = ''; if (dy > 90) cerrar(); y0 = null; });

  window.Pedido = { agregar, abrir, cantidad, variedades: VARIEDADES, skus: SKUS, fmt, peso };
  pintar();
})();
