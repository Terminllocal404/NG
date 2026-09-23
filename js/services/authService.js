/* ============================================
   NG Doce Duo — authService (mock + localStorage)
   Login, cadastro, confirmação de e-mail (código de
   8 dígitos), recuperação de senha e contas admin.
   Tudo simulado (modo demonstração). Preparado para API.
   ============================================ */
(function (NG) {
  "use strict";

  var CUSTOMER_KEY = "ng_session_customer";
  var ADMIN_KEY = "ng_session_admin";
  var USERS_KEY = "ng_users";
  var ADMINS_KEY = "ng_admins";

  function gen8() {
    return String(Math.floor(10000000 + Math.random() * 89999999));
  }

  function seedUsers() {
    var users = NG.storage.get(USERS_KEY, null);
    if (!users) {
      var demo = JSON.parse(JSON.stringify(NG.demoCustomer));
      demo.emailVerified = true;
      users = [demo];
      NG.storage.set(USERS_KEY, users);
    }
    return users;
  }

  function seedAdmins() {
    var admins = NG.storage.get(ADMINS_KEY, null);
    if (!admins) {
      admins = [{ id: "adm-001", name: NG.demoAdmin.name, email: NG.demoAdmin.email, password: NG.demoAdmin.password, emailVerified: true }];
      NG.storage.set(ADMINS_KEY, admins);
    }
    return admins;
  }

  function safe(u) {
    var c = Object.assign({}, u);
    delete c.password;
    return c;
  }

  var S = {
    /* ---------- Sessão ---------- */
    getCustomer() { return NG.storage.get(CUSTOMER_KEY, null); },
    getAdmin() { return NG.storage.get(ADMIN_KEY, null); },
    isCustomer() { return !!S.getCustomer(); },
    isAdmin() { return !!S.getAdmin(); },
    logout() { NG.storage.remove(CUSTOMER_KEY); },
    adminLogout() { NG.storage.remove(ADMIN_KEY); },

    /* ---------- Login cliente ---------- */
    login(email, password) {
      var users = seedUsers();
      var u = users.find(function (x) { return x.email.toLowerCase() === String(email).toLowerCase(); });
      if (!u || u.password !== password) return { ok: false, error: "E-mail ou senha incorretos." };
      if (u.emailVerified === false) {
        // mantém o código pendente; só cria um se não houver
        var pend = NG.storage.get("ng_email_verify", null);
        if (!pend || pend.email.toLowerCase() !== u.email.toLowerCase()) {
          NG.storage.set("ng_email_verify", { email: u.email, code: gen8(), ts: Date.now() });
        }
        return { ok: false, needVerify: true, email: u.email, error: "Confirme seu e-mail antes de entrar." };
      }
      NG.storage.set(CUSTOMER_KEY, safe(u));
      return { ok: true, user: safe(u) };
    },

    /* ---------- Cadastro cliente (com confirmação de e-mail) ---------- */
    register(data) {
      var users = seedUsers();
      if (users.some(function (x) { return x.email.toLowerCase() === data.email.toLowerCase(); })) {
        return { ok: false, error: "Já existe uma conta com este e-mail." };
      }
      var user = {
        id: NG.uid("cli"),
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        avatar: "",
        addresses: [],
        emailVerified: false,
      };
      users.push(user);
      NG.storage.set(USERS_KEY, users);
      var code = gen8();
      NG.storage.set("ng_email_verify", { email: user.email, code: code, ts: Date.now() });
      return { ok: true, pending: true, email: user.email, code: code };
    },

    // Reenvia o código de confirmação de e-mail (cliente)
    requestEmailCode(email) {
      var pend = NG.storage.get("ng_email_verify", null);
      var target = email || (pend && pend.email);
      if (!target) return { ok: false, error: "Nenhuma confirmação em andamento." };
      var code = gen8();
      NG.storage.set("ng_email_verify", { email: target, code: code, ts: Date.now() });
      return { ok: true, email: target, code: code };
    },

    // Verifica o código e ativa a conta, já autenticando
    verifyEmailCode(code) {
      var pend = NG.storage.get("ng_email_verify", null);
      if (!pend) return { ok: false, error: "Nenhuma confirmação em andamento." };
      if (pend.code !== code) return { ok: false, error: "Código incorreto. Confira os 8 dígitos." };
      var users = seedUsers();
      var u = users.find(function (x) { return x.email.toLowerCase() === pend.email.toLowerCase(); });
      if (u) { u.emailVerified = true; NG.storage.set(USERS_KEY, users); }
      NG.storage.remove("ng_email_verify");
      if (u) { NG.storage.set(CUSTOMER_KEY, safe(u)); return { ok: true, user: safe(u) }; }
      return { ok: true };
    },

    pendingEmail() {
      var p = NG.storage.get("ng_email_verify", null);
      return p ? p.email : null;
    },

    /* ---------- Recuperação de senha ---------- */
    requestReset(email) {
      var users = seedUsers();
      var exists = users.some(function (x) { return x.email.toLowerCase() === String(email).toLowerCase(); });
      if (!exists) return { ok: false, error: "Não encontramos uma conta com este e-mail." };
      var code = gen8();
      NG.storage.set("ng_reset", { email: email, code: code, ts: Date.now() });
      return { ok: true, code: code, email: email };
    },
    resendResetCode() {
      var r = NG.storage.get("ng_reset", null);
      if (!r) return { ok: false, error: "Nenhuma recuperação em andamento." };
      return S.requestReset(r.email);
    },
    verifyReset(code) {
      var r = NG.storage.get("ng_reset", null);
      if (!r) return { ok: false, error: "Nenhuma recuperação em andamento." };
      if (Date.now() - r.ts > 15 * 60 * 1000) return { ok: false, error: "Código expirado. Solicite um novo." };
      if (r.code !== code) return { ok: false, error: "Código incorreto." };
      return { ok: true, email: r.email };
    },
    resetPassword(newPassword) {
      var r = NG.storage.get("ng_reset", null);
      if (!r) return { ok: false, error: "Sessão de recuperação inválida." };
      var users = seedUsers();
      var u = users.find(function (x) { return x.email.toLowerCase() === r.email.toLowerCase(); });
      if (u) { u.password = newPassword; NG.storage.set(USERS_KEY, users); }
      NG.storage.remove("ng_reset");
      return { ok: true };
    },

    /* ---------- Perfil cliente ---------- */
    updateProfile(patch) {
      var cur = S.getCustomer();
      if (!cur) return { ok: false };
      var merged = Object.assign({}, cur, patch);
      NG.storage.set(CUSTOMER_KEY, merged);
      var users = seedUsers();
      var u = users.find(function (x) { return x.id === cur.id; });
      if (u) { Object.assign(u, patch); NG.storage.set(USERS_KEY, users); }
      return { ok: true, user: merged };
    },

    // Alteração de senha com verificação da senha atual (persiste de verdade)
    changePassword(currentPw, newPw) {
      var cur = S.getCustomer();
      if (!cur) return { ok: false, error: "Você precisa estar logada." };
      var users = seedUsers();
      var u = users.find(function (x) { return x.id === cur.id; });
      if (!u) return { ok: false, error: "Conta não encontrada." };
      if (u.password !== currentPw) return { ok: false, error: "A senha atual está incorreta." };
      u.password = newPw;
      NG.storage.set(USERS_KEY, users);
      return { ok: true };
    },

    /* ---------- Admin ---------- */
    adminLogin(email, password) {
      var admins = seedAdmins();
      var a = admins.find(function (x) { return x.email.toLowerCase() === String(email).toLowerCase(); });
      if (!a || a.password !== password) return { ok: false, error: "Credenciais administrativas inválidas." };
      if (a.emailVerified === false) {
        var pendA = NG.storage.get("ng_admin_verify", null);
        if (!pendA || pendA.email.toLowerCase() !== a.email.toLowerCase()) {
          NG.storage.set("ng_admin_verify", { email: a.email, code: gen8(), ts: Date.now() });
        }
        return { ok: false, needVerify: true, email: a.email, error: "Confirme o e-mail administrativo antes de entrar." };
      }
      NG.storage.set(ADMIN_KEY, { id: a.id, email: a.email, name: a.name });
      return { ok: true };
    },
    adminRegister(data) {
      var admins = seedAdmins();
      if (admins.some(function (x) { return x.email.toLowerCase() === data.email.toLowerCase(); })) {
        return { ok: false, error: "Já existe um acesso administrativo com este e-mail." };
      }
      var admin = { id: NG.uid("adm"), name: data.name, email: data.email, phone: data.phone || "", password: data.password, emailVerified: false };
      admins.push(admin);
      NG.storage.set(ADMINS_KEY, admins);
      var code = gen8();
      NG.storage.set("ng_admin_verify", { email: admin.email, code: code, ts: Date.now() });
      return { ok: true, pending: true, email: admin.email, code: code };
    },
    requestAdminCode(email) {
      var pend = NG.storage.get("ng_admin_verify", null);
      var target = email || (pend && pend.email);
      if (!target) return { ok: false, error: "Nenhuma confirmação em andamento." };
      var code = gen8();
      NG.storage.set("ng_admin_verify", { email: target, code: code, ts: Date.now() });
      return { ok: true, email: target, code: code };
    },
    verifyAdminCode(code) {
      var pend = NG.storage.get("ng_admin_verify", null);
      if (!pend) return { ok: false, error: "Nenhuma confirmação em andamento." };
      if (pend.code !== code) return { ok: false, error: "Código incorreto. Confira os 8 dígitos." };
      var admins = seedAdmins();
      var a = admins.find(function (x) { return x.email.toLowerCase() === pend.email.toLowerCase(); });
      if (a) { a.emailVerified = true; NG.storage.set(ADMINS_KEY, admins); }
      NG.storage.remove("ng_admin_verify");
      return { ok: true };
    },
    pendingAdminEmail() {
      var p = NG.storage.get("ng_admin_verify", null);
      return p ? p.email : null;
    },
    updateAdminProfile(patch) {
      var cur = S.getAdmin();
      if (!cur) return { ok: false, error: "Sessão administrativa inválida." };
      var admins = seedAdmins();
      var a = admins.find(function (x) { return x.id === cur.id || x.email.toLowerCase() === cur.email.toLowerCase(); });
      if (!a) return { ok: false, error: "Conta administrativa não encontrada." };
      if (patch.name) a.name = patch.name;
      if (patch.password) a.password = patch.password;
      NG.storage.set(ADMINS_KEY, admins);
      NG.storage.set(ADMIN_KEY, { id: a.id, email: a.email, name: a.name });
      return { ok: true };
    },
  };

  NG.authService = S;
})((window.NG = window.NG || {}));
