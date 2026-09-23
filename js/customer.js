/* ============================================
   NG Doce Duo — Helpers da área do cliente
   ============================================ */
(function (NG) {
  "use strict";

  NG.accountNav = function (active) {
    var items = [
      { key: "perfil", label: "Dados pessoais", icon: "user", href: "perfil.html" },
      { key: "enderecos", label: "Endereços", icon: "map", href: "enderecos.html" },
      { key: "pedidos", label: "Meus pedidos", icon: "box", href: "pedidos.html" },
    ];
    return (
      '<nav class="stack" style="gap:4px" aria-label="Menu da conta">' +
      items.map(function (i) {
        return '<a href="' + i.href + '" class="dropdown__item' + (i.key === active ? " is-active" : "") + '" style="' + (i.key === active ? "background:var(--color-surface-alt);color:var(--color-chocolate);font-weight:600" : "") + '">' + NG.icon(i.icon, { size: 18 }) + " " + i.label + "</a>";
      }).join("") +
      "</nav>"
    );
  };
})((window.NG = window.NG || {}));
