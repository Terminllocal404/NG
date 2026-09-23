# Arquivos Alterados — Rodada de Auditoria, Correção e Polimento

## Criados
- `css/enhancements.css` — camada de polimento visual aditiva (microinterações, hover, foco, timeline, dashboard) importada por último em `main.css`.
- `docs/AUDITORIA-FINAL.md`
- `docs/MATRIZ-DE-TELAS.md`
- `docs/MATRIZ-DE-FUNCIONALIDADES.md`
- `docs/FUNCIONALIDADES-AUSENTES.md`
- `docs/AUDITORIA-RESPONSIVA.md`
- `docs/POLIMENTO-VISUAL.md`
- `docs/CHECKLIST-FINAL.md`
- `docs/QA-FINAL.md`
- `docs/ARQUIVOS-ALTERADOS.md`
- `docs/screenshots/README.md`

## Alterados
- `css/main.css` — passou a importar `enhancements.css`.
- `css/layout.css` — `.split--checkout` tornou-se grid autossuficiente (display/gap/align), permitindo o colapso responsivo para 1 coluna. **Motivo:** corrigir A-03.
- `css/responsive.css` — correções de header mobile (hambúrguer `flex:0 0 44px`, marca logo-only ≤640px, ícones 42px ≤420px, gaps). **Motivo:** corrigir A-02.
- `css/components.css` — `.admin-main { min-width: 0 }` no ≤1024px. **Motivo:** corrigir A-04 (estouro do admin no mobile).
- `js/checkout.js` — (1) data do agendamento sem deslocamento de fuso; (2) remoção do `grid-template-columns` inline do wrapper de etapas. **Motivo:** corrigir A-01 e A-03.
- `pages/checkout/sacola.html` — remoção do grid inline no `.split--checkout`. **Motivo:** corrigir A-03.
- `pages/contato.html` — remoção do grid inline no `.split--checkout`. **Motivo:** corrigir A-03.

## Removidos
- Nenhum arquivo removido. Nenhuma funcionalidade existente foi apagada ou simplificada.

## Reorganizados
- Nenhuma reorganização estrutural. A arquitetura original (HTML por página, CSS modular via `main.css`, JS no namespace global `NG` carregado por `js/include.js`, serviços em `js/services/`) foi preservada.

## Princípio aplicado
Preservar o que já funcionava; corrigir defeitos reais; refinar o acabamento de forma aditiva e reversível.

---

## Rodada — Cupons + Autenticação/Verificação de e-mail + integrações

### Criados
- `js/services/couponService.js` — CRUD e validação de cupons.
- `js/components/otp.js` — componente OTP reutilizável (8 dígitos) + `NG.maskEmail`.
- `pages/admin/cupons.html` — gestão de cupons (admin).
- `pages/admin/cadastro.html` — cadastro administrativo + confirmação de e-mail.
- `pages/auth/verificar-email.html` — confirmação de e-mail do cliente.
- `docs/CORRECAO-AUTH-E-CUPONS.md` — relatório desta rodada.

### Alterados
- `js/services/authService.js` — reescrito: confirmação de e-mail (cliente/admin), `changePassword`, `resendResetCode`, `adminRegister`, `updateAdminProfile`, contas admin em `localStorage`. **Motivo:** novas funcionalidades + correção de senha.
- `js/cart.js` — cupom passa a consultar `couponService`; desconto recalculado dinamicamente (`couponResult`). **Motivo:** integração de cupons administráveis.
- `js/utils.js` — `NG.getStoreConfig()` (mescla padrões + config do admin). **Motivo:** integração das configurações.
- `js/checkout.js` — usa `getStoreConfig` para taxa, frete grátis, antecedência e toggles de entrega/retirada. **Motivo:** configurações administrativas efetivas.
- `js/admin.js` — item "Cupons" no menu admin.
- `js/include.js` — carrega `couponService.js` e `components/otp.js`.
- `pages/checkout/sacola.html` — resumo do cupom com estados válido/inválido.
- `pages/auth/cadastro.html` — redireciona para verificação de e-mail (sem login automático).
- `pages/auth/login.html` — trata `needVerify` (redireciona à verificação).
- `pages/customer/perfil.html` — alteração de senha com senha atual + persistência real.
- `pages/admin/login.html` — links "Criar conta" e tratamento de `needVerify`.
- `pages/admin/configuracoes.html` — persiste toggles entrega/retirada e perfil admin; usa `getStoreConfig`.
- `css/forms.css` — `.otp` ajustado para 8 campos em uma linha.

### Removidos
- Nenhum. Nenhuma funcionalidade existente foi apagada.

---

## Rodada — Fluxo unificado de pagamento (DECLINED ≠ ERROR)

### Criados
- `docs/FLUXO-UNIFICADO-PAGAMENTO.md` — documentação do fluxo central de pagamento.

### Alterados
- `js/services/paymentService.js` — reescrito como fonte única: `NG.PAYMENT_STATUS`, `processPayment()` retornando `{status}` padronizado (approved/declined/error), `paymentStatusUI`/`paymentStatusBadge`/`paymentShortLabel`, logs. **Motivo:** separar recusa de falha técnica.
- `js/checkout.js` — usa `processPayment`; alertas distintos para declined (recusa) e error (técnico); botão desabilitado no processing; `finishOrder` idempotente (`_finalized`); PIX/cartão pelo mesmo fluxo; status `approved`. **Motivo:** unificação + idempotência.
- `js/services/orderService.js` — confirma pagamento só quando `payment.status === "approved"`. **Motivo:** pedido só confirmado após aprovação.
- `js/data.js` — status de pagamento dos pedidos demo padronizados (`approved`/`pending`). **Motivo:** consistência com o novo padrão.
- `pages/checkout/checkout.html` (via checkout.js), `pages/orders/detalhe.html`, `pages/admin/detalhe.html` — exibem status via `paymentStatusBadge`/`paymentShortLabel`.
- `pages/admin/pedidos.html` — nova coluna **Pagamento** (separada de Status) **e** correção de aspas que quebrava a tabela.
- `pages/admin/clientes.html` — correção de aspas que quebrava a tabela.

### Correção de bug latente
- Listas admin de **Pedidos** e **Clientes** não renderizavam por erro de aspas (string JS aberta com `'` e fechada com `"`). Corrigido; verificador de sintaxe rodado em todos os scripts inline (todos OK).
