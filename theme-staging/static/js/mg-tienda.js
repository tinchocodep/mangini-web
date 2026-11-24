/* Mangini 2026 · mg-tienda.js: se carga en TODAS las páginas de la tienda.
   Muestra los precios sin ",00" ($42.360 en vez de $42.360,00). Si un precio tiene centavos
   de verdad (por ejemplo $44.502,75) lo deja como está. El checkout de Tiendanube no lo toca. */
(function () {
  var RE = /(\$\s?\d{1,3}(?:\.\d{3})*),00(?!\d)/g;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, NOSCRIPT: 1, CODE: 1 };

  function limpiar(nodo) {
    if (!nodo) return;
    if (nodo.nodeType === 3) {
      var v = nodo.nodeValue;
      if (v && v.indexOf(',00') !== -1) {
        var n = v.replace(RE, '$1');
        if (n !== v) nodo.nodeValue = n;
      }
      return;
    }
    if (nodo.nodeType !== 1 || SKIP[nodo.nodeName]) return;
    var w = document.createTreeWalker(nodo, NodeFilter.SHOW_TEXT, {
      acceptNode: function (t) {
        var p = t.parentNode;
        return p && !SKIP[p.nodeName] && t.nodeValue.indexOf(',00') !== -1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var t, lista = [];
    while ((t = w.nextNode())) lista.push(t);
    lista.forEach(limpiar);
  }

  function arrancar() {
    limpiar(document.body);
    // Rio cambia precios al elegir variantes, abrir el carrito o cargar más productos
    var pendientes = [], programado = false;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === 'characterData') pendientes.push(m.target);
        else m.addedNodes.forEach(function (n) { pendientes.push(n); });
      });
      if (programado) return;
      programado = true;
      requestAnimationFrame(function () {
        programado = false;
        var l = pendientes; pendientes = [];
        l.forEach(limpiar);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
