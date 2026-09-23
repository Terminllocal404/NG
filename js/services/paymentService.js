/* ============================================
   NG Doce Duo — paymentService (simulado / mock)
   FONTE ÚNICA DE VERDADE do status de pagamento.
   Distingue claramente DECLINED (recusado) de ERROR
   (falha técnica). Preparado para gateway real futuro.
   NENHUMA integração real com banco/adquirente/PIX.
   ============================================ */
(function (NG) {
  "use strict";

  // Estados padronizados (usados em todo o app)
  var PAYMENT_STATUS = {
    PENDING: "pending",       // iniciado, aguardando processamento
    PROCESSING: "processing", // em processamento
    APPROVED: "approved",     // processado e autorizado
    DECLINED: "declined",     // processado, porém NÃO autorizado
    ERROR: "error",           // falha técnica na operação
  };
  NG.PAYMENT_STATUS = PAYMENT_STATUS;

  // Mapa único de apresentação (rótulo + classe de badge + tom)
  NG.paymentStatusUI = {
    pending: { label: "Aguardando pagamento", badge: "badge--info" },
    processing: { label: "Processando pagamento", badge: "badge--warning" },
    approved: { label: "Pagamento aprovado", badge: "badge--success" },
    declined: { label: "Pagamento recusado", badge: "badge--danger" },
    error: { label: "Erro no processamento", badge: "badge--warning" },
  };
  // Rótulo curto para tabelas/detalhes (contexto de "Pagamento: X")
  NG.paymentShortLabel = function (status) {
    return ({ pending: "Aguardando", processing: "Processando", approved: "Confirmado", declined: "Recusado", error: "Erro técnico" })[status] || status;
  };
  NG.paymentStatusBadge = function (status) {
    var ui = NG.paymentStatusUI[status] || { label: status, badge: "badge--neutral" };
    return '<span class="badge ' + ui.badge + '">' + NG.escape(ui.label) + "</span>";
  };

  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  var S = {
    PAYMENT_STATUS: PAYMENT_STATUS,

    /* ---------- PIX ---------- */
    createPix(amount) {
      var txid = "NGDD" + Date.now().toString().slice(-10);
      var payload =
        "00020126580014BR.GOV.BCB.PIX0136" + txid +
        "520400005303986540" + amount.toFixed(2) +
        "5802BR5910NG DOCE DUO6009SAO PAULO62070503***6304ABCD";
      return { txid: txid, payload: payload, expiresInSec: 15 * 60 };
    },

    // Simula verificação do PIX; aprova após alguns segundos (modo demo)
    watchPix(txid, onApproved, opts) {
      opts = opts || {};
      var t = setTimeout(function () { onApproved && onApproved(); }, opts.approveAfter || 6000);
      return { cancel: function () { clearTimeout(t); } };
    },

    /**
     * FONTE ÚNICA DE VERDADE.
     * Processa qualquer método (pix/credito/debito) e retorna SEMPRE
     * um resultado padronizado: { status, code, message }.
     * - approved: autorizado
     * - declined: processado e recusado (ex.: cartão recusado)
     * - error:    falha técnica (exceção, serviço indisponível, timeout)
     *
     * Regras de simulação (mock, sem operadora real):
     *  - cartão terminado em 0  -> declined (CARD_DECLINED)
     *  - cartão terminado em 9  -> error    (PAYMENT_SERVICE_UNAVAILABLE)
     *  - demais                 -> approved
     */
    async processPayment(paymentData) {
      paymentData = paymentData || {};
      try {
        await delay(2000); // simula processamento
        if (paymentData.method === "pix") {
          // O PIX é resolvido por watchPix; aqui só validamos geração.
          return { status: PAYMENT_STATUS.APPROVED };
        }
        var num = String(paymentData.number || "").replace(/\D/g, "");
        if (!num) {
          return { status: PAYMENT_STATUS.ERROR, code: "INVALID_RESPONSE", message: "Resposta inválida do processamento." };
        }
        if (num.slice(-1) === "9") {
          // simula falha técnica
          return { status: PAYMENT_STATUS.ERROR, code: "PAYMENT_SERVICE_UNAVAILABLE", message: "Serviço de pagamento indisponível." };
        }
        if (num.slice(-1) === "0") {
          return { status: PAYMENT_STATUS.DECLINED, code: "CARD_DECLINED", message: "Cartão recusado pela operadora." };
        }
        return { status: PAYMENT_STATUS.APPROVED, code: "AUTHORIZED", authCode: "AUT" + Math.floor(Math.random() * 900000 + 100000) };
      } catch (e) {
        return { status: PAYMENT_STATUS.ERROR, code: "UNEXPECTED", message: "Falha inesperada no processamento." };
      }
    },

    // Log estruturado (modo desenvolvimento/mock)
    log(entry) {
      try {
        var logs = NG.storage.get("ng_payment_logs", []);
        logs.unshift(Object.assign({ timestamp: new Date().toISOString() }, entry));
        NG.storage.set("ng_payment_logs", logs.slice(0, 50));
      } catch (e) {}
    },
  };

  NG.paymentService = S;
})((window.NG = window.NG || {}));
