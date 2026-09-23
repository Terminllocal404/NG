/* ============================================
   NG Doce Duo — Bootstrap
   Monta layout e executa o script da página.
   Cada página define window.NG_PAGE = { nav, init }.
   ============================================ */
(function (NG) {
  "use strict";

  function boot() {
    const page = window.NG_PAGE || {};
    if (NG.mountLayout && !document.body.hasAttribute("data-no-layout")) {
      NG.mountLayout(page.nav || "");
    }
    if (typeof page.init === "function") {
      try {
        page.init();
      } catch (err) {
        console.error("Erro ao inicializar a página:", err);
      }
    }
  }

  // Executa quando o DOM estiver pronto — funcione o app carregado durante
  // o parsing (DOMContentLoaded ainda vai disparar) ou depois dele.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Guarda de rota simples
  NG.requireCustomer = function () {
    if (!NG.authService.isCustomer()) {
      const back = encodeURIComponent(location.pathname + location.search);
      location.href = NG.url("pages/auth/login.html") + "?redirect=" + back;
      return false;
    }
    return true;
  };
  NG.requireAdmin = function () {
    if (!NG.authService.isAdmin()) {
      location.href = NG.url("pages/admin/login.html");
      return false;
    }
    return true;
  };
})((window.NG = window.NG || {}));
