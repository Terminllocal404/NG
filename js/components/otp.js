/* ============================================
   NG Doce Duo — Componente OTP reutilizável (8 dígitos)
   Uso: var otp = NG.renderOTP(containerEl, { onComplete });
        otp.value()  -> string
        otp.clear()
   Reutilizado em: recuperação de senha, confirmação de
   e-mail do cliente e confirmação de e-mail administrativo.
   ============================================ */
(function (NG) {
  "use strict";

  NG.renderOTP = function (container, opts) {
    opts = opts || {};
    var n = 8;
    container.classList.add("otp");
    container.innerHTML = "";
    for (var i = 0; i < n; i++) {
      var inp = document.createElement("input");
      inp.setAttribute("inputmode", "numeric");
      inp.setAttribute("maxlength", "1");
      inp.setAttribute("aria-label", "Dígito " + (i + 1));
      inp.autocomplete = "one-time-code";
      container.appendChild(inp);
    }
    var inputs = Array.prototype.slice.call(container.querySelectorAll("input"));

    function value() {
      return inputs.map(function (i) { return i.value; }).join("");
    }
    function maybeComplete() {
      if (value().length === n && opts.onComplete) opts.onComplete(value());
    }

    inputs.forEach(function (inp, i) {
      inp.addEventListener("input", function () {
        inp.value = inp.value.replace(/\D/g, "");
        if (inp.value && i < n - 1) inputs[i + 1].focus();
        maybeComplete();
      });
      inp.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !inp.value && i > 0) inputs[i - 1].focus();
      });
      inp.addEventListener("paste", function (e) {
        var txt = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, n);
        if (!txt) return;
        e.preventDefault();
        txt.split("").forEach(function (c, k) { if (inputs[k]) inputs[k].value = c; });
        inputs[Math.min(txt.length, n - 1)].focus();
        maybeComplete();
      });
    });

    if (inputs[0]) inputs[0].focus();

    return {
      value: value,
      clear: function () { inputs.forEach(function (i) { i.value = ""; }); if (inputs[0]) inputs[0].focus(); },
      focus: function () { if (inputs[0]) inputs[0].focus(); },
    };
  };

  // Mascara e-mail: marina@email.com -> m***a@email.com
  NG.maskEmail = function (email) {
    email = String(email || "");
    var parts = email.split("@");
    if (parts.length !== 2) return email;
    var u = parts[0];
    var masked = u.length <= 2 ? u.charAt(0) + "***" : u.charAt(0) + "***" + u.charAt(u.length - 1);
    return masked + "@" + parts[1];
  };
})((window.NG = window.NG || {}));
