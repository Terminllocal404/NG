/* ============================================
   NG Doce Duo — Fluxo de checkout (5 etapas)
   1 Sacola · 2 Entrega/Retirada · 3 Agendamento
   4 Pagamento · 5 Confirmação
   ============================================ */
(function (NG) {
  "use strict";

  var STEPS = ["Sacola", "Entrega", "Agendamento", "Pagamento", "Confirmação"];
  var KEY = "ng_checkout";

  function getState() {
    return NG.storage.get(KEY, { step: 1, mode: "", address: null, schedule: {}, payment: {} });
  }
  function setState(s) {
    NG.storage.set(KEY, s);
  }

  function money(v) { return NG.money(v); }

  var Checkout = {
    root: null,
    pixWatcher: null,
    pixCountdown: null,

    mount(root) {
      this.root = root;
      this._finalized = false;
      this._processing = false;
      this._attemptId = null;
      var items = NG.cart.items();
      if (!items.length) {
        root.innerHTML = NG.emptyState({
          icon: "cart",
          title: "Sua sacola está vazia",
          message: "Adicione doces antes de finalizar o pedido.",
          actionHtml: '<a class="btn btn--primary btn--inline" href="../catalogo.html">Ver catálogo</a>',
        });
        return;
      }
      this.render();
    },

    stepper(current) {
      return (
        '<ol class="stepper">' +
        STEPS.map(function (label, i) {
          var n = i + 1;
          var cls = n < current ? "is-done" : n === current ? "is-current" : "";
          var inner = n < current ? NG.icon("check", { size: 16 }) : n;
          return '<li class="stepper__item ' + cls + '"><span class="stepper__dot">' + inner + '</span><span class="stepper__label">' + label + "</span></li>";
        }).join("") +
        "</ol>"
      );
    },

    totals() {
      var s = getState();
      var cfg = NG.getStoreConfig();
      var sub = NG.cart.subtotal();
      var disc = NG.cart.discount();
      var fee = 0;
      if (s.mode === "entrega") {
        fee = sub - disc >= cfg.freeDeliveryAbove ? 0 : cfg.deliveryFee;
      }
      return { sub: sub, disc: disc, fee: fee, total: sub - disc + fee };
    },

    summaryAside() {
      var t = this.totals();
      var s = getState();
      var items = NG.cart.items();
      var coupon = NG.cart.coupon();
      return (
        '<aside class="card order-summary" style="position:sticky;top:calc(var(--header-h) + 16px)">' +
        "<h3>Resumo</h3><div class=\"divider\"></div>" +
        items.map(function (i) {
          return '<div class="summary-row"><span class="muted">' + i.qty + "x " + NG.escape(i.name) + "</span><span>" + money(i.price * i.qty) + "</span></div>";
        }).join("") +
        '<div class="divider"></div>' +
        '<div class="summary-row"><span class="muted">Subtotal</span><span>' + money(t.sub) + "</span></div>" +
        (t.disc > 0 ? '<div class="summary-row"><span class="muted">Desconto (' + coupon.code + ')</span><span class="discount">- ' + money(t.disc) + "</span></div>" : "") +
        '<div class="summary-row"><span class="muted">Entrega</span><span>' + (s.mode === "entrega" ? (t.fee === 0 ? "Grátis" : money(t.fee)) : s.mode === "retirada" ? "Retirada" : "—") + "</span></div>" +
        '<div class="summary-row summary-row--total"><span>Total</span><span>' + money(t.total) + "</span></div>" +
        "</aside>"
      );
    },

    render() {
      var s = getState();
      var body = "";
      if (s.step === 1) body = this.stepSacola();
      else if (s.step === 2) body = this.stepEntrega();
      else if (s.step === 3) body = this.stepAgendamento();
      else if (s.step === 4) body = this.stepPagamento();
      else if (s.step === 5) { this.renderConfirmacao(); return; }

      this.root.innerHTML =
        this.stepper(s.step) +
        '<div class="split--checkout">' +
        '<div>' + body + "</div>" +
        this.summaryAside() +
        "</div>";
      this.wire();
    },

    goto(step) {
      var s = getState();
      s.step = step;
      setState(s);
      this.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    /* ---------- Etapa 1 ---------- */
    stepSacola() {
      var items = NG.cart.items();
      return (
        '<div class="card card--flat"><h2 style="margin-bottom:16px">Revise sua sacola</h2>' +
        items.map(function (i) {
          return '<div class="cart-item"><img class="cart-item__img" src="' + NG.url(i.image) + '" alt=""><div><div class="cart-item__name">' + NG.escape(i.name) + '</div><div class="cart-item__meta">' + i.qty + " un. × " + money(i.price) + '</div></div><span class="cart-item__price">' + money(i.price * i.qty) + "</span></div>";
        }).join("") +
        '<div class="flex mt-6" style="gap:12px"><a class="btn btn--secondary btn--inline" href="sacola.html">Editar sacola</a>' +
        '<button class="btn btn--primary btn--inline" data-next>Continuar</button></div></div>'
      );
    },

    /* ---------- Etapa 2 ---------- */
    stepEntrega() {
      var s = getState();
      var cfg = NG.getStoreConfig();
      var cust = NG.authService.getCustomer();
      var addresses = (cust && cust.addresses) || [];
      var addrHtml = addresses.length
        ? addresses.map(function (a) {
            var checked = s.address && s.address.id === a.id;
            return '<label class="option-card ' + (checked ? "is-selected" : "") + '"><input type="radio" name="addr" value="' + a.id + '"' + (checked ? " checked" : "") + '><div><div class="option-card__title">' + NG.escape(a.label) + '</div><div class="option-card__desc">' + NG.escape(a.street + ", " + a.number + (a.complement ? " - " + a.complement : "") + " · " + a.district + ", " + a.city + "/" + a.state) + "</div></div></label>";
          }).join("")
        : '<div class="alert alert--info">' + NG.icon("info", {}) + "<div>Você ainda não tem endereços salvos. Adicione um para entrega.</div></div>";

      var optRetirada = cfg.enablePickup
        ? '<label class="option-card ' + (s.mode === "retirada" ? "is-selected" : "") + '"><input type="radio" name="mode" value="retirada"' + (s.mode === "retirada" ? " checked" : "") + '>' +
            '<div><div class="option-card__title">' + NG.icon("store", { size: 18 }) + ' Retirada na loja</div><div class="option-card__desc">' + NG.escape(cfg.address.street + ", " + cfg.address.district) + " · sem taxa</div></div></label>"
        : "";
      var optEntrega = cfg.enableDelivery
        ? '<label class="option-card ' + (s.mode === "entrega" ? "is-selected" : "") + '"><input type="radio" name="mode" value="entrega"' + (s.mode === "entrega" ? " checked" : "") + '>' +
            '<div><div class="option-card__title">' + NG.icon("truck", { size: 18 }) + ' Entrega por motoboy</div><div class="option-card__desc">Taxa a partir de ' + money(cfg.deliveryFee) + " · grátis acima de " + money(cfg.freeDeliveryAbove) + "</div></div></label>"
        : "";
      var noneMsg = (!cfg.enablePickup && !cfg.enableDelivery)
        ? '<div class="alert alert--warning">' + NG.icon("alert", {}) + "<div>No momento não há modalidades de entrega ou retirada disponíveis. Entre em contato com a loja.</div></div>"
        : "";

      return (
        '<div class="card card--flat"><h2 style="margin-bottom:16px">Como você quer receber?</h2>' +
        '<div class="stack" style="gap:12px">' + optRetirada + optEntrega + noneMsg + "</div>" +
        '<div data-entrega-extra style="margin-top:24px"' + (s.mode === "entrega" ? "" : " hidden") + '>' +
          "<h3 style=\"margin-bottom:12px\">Endereço de entrega</h3>" +
          '<div class="stack" style="gap:12px">' + addrHtml + "</div>" +
          '<button class="btn btn--secondary btn--sm btn--inline mt-4" data-add-address>' + NG.icon("plus", { size: 16 }) + " Adicionar endereço</button>" +
        "</div>" +
        '<div data-retirada-extra style="margin-top:24px"' + (s.mode === "retirada" ? "" : " hidden") + '>' +
          '<div class="alert alert--info">' + NG.icon("store", {}) + "<div><strong>" + NG.escape(cfg.name) + "</strong><br>" + NG.escape(cfg.address.street + " — " + cfg.address.district + ", " + cfg.address.city + "/" + cfg.address.state) + "<br>" + NG.escape(cfg.pickupInfo) + "</div></div>" +
        "</div>" +
        '<div class="flex mt-8" style="gap:12px"><button class="btn btn--secondary btn--inline" data-back>Voltar</button>' +
        '<button class="btn btn--primary btn--inline" data-next>Continuar</button></div></div>'
      );
    },

    /* ---------- Etapa 3 ---------- */
    stepAgendamento() {
      var s = getState();
      // gera próximos 7 dias
      var days = [];
      var minHours = NG.getStoreConfig().scheduleMinHours || 4;
      var items = NG.cart.items();
      items.forEach(function (i) { var p = NG.getProduct(i.id); if (p && p.leadHours > minHours) minHours = p.leadHours; });
      var now = new Date();
      var startOffset = minHours >= 48 ? 2 : 0;
      for (var d = startOffset; d < startOffset + 7; d++) {
        var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
        days.push(dt);
      }
      var times = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
      var noteLead = minHours >= 48 ? "Este pedido inclui itens sob encomenda: agende com no mínimo 48h de antecedência." : "Escolha o melhor dia e horário para " + (s.mode === "retirada" ? "retirar" : "receber") + " seus doces.";

      return (
        '<div class="card card--flat"><h2 style="margin-bottom:8px">Agende seu pedido</h2>' +
        '<p class="text-soft" style="margin-bottom:16px">' + noteLead + "</p>" +
        "<h3 style=\"margin-bottom:8px\">Data</h3><div class=\"flex flex-wrap\" data-days style=\"gap:8px\">" +
        days.map(function (dt, i) {
          var iso = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");
          var wd = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][dt.getDay()];
          var sel = s.schedule && s.schedule.date === iso;
          return '<button type="button" class="chip ' + (sel ? "is-active" : "") + '" data-day="' + iso + '">' + wd + " " + dt.getDate() + "/" + (dt.getMonth() + 1) + "</button>";
        }).join("") +
        "</div>" +
        '<h3 style="margin:20px 0 8px">Horário</h3><div class="flex flex-wrap" data-times style="gap:8px">' +
        times.map(function (t) {
          var sel = s.schedule && s.schedule.time === t;
          return '<button type="button" class="chip ' + (sel ? "is-active" : "") + '" data-time="' + t + '">' + t + "</button>";
        }).join("") +
        "</div>" +
        '<div class="field mt-6"><label for="obs">Observações (opcional)</label><textarea id="obs" class="textarea" data-obs placeholder="Ex.: mensagem no cartão, ponto de referência...">' + NG.escape(s.schedule && s.schedule.obs || "") + "</textarea></div>" +
        '<div class="flex mt-6" style="gap:12px"><button class="btn btn--secondary btn--inline" data-back>Voltar</button>' +
        '<button class="btn btn--primary btn--inline" data-next>Ir para pagamento</button></div></div>'
      );
    },

    /* ---------- Etapa 4 ---------- */
    stepPagamento() {
      var s = getState();
      var method = s.payment.method || "";
      return (
        '<div class="card card--flat"><h2 style="margin-bottom:16px">Como você quer pagar?</h2>' +
        '<div class="stack" data-methods style="gap:12px">' +
          this.methodOption("pix", "pix", "PIX", "Aprovação na hora, sem taxas.", method) +
          this.methodOption("credito", "card", "Cartão de crédito", "Em até 3x sem juros.", method) +
          this.methodOption("debito", "card", "Cartão de débito", "Débito à vista.", method) +
        "</div>" +
        '<div data-payment-area style="margin-top:24px"></div>' +
        '<div class="flex mt-8" style="gap:12px"><button class="btn btn--secondary btn--inline" data-back>Voltar</button></div></div>'
      );
    },
    methodOption(val, icon, title, desc, current) {
      var sel = current === val;
      return '<label class="option-card ' + (sel ? "is-selected" : "") + '"><input type="radio" name="pay" value="' + val + '"' + (sel ? " checked" : "") + '><div><div class="option-card__title">' + NG.icon(icon, { size: 18 }) + " " + title + '</div><div class="option-card__desc">' + desc + "</div></div></label>";
    },

    renderPaymentArea(method) {
      var area = NG.qs("[data-payment-area]");
      if (!area) return;
      if (method === "pix") area.innerHTML = this.pixArea();
      else area.innerHTML = this.cardArea(method);
      this.wirePayment(method);
    },

    pixArea() {
      var t = this.totals();
      return (
        '<div class="card"><h3>Pague com PIX</h3>' +
        '<p class="text-soft mt-4">Valor: <strong>' + money(t.total) + "</strong></p>" +
        '<div data-pix-state="idle">' +
          '<p class="text-small text-soft mt-4">Clique abaixo para gerar o código PIX.</p>' +
          '<button class="btn btn--primary btn--block mt-4" data-gen-pix>Gerar PIX</button>' +
        "</div></div>"
      );
    },

    cardArea(method) {
      var t = this.totals();
      var parcelas = method === "credito"
        ? '<div class="field"><label for="cx-parc">Parcelas</label><select id="cx-parc" class="select" data-parc>' +
            "<option value=\"1\">1x de " + money(t.total) + " sem juros</option>" +
            "<option value=\"2\">2x de " + money(t.total / 2) + " sem juros</option>" +
            "<option value=\"3\">3x de " + money(t.total / 3) + " sem juros</option>" +
          "</select></div>"
        : '<div class="alert alert--info">' + NG.icon("info", {}) + "<div>Cartão de débito: cobrança à vista de <strong>" + money(t.total) + "</strong>.</div></div>";

      return (
        '<div class="card"><h3>' + (method === "credito" ? "Cartão de crédito" : "Cartão de débito") + "</h3>" +
        '<form data-card-form class="mt-4">' +
          '<div class="field"><label for="cx-num">Número do cartão <span class="req">*</span></label><input id="cx-num" class="input" inputmode="numeric" data-mask="cardNumber" data-validate="required cardNumber" placeholder="0000 0000 0000 0000"></div>' +
          '<div class="field"><label for="cx-name">Nome impresso no cartão <span class="req">*</span></label><input id="cx-name" class="input" data-validate="required" placeholder="Como está no cartão"></div>' +
          '<div class="form-row"><div class="field"><label for="cx-val">Validade <span class="req">*</span></label><input id="cx-val" class="input" inputmode="numeric" data-mask="cardExpiry" data-validate="required cardExpiry" placeholder="MM/AA"></div>' +
          '<div class="field"><label for="cx-cvv">CVV <span class="req">*</span></label><input id="cx-cvv" class="input" inputmode="numeric" data-mask="cvv" data-validate="required cvv" placeholder="123"></div></div>' +
          parcelas +
          '<button class="btn btn--primary btn--block mt-4" type="submit" data-pay-card>Pagar ' + money(t.total) + "</button>" +
          '<p class="text-small text-soft mt-4">Ambiente de demonstração: cartão terminado em <strong>0</strong> é recusado; terminado em <strong>9</strong> simula erro técnico; os demais são aprovados.</p>' +
        "</form></div>"
      );
    },

    /* ---------- Etapa 5 ---------- */
    renderConfirmacao() {
      var order = NG.storage.get("ng_last_order", null);
      if (!order) { this.goto(1); return; }
      this.root.innerHTML =
        '<div class="state" style="max-width:560px">' +
          '<div class="state__icon" style="color:var(--color-success)">' + NG.icon("check", { size: 64 }) + "</div>" +
          "<h1>Pedido confirmado!</h1>" +
          '<p>Recebemos seu pedido <strong>' + order.id + "</strong>. " + (order.payment.status === "aguardando" ? "Assim que o pagamento for confirmado, começamos a preparar." : "Já vamos começar a preparar com todo carinho.") + "</p>" +
        "</div>" +
        '<div class="card" style="max-width:560px;margin:0 auto">' +
          '<h3>Resumo do pedido</h3><div class="divider"></div>' +
          order.items.map(function (i) { return '<div class="summary-row"><span class="muted">' + i.qty + "x " + NG.escape(i.name) + "</span><span>" + money(i.price * i.qty) + "</span></div>"; }).join("") +
          '<div class="divider"></div>' +
          '<div class="summary-row"><span class="muted">Modalidade</span><span>' + (order.mode === "entrega" ? "Entrega" : "Retirada") + "</span></div>" +
          '<div class="summary-row"><span class="muted">' + (order.mode === "entrega" ? "Endereço" : "Local") + '</span><span style="text-align:right;max-width:60%">' + NG.escape(order.address) + "</span></div>" +
          '<div class="summary-row"><span class="muted">Data e horário</span><span>' + NG.dateBR(order.schedule.date) + " às " + order.schedule.time + "</span></div>" +
          '<div class="summary-row"><span class="muted">Pagamento</span><span>' + ({ pix: "PIX", credito: "Crédito", debito: "Débito" }[order.payment.method]) + " · " + NG.paymentShortLabel(order.payment.status) + "</span></div>" +
          '<div class="summary-row summary-row--total"><span>Total</span><span>' + money(NG.orderService.total(order)) + "</span></div>" +
          '<a class="btn btn--primary btn--block mt-6" href="../orders/acompanhar.html?id=' + order.id + '">Acompanhar pedido</a>' +
          '<a class="btn btn--ghost btn--block mt-4" href="../catalogo.html">Voltar às compras</a>' +
        "</div>";
      // limpa carrinho e estado
      NG.cart.clear();
      NG.storage.remove(KEY);
    },

    /* ---------- Wiring ---------- */
    wire() {
      var self = this;
      var s = getState();

      var next = NG.qs("[data-next]");
      if (next) next.addEventListener("click", function () { self.onNext(); });
      var back = NG.qs("[data-back]");
      if (back) back.addEventListener("click", function () { self.goto(Math.max(1, s.step - 1)); });

      // etapa 2
      NG.qsa('input[name="mode"]').forEach(function (r) {
        r.addEventListener("change", function () {
          s.mode = r.value; setState(s);
          NG.qs("[data-entrega-extra]").hidden = r.value !== "entrega";
          NG.qs("[data-retirada-extra]").hidden = r.value !== "retirada";
          NG.qsa(".option-card").forEach(function (c) { c.classList.remove("is-selected"); });
          r.closest(".option-card").classList.add("is-selected");
        });
      });
      NG.qsa('input[name="addr"]').forEach(function (r) {
        r.addEventListener("change", function () {
          var cust = NG.authService.getCustomer();
          s.address = cust.addresses.find(function (a) { return a.id === r.value; });
          setState(s);
        });
      });
      var addAddr = NG.qs("[data-add-address]");
      if (addAddr) addAddr.addEventListener("click", function () { self.addAddressModal(); });

      // etapa 3
      NG.qsa("[data-day]").forEach(function (b) {
        b.addEventListener("click", function () {
          NG.qsa("[data-day]").forEach(function (x) { x.classList.remove("is-active"); });
          b.classList.add("is-active");
          s.schedule.date = b.dataset.day; setState(s);
        });
      });
      NG.qsa("[data-time]").forEach(function (b) {
        b.addEventListener("click", function () {
          NG.qsa("[data-time]").forEach(function (x) { x.classList.remove("is-active"); });
          b.classList.add("is-active");
          s.schedule.time = b.dataset.time; setState(s);
        });
      });

      // etapa 4
      NG.qsa('input[name="pay"]').forEach(function (r) {
        r.addEventListener("change", function () {
          s.payment.method = r.value; setState(s);
          NG.qsa('[data-methods] .option-card').forEach(function (c) { c.classList.remove("is-selected"); });
          r.closest(".option-card").classList.add("is-selected");
          self.renderPaymentArea(r.value);
        });
      });
      if (s.step === 4 && s.payment.method) self.renderPaymentArea(s.payment.method);
    },

    onNext() {
      var s = getState();
      if (s.step === 2) {
        if (!s.mode) { NG.toast({ type: "danger", message: "Escolha entrega ou retirada." }); return; }
        if (s.mode === "entrega" && !s.address) { NG.toast({ type: "danger", message: "Selecione um endereço de entrega." }); return; }
      }
      if (s.step === 3) {
        if (!s.schedule.date || !s.schedule.time) { NG.toast({ type: "danger", message: "Selecione data e horário." }); return; }
        var obs = NG.qs("[data-obs]"); if (obs) { s.schedule.obs = obs.value; setState(s); }
      }
      this.goto(s.step + 1);
    },

    wirePayment(method) {
      var self = this;
      if (method === "pix") {
        var gen = NG.qs("[data-gen-pix]");
        if (gen) gen.addEventListener("click", function () { self.startPix(); });
      } else {
        var form = NG.qs("[data-card-form]");
        if (form) {
          NG.validation.bindForm(form);
          form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!NG.validation.validateForm(form)) return;
            self.processCard(method, form);
          });
        }
      }
    },

    startPix() {
      var self = this;
      var t = this.totals();
      var pix = NG.paymentService.createPix(t.total);
      var area = NG.qs("[data-payment-area]");
      area.innerHTML =
        '<div class="card"><h3>Escaneie para pagar</h3>' +
        '<div class="flex" style="gap:24px;flex-wrap:wrap;align-items:center;margin-top:16px">' +
          '<div>' + self.qrSvg(pix.txid) + "</div>" +
          '<div style="flex:1;min-width:220px">' +
            '<span class="badge badge--warning" data-pix-status>' + NG.icon("clock", { size: 14 }) + ' Aguardando pagamento</span>' +
            '<p class="text-small text-soft mt-4">Expira em <strong data-pix-timer>15:00</strong></p>' +
            '<label class="text-caption text-soft mt-4" style="display:block">PIX COPIA E COLA</label>' +
            '<div class="input-group mt-4"><input class="input" readonly value="' + pix.payload + '" data-pix-code style="font-size:12px"><button class="input-group__addon" data-copy-pix aria-label="Copiar código">' + NG.icon("copy", { size: 20 }) + "</button></div>" +
            '<button class="btn btn--secondary btn--block mt-4" data-copy-pix>Copiar código PIX</button>' +
            '<p class="text-small text-soft mt-4">Ambiente demo: o pagamento é aprovado automaticamente em alguns segundos.</p>' +
          "</div></div></div>";

      NG.qsa("[data-copy-pix]").forEach(function (b) {
        b.addEventListener("click", function () {
          var code = NG.qs("[data-pix-code]").value;
          navigator.clipboard && navigator.clipboard.writeText(code);
          NG.toast({ type: "success", message: "Código PIX copiado!" });
        });
      });

      // countdown
      var remaining = pix.expiresInSec;
      this.pixCountdown = setInterval(function () {
        remaining--;
        var m = String(Math.floor(remaining / 60)).padStart(2, "0");
        var sec = String(remaining % 60).padStart(2, "0");
        var timer = NG.qs("[data-pix-timer]");
        if (timer) timer.textContent = m + ":" + sec;
        if (remaining <= 0) { clearInterval(self.pixCountdown); self.pixExpired(); }
      }, 1000);

      // simula aprovação (PIX aprovado -> approved)
      this.pixWatcher = NG.paymentService.watchPix(pix.txid, function () {
        clearInterval(self.pixCountdown);
        NG.paymentService.log({ paymentAttemptId: self.attemptId(), method: "pix", status: NG.PAYMENT_STATUS.APPROVED, code: "AUTHORIZED" });
        self.finishOrder({ method: "pix", status: NG.PAYMENT_STATUS.APPROVED, txid: pix.txid });
      }, { approveAfter: 6000 });
    },

    pixExpired() {
      var self = this;
      if (this.pixWatcher) this.pixWatcher.cancel();
      var area = NG.qs("[data-payment-area]");
      area.innerHTML =
        '<div class="card"><div class="alert alert--danger">' + NG.icon("alert", {}) +
        "<div><strong>PIX expirado</strong><br>O tempo para pagamento acabou. Gere um novo código para continuar.</div></div>" +
        '<button class="btn btn--primary btn--block mt-4" data-gen-pix>Gerar novo PIX</button></div>';
      NG.qs("[data-gen-pix]").addEventListener("click", function () { self.startPix(); });
    },

    processCard(method, form) {
      var self = this;
      if (self._processing) return; // evita duplo clique
      self._processing = true;
      var PS = NG.PAYMENT_STATUS;
      var btn = NG.qs("[data-pay-card]");
      btn.classList.add("is-loading");
      btn.disabled = true;
      btn.textContent = "Processando pagamento...";
      // remove alertas anteriores
      NG.qsa("[data-pay-alert]", form).forEach(function (a) { a.remove(); });
      var data = {
        method: method,
        number: NG.qs("#cx-num").value,
        expiry: NG.qs("#cx-val").value,
        cvv: NG.qs("#cx-cvv").value,
      };
      NG.paymentService.processPayment(data).then(function (res) {
        self._processing = false;
        NG.paymentService.log({ paymentAttemptId: self.attemptId(), method: method, status: res.status, code: res.code });
        if (res.status === PS.APPROVED) {
          self.finishOrder({ method: method, status: PS.APPROVED, authCode: res.authCode });
          return;
        }
        // não aprovado: reabilita e mostra a situação correta
        btn.classList.remove("is-loading");
        btn.disabled = false;
        btn.textContent = "Tentar novamente";
        self.showPaymentResult(res.status, form);
      });
    },

    // Alerta distinto para DECLINED (recusa) vs ERROR (falha técnica)
    showPaymentResult(status, form) {
      var PS = NG.PAYMENT_STATUS;
      var alert = document.createElement("div");
      alert.setAttribute("data-pay-alert", "");
      alert.style.marginTop = "16px";
      if (status === PS.DECLINED) {
        alert.className = "alert alert--danger";
        alert.innerHTML = NG.icon("alert", {}) +
          "<div><strong>Pagamento recusado</strong><br>Não foi possível aprovar este pagamento. Verifique os dados informados ou tente outra forma de pagamento.</div>";
      } else {
        alert.className = "alert alert--warning";
        alert.innerHTML = NG.icon("alert", {}) +
          "<div><strong>Não foi possível processar o pagamento</strong><br>Ocorreu um problema técnico durante o processamento. Nenhum pagamento foi concluído. Tente novamente.</div>";
      }
      if (form) form.prepend(alert); else { var area = NG.qs("[data-payment-area]"); if (area) area.prepend(alert); }
    },

    attemptId() {
      if (!this._attemptId) this._attemptId = NG.uid("pay");
      return this._attemptId;
    },

    finishOrder(payment) {
      if (this._finalized) return; // idempotência: um pagamento -> um pedido
      this._finalized = true;
      var s = getState();
      var t = this.totals();
      var items = NG.cart.items().map(function (i) { return { id: i.id, name: i.name, qty: i.qty, price: i.price }; });
      var cust = NG.authService.getCustomer();
      var address = s.mode === "entrega" && s.address
        ? s.address.street + ", " + s.address.number + (s.address.complement ? " - " + s.address.complement : "") + ", " + s.address.district
        : "Retirada na loja — " + NG.getStoreConfig().address.street;
      var order = NG.orderService.create({
        customer: cust ? cust.name : "Cliente",
        customerId: cust ? cust.id : "guest",
        mode: s.mode,
        items: items,
        address: address,
        schedule: s.schedule,
        payment: payment,
        deliveryFee: t.fee,
        discount: t.disc,
      });
      NG.storage.set("ng_last_order", order);
      this.goto(5);
    },

    addAddressModal() {
      var self = this;
      NG.modal({
        title: "Adicionar endereço",
        body:
          '<form data-addr-form>' +
          '<div class="field"><label for="a-label">Identificação</label><input id="a-label" class="input" placeholder="Casa, Trabalho..." data-validate="required"></div>' +
          '<div class="form-row"><div class="field"><label for="a-cep">CEP</label><input id="a-cep" class="input" data-mask="cep" data-validate="required cep" placeholder="00000-000"></div>' +
          '<div class="field"><label for="a-num">Número</label><input id="a-num" class="input" data-validate="required number"></div></div>' +
          '<div class="field"><label for="a-street">Rua</label><input id="a-street" class="input" data-validate="required"></div>' +
          '<div class="field"><label for="a-comp">Complemento</label><input id="a-comp" class="input" placeholder="Opcional"></div>' +
          '<div class="form-row"><div class="field"><label for="a-dist">Bairro</label><input id="a-dist" class="input" data-validate="required"></div>' +
          '<div class="field"><label for="a-city">Cidade</label><input id="a-city" class="input" data-validate="required"></div></div>' +
          "</form>",
        footer: '<button class="btn btn--secondary btn--inline" data-close type="button">Cancelar</button><button class="btn btn--primary btn--inline" data-save type="button">Salvar endereço</button>',
        onMount: function (el, close) {
          var form = el.querySelector("[data-addr-form]");
          NG.validation.bindForm(form);
          el.querySelector("[data-save]").addEventListener("click", function () {
            if (!NG.validation.validateForm(form)) return;
            var addr = {
              id: NG.uid("end"),
              label: NG.qs("#a-label").value,
              cep: NG.qs("#a-cep").value,
              street: NG.qs("#a-street").value,
              number: NG.qs("#a-num").value,
              complement: NG.qs("#a-comp").value,
              district: NG.qs("#a-dist").value,
              city: NG.qs("#a-city").value,
              state: "SP",
              primary: false,
            };
            var cust = NG.authService.getCustomer();
            cust.addresses = cust.addresses || [];
            cust.addresses.push(addr);
            NG.authService.updateProfile({ addresses: cust.addresses });
            var s = getState(); s.address = addr; setState(s);
            close();
            self.render();
          });
        },
      });
    },

    qrSvg(seed) {
      // QR mock determinístico (visual) — não é um QR válido, apenas ilustrativo
      var size = 21;
      var cells = "";
      var h = 0;
      for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffffff;
      function rnd() { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; }
      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          var on = rnd() > 0.5;
          // finder patterns
          if ((x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)) {
            var fx = x % (size - 7 === x - (size - 7) ? 1 : 1);
            on = ((x % 7 === 0 || x % 7 === 6 || y % 7 === 0 || y % 7 === 6) && (x < 7 || x >= size - 7) && (y < 7 || y >= size - 7)) || ((x % 7 >= 2 && x % 7 <= 4 && y % 7 >= 2 && y % 7 <= 4));
          }
          if (on) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
        }
      }
      return '<svg width="180" height="180" viewBox="0 0 21 21" role="img" aria-label="QR Code PIX" style="background:#fff;border-radius:8px;padding:6px;border:1px solid var(--color-border)"><g fill="#402820">' + cells + "</g></svg>";
    },
  };

  NG.checkout = Checkout;
})((window.NG = window.NG || {}));
