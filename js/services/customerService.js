/* ============================================
   NG Doce Duo — customerService (admin)
   ============================================ */
(function (NG) {
  "use strict";
  const S = {
    all() {
      return NG.demoCustomers.slice();
    },
    get(id) {
      return NG.demoCustomers.find((c) => c.id === id) || null;
    },
    search(q) {
      q = (q || "").toLowerCase();
      return S.all().filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    },
  };
  NG.customerService = S;
})((window.NG = window.NG || {}));
