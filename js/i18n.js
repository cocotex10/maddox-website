/* Maddox — idioma ES / EN.
   El HTML está en español (por defecto). js/i18n-data.js contiene el inglés por clave.
   Cualquier elemento con data-i18n="clave" cambia su contenido; data-i18n-attr="attr:clave;attr2:clave2"
   cambia atributos (placeholder, aria-label, content, alt…). */
(function () {
  'use strict';
  var KEY = 'maddoxLang';
  var EN = window.MADDOX_I18N || {};
  var nodes = [];

  function collect() {
    [].forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in EN)) return;
      nodes.push({ el: el, key: k, es: el.tagName === 'TITLE' ? el.textContent : el.innerHTML });
    });
    [].forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); var attr = p[0].trim(), k = (p[1] || '').trim();
        if (!attr || !(k in EN)) return;
        nodes.push({ el: el, key: k, attr: attr, es: el.getAttribute(attr) });
      });
    });
  }

  var current = 'es';
  function apply(lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'es';
    nodes.forEach(function (n) {
      var v = lang === 'en' ? EN[n.key] : n.es;
      if (n.attr) n.el.setAttribute(n.attr, v);
      else if (n.el.tagName === 'TITLE') n.el.textContent = v;
      else n.el.innerHTML = v;
    });
    current = lang;
    document.documentElement.setAttribute('lang', lang);
    [].forEach.call(document.querySelectorAll('[data-setlang]'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === lang ? 'true' : 'false');
    });
    var hid = document.getElementById('f-idioma'); if (hid) hid.value = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('maddox:lang', { detail: lang }));
  }

  collect();
  [].forEach.call(document.querySelectorAll('[data-setlang]'), function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-setlang')); });
  });

  var start = 'es';
  try {
    var q = /[?&]lang=(es|en)\b/.exec(location.search);
    start = q ? q[1] : (localStorage.getItem(KEY) || 'es');
  } catch (e) {}
  apply(start);
  window.MADDOX_LANG = function () { return current; };
})();
