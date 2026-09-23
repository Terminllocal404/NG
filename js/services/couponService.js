/* ============================================
   NG Doce Duo — couponService
   CRUD de cupons (admin) + validação/cálculo (carrinho).
   Persistência via localStorage. Pronto para API futura.
   ============================================ */
(function (NG) {
  "use strict";

  var KEY = "ng_coupons_v2";

  function seed() {
    var all = NG.storage.get(KEY, null);
    if (!all) {
      all = [
        { id: "cup_doce10", code: "DOCE10", description: "10% de desconto em tudo", type: "percent", value: 10, scope: "all", category: null, productIds: [], minSubtotal: 0, active: true },
        { id: "cup_bemvindo", code: "BEMVINDO", description: "R$ 8,00 de boas-vindas", type: "fixed", value: 8, scope: "all", category: null, productIds: [], minSubtotal: 30, active: true },
        { id: "cup_bolo10", code: "BOLO10", description: "10% em Bolos de Pote", type: "percent", value: 10, scope: "category", category: "bolos-de-pote", productIds: [], minSubtotal: 0, active: true },
      ];
      NG.storage.set(KEY, all);
    }
    return all;
  }

  function save(all) { NG.storage.set(KEY, all); }

  var S = {
    all() { return seed(); },
    active() { return seed().filter(function (c) { return c.active; }); },
    get(id) { return seed().find(function (c) { return c.id === id; }) || null; },
    getByCode(code) {
      code = (code || "").trim().toUpperCase();
      return seed().find(function (c) { return c.code.toUpperCase() === code; }) || null;
    },
    create(data) {
      var all = seed();
      data.id = data.id || NG.uid("cup");
      data.code = (data.code || "").trim().toUpperCase();
      all.push(data);
      save(all);
      return data;
    },
    update(id, patch) {
      var all = seed();
      var c = all.find(function (x) { return x.id === id; });
      if (c) { Object.assign(c, patch); if (patch.code) c.code = patch.code.trim().toUpperCase(); save(all); }
      return c;
    },
    remove(id) { save(seed().filter(function (c) { return c.id !== id; })); },
    toggle(id, active) { return S.update(id, { active: active }); },

    // Itens elegíveis conforme escopo
    eligibleItems(coupon, items) {
      if (coupon.scope === "category") {
        return items.filter(function (i) {
          var p = NG.getProduct(i.id);
          return p && p.category === coupon.category;
        });
      }
      if (coupon.scope === "products") {
        return items.filter(function (i) { return (coupon.productIds || []).indexOf(i.id) !== -1; });
      }
      return items.slice(); // all
    },

    /**
     * Valida e calcula. Retorna { ok, coupon, discount, error }
     * items: [{id, qty, price}], subtotal: number
     */
    validate(code, items, subtotal) {
      var c = S.getByCode(code);
      if (!c) return { ok: false, error: "Cupom inválido ou inexistente." };
      if (!c.active) return { ok: false, error: "Este cupom está inativo no momento." };
      if (c.minSubtotal && subtotal < c.minSubtotal) {
        return { ok: false, error: "Este cupom exige um pedido mínimo de " + NG.money(c.minSubtotal) + "." };
      }
      var elig = S.eligibleItems(c, items || []);
      if (!elig.length) {
        var msg = c.scope === "category"
          ? "Este cupom vale apenas para " + NG.categoryName(c.category) + "."
          : c.scope === "products"
            ? "Este cupom não é válido para os produtos da sua sacola."
            : "Este cupom não pode ser aplicado à sua sacola.";
        return { ok: false, error: msg };
      }
      var eligSubtotal = elig.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
      var discount = c.type === "percent"
        ? (eligSubtotal * c.value) / 100
        : Math.min(c.value, eligSubtotal);
      discount = Math.round(discount * 100) / 100;
      return { ok: true, coupon: c, discount: discount };
    },
  };

  NG.couponService = S;
})((window.NG = window.NG || {}));
