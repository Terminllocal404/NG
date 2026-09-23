/* ============================================
   NG Doce Duo — Validação e máscaras
   Valida no blur e no submit; foca 1º campo inválido.
   ============================================ */
(function (NG) {
  "use strict";

  const V = {};

  V.rules = {
    required: (v) => (v && String(v).trim() !== "" ? "" : "Campo obrigatório."),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Informe um e-mail válido.",
    password: (v) => (v && v.length >= 6 ? "" : "A senha deve ter ao menos 6 caracteres."),
    phone: (v) => (v.replace(/\D/g, "").length >= 10 ? "" : "Telefone incompleto."),
    cep: (v) => (v.replace(/\D/g, "").length === 8 ? "" : "CEP deve ter 8 dígitos."),
    cardNumber: (v) => (v.replace(/\D/g, "").length >= 16 ? "" : "Número do cartão inválido."),
    cardExpiry: (v) => {
      if (!/^\d{2}\/\d{2}$/.test(v)) return "Validade no formato MM/AA.";
      const [m] = v.split("/");
      return +m >= 1 && +m <= 12 ? "" : "Mês inválido.";
    },
    cvv: (v) => (/^\d{3,4}$/.test(v) ? "" : "CVV inválido."),
    otp8: (v) => (/^\d{8}$/.test(v) ? "" : "O código deve ter 8 dígitos."),
    number: (v) => (v && String(v).trim() !== "" ? "" : "Informe o número."),
  };

  // Máscaras
  V.mask = {
    phone(v) {
      v = v.replace(/\D/g, "").slice(0, 11);
      if (v.length <= 10)
        return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/[-\s]*$/, "");
      return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/[-\s]*$/, "");
    },
    cep(v) {
      return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{0,3})/, "$1-$2").replace(/-$/, "");
    },
    cardNumber(v) {
      return v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    },
    cardExpiry(v) {
      v = v.replace(/\D/g, "").slice(0, 4);
      return v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
    },
    cvv(v) {
      return v.replace(/\D/g, "").slice(0, 4);
    },
    digits(v) {
      return v.replace(/\D/g, "");
    },
  };

  // Aplica máscara automaticamente em [data-mask]
  V.bindMasks = function (ctx) {
    NG.qsa("[data-mask]", ctx).forEach((el) => {
      const type = el.dataset.mask;
      if (!V.mask[type]) return;
      el.addEventListener("input", () => {
        const pos = el.selectionStart;
        el.value = V.mask[type](el.value);
      });
    });
  };

  function showError(field, msg) {
    field.classList.toggle("has-error", !!msg);
    let err = field.querySelector(".field__error");
    if (msg) {
      if (!err) {
        err = document.createElement("span");
        err.className = "field__error";
        field.appendChild(err);
      }
      err.innerHTML = NG.icon("alert", { size: 14 }) + " " + NG.escape(msg);
    }
  }

  // Valida um input individual conforme data-validate="required email ..."
  V.validateInput = function (input) {
    const field = input.closest(".field");
    if (!field) return true;
    const checks = (input.dataset.validate || "").split(/\s+/).filter(Boolean);
    let msg = "";
    for (const c of checks) {
      if (V.rules[c]) {
        msg = V.rules[c](input.value);
        if (msg) break;
      }
    }
    // confirmação de senha
    if (!msg && input.dataset.match) {
      const other = document.querySelector(input.dataset.match);
      if (other && other.value !== input.value) msg = "As senhas não coincidem.";
    }
    showError(field, msg);
    return !msg;
  };

  // Liga validação no blur para um formulário
  V.bindForm = function (form) {
    NG.qsa("[data-validate], [data-match]", form).forEach((input) => {
      input.addEventListener("blur", () => V.validateInput(input));
    });
    V.bindMasks(form);
  };

  // Valida no submit; foca 1º inválido. Retorna bool.
  V.validateForm = function (form) {
    const inputs = NG.qsa("[data-validate], [data-match]", form);
    let firstInvalid = null;
    let ok = true;
    inputs.forEach((input) => {
      const valid = V.validateInput(input);
      if (!valid && !firstInvalid) firstInvalid = input;
      if (!valid) ok = false;
    });
    if (firstInvalid) firstInvalid.focus();
    return ok;
  };

  NG.validation = V;
})((window.NG = window.NG || {}));
