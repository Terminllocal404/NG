# Checklist Final — NG Doce Duo

Marcado apenas o que foi de fato verificado nesta rodada de auditoria/execução.

## Cobertura
- [✅] Todas as 23 páginas existentes revisadas (código)
- [✅] Fluxos principais executados no navegador
- [✅] Checkout testado (5 etapas, resumo persistente)
- [✅] PIX testado (geração, copiar, aguardando → aprovado, expirado por tempo)
- [✅] Crédito testado (processando, aprovado, recusado — regra demo)
- [✅] Débito testado (mesmo motor de cartão)
- [✅] Timeline testada (entrega e retirada; done/current/future)
- [✅] Área administrativa testada (login, dashboard, pedidos, produtos, clientes, config)
- [✅] Alteração de status (admin) reflete no mock e na timeline
- [✅] Mobile testado (375px) — sem estouro horizontal
- [✅] Desktop testado (home, timeline, dashboard) via screenshots
- [⚠️] Tablet validado por CSS/breakpoints e amostragem (sem device físico)
- [✅] Links internos verificados (navegação entre páginas reais)
- [✅] Console sem erros conhecidos nas páginas testadas
- [✅] Pendências críticas resolvidas (A-01 a A-04)

## Correções desta rodada
- [✅] A-01 Fuso horário no agendamento
- [✅] A-02 Header mobile (sacola cortada / hambúrguer 0px)
- [✅] A-03 Colapso de 2 colunas no mobile (checkout/sacola/contato)
- [✅] A-04 Estouro do conteúdo admin no mobile

## Polimento
- [✅] Camada `enhancements.css` aplicada (cards, botões, formulários, timeline, dashboard, header/footer, microinterações)
- [✅] Identidade preservada (paleta, tipografia, chocolate protagonista)
- [✅] `prefers-reduced-motion` respeitado

## Rodada — Cupons + Autenticação (validado)
- [✅] Cupom administrativo (criar/editar/ativar/desativar/excluir)
- [✅] Cupom geral (DOCE10) — desconto correto
- [✅] Cupom por categoria (BOLO10) — desconto só nos itens elegíveis
- [✅] Cupom por produto — scope=products
- [✅] Valor mínimo do pedido respeitado
- [✅] Cupom aplicado no carrinho
- [✅] Cupom preservado no checkout e no pedido
- [✅] Confirmação de e-mail do cliente (OTP 8 dígitos, mock)
- [✅] Login bloqueia conta não verificada
- [✅] Reset de senha completo + reenvio de código
- [✅] Cadastro administrativo + confirmação de e-mail
- [✅] Alteração de senha do cliente corrigida (exige senha atual, persiste)
- [✅] Configurações admin persistem e o checkout as respeita
- [✅] Entrega/retirada desativadas somem do checkout
- [✅] Componente OTP único reutilizado em 3 fluxos
- [✅] Console sem erros nas páginas testadas

## Rodada — Fluxo unificado de pagamento (validado)
- [✅] Fonte única de status (`paymentService.processPayment`)
- [✅] PIX, crédito e débito usam o mesmo fluxo central
- [✅] DECLINED (recusa) distinto de ERROR (falha técnica) — mensagens diferentes
- [✅] Loading controlado por processing; botão desabilitado durante processamento
- [✅] Pedido confirmado somente após APPROVED
- [✅] Recusa/erro não confirmam pedido e preservam carrinho e cupom
- [✅] Duplo clique não gera pedido duplicado (idempotência)
- [✅] Confirmação, detalhes (cliente/admin) e lista admin usam o mesmo status
- [✅] Timeline continua refletindo status do PEDIDO (independente do pagamento)
- [✅] Bug latente de aspas nas listas admin (Pedidos/Clientes) corrigido
- [✅] Verificador de sintaxe rodado em todos os scripts inline — todos OK

## Transparência
- [✅] Itens fora de escopo e dependências de backend registrados em `FUNCIONALIDADES-AUSENTES.md`
- [✅] Nenhuma integração real mascarada como concluída (e-mail/pagamento/banco = mock, rotulado modo demonstração)
