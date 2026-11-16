/* Abdur Rauf portfolio: interactions. Settings live in js/config.js */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Apply settings from config.js ---------- */
  $$('[data-mail]').forEach(function (a) {
    a.href = 'mailto:' + C.email;
    if (a.textContent.trim().indexOf('@') > -1) a.textContent = C.email;
  });
  $$('[data-cv]').forEach(function (a) { if (C.cvFile) a.href = C.cvFile; else a.hidden = true; });
  $$('[data-social]').forEach(function (a) {
    var url = C[a.dataset.social];
    if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; if (a.textContent.indexOf('coming soon') > -1) a.textContent = url.replace(/^https?:\/\/(www\.)?/, ''); }
    else { a.classList.add('is-off'); a.setAttribute('aria-disabled', 'true'); a.removeAttribute('href'); a.tabIndex = -1; a.title = 'Link coming soon'; }
  });
  if (C.showPhone && C.phone) {
    var pi = $('#phoneItem'), pa = $('[data-phone]');
    pa.href = 'tel:' + C.phone.replace(/[^\d+]/g, ''); pa.textContent = C.phone; pi.hidden = false;
  }
  $$('[data-proj]').forEach(function (card) {
    var p = (C.projects || {})[card.dataset.proj] || {};
    var st = $('[data-status]', card), s = (p.status || 'In progress');
    st.textContent = s; var l = s.toLowerCase();
    st.classList.toggle('done', /complete|done|finish/.test(l)); st.classList.toggle('plan', /plan|idea|soon/.test(l));
    ['github', 'demo'].forEach(function (k) {
      var a = $('[data-link="' + k + '"]', card);
      if (p[k]) { a.href = p[k]; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.hidden = false; }
      else if (k === 'github') { a.setAttribute('aria-disabled', 'true'); a.removeAttribute('href'); a.title = 'GitHub link coming soon'; a.lastChild.textContent = ' GitHub (coming soon)'; }
    });
  });
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Navigation ---------- */
  var nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
  function onScroll() {
    nav.classList.toggle('solid', window.scrollY > 24);
    $('#totop').hidden = window.scrollY < 700;
  }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () { var o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  $('#totop').addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  var links = $$('#menu a[href^="#"]'), sections = links.map(function (a) { return $(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Scroll reveal, counters, skill bars ---------- */
  $$('[data-stagger]').forEach(function (p) { $$('.rv', p).forEach(function (c, i) { c.style.setProperty('--d', (i * 0.09) + 's'); }); });
  function counter(el) {
    var to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0;
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    var t0 = null;
    (function step(t) { t0 = t0 || t; var p = Math.min((t - t0) / 1700, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = (to * e).toFixed(dec); if (p < 1) requestAnimationFrame(step); })(performance.now());
  }
  function fillBars(root) { $$('.bar i', root).forEach(function (b) { b.style.width = b.dataset.w + '%'; }); }
  var rvEls = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; t.classList.add('in'); io.unobserve(t);
        $$('.count', t).forEach(counter); fillBars(t);
        setTimeout(function () { t.style.setProperty('--d', '0s'); }, 2200);
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    rvEls.forEach(function (el) { io.observe(el); });
  } else { rvEls.forEach(function (el) { el.classList.add('in'); $$('.count', el).forEach(counter); fillBars(el); }); }

  /* ---------- Copy email ---------- */
  var cp = $('#copy');
  if (cp) cp.addEventListener('click', function () {
    var done = function () { var o = cp.lastChild.textContent; cp.lastChild.textContent = ' Copied!'; setTimeout(function () { cp.lastChild.textContent = o; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(C.email).then(done, function () {}); else done();
  });

  /* ---------- Contact form ---------- */
  var form = $('#cform'), st = $('#fstatus');
  function say(msg, ok) { st.textContent = msg; st.className = 'fstatus ' + (ok ? 'ok' : 'err'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    $$('input,textarea', form).forEach(function (f) {
      var invalid = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.classList.toggle('bad', invalid); f.setAttribute('aria-invalid', invalid); if (invalid && !bad) { bad = true; f.focus(); }
    });
    if (bad) { say('Please fill in every field with a valid email address.', false); return; }
    var d = { name: form.name.value.trim(), email: form.email.value.trim(), subject: form.subject.value.trim(), message: form.message.value.trim() };
    if (C.formEndpoint) {
      say('Sending...', true);
      fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw 0; say('Thank you! Your message has been sent.', true); form.reset(); })
        .catch(function () { say('Sorry, the message could not be sent. Please email me directly.', false); });
    } else {
      var body = 'Name: ' + d.name + '\nEmail: ' + d.email + '\n\n' + d.message;
      window.location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent(d.subject) + '&body=' + encodeURIComponent(body);
      say('Thank you, ' + d.name.split(' ')[0] + '! Your email app should open with the message ready to send.', true);
      form.reset();
    }
  });
})();
