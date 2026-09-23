/* ============================================
   NG Doce Duo — Carrinho (estado + eventos)
   ============================================ */
(function (NG) {
  "use strict";

  const KEY = "ng_cart";
  const COUPON_KEY = "ng_coupon";
  const MAX_QTY = 10;

  const Cart = {
    items() {
      return NG.storage.get(KEY, []);
    },
    save(items) {
      NG.storage.set(KEY, items);
      Cart.emit();
    },
    count() {
      return Cart.items().reduce((s, i) => s + i.qty, 0);
    },
    add(productId, qty) {
      qty = qty || 1;
      const p = NG.getProduct(productId);
      if (!p) return;
      const items = Cart.items();
      const found = items.find((i) => i.id === productId);
      if (found) {
        found.qty = Math.min(MAX_QTY, found.qty + qty);
      } else {
        items.push({ id: productId, qty: Math.min(MAX_QTY, qty), price: p.price, name: p.name, image: p.image });
      }
      Cart.save(items);
    },
    setQty(productId, qty) {
      const items = Cart.items();
      const it = items.find((i) => i.id === productId);
      if (!it) return;
      it.qty = Math.max(1, Math.min(MAX_QTY, qty));
      Cart.save(items);
    },
    remove(productId) {
      const items = Cart.items();
      const removed = items.find((i) => i.id === productId);
      Cart.save(items.filter((i) => i.id !== productId));
      return removed;
    },
    restore(item) {
      const items = Cart.items();
      if (!items.find((i) => i.id === item.id)) items.push(item);
      Cart.save(items);
    },
    clear() {
      NG.storage.remove(KEY);
      NG.storage.remove(COUPON_KEY);
      Cart.emit();
    },
    subtotal() {
      return Cart.items().reduce((s, i) => s + i.price * i.qty, 0);
    },
    coupon() {
      return NG.storage.get(COUPON_KEY, null);
    },
    applyCoupon(code) {
      const items = Cart.items();
      const res = NG.couponService.validate(code, items, Cart.subtotal());
      if (!res.ok) return res;
      // guarda o código; o desconto é recalculado dinamicamente
      NG.storage.set(COUPON_KEY, { code: res.coupon.code });
      Cart.emit();
      return { ok: true, coupon: res.coupon };
    },
    removeCoupon() {
      NG.storage.remove(COUPON_KEY);
      Cart.emit();
    },
    // Reavalia o cupom guardado contra o estado atual da sacola.
    couponResult() {
      const saved = Cart.coupon();
      if (!saved) return null;
      return NG.couponService.validate(saved.code, Cart.items(), Cart.subtotal());
    },
    discount() {
      const r = Cart.couponResult();
      return r && r.ok ? r.discount : 0;
    },
    // Máximo de itens por produto (para UI)
    MAX_QTY,
    emit() {
      document.dispatchEvent(new CustomEvent("cart:change", { detail: { count: Cart.count() } }));
    },
  };

  NG.cart = Cart;
})((window.NG = window.NG || {}));
