/* ============================================
   NG Doce Duo — Carregador de scripts do core
   Inclua apenas <script src=".../js/include.js"></script>
   em cada página; este arquivo injeta o restante em ordem.
   ============================================ */
(function () {
  "use strict";
  var self = document.currentScript.src;
  var root = self.replace(/js\/include\.js.*$/, ""); // raiz do projeto (com barra final)

  var files = [
    "js/data.js",
    "js/utils.js",
    "js/components/icons.js",
    "js/components/ui.js",
    "js/validation.js",
    "js/services/productService.js",
    "js/services/authService.js",
    "js/services/orderService.js",
    "js/services/paymentService.js",
    "js/services/customerService.js",
    "js/services/couponService.js",
    "js/cart.js",
    "js/orders.js",
    "js/components/otp.js",
    "js/components/layout.js",
    "js/app.js",
  ];

  // Caminho normal: durante o parsing do HTML, document.write preserva a ordem
  // e é síncrono. Fallback: se este script rodar após o parsing (ex.: injeção
  // assíncrona), carrega em sequência sem apagar a página.
  if (document.readyState === "loading") {
    files.forEach(function (f) {
      document.write('<script src="' + root + f + '"><\/script>');
    });
  } else {
    (function loadSeq(i) {
      if (i >= files.length) return;
      var s = document.createElement("script");
      s.src = root + files[i];
      s.async = false;
      s.onload = function () { loadSeq(i + 1); };
      document.head.appendChild(s);
    })(0);
  }
})();
