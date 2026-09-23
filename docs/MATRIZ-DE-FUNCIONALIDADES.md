# Matriz de Funcionalidades — NG Doce Duo

Legenda de Escopo: **Obrigatória** · **Necessária** (para completar fluxo) · **Fora de escopo** · **Dependência externa** (backend)

| Funcionalidade | Implementada | Testada | Escopo | Observação |
|----------------|--------------|---------|--------|------------|
| Navegação global (header/drawer/footer) | ✅ | ✅ | Obrigatória | Injeção via `components/layout.js`; nav ativa por página |
| Busca com sugestões/histórico + debounce | ✅ | ✅ | Obrigatória | Histórico em `localStorage`; resultados no catálogo |
| Filtros (categoria/sabor/preço) + ordenação | ✅ | ✅ | Obrigatória | Chips removíveis, limpar filtros |
| Paginação | ✅ | ✅ | Obrigatória | 8/página, com contagem |
| Product Card | ✅ | ✅ | Obrigatória | Padrão único, estados esgotado/indisponível |
| Carrinho (add/alterar/remover) | ✅ | ✅ | Obrigatória | Recalcula em tempo real |
| Remover com "Desfazer" (8s) | ✅ | ✅ | Obrigatória | Toast com ação |
| Quantidade (mín 1 / máx 10) | ✅ | ✅ | Obrigatória | Botões desabilitam nos limites |
| Cupom de desconto | ✅ | ✅ | Obrigatória | `DOCE10`, `BEMVINDO` (mock) |
| Login | ✅ | ✅ | Obrigatória | Sessão em `localStorage` |
| Cadastro | ✅ | ✅ | Obrigatória | Validação + máscaras |
| Recuperação de senha (código 8 dígitos) | ✅ | ✅ | Obrigatória | Código simulado exibido em modo demo |
| Perfil (nome/e-mail/telefone/senha/foto) | ✅ | ✅ | Obrigatória | Foto via FileReader (data URL) |
| Endereços (CRUD + principal) | ✅ | ✅ | Obrigatória | Confirmação de exclusão |
| Checkout multi-etapas (stepper) | ✅ | ✅ | Obrigatória | 5 etapas, resumo persistente, voltar sem perder dados |
| Entrega por motoboy (taxa/endereço) | ✅ | ✅ | Obrigatória | Frete grátis acima de R$ 90 |
| Retirada na loja | ✅ | ✅ | Obrigatória | Dados da loja + instruções |
| Agendamento (data/horário/antecedência) | ✅ | ✅ | Obrigatória | 48h para bolos sob encomenda |
| Pagamento PIX (QR/copia-e-cola/aguardando/aprovado/expirado) | ✅ | ✅ | Obrigatória (visual) / Dependência externa (processamento real) | Aprovação simulada; QR ilustrativo |
| Pagamento crédito (parcelas/processando/aprovado/recusado) | ✅ | ✅ | Obrigatória (visual) / Dependência externa | Regra demo: cartão terminado em 0 = recusado |
| Pagamento débito | ✅ | ✅ | Obrigatória (visual) / Dependência externa | Mesmo motor de cartão |
| Confirmação do pedido | ✅ | ✅ | Obrigatória | Nº do pedido, resumo, próximo passo |
| Meus pedidos (lista + filtros) | ✅ | ✅ | Obrigatória | Filtro por andamento/concluído/cancelado |
| Timeline do pedido (círculos + linhas) | ✅ | ✅ | Obrigatória | Horizontal no desktop, vertical no mobile; estados done/current/future/cancelled |
| Acompanhamento + avanço de etapa (demo) | ✅ | ✅ | Obrigatória | Atualiza estado mock |
| Admin — Login | ✅ | ✅ | Obrigatória | Sessão admin separada |
| Admin — Dashboard (KPIs + gráfico) | ✅ | ✅ | Obrigatória | Métricas derivadas dos pedidos |
| Admin — Pedidos (busca/filtro/detalhe) | ✅ | ✅ | Obrigatória | — |
| Admin — Alterar status | ✅ | ✅ | Obrigatória | Persiste no mock; atualiza timeline |
| Admin — Produtos (CRUD/ativar/desativar) | ✅ | ✅ | Obrigatória | Overlay em `localStorage`; upload de imagem via FileReader |
| Admin — Clientes (lista/busca/detalhe) | ✅ | ✅ | Obrigatória | Histórico de pedidos por cliente |
| Admin — Configurações | ✅ | ✅ | Obrigatória | Dados da loja/regras salvos em `localStorage` |
| Estados: loading/vazio/erro/sucesso/preenchido | ✅ | ✅ | Obrigatória | Skeletons, empty/error states, toasts |
| Estados de pagamento (pendente/aprovado/recusado/expirado) | ✅ | ✅ | Obrigatória | Cobertos nos fluxos PIX/cartão |
| Copiar código PIX | ✅ | ✅ | Obrigatória | `navigator.clipboard` + toast |
| Validação de formulários (blur + submit) | ✅ | ✅ | Obrigatória | Foco no 1º inválido; máscaras tel/CEP/cartão |
| Acessibilidade (foco, aria, skip-link, teclado) | ✅ | ⚠️ | Obrigatória | Implementada; auditoria completa WCAG não executada com ferramenta automatizada |
| Cupom administrativo (CRUD) | ✅ | ✅ | Obrigatória | `pages/admin/cupons.html` + `couponService` |
| Cupom por produto | ✅ | ✅ | Obrigatória | scope=products; desconto só nos itens elegíveis |
| Cupom por categoria | ✅ | ✅ | Obrigatória | scope=category; testado BOLO10 |
| Cupom geral | ✅ | ✅ | Obrigatória | scope=all; testado DOCE10 |
| Aplicação de cupom no carrinho | ✅ | ✅ | Obrigatória | recalcula dinâmico; avisa se ficar inválido |
| Aplicação de cupom no checkout | ✅ | ✅ | Obrigatória | preservado no resumo/total e no pedido |
| Confirmação de e-mail do cliente | ✅ | ✅ | Obrigatória | `verificar-email.html`, OTP 8 dígitos (mock) |
| Tela de e-mail enviado / confirmação | ✅ | ✅ | Obrigatória | e-mail mascarado, reenviar, modo demo |
| Reset de senha completo | ✅ | ✅ | Obrigatória | e-mail→código→nova senha→login |
| Reenvio de código | ✅ | ✅ | Obrigatória | `requestEmailCode`/`resendResetCode`/`requestAdminCode` |
| Cadastro administrativo | ✅ | ✅ | Obrigatória | `pages/admin/cadastro.html` + verificação |
| Confirmação de e-mail administrativo | ✅ | ✅ | Obrigatória | mesmo componente OTP |
| Alteração de senha do cliente (persistente) | ✅ | ✅ | Correção | exige senha atual; persiste de verdade |
| Configurações admin integradas ao checkout | ✅ | ✅ | Correção | taxa, frete grátis, antecedência, toggles entrega/retirada |
| Perfil administrativo persistente | ✅ | ✅ | Correção | nome/senha via `updateAdminProfile` |
| Componente OTP reutilizável | ✅ | ✅ | Necessária | `NG.renderOTP` usado em 3 fluxos |
