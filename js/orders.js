/* ============================================
   NG Doce Duo — Componentes de pedido
   Timeline (círculos + linhas) e Order Card.
   Reutilizado no cliente e no admin.
   ============================================ */
(function (NG) {
  "use strict";

  // Renderiza a timeline. orientation: "auto" (horizontal no desktop) ou "vertical"
  NG.renderTimeline = function (order, orientation) {
    var steps = NG.orderService.timeline(order);
    var cls = "timeline " + (orientation === "vertical" ? "timeline--vertical" : "timeline--vertical timeline--auto");
    var html = '<ol class="' + cls + '">';
    steps.forEach(function (s) {
      var stateCls = s.state === "done" ? "is-done" : s.state === "current" ? "is-current" : s.state === "cancelled" ? "is-cancelled" : "";
      var mark = s.state === "done" ? NG.icon("check", { size: 14 }) : s.state === "cancelled" ? NG.icon("close", { size: 14 }) : "";
      var time = "";
      if (s.state === "current") time = '<span class="timeline__time">Etapa atual</span>';
      else if (s.state === "done") time = '<span class="timeline__time">Concluído</span>';
      html +=
        '<li class="timeline__step ' + stateCls + '">' +
        '<span class="timeline__bullet">' + mark + "</span>" +
        '<div class="timeline__content"><h4>' + NG.escape(s.label) + "</h4>" + time + "</div></li>";
    });
    html += "</ol>";
    return html;
  };

  var STATUS_BADGE = {
    pedido_recebido: "badge--info",
    pagamento_confirmado: "badge--info",
    em_preparacao: "badge--warning",
    pedido_pronto: "badge--warning",
    saiu_para_entrega: "badge--info",
    aguardando_retirada: "badge--info",
    entregue: "badge--success",
    retirado: "badge--success",
    cancelado: "badge--danger",
  };

  NG.statusBadge = function (status) {
    return '<span class="badge ' + (STATUS_BADGE[status] || "badge--neutral") + '">' + (NG.orderStatus[status] || status) + "</span>";
  };

  // Card de pedido (lista do cliente)
  NG.orderCard = function (o, hrefBase) {
    var items = o.items.map(function (i) { return i.qty + "x " + i.name; }).join(", ");
    var href = (hrefBase || "detalhe.html") + "?id=" + o.id;
    return (
      '<a class="card" href="' + href + '" style="display:block">' +
      '<div class="flex-between flex-wrap"><div><strong>Pedido ' + o.id + "</strong>" +
      '<div class="text-small text-soft">' + NG.dateTimeBR(o.date) + "</div></div>" +
      NG.statusBadge(o.status) + "</div>" +
      '<p class="text-small text-soft mt-4">' + NG.escape(items) + "</p>" +
      '<div class="flex-between mt-4"><span class="text-small">' + (o.mode === "entrega" ? NG.icon("truck", { size: 16 }) + " Entrega" : NG.icon("store", { size: 16 }) + " Retirada") + "</span>" +
      '<strong>' + NG.money(NG.orderService.total(o)) + "</strong></div></a>"
    );
  };
})((window.NG = window.NG || {}));
