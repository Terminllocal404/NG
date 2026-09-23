/* ============================================
   NG Doce Duo — productService
   Camada de dados de produtos. Hoje usa mock;
   troque o corpo por chamadas fetch() no futuro.
   ============================================ */
(function (NG) {
  "use strict";

  // Simula latência de rede opcionalmente
  function delay(v, ms) {
    return new Promise((res) => setTimeout(() => res(v), ms || 0));
  }

  // Persiste alterações de admin no localStorage sobre o mock
  function overlay() {
    return NG.storage.get("ng_products_overlay", {});
  }
  function saveOverlay(o) {
    NG.storage.set("ng_products_overlay", o);
  }

  function withOverlay(list) {
    const ov = overlay();
    return list
      .map((p) => (ov[p.id] ? Object.assign({}, p, ov[p.id]) : p))
      .concat(
        Object.values(ov)
          .filter((p) => p.__new)
          .map((p) => p)
      );
  }

  const S = {
    async list(filters) {
      filters = filters || {};
      let items = withOverlay(NG.products.slice());
      // catálogo público mostra apenas ativos (mas mantém esgotados visíveis)
      if (filters.publicOnly) items = items.filter((p) => p.active);
      if (filters.category) items = items.filter((p) => p.category === filters.category);
      if (filters.flavor) items = items.filter((p) => p.flavor === filters.flavor);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.shortDesc || "").toLowerCase().includes(q) ||
            NG.categoryName(p.category).toLowerCase().includes(q)
        );
      }
      if (filters.maxPrice) items = items.filter((p) => p.price <= filters.maxPrice);
      // ordenação
      switch (filters.sort) {
        case "price-asc": items.sort((a, b) => a.price - b.price); break;
        case "price-desc": items.sort((a, b) => b.price - a.price); break;
        case "name": items.sort((a, b) => a.name.localeCompare(b.name)); break;
        default: break; // relevância (ordem original + destaques)
      }
      return delay(items, 350);
    },

    async get(id) {
      const items = withOverlay(NG.products.slice());
      return delay(items.find((p) => p.id === id) || null, 200);
    },

    async featured() {
      return (await S.list({ publicOnly: true })).filter((p) => p.featured);
    },

    // Admin: salvar / criar / remover
    save(product) {
      const ov = overlay();
      ov[product.id] = Object.assign(ov[product.id] || {}, product);
      saveOverlay(ov);
      return product;
    },
    create(product) {
      const ov = overlay();
      product.id = product.id || NG.uid("prod");
      product.__new = true;
      ov[product.id] = product;
      saveOverlay(ov);
      return product;
    },
    remove(id) {
      const ov = overlay();
      ov[id] = Object.assign(ov[id] || { id }, { active: false, __removed: true });
      saveOverlay(ov);
    },
    toggleActive(id, active) {
      const ov = overlay();
      ov[id] = Object.assign(ov[id] || { id }, { active });
      saveOverlay(ov);
    },
  };

  NG.productService = S;
})((window.NG = window.NG || {}));
