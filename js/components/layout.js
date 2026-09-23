/* ============================================
   NG Doce Duo — Layout (header/footer/drawer)
   Injeta em [data-layout="header"] e [data-layout="footer"]
   ============================================ */
(function (NG) {
  "use strict";

  const navLinks = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "pages/catalogo.html", label: "Catálogo", key: "catalogo" },
    { href: "pages/catalogo.html?cat=bolos-inteiros", label: "Bolos", key: "bolos" },
    { href: "pages/catalogo.html?cat=bolos-de-pote", label: "Bolos de Pote", key: "potes" },
    { href: "pages/contato.html", label: "Contato", key: "contato" },
  ];

  function headerHTML(active) {
    const logo = NG.url("assets/logo/ng-doce-duo-logo.png");

    // Refina o item ativo quando a página é o catálogo filtrado por categoria,
    // para que "Bolos" e "Bolos de Pote" acendam em vez de "Catálogo".
    // Um único item principal fica ativo por vez.
    let effectiveActive = active;
    if (/catalogo\.html$/.test(location.pathname.replace(/\\/g, "/"))) {
      const cat = new URLSearchParams(location.search).get("cat");
      if (cat === "bolos-inteiros") effectiveActive = "bolos";
      else if (cat === "bolos-de-pote") effectiveActive = "potes";
      else effectiveActive = "catalogo";
    }

    const links = navLinks
      .map((l) => {
        const trig = l.key === "catalogo" ? ' data-catalog-trigger aria-haspopup="true" aria-expanded="false" aria-controls="catalog-menu"' : "";
        return `<a href="${NG.url(l.href)}" class="${l.key === effectiveActive ? "is-active" : ""}"${trig}>${l.label}</a>`;
      })
      .join("");

    const cust = NG.authService.getCustomer();
    const accountHref = cust ? NG.url("pages/customer/perfil.html") : NG.url("pages/auth/login.html");
    const accountLabel = cust ? "Minha conta" : "Entrar";

    return `
    <a href="#main" class="skip-link">Pular para o conteúdo</a>
    <header class="site-header">
      <div class="container site-header__bar">
        <a href="${NG.url("index.html")}" class="brand header-brand" aria-label="NG Doce Duo — início">
          <img src="${logo}" alt="Logo NG Doce Duo" width="48" height="48" />
          <span class="brand__text">
            <span class="brand__name">NG Doce Duo</span>
            <span class="brand__tag">Tudo com amor</span>
          </span>
        </a>
        <nav class="main-nav header-navigation" aria-label="Navegação principal">${links}</nav>
        <div class="header-actions">
          <button class="icon-btn" type="button" aria-label="Pesquisar" title="Pesquisar" data-search-toggle>${NG.icon("search", { size: 24 })}</button>
          <a class="icon-btn" href="${accountHref}" aria-label="${accountLabel}" title="${accountLabel}">${NG.icon("user", { size: 24 })}</a>
          <a class="icon-btn" href="${NG.url("pages/checkout/sacola.html")}" aria-label="Sacola de compras" title="Sacola">
            ${NG.icon("cart", { size: 24 })}
            <span class="cart-count" data-cart-count aria-live="polite"></span>
          </a>
          <button class="hamburger" type="button" aria-label="Abrir menu" title="Menu" data-drawer-open>${NG.icon("menu", { size: 24 })}</button>
        </div>
      </div>
      <div class="header-search" hidden data-search-panel>
        <div class="container" style="position:relative">
          <form data-search-form role="search">
            <div class="input-group">
              <input class="input" type="search" name="q" placeholder="Buscar doces, bolos, sabores..." aria-label="Buscar produtos" autocomplete="off" data-search-input>
              <span class="input-group__addon">${NG.icon("search", { size: 20 })}</span>
            </div>
          </form>
          <div class="search-suggestions" hidden data-search-suggestions></div>
        </div>
      </div>
    </header>`;
  }

  function drawerHTML(active) {
    let effectiveActive = active;
    if (/catalogo\.html$/.test(location.pathname.replace(/\\/g, "/"))) {
      const cat = new URLSearchParams(location.search).get("cat");
      if (cat === "bolos-inteiros") effectiveActive = "bolos";
      else if (cat === "bolos-de-pote") effectiveActive = "potes";
      else effectiveActive = "catalogo";
    }
    const cust = NG.authService.getCustomer();
    const links = navLinks
      .map((l) => {
        const trig = l.key === "catalogo" ? ' data-catalog-trigger aria-haspopup="true" aria-expanded="false" aria-controls="catalog-menu"' : "";
        return `<a href="${NG.url(l.href)}" class="${l.key === effectiveActive ? "is-active" : ""}"${trig}>${l.label}</a>`;
      })
      .join("");
    const account = cust
      ? `<a href="${NG.url("pages/customer/perfil.html")}">Minha conta</a>
         <a href="${NG.url("pages/customer/pedidos.html")}">Meus pedidos</a>`
      : `<a href="${NG.url("pages/auth/login.html")}">Entrar</a>
         <a href="${NG.url("pages/auth/cadastro.html")}">Criar conta</a>`;
    return `
      <div class="drawer-backdrop" data-drawer-close></div>
      <aside class="drawer" role="dialog" aria-label="Menu" aria-modal="true">
        <div class="drawer__head">
          <span class="brand__name" style="color:var(--color-chocolate)">Menu</span>
          <button class="icon-btn" style="color:var(--color-chocolate)" data-drawer-close aria-label="Fechar menu">${NG.icon("close", { size: 24 })}</button>
        </div>
        <nav aria-label="Navegação mobile">
          ${links}
          <hr class="divider">
          ${account}
          <a href="${NG.url("pages/admin/login.html")}">Área administrativa</a>
        </nav>
      </aside>`;
  }

  function footerHTML() {
    const s = NG.store;
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__grid">
          <div>
            <div class="brand" style="margin-bottom:16px">
              <img src="${NG.url("assets/logo/ng-doce-duo-logo.png")}" alt="" width="48" height="48" style="border-radius:50%;background:var(--color-cream)">
              <span class="brand__name">NG Doce Duo</span>
            </div>
            <p>Doces artesanais feitos com amor. Bolos de pote, copos da felicidade, brigadeiros e bolos para todos os momentos.</p>
            <p>${NG.icon("map", { size: 16 })} ${s.address.street} — ${s.address.district}, ${s.address.city}/${s.address.state}</p>
          </div>
          <div>
            <h4>Loja</h4>
            <a href="${NG.url("pages/catalogo.html")}">Catálogo</a>
            <a href="${NG.url("pages/catalogo.html?cat=bolos-de-pote")}">Bolos de Pote</a>
            <a href="${NG.url("pages/catalogo.html?cat=copos-da-felicidade")}">Copos da Felicidade</a>
            <a href="${NG.url("pages/catalogo.html?cat=bolos-inteiros")}">Bolos Inteiros</a>
          </div>
          <div>
            <h4>Conta</h4>
            <a href="${NG.url("pages/auth/login.html")}">Entrar</a>
            <a href="${NG.url("pages/auth/cadastro.html")}">Criar conta</a>
            <a href="${NG.url("pages/customer/pedidos.html")}">Meus pedidos</a>
            <a href="${NG.url("pages/checkout/sacola.html")}">Sacola</a>
          </div>
          <div>
            <h4>Atendimento</h4>
            <p>${NG.icon("phone", { size: 16 })} ${s.phone}</p>
            <p>${NG.icon("clock", { size: 16 })} ${s.hours}</p>
            <a href="${NG.url("pages/contato.html")}">Fale conosco</a>
          </div>
        </div>
        <div class="footer-bottom">
          © 2026 NG Doce Duo · Sabor que aproxima · Feito com amor 🤍
        </div>
      </div>
    </footer>`;
  }

  function updateCartBadge() {
    const count = NG.cart.count();
    NG.qsa("[data-cart-count]").forEach((el) => {
      el.textContent = count > 0 ? count : "";
      el.dataset.count = count;
    });
  }

  function renderSuggestions(panel, q) {
    const recent = NG.storage.get("ng_recent_search", []);
    let html = "";
    if (q && q.length >= 2) {
      const matches = NG.products
        .filter((p) => p.active && p.name.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 5);
      if (matches.length) {
        html += `<h4>Sugestões</h4>` + matches
          .map((p) => `<a href="${NG.url("pages/produto.html?id=" + p.id)}">${NG.icon("search", { size: 16 })} ${NG.escape(p.name)}</a>`)
          .join("");
      } else {
        html += `<h4>Nenhum resultado para “${NG.escape(q)}”</h4>`;
      }
    } else if (recent.length) {
      html += `<h4>Buscas recentes</h4>` + recent
        .slice(0, 5)
        .map((t) => `<button type="button" data-recent="${NG.escape(t)}">${NG.icon("clock", { size: 16 })} ${NG.escape(t)}</button>`)
        .join("");
    } else {
      html += `<h4>Populares</h4>` + ["Oreo", "Maracujá", "Ninho", "Brigadeiro"]
        .map((t) => `<button type="button" data-recent="${t}">${NG.icon("star", { size: 16 })} ${t}</button>`)
        .join("");
    }
    panel.innerHTML = html;
    panel.hidden = false;
  }

  function wireHeader(active) {
    // Drawer
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-drawer-open]")) {
        const wrap = document.createElement("div");
        wrap.id = "drawer-root";
        wrap.innerHTML = drawerHTML(active);
        document.body.appendChild(wrap);
        wrap.querySelectorAll("[data-drawer-close]").forEach((b) =>
          b.addEventListener("click", () => wrap.remove())
        );
        wrap.querySelector(".drawer a").focus();
      }
    });

    // Busca
    const toggle = NG.qs("[data-search-toggle]");
    const panel = NG.qs("[data-search-panel]");
    const input = NG.qs("[data-search-input]");
    const sugg = NG.qs("[data-search-suggestions]");
    if (toggle && panel) {
      toggle.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        if (!panel.hidden) {
          input.focus();
          renderSuggestions(sugg, "");
        } else {
          sugg.hidden = true;
        }
      });
    }

    // Fecha o painel de busca sem apagar texto/histórico/estado.
    function closeSearch() {
      if (panel && !panel.hidden) {
        panel.hidden = true;
        if (sugg) sugg.hidden = true;
      }
    }
    if (panel) {
      // ESC fecha
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeSearch();
      });
      // Clique fora fecha; dentro do painel/input/sugestões ou no toggle, mantém
      document.addEventListener("click", (e) => {
        if (panel.hidden) return;
        if (e.target.closest("[data-search-panel]")) return;
        if (e.target.closest("[data-search-toggle]")) return;
        closeSearch();
      });
    }
    if (input) {
      let deb;
      input.addEventListener("input", () => {
        clearTimeout(deb);
        deb = setTimeout(() => renderSuggestions(sugg, input.value.trim()), 250);
      });
    }
    if (sugg) {
      sugg.addEventListener("click", (e) => {
        const rec = e.target.closest("[data-recent]");
        if (rec) {
          input.value = rec.dataset.recent;
          NG.qs("[data-search-form]").requestSubmit();
        }
      });
    }
    const form = NG.qs("[data-search-form]");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (!q) return;
        const recent = NG.storage.get("ng_recent_search", []);
        if (!recent.includes(q)) recent.unshift(q);
        NG.storage.set("ng_recent_search", recent.slice(0, 8));
        location.href = NG.url("pages/catalogo.html?q=" + encodeURIComponent(q));
      });
    }

    // Sombra dinâmica do header ao rolar (sem layout shift; só box-shadow)
    var headerEl = NG.qs(".site-header");
    if (headerEl) {
      var onScroll = function () {
        headerEl.classList.toggle("is-scrolled", window.scrollY > 4);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    document.addEventListener("cart:change", updateCartBadge);
    updateCartBadge();
  }

  // FE-012 — menu de categorias (dropdown desktop / gaveta <1024). Textos e
  // contagens conforme especificação; links usam as rotas existentes (?cat=).
  const catalogCats = [
    { label: "Bolos de pote", meta: "18 sabores", href: "pages/catalogo.html?cat=bolos-de-pote" },
    { label: "Copos da felicidade", meta: "6 sabores", href: "pages/catalogo.html?cat=copos-da-felicidade" },
    { label: "Bolos inteiros", meta: "9 sabores", href: "pages/catalogo.html?cat=bolos-inteiros" },
    { label: "Brownies e doces", meta: "7 itens", href: "pages/catalogo.html?cat=doces" },
  ];
  const catalogOcasioes = ["Aniversário", "Presente", "Para dividir", "Só para mim"];

  function catalogMenuHTML() {
    const cats = catalogCats
      .map((c) => `<a class="catalog-menu__item" href="${NG.url(c.href)}"><span>${c.label}</span><span class="catalog-menu__meta">${c.meta}</span></a>`)
      .join("");
    // Sem filtro por ocasião no front-end atual → apontam para o catálogo geral (spec §9)
    const oc = catalogOcasioes
      .map((o) => `<a class="catalog-menu__item" href="${NG.url("pages/catalogo.html")}">${o}</a>`)
      .join("");
    const prodHref = NG.url("pages/produto.html?id=bolo-ninho-nutella");
    return `
    <div class="catalog-menu__overlay" data-catalog-close hidden></div>
    <div class="catalog-menu" id="catalog-menu" role="dialog" aria-label="Categorias" hidden>
      <div class="container catalog-menu__inner">
        <button class="catalog-menu__close icon-btn" type="button" data-catalog-close aria-label="Fechar menu de categorias">${NG.icon("close", { size: 24 })}</button>
        <div class="catalog-menu__col">
          <h3 class="catalog-menu__title">Categorias</h3>
          ${cats}
          <a class="catalog-menu__all" href="${NG.url("pages/catalogo.html")}">Ver todo o catálogo →</a>
        </div>
        <div class="catalog-menu__col">
          <h3 class="catalog-menu__title">Por ocasião</h3>
          ${oc}
          <div class="catalog-menu__feature">
            <span class="catalog-menu__feature-tag">Novo:</span>
            <strong class="catalog-menu__feature-name">Ninho com Nutella</strong>
            <a class="btn btn--primary btn--sm btn--inline" href="${prodHref}">Ver</a>
          </div>
        </div>
      </div>
    </div>`;
  }

  function wireCatalogMenu() {
    const overlay = NG.qs(".catalog-menu__overlay");
    const menu = NG.qs(".catalog-menu");
    if (!menu || !overlay) return;
    const isDrawer = () => window.matchMedia("(max-width:1024px)").matches;
    let lastTrigger = null;
    const setAria = (v) => NG.qsa("[data-catalog-trigger]").forEach((t) => t.setAttribute("aria-expanded", v));

    function open(trigger) {
      if (menu.classList.contains("is-open")) return;
      lastTrigger = trigger || null;
      // fecha a gaveta do hambúrguer, se aberta (evita dois drawers)
      const dr = document.getElementById("drawer-root");
      if (dr) dr.remove();
      menu.hidden = false;
      overlay.hidden = false;
      requestAnimationFrame(() => { menu.classList.add("is-open"); overlay.classList.add("is-open"); });
      setAria("true");
    }
    function close(restoreFocus) {
      if (!menu.classList.contains("is-open")) return;
      menu.classList.remove("is-open");
      overlay.classList.remove("is-open");
      setAria("false");
      setTimeout(() => {
        if (!menu.classList.contains("is-open")) { menu.hidden = true; overlay.hidden = true; }
      }, 200);
      if (restoreFocus && lastTrigger && lastTrigger.focus) lastTrigger.focus();
    }

    // Hover/foco abrem no desktop (gatilho estático do header)
    NG.qsa("[data-catalog-trigger]").forEach((t) => {
      t.addEventListener("mouseenter", () => { if (!isDrawer()) open(t); });
      t.addEventListener("focus", () => { if (!isDrawer()) open(t); });
    });
    // Clique delegado: cobre o gatilho do header e o da gaveta (criada dinamicamente).
    // Em drawer (<=1024) abre/fecha o menu; no desktop o link navega normalmente.
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-catalog-trigger]");
      if (!t || !isDrawer()) return;
      e.preventDefault();
      menu.classList.contains("is-open") ? close(true) : open(t);
    });
    overlay.addEventListener("click", () => close());
    NG.qsa("[data-catalog-close]").forEach((b) => b.addEventListener("click", () => close(true)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) close(true); });
    menu.addEventListener("mouseleave", () => { if (!isDrawer()) close(); });
    // clicar num link do menu fecha (a navegação segue)
    menu.addEventListener("click", (e) => { const a = e.target.closest("a"); if (a && !a.hasAttribute("data-catalog-close")) close(); });
    // clique fora (desktop dropdown)
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      if (e.target.closest(".catalog-menu") || e.target.closest("[data-catalog-trigger]")) return;
      close();
    });
  }

  NG.mountLayout = function (active) {
    const h = NG.qs('[data-layout="header"]');
    if (h) h.innerHTML = headerHTML(active);
    const f = NG.qs('[data-layout="footer"]');
    if (f) f.innerHTML = footerHTML();
    wireHeader(active);
    if (!NG.qs(".catalog-menu")) {
      document.body.insertAdjacentHTML("beforeend", catalogMenuHTML());
      wireCatalogMenu();
    }
  };

  // Renderizador de product card (reutilizável)
  NG.productCard = function (p) {
    const av = NG.availability(p);
    const href = NG.url("pages/produto.html?id=" + p.id);
    let flag = "";
    if (av.state === "esgotado") flag = `<span class="badge badge--danger product-card__flag">Esgotado</span>`;
    else if (av.state === "indisponivel") flag = `<span class="badge badge--neutral product-card__flag">Indisponível</span>`;
    else if (p.badges && p.badges.length) flag = `<span class="badge product-card__flag">${NG.escape(p.badges[0])}</span>`;

    const canBuy = av.state === "disponivel" || av.state === "baixo";
    const btn = canBuy
      ? `<button class="btn btn--primary btn--sm btn--inline" type="button" data-add="${p.id}">Adicionar</button>`
      : `<button class="btn btn--sm btn--inline" type="button" disabled>${av.state === "esgotado" ? "Esgotado" : "Indisponível"}</button>`;

    return `
    <article class="product-card ${canBuy ? "" : "is-out"}">
      <a href="${href}" class="product-card__media" aria-label="${NG.escape(p.name)}">
        ${flag}
        <img src="${NG.url(p.image)}" alt="${NG.escape(p.name)}" loading="lazy">
      </a>
      <div class="product-card__body">
        <span class="product-card__cat">${NG.escape(NG.categoryName(p.category))}</span>
        <a href="${href}"><h3 class="product-card__name">${NG.escape(p.name)}</h3></a>
        <p class="product-card__desc">${NG.escape(p.shortDesc)}</p>
        <div class="product-card__foot">
          <span class="product-card__price">${NG.money(p.price)}</span>
          ${btn}
        </div>
      </div>
    </article>`;
  };

  // Variante de card para "Destaques da semana" (FE-019).
  // Reutiliza os dados/URL existentes e o handler global [data-add];
  // adiciona o CTA principal "Quero esse" -> página de detalhes do produto.
  NG.featuredCard = function (p) {
    const av = NG.availability(p);
    const href = NG.url("pages/produto.html?id=" + p.id);
    const canBuy = av.state === "disponivel" || av.state === "baixo";
    let flag = "";
    if (av.state === "esgotado") flag = `<span class="badge badge--danger product-card__flag">Esgotado</span>`;
    else if (av.state === "indisponivel") flag = `<span class="badge badge--neutral product-card__flag">Indisponível</span>`;
    else if (p.badges && p.badges.length) flag = `<span class="badge product-card__flag">${NG.escape(p.badges[0])}</span>`;

    const addBtn = canBuy
      ? `<button class="btn btn--secondary btn--sm btn--block" type="button" data-add="${p.id}">${NG.icon("cart", { size: 16 })} Adicionar</button>`
      : `<button class="btn btn--sm btn--block" type="button" disabled>${av.state === "esgotado" ? "Esgotado" : "Indisponível"}</button>`;

    return `
    <article class="product-card product-card--featured ${canBuy ? "" : "is-out"}">
      <a href="${href}" class="product-card__media" aria-label="${NG.escape(p.name)}">
        ${flag}
        <img src="${NG.url(p.image)}" alt="${NG.escape(p.name)}" loading="lazy">
      </a>
      <div class="product-card__body">
        <span class="product-card__cat">${NG.escape(NG.categoryName(p.category))}</span>
        <a href="${href}"><h3 class="product-card__name">${NG.escape(p.name)}</h3></a>
        <p class="product-card__desc">${NG.escape(p.shortDesc)}</p>
        <span class="product-card__price">${NG.money(p.price)}</span>
        <div class="product-card__actions">
          <a class="btn btn--primary btn--sm btn--block" href="${href}" aria-label="Ver detalhes de ${NG.escape(p.name)}">Quero esse</a>
          ${addBtn}
        </div>
      </div>
    </article>`;
  };

  // delega clique em [data-add]
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    NG.cart.add(btn.dataset.add, 1);
    const p = NG.getProduct(btn.dataset.add);
    NG.toast({
      type: "success",
      title: "Adicionado à sacola",
      message: p ? p.name : "Produto adicionado.",
      actionLabel: "Ver sacola",
      onAction: () => (location.href = NG.url("pages/checkout/sacola.html")),
    });
  });

  NG.updateCartBadge = updateCartBadge;
})((window.NG = window.NG || {}));
