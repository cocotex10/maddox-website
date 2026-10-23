/* Maddox — comportamiento general: menús, menú móvil, formulario. */
(function () {
  'use strict';

  /* ---- menús desplegables (escritorio) ---- */
  var items = [].slice.call(document.querySelectorAll('.nav-item.has-mega'));
  var closeTimer;
  function setOpen(item, open) {
    item.classList.toggle('open', open);
    var b = item.querySelector('.nav-link');
    if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) { items.forEach(function (i) { if (i !== except) setOpen(i, false); }); }
  items.forEach(function (item) {
    var btn = item.querySelector('.nav-link');
    item.addEventListener('mouseenter', function () { clearTimeout(closeTimer); closeAll(item); setOpen(item, true); });
    item.addEventListener('mouseleave', function () { closeTimer = setTimeout(function () { setOpen(item, false); }, 160); });
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains('open');
      closeAll(item); setOpen(item, willOpen);
    });
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) setOpen(item, false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); closeDrawer(); } });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closeAll(); });

  /* ---- menú móvil ---- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  function closeDrawer() {
    if (!burger || !drawer) return;
    drawer.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = !drawer.classList.contains('open');
      drawer.classList.toggle('open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) closeDrawer(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1000) closeDrawer(); });
  }

  /* ---- formulario ---- */
  var form = document.getElementById('contactForm');
  if (form) {
    var msgs = { ok: document.getElementById('msgOk'), err: document.getElementById('msgErr'), info: document.getElementById('msgInfo') };
    function show(which) { Object.keys(msgs).forEach(function (k) { msgs[k].classList.toggle('show', k === which); }); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = (window.MADDOX_CONFIG && window.MADDOX_CONFIG.FORM_ENDPOINT) || '';
      if (form.querySelector('[name="_gotcha"]').value) return;   // anti-spam
      if (!endpoint) { show('info'); return; }                    // aún sin servicio de envío
      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true; show(null);
      var data = {};
      new FormData(form).forEach(function (v, k) { if (k !== '_gotcha') data[k] = v; });
      data._subject = 'Nuevo contacto — maddox-global.com (' + (data.empresa || 's/e') + ')';
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); show('ok'); form.reset(); var h = document.getElementById('f-idioma'); if (h && window.MADDOX_LANG) h.value = window.MADDOX_LANG(); })
        .catch(function () { show('err'); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
