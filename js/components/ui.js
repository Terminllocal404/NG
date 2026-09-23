/* ============================================
   NG Doce Duo — UI: Toast, Modal, Confirm
   ============================================ */
(function (NG) {
  "use strict";

  function ensureToastRegion() {
    let region = document.getElementById("toast-region");
    if (!region) {
      region = document.createElement("div");
      region.id = "toast-region";
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "false");
      document.body.appendChild(region);
    }
    return region;
  }

  /**
   * NG.toast({ title, message, type, actionLabel, onAction, duration })
   */
  NG.toast = function (opts) {
    opts = opts || {};
    const region = ensureToastRegion();
    const el = document.createElement("div");
    el.className = "toast" + (opts.type ? " toast--" + opts.type : "");
    el.setAttribute("role", "status");

    const iconName =
      opts.type === "success" ? "check" : opts.type === "danger" ? "alert" : "info";

    el.innerHTML = `
      ${NG.icon(iconName, { size: 20 })}
      <div class="toast__body">
        ${opts.title ? `<div class="toast__title">${NG.escape(opts.title)}</div>` : ""}
        <div>${NG.escape(opts.message || "")}</div>
      </div>
      ${opts.actionLabel ? `<button class="toast__action" type="button">${NG.escape(opts.actionLabel)}</button>` : ""}
      <button class="toast__close" type="button" aria-label="Fechar aviso">${NG.icon("close", { size: 18 })}</button>
    `;

    const remove = () => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 200);
    };

    const actionBtn = el.querySelector(".toast__action");
    if (actionBtn) {
      actionBtn.addEventListener("click", () => {
        if (opts.onAction) opts.onAction();
        remove();
      });
    }
    el.querySelector(".toast__close").addEventListener("click", remove);

    region.appendChild(el);
    const dur = opts.duration || 4000;
    if (dur > 0) setTimeout(remove, dur);
    return { close: remove };
  };

  /**
   * NG.modal({ title, body(HTML), footer(HTML), onMount(el) })
   * retorna { close }
   */
  NG.modal = function (opts) {
    opts = opts || {};
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${NG.escape(opts.title || "Janela")}">
        <div class="modal__head">
          <h3>${NG.escape(opts.title || "")}</h3>
          <button class="icon-btn" type="button" data-close aria-label="Fechar" style="color:var(--color-chocolate)">
            ${NG.icon("close", { size: 22 })}
          </button>
        </div>
        <div class="modal__body">${opts.body || ""}</div>
        ${opts.footer ? `<div class="modal__foot">${opts.footer}</div>` : ""}
      </div>`;

    const close = () => {
      document.removeEventListener("keydown", onKey);
      backdrop.remove();
    };
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
      if (e.target.closest("[data-close]")) close();
    });
    document.addEventListener("keydown", onKey);
    document.body.appendChild(backdrop);

    const firstInput = backdrop.querySelector("input, button:not([data-close]), select, textarea");
    if (firstInput) firstInput.focus();

    if (opts.onMount) opts.onMount(backdrop.querySelector(".modal"), close);
    return { close, el: backdrop };
  };

  /**
   * NG.confirm({ title, message, confirmLabel, danger }) -> Promise<boolean>
   */
  NG.confirm = function (opts) {
    opts = opts || {};
    return new Promise((resolve) => {
      const m = NG.modal({
        title: opts.title || "Confirmar",
        body: `<p>${NG.escape(opts.message || "Tem certeza?")}</p>`,
        footer: `
          <button class="btn btn--secondary btn--inline" data-cancel type="button">${NG.escape(opts.cancelLabel || "Cancelar")}</button>
          <button class="btn ${opts.danger ? "btn--danger" : "btn--primary"} btn--inline" data-ok type="button">${NG.escape(opts.confirmLabel || "Confirmar")}</button>`,
        onMount(el, close) {
          el.querySelector("[data-cancel]").addEventListener("click", () => {
            close();
            resolve(false);
          });
          el.querySelector("[data-ok]").addEventListener("click", () => {
            close();
            resolve(true);
          });
        },
      });
    });
  };

  // Estados reutilizáveis (HTML)
  NG.emptyState = function (o) {
    return `<div class="state">
      <div class="state__icon">${NG.icon(o.icon || "box", { size: 64 })}</div>
      <h3>${NG.escape(o.title)}</h3>
      <p>${NG.escape(o.message || "")}</p>
      ${o.actionHtml || ""}
    </div>`;
  };

  NG.errorState = function (o) {
    return `<div class="state">
      <div class="state__icon" style="color:var(--color-danger)">${NG.icon("alert", { size: 64 })}</div>
      <h3>${NG.escape(o.title || "Algo deu errado")}</h3>
      <p>${NG.escape(o.message || "Não foi possível carregar. Tente novamente.")}</p>
      ${o.actionHtml || `<button class="btn btn--primary btn--inline" onclick="location.reload()">Tentar novamente</button>`}
    </div>`;
  };

  NG.skeletonCards = function (n) {
    let html = "";
    for (let i = 0; i < (n || 8); i++) {
      html += `<div class="product-card"><div class="skeleton skeleton--card" style="height:220px;border-radius:0"></div>
        <div style="padding:16px"><div class="skeleton skeleton--title"></div><div class="skeleton skeleton--text"></div><div class="skeleton skeleton--text" style="width:40%"></div></div></div>`;
    }
    return html;
  };
})((window.NG = window.NG || {}));
