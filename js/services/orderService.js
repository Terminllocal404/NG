/* ============================================
   NG Doce Duo — orderService
   ============================================ */
(function (NG) {
  "use strict";

  const KEY = "ng_orders";

  function seed() {
    let all = NG.storage.get(KEY, null);
    if (!all) {
      all = JSON.parse(JSON.stringify(NG.demoOrders));
      NG.storage.set(KEY, all);
    }
    return all;
  }

  // Fluxo de status conforme modalidade
  NG.statusFlow = {
    entrega: [
      "pedido_recebido",
      "pagamento_confirmado",
      "em_preparacao",
      "pedido_pronto",
      "saiu_para_entrega",
      "entregue",
    ],
    retirada: [
      "pedido_recebido",
      "pagamento_confirmado",
      "em_preparacao",
      "pedido_pronto",
      "aguardando_retirada",
      "retirado",
    ],
  };

  const S = {
    all() {
      return seed();
    },
    byCustomer(customerId) {
      return seed().filter((o) => o.customerId === customerId);
    },
    get(id) {
      return seed().find((o) => o.id === id) || null;
    },
    create(order) {
      const all = seed();
      const num = "NG-" + (1060 + all.length);
      const full = Object.assign(
        {
          id: num,
          date: new Date().toISOString(),
          // pedido só é confirmado (pagamento) quando o pagamento é approved
          status: order.payment && order.payment.status === "approved"
            ? "pagamento_confirmado"
            : "pedido_recebido",
        },
        order
      );
      all.unshift(full);
      NG.storage.set(KEY, all);
      return full;
    },
    updateStatus(id, status) {
      const all = seed();
      const o = all.find((x) => x.id === id);
      if (o) {
        o.status = status;
        NG.storage.set(KEY, all);
      }
      return o;
    },
    total(o) {
      const sub = o.items.reduce((s, i) => s + i.price * i.qty, 0);
      return sub + (o.deliveryFee || 0) - (o.discount || 0);
    },
    subtotal(o) {
      return o.items.reduce((s, i) => s + i.price * i.qty, 0);
    },
    // Constrói steps para a timeline
    timeline(o) {
      const flow = NG.statusFlow[o.mode] || NG.statusFlow.entrega;
      if (o.status === "cancelado") {
        return [{ key: "cancelado", label: "Pedido cancelado", state: "cancelled" }];
      }
      const currentIdx = flow.indexOf(o.status);
      return flow.map((key, i) => ({
        key,
        label: NG.orderStatus[key],
        state: i < currentIdx ? "done" : i === currentIdx ? "current" : "future",
      }));
    },
  };

  NG.orderService = S;
})((window.NG = window.NG || {}));
