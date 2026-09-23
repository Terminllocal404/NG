/* ============================================
   NG Doce Duo — Shell administrativo
   ============================================ */
(function (NG) {
  "use strict";

  var NAV = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "dashboard.html" },
    { key: "pedidos", label: "Pedidos", icon: "box", href: "pedidos.html" },
    { key: "produtos", label: "Produtos", icon: "tag", href: "produtos.html" },
    { key: "cupons", label: "Cupons", icon: "gift", href: "cupons.html" },
    { key: "clientes", label: "Clientes", icon: "users", href: "clientes.html" },
    { key: "config", label: "Configurações", icon: "settings", href: "configuracoes.html" },
  ];

  // Monta o shell no <body data-no-layout>. contentHtml vai no <main>.
  NG.adminShell = function (active, title, contentHtml) {
    var admin = NG.authService.getAdmin();
    var nav = NAV.map(function (i) {
      return '<a href="' + i.href + '" class="' + (i.key === active ? "is-active" : "") + '">' + NG.icon(i.icon, { size: 18 }) + " " + i.label + "</a>";
    }).join("");

    document.body.innerHTML =
      '<div class="admin-layout">' +
        '<aside class="admin-sidebar" data-admin-sidebar>' +
          '<div class="brand"><img src="' + NG.url("assets/logo/ng-doce-duo-logo.png") + '" alt="" width="40" height="40" style="border-radius:50%;background:var(--color-cream)"><span class="brand__name">NG Admin</span></div>' +
          '<nav class="admin-nav" aria-label="Menu administrativo">' + nav + "</nav>" +
          '<div style="margin-top:auto;padding-top:32px"><a href="#" class="admin-nav" data-logout style="color:var(--color-rose-light);display:flex;align-items:center;gap:12px;padding:12px">' + NG.icon("logout", { size: 18 }) + " Sair</a></div>" +
        "</aside>" +
        '<main class="admin-main" id="main">' +
          '<div class="admin-topbar">' +
            '<div class="flex items-center" style="gap:12px"><button class="icon-btn admin-menu-btn" data-admin-menu style="color:var(--color-chocolate)">' + NG.icon("menu", { size: 24 }) + "</button><h1>" + NG.escape(title) + "</h1></div>" +
            '<div class="flex items-center" style="gap:12px"><span class="text-small text-soft">' + NG.escape(admin ? admin.name : "") + '</span><a href="' + NG.url("index.html") + '" class="btn btn--secondary btn--sm btn--inline">Ver loja</a></div>' +
          "</div>" +
          contentHtml +
        "</main>" +
      "</div>";

    var menuBtn = NG.qs("[data-admin-menu]");
    if (menuBtn) menuBtn.addEventListener("click", function () { NG.qs("[data-admin-sidebar]").classList.toggle("is-open"); });
    NG.qs("[data-logout]").addEventListener("click", function (e) {
      e.preventDefault();
      NG.authService.adminLogout();
      location.href = "login.html";
    });
  };

  // KPIs a partir dos pedidos
  NG.adminMetrics = function () {
    var orders = NG.orderService.all();
    var revenue = orders.filter(function (o) { return o.payment.status !== "aguardando"; }).reduce(function (s, o) { return s + NG.orderService.total(o); }, 0);
    var pending = orders.filter(function (o) { return !["entregue", "retirado", "cancelado"].includes(o.status); }).length;
    var done = orders.filter(function (o) { return ["entregue", "retirado"].includes(o.status); }).length;
    return {
      orders: orders.length,
      revenue: revenue,
      pending: pending,
      done: done,
      customers: NG.customerService.all().length,
      products: NG.products.filter(function (p) { return p.active; }).length,
    };
  };
})((window.NG = window.NG || {}));
