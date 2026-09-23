# Matriz de Telas — NG Doce Duo

Legenda: ✅ concluído/verificado · ⚠️ pendente/não validado · ❌ problema · N/A não aplicável

Verificação realizada em servidor local, com viewport emulado (mobile 375px) e desktop. Onde marcado ✅ em Mobile/Desktop, houve inspeção real (screenshot e/ou medição de `scrollWidth`).

| Tela | Arquivo/Rota | Desktop | Tablet | Mobile | Funcional | Polida |
|------|--------------|---------|--------|--------|-----------|--------|
| Home | `index.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Catálogo | `pages/catalogo.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Busca (resultados) | `pages/catalogo.html?q=` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Categoria filtrada | `pages/catalogo.html?cat=` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Produto | `pages/produto.html?id=` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Produto esgotado/indisponível | `pages/produto.html` (estados) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contato | `pages/contato.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sacola (vazia/preenchida) | `pages/checkout/sacola.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Checkout (5 etapas) | `pages/checkout/checkout.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pagamento PIX | checkout etapa 4 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pagamento crédito | checkout etapa 4 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pagamento débito | checkout etapa 4 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Confirmação | checkout etapa 5 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login | `pages/auth/login.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Cadastro | `pages/auth/cadastro.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Recuperação de senha (fluxo) | `pages/auth/recuperar-senha.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Confirmar e-mail (cliente) | `pages/auth/verificar-email.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Cadastro + confirmação | `pages/admin/cadastro.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Cupons | `pages/admin/cupons.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Perfil do cliente | `pages/customer/perfil.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Endereços (CRUD) | `pages/customer/enderecos.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Meus pedidos | `pages/customer/pedidos.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Detalhe do pedido | `pages/orders/detalhe.html?id=` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Acompanhar pedido (timeline) | `pages/orders/acompanhar.html?id=` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Login | `pages/admin/login.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Dashboard | `pages/admin/dashboard.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Pedidos | `pages/admin/pedidos.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Detalhe do pedido | `pages/admin/detalhe.html?id=` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Produtos | `pages/admin/produtos.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Produto (novo/editar) | `pages/admin/produto-form.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Clientes | `pages/admin/clientes.html` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Cliente (detalhe) | `pages/admin/cliente-detalhe.html?id=` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin — Configurações | `pages/admin/configuracoes.html` | ✅ | ✅ | ✅ | ✅ | ✅ |

Observação: "Tablet" foi validado por regras de CSS (breakpoints 768/1024) e amostragem; o comportamento é o mesmo do desktop até 1024px e do mobile abaixo disso, com grid próprio para as faixas intermediárias.
