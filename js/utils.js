/* ============================================
   NG Doce Duo — Utilidades globais
   ============================================ */
(function (NG) {
  "use strict";

  // Detecta profundidade para resolver caminhos relativos (raiz vs /pages/x/)
  NG.base = (function () {
    const path = location.pathname.replace(/\\/g, "/");
    const marker = "/pages/";
    const idx = path.indexOf(marker);
    if (idx === -1) return "";
    const after = path.slice(idx + marker.length);
    const depth = after.split("/").length - 1; // subpastas após /pages/
    return "../".repeat(depth + 1);
  })();

  NG.url = function (rel) {
    return NG.base + rel;
  };

  NG.money = function (v) {
    return "R$ " + Number(v || 0).toFixed(2).replace(".", ",");
  };

  NG.dateBR = function (iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) {
      // aceita "2026-09-16"
      const parts = String(iso).split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return iso;
    }
    return d.toLocaleDateString("pt-BR");
  };

  NG.dateTimeBR = function (iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return (
      d.toLocaleDateString("pt-BR") +
      " às " +
      d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Storage helpers seguros
  NG.storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {}
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    },
  };

  NG.uid = function (prefix) {
    return (prefix || "id") + "-" + Math.random().toString(36).slice(2, 8);
  };

  NG.qs = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  NG.qsa = function (sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  };

  NG.param = function (name) {
    return new URLSearchParams(location.search).get(name);
  };

  NG.escape = function (str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  };

  // Configuração da loja: mescla os padrões com o que o admin salvou.
  NG.getStoreConfig = function () {
    const saved = NG.storage.get("ng_store_config", null) || {};
    const base = NG.store;
    return {
      name: saved.name != null ? saved.name : base.name,
      phone: saved.phone != null ? saved.phone : base.phone,
      email: saved.email != null ? saved.email : base.email,
      hours: saved.hours != null ? saved.hours : base.hours,
      address: Object.assign({}, base.address, saved.address || {}),
      deliveryFee: saved.deliveryFee != null ? saved.deliveryFee : base.deliveryFee,
      freeDeliveryAbove: saved.freeDeliveryAbove != null ? saved.freeDeliveryAbove : base.freeDeliveryAbove,
      scheduleMinHours: saved.scheduleMinHours != null ? saved.scheduleMinHours : base.scheduleMinHours,
      pickupInfo: saved.pickupInfo != null ? saved.pickupInfo : base.pickupInfo,
      enableDelivery: saved.enableDelivery != null ? saved.enableDelivery : true,
      enablePickup: saved.enablePickup != null ? saved.enablePickup : true,
    };
  };

  NG.getProduct = function (id) {
    return (NG.products || []).find((p) => p.id === id);
  };

  NG.categoryName = function (slug) {
    const c = (NG.categories || []).find((x) => x.slug === slug);
    return c ? c.name : slug;
  };

  // Disponibilidade de produto
  NG.availability = function (p) {
    if (!p.active) return { state: "indisponivel", label: "Indisponível" };
    if (p.stock <= 0) return { state: "esgotado", label: "Esgotado" };
    if (p.stock <= 5) return { state: "baixo", label: "Últimas unidades" };
    return { state: "disponivel", label: "Disponível" };
  };
})((window.NG = window.NG || {}));
