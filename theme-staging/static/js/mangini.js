/* Mangini 2026: interacciones de las secciones nuevas dentro del tema de Tiendanube.
   Usa el carrito propio de la tienda (POST /comprar/ y /cart/update/), así que lo que se suma
   acá es lo mismo que se ve en el carrito y en el checkout. */
(function () {
  if (!document.querySelector('.mg-root')) return;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CFG = Object.assign({ transferenciaOff: 0.05, carritoUrl: '/comprar/' }, window.MG_CONFIG || {});
  var fmt = function (n) { return '$' + n.toLocaleString('es-AR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };

  /* ---------------- Carrito de Tiendanube ---------------- */
  var items = []; // {itemId, productId, nombre, variante, q, unit, img}

  function desdeLS() {
    var c = window.LS && LS.cart;
    if (!c || !Array.isArray(c.items)) return;
    items = c.items.map(function (i) {
      return { itemId: i.item_id, productId: i.product_id, nombre: i.name, variante: (i.short_variant_name || '').replace(/[()]/g, ''), q: i.quantity, unit: (i.unit_price || 0) / 100, img: i.image_url || '' };
    });
  }
  function desdeRespuesta(cart) {
    if (!cart || !Array.isArray(cart.products)) return;
    items = cart.products.map(function (p) {
      var img = p.image && (p.image.src || p.image) || '';
      return { itemId: p.id, productId: p.product_id, nombre: p.name_without_variants || p.name, variante: (p.variant_values || []).join(' '), q: p.quantity, unit: parseFloat(p.price) || 0, img: typeof img === 'string' ? img : '' };
    });
  }
  function enc(o) { return Object.keys(o).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(o[k]); }).join('&'); }
  function post(url, body) {
    return fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' }, body: body })
      .then(function (r) { return r.json(); });
  }
  function agregarAlCarrito(productId, opcion, q) {
    var data = { add_to_cart: productId, quantity: q || 1, add_to_cart_enhanced: 1 };
    if (opcion) data['variation[0]'] = opcion;
    return post(CFG.carritoUrl, enc(data)).then(function (d) {
      if (!d || !d.success) throw new Error((d && d.error_code) || 'error');
      desdeRespuesta(d.cart);
      return d;
    });
  }
  function cambiarCantidad(itemId, q) {
    var data = { cart_page: 0 }; data['quantity[' + itemId + ']'] = q;
    return post('/cart/update/', enc(data)).then(function (d) { if (d && d.success) desdeRespuesta(d.cart); });
  }
  var total = function () { return items.reduce(function (t, i) { return t + i.unit * i.q; }, 0); };
  var cantidad = function () { return items.reduce(function (t, i) { return t + i.q; }, 0); };

  /* ---------------- Panel "Tu pedido" (estilo app) ---------------- */
  var ui = document.createElement('div');
  ui.className = 'mg-ui';
  ui.innerHTML =
    '<div class="mg-pd-scrim" data-mg-close></div>' +
    '<aside class="mg-pd-sheet mg-sheet" role="dialog" aria-modal="true" aria-labelledby="mg-pd-title" tabindex="-1">' +
      '<div class="mg-pd-grip" aria-hidden="true"></div>' +
      '<div class="mg-pd-head"><h2 id="mg-pd-title">Tu pedido</h2><button type="button" class="mg-pd-x" data-mg-close aria-label="Cerrar">×</button></div>' +
      '<div class="mg-pd-body"><ul class="mg-pd-items" data-mg-items></ul>' +
        '<div class="mg-pd-upsell" data-mg-upsell hidden><p class="mg-pd-upsell-t">Sumale</p><div class="mg-pd-upsell-row" data-mg-sugs></div></div></div>' +
      '<div class="mg-pd-foot">' +
        '<div class="mg-pd-line"><span>Total</span><b data-mg-sub>$0</b></div>' +
        '<div class="mg-pd-line mg-pd-tr" data-mg-tr-line><span>Pagando por transferencia, 5% off</span><b data-mg-tr>$0</b></div>' +
        '<div class="mg-pd-line mg-pd-muted"><span>Envío</span><span>Lo calculás con tu código postal en el carrito</span></div>' +
        '<a class="mg-btn mg-btn-bordo mg-btn-wide mg-pd-pay" href="' + CFG.carritoUrl + '" data-mg-pay>Ir a pagar</a>' +
        '<p class="mg-pd-pays">Mercado Pago o transferencia con 5% off.</p>' +
      '</div>' +
    '</aside>' +
    '<button type="button" class="mg-pd-bar" data-mg-bar><span class="mg-pd-bar-n" data-mg-bar-n>0</span><span class="mg-pd-bar-t">Ver pedido</span><span class="mg-pd-bar-p" data-mg-bar-p>$0</span></button>' +
    '<div class="mg-pd-toast" data-mg-toast role="status" aria-live="polite"></div>';
  document.body.appendChild(ui);
  var sheet = $('.mg-pd-sheet', ui), bar = $('[data-mg-bar]', ui), toast = $('[data-mg-toast]', ui);
  var antes = null;

  function abrir() { pintar(); antes = document.activeElement; document.documentElement.classList.add('mg-pd-open'); setTimeout(function () { sheet.focus(); }, 60); }
  function cerrar() { if (!document.documentElement.classList.contains('mg-pd-open')) return; document.documentElement.classList.remove('mg-pd-open'); if (antes && antes.focus) antes.focus(); }

  // Sugerencias: los productos de la página (cartas y packs) que todavía no están en el carrito
  function sugerencias() {
    var en = {}; items.forEach(function (i) { en[i.productId + '|' + i.variante] = 1; });
    return $$('[data-mg-sug]').map(function (el) {
      return { p: el.getAttribute('data-mg-sug'), v: el.getAttribute('data-mg-opcion') || '', nombre: el.getAttribute('data-mg-nombre'), precio: el.getAttribute('data-mg-precio'), img: el.getAttribute('data-mg-img') };
    }).filter(function (s, k, arr) {
      return !en[s.p + '|' + s.v] && arr.findIndex(function (x) { return x.p === s.p && x.v === s.v; }) === k;
    }).slice(0, 4);
  }

  var tacho = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // Foto recortada de cada producto de la página (si el carrito no trae imagen o para que combine)
  var fotos = {};
  $$('[data-mg-sug]').forEach(function (el) { fotos[el.getAttribute('data-mg-sug')] = el.getAttribute('data-mg-img'); });

  function pintar() {
    items.forEach(function (i) { if (fotos[i.productId]) i.img = fotos[i.productId]; });
    var ul = $('[data-mg-items]', ui);
    if (!items.length) {
      ul.innerHTML = '<li class="mg-pd-empty"><p>Tu pedido está vacío.</p><button type="button" class="mg-btn mg-btn-bordo" data-mg-close data-mg-ir="elegir">Elegir pan dulce</button></li>';
    } else {
      ul.innerHTML = items.map(function (i, k) {
        return '<li class="mg-pd-item">' + (i.img ? '<img src="' + esc(i.img) + '" alt="">' : '<span></span>') +
          '<div class="mg-pd-item-t"><strong>' + esc(i.nombre) + '</strong>' + (i.variante ? '<span class="mg-pd-item-d">' + esc(i.variante) + '</span>' : '') + '<span class="mg-pd-item-p">' + fmt(i.unit) + (i.q > 1 ? ' <small>c/u</small>' : '') + '</span></div>' +
          '<div class="mg-pd-step"><button type="button" data-mg-d="-1" data-mg-k="' + k + '" aria-label="' + (i.q === 1 ? 'Quitar ' : 'Uno menos de ') + esc(i.nombre) + '">' + (i.q === 1 ? tacho : '−') + '</button><output>' + i.q + '</output><button type="button" data-mg-d="1" data-mg-k="' + k + '" aria-label="Uno más de ' + esc(i.nombre) + '">+</button></div></li>';
      }).join('');
    }
    var sugs = items.length ? sugerencias() : [];
    $('[data-mg-upsell]', ui).hidden = !sugs.length;
    $('[data-mg-sugs]', ui).innerHTML = sugs.map(function (s) {
      return '<button type="button" class="mg-pd-sug" data-mg-add="' + esc(s.p) + '" data-mg-opcion="' + esc(s.v) + '" aria-label="Sumar ' + esc(s.nombre) + '">' +
        (s.img ? '<img src="' + esc(s.img) + '" alt="">' : '') + '<span class="mg-pd-sug-n">' + esc(s.nombre) + '</span><span class="mg-pd-sug-p">' + esc(s.precio || '') + '</span><span class="mg-pd-sug-plus" aria-hidden="true">+</span></button>';
    }).join('');
    var t = total(), n = cantidad();
    $('[data-mg-sub]', ui).textContent = fmt(t);
    $('[data-mg-tr]', ui).textContent = fmt(Math.round(t * (1 - CFG.transferenciaOff) * 100) / 100);
    $('[data-mg-tr-line]', ui).hidden = !n;
    var pay = $('[data-mg-pay]', ui);
    pay.textContent = n ? 'Ir a pagar ' + fmt(t) : 'Ir a pagar';
    pay.classList.toggle('mg-is-off', !n);
    $('[data-mg-bar-n]', ui).textContent = n;
    $('[data-mg-bar-p]', ui).textContent = fmt(t);
    bar.classList.toggle('mg-show', n > 0);
    $$('.js-cart-widget-amount').forEach(function (e) { e.textContent = n; });
  }

  function volar(desde) {
    var destino = bar.classList.contains('mg-show') ? bar : ($('.js-cart-widget-amount') || bar);
    if (reduce || !desde) return Promise.resolve();
    var a = desde.getBoundingClientRect(), b = destino.getBoundingClientRect();
    if (!a.width || a.bottom < 0 || a.top > innerHeight || !b.width) return Promise.resolve();
    var img = document.createElement('img');
    img.src = desde.currentSrc || desde.src; img.alt = ''; img.className = 'mg-pd-fly';
    var size = Math.min(a.width, 200);
    img.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (a.left + a.width / 2 - size / 2) + 'px;top:' + (a.top + a.height / 2 - size / 2) + 'px';
    document.body.appendChild(img);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    var anim = img.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1 },
      { transform: 'translate(' + dx * 0.4 + 'px,' + (Math.min(dy * 0.4, 0) - 110) + 'px) scale(.62) rotate(-14deg)', opacity: 1, offset: 0.45 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.12) rotate(12deg)', opacity: 0.5 }
    ], { duration: 700, easing: 'cubic-bezier(.5,0,.4,1)' });
    return anim.finished.then(function () { img.remove(); }, function () { img.remove(); });
  }
  function rebote() {
    if (reduce || !bar.classList.contains('mg-show')) return;
    bar.animate([{ scale: '1' }, { scale: '1.06' }, { scale: '1' }], { duration: 380, easing: 'ease-out' });
  }
  var tt;
  function avisar(html) { toast.innerHTML = html; toast.classList.add('mg-show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('mg-show'); }, 2400); }

  var ocupado = false;
  function sumar(productId, opcion, q, nombre, desdeImg) {
    if (ocupado) return; ocupado = true;
    var vuelo = volar(desdeImg);
    agregarAlCarrito(productId, opcion, q).then(function () {
      return vuelo.then(function () { pintar(); rebote(); avisar((desdeImg ? '<img src="' + esc(desdeImg.currentSrc || desdeImg.src) + '" alt=""> ' : '') + 'Sumaste ' + (q > 1 ? q + ' × ' : '') + '<b>' + esc(nombre) + '</b>'); });
    }).catch(function (err) {
      avisar(String(err.message) === 'unavailable_product' ? 'Ese producto todavía no está disponible online.' : 'No pudimos sumarlo. Probá de nuevo.');
    }).then(function () { ocupado = false; });
  }

  ui.addEventListener('click', function (e) {
    var c = e.target.closest('[data-mg-close]');
    if (c) { cerrar(); if (c.hasAttribute('data-mg-ir')) { var t = document.getElementById(c.getAttribute('data-mg-ir')); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } return; }
    var d = e.target.closest('[data-mg-d]');
    if (d) { var it = items[+d.getAttribute('data-mg-k')]; if (it) cambiarCantidad(it.itemId, Math.max(0, it.q + +d.getAttribute('data-mg-d'))).then(pintar); return; }
    var a = e.target.closest('[data-mg-add]');
    if (a) { agregarAlCarrito(a.getAttribute('data-mg-add'), a.getAttribute('data-mg-opcion'), 1).then(pintar).catch(function () { avisar('No pudimos sumarlo. Probá de nuevo.'); }); return; }
    if (e.target.closest('[data-mg-bar]')) { abrir(); return; }
    var pay = e.target.closest('[data-mg-pay]');
    if (pay) {
      // Directo al checkout de Tiendanube (envío y pago), sin pasar por la página del carrito de Rio
      e.preventDefault();
      if (!cantidad()) return;
      pay.textContent = 'Te llevamos al pago...';
      var f = document.createElement('form');
      f.method = 'post'; f.action = CFG.carritoUrl; f.style.display = 'none';
      var inp = document.createElement('input'); inp.type = 'hidden'; inp.name = 'go_to_checkout'; inp.value = 'Iniciar compra';
      f.appendChild(inp); document.body.appendChild(f); f.submit();
    }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

  // El ícono del carrito del header de Rio abre "Tu pedido" en vez del panel de Rio
  document.addEventListener('click', function (e) {
    var icon = e.target.closest('[data-toggle="#modal-cart"]');
    if (!icon) return;
    e.preventDefault(); e.stopImmediatePropagation();
    abrir();
  }, true);
  var y0 = null;
  sheet.addEventListener('touchstart', function (e) { if (e.target.closest('.mg-pd-grip, .mg-pd-head')) y0 = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchmove', function (e) { if (y0 !== null) sheet.style.transform = 'translateY(' + Math.max(0, e.touches[0].clientY - y0) + 'px)'; }, { passive: true });
  sheet.addEventListener('touchend', function (e) { if (y0 === null) return; var dy = e.changedTouches[0].clientY - y0; sheet.style.transform = ''; if (dy > 90) cerrar(); y0 = null; });

  /* ---------------- Hero: baraja, parallax ---------------- */
  var hero = $('[data-mg-hero]');
  if (hero) {
    requestAnimationFrame(function () { setTimeout(function () { var w = $('.mg-deck-wrap', hero); if (w) w.classList.add('mg-is-dealt'); }, 60); });
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); hero.style.setProperty('--mg-mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3)); hero.style.setProperty('--mg-my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3)); });
    hero.addEventListener('pointerleave', function () { hero.style.setProperty('--mg-mx', 0); hero.style.setProperty('--mg-my', 0); });
  }
  // "+" rápido en las cartas: suma 1 kg
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mg-quick]');
    if (!b) return;
    e.preventDefault();
    var card = b.closest('.mg-card');
    sumar(b.getAttribute('data-mg-quick'), b.getAttribute('data-mg-opcion') || '', 1, b.getAttribute('data-mg-nombre') || 'Pan dulce', card && $('.mg-card-prod', card));
  });

  /* ---------------- Elegí el tuyo: tamaño, cantidad, agregar ---------------- */
  $$('[data-mg-prod]').forEach(function (el) {
    var variantes = [];
    try { variantes = JSON.parse(el.getAttribute('data-mg-variantes') || '[]'); } catch (err) {}
    var st = { op: (el.querySelector('[data-mg-size].mg-on') || el.querySelector('[data-mg-size]') || {}).getAttribute ? (el.querySelector('[data-mg-size].mg-on') || el.querySelector('[data-mg-size]')).getAttribute('data-mg-size') : '', q: 1 };
    function precio() { var v = variantes.find(function (x) { return x.option0 === st.op; }); return v ? (v.price_number || 0) : 0; }
    function pintarProd() {
      $$('[data-mg-size]', el).forEach(function (b) { var on = b.getAttribute('data-mg-size') === st.op; b.classList.toggle('mg-on', on); b.setAttribute('aria-pressed', on); });
      var pr = $('[data-mg-price]', el); if (pr) pr.textContent = fmt(precio() * st.q);
      var qo = $('[data-mg-qo]', el); if (qo) qo.textContent = st.q;
    }
    $$('[data-mg-size]', el).forEach(function (b) { b.addEventListener('click', function () { st.op = b.getAttribute('data-mg-size'); pintarProd(); }); });
    $$('[data-mg-q]', el).forEach(function (b) { b.addEventListener('click', function () { st.q = Math.max(1, Math.min(99, st.q + +b.getAttribute('data-mg-q'))); pintarProd(); }); });
    var add = $('[data-mg-add-prod]', el);
    if (add) add.addEventListener('click', function () {
      sumar(el.getAttribute('data-mg-prod'), st.op, st.q, (el.getAttribute('data-mg-nombre') || '') + ' ' + st.op, $('.mg-prod-img', el));
      st.q = 1; pintarProd();
    });
    pintarProd();
  });
  // Packs (productos sin variantes)
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-mg-add-pack]');
    if (!b) return;
    var art = b.closest('[data-mg-pack]');
    if (art) sumar(art.getAttribute('data-mg-pack'), '', 1, art.getAttribute('data-mg-nombre') || 'Pack', $('.mg-pack-vis img', art));
  });

  /* ---------------- Historia: producto que gira y cambia ---------------- */
  var story = $('[data-mg-story]');
  if (story) {
    var stage = $('[data-mg-story-img]', story), steps = $$('[data-mg-step]', story);
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (!e.isIntersecting) return; steps.forEach(function (s) { s.classList.toggle('mg-on', s === e.target); }); var src = e.target.getAttribute('data-mg-img'); if (stage && src && stage.getAttribute('src') !== src) stage.src = src; });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { so.observe(s); });
    if (stage) addEventListener('scroll', function () {
      var r = story.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      stage.style.setProperty('--mg-rot', (p * 40 - 20).toFixed(1) + 'deg');
      stage.style.setProperty('--mg-sc', (0.92 + Math.sin(p * Math.PI) * 0.12).toFixed(3));
    }, { passive: true });
  }

  /* ---------------- WhatsApp de regalos empresariales ---------------- */
  // Si no se cargó un número comercial, usa el WhatsApp que la tienda ya muestra (botón flotante de Rio)
  var wa = $('[data-mg-wa]');
  if (wa && (wa.getAttribute('href') || '#') === '#') {
    var rio = $$('a[href*="wa.me/"], a[href*="api.whatsapp.com"], a[href*="whatsapp.com/send"]').filter(function (a) { return !a.closest('.mg-root'); })[0];
    var m = rio && /(?:wa\.me\/|phone=)(\d{8,15})/.exec(rio.getAttribute('href'));
    if (m) wa.setAttribute('href', 'https://wa.me/' + m[1] + '?text=' + encodeURIComponent(wa.getAttribute('data-mg-wa')));
    else wa.hidden = true;
  }

  desdeLS();
  pintar();
  window.MG = { abrir: abrir, sumar: sumar };
})();
