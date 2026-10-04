/* ═══════════════════════════════════════════════
   صحتك أولاً — Google Analytics 4
   ═══════════════════════════════════════════════
   لتفعيل التتبّع: ضع معرّف القياس (Measurement ID)
   من لوحة Google Analytics في السطر التالي.
   الصيغة: G-XXXXXXXXXX

   ملاحظة أمان: لن يُحمَّل أي كود تتبّع على الإطلاق
   قبل وضع المعرّف الحقيقي — فالنشر بالمعرّف المؤقت
   لا يُرسل أي بيانات ولا يسبّب أخطاء.
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  var GA_ID = 'G-XXXXXXXXXX'; // ← ضع معرّف القياس هنا

  // لا نُفعّل شيئًا قبل وضع معرّف حقيقي
  if (!GA_ID || GA_ID.indexOf('XXXX') !== -1) {
    window.trackAffiliateClick = function () {}; // دالة فارغة آمنة
    return;
  }

  // ── تحميل مكتبة gtag.js ──────────────────────
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  // ── تتبّع النقر على روابط الأفلييت (حدث مخصّص) ──
  // يُستدعى من js/main.js عند النقر على أي رابط [data-affiliate]
  window.trackAffiliateClick = function (product, url) {
    try {
      gtag('event', 'affiliate_click', {
        product_name: product || 'unknown',
        link_url: url || '',
        page_path: window.location.pathname
      });
    } catch (e) { /* تجاهل */ }
  };

  // ── تتبّع روابط الخروج الأخرى ─────────────────
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var isExternal = /^https?:\/\//i.test(href) && href.indexOf(location.hostname) === -1;
    if (isExternal && !a.hasAttribute('data-affiliate')) {
      try {
        gtag('event', 'outbound_click', {
          link_url: href,
          link_text: (a.textContent || '').trim().slice(0, 80)
        });
      } catch (e) { /* تجاهل */ }
    }
  }, true);
})();
