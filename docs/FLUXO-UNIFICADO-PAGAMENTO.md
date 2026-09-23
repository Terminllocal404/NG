# Fluxo Unificado de Pagamento — NG Doce Duo

Objetivo: **uma única fonte de verdade** para o status do pagamento, com separação obrigatória entre **DECLINED (recusado)** e **ERROR (falha técnica)**. Tudo em modo demonstração (mock), sem integração real com banco/adquirente/PIX.

## Estados padronizados

```
const PAYMENT_STATUS = {
  PENDING: "pending",       // iniciado, aguardando processamento
  PROCESSING: "processing", // em processamento
  APPROVED: "approved",     // processado e autorizado
  DECLINED: "declined",     // processado, porém NÃO autorizado
  ERROR: "error",           // falha técnica na operação
};
```

Definido em `js/services/paymentService.js` e exposto em `NG.PAYMENT_STATUS`.

## Transições

```
                 PENDING
                    │
                    ▼
                PROCESSING
              /     |      \
             ▼      ▼       ▼
        APPROVED DECLINED  ERROR
            │        │       │
            ▼        ▼       ▼
     Pedido        Retry    Retry
     confirmado
```

- **APPROVED** → confirma o pedido (uma única vez).
- **DECLINED** → não confirma; permite tentar de novo ou trocar de forma de pagamento; carrinho e cupom preservados.
- **ERROR** → não confirma; mensagem de falha técnica; permite tentar de novo; carrinho e cupom preservados.

## Fonte única de verdade

`NG.paymentService.processPayment(paymentData)` retorna **sempre** `{ status, code, message? }` com um dos estados acima. Regras de simulação (mock, sem operadora real):

| Gatilho de teste | Resultado | code |
|------------------|-----------|------|
| Cartão terminado em `0` | `declined` | `CARD_DECLINED` |
| Cartão terminado em `9` | `error` | `PAYMENT_SERVICE_UNAVAILABLE` |
| Número vazio/ inválido | `error` | `INVALID_RESPONSE` |
| Demais cartões | `approved` | `AUTHORIZED` |
| PIX (aprovação via `watchPix`) | `approved` | `AUTHORIZED` |

PIX expirado continua sendo tratado como estado próprio (gerar novo código), **não** vira `error`.

## Componente visual de status

Mapa único `NG.paymentStatusUI` + helpers:
- `NG.paymentStatusBadge(status)` → badge colorido (success/danger/warning/info).
- `NG.paymentShortLabel(status)` → rótulo curto ("Confirmado", "Recusado", "Erro técnico"...).

| Status | Rótulo | Cor |
|--------|--------|-----|
| pending | Aguardando pagamento | info |
| processing | Processando pagamento | warning |
| approved | Pagamento aprovado | success (verde) |
| declined | Pagamento recusado | danger (vermelho) |
| error | Erro no processamento | warning |

## Consumidores (todos usam a mesma fonte)

- **Checkout** (`js/checkout.js`): `processPayment` → `approved` chama `finishOrder` (idempotente); `declined`/`error` mostram alertas distintos e mantêm carrinho/cupom. Botão desabilitado durante o processamento.
- **Pedido** (`orderService.create`): confirma pagamento (`pagamento_confirmado`) apenas quando `payment.status === "approved"`; caso contrário `pedido_recebido`.
- **Confirmação**: mostra `NG.paymentShortLabel(order.payment.status)`.
- **Detalhes do pedido** (cliente e admin): `NG.paymentStatusBadge(order.payment.status)`.
- **Lista admin de pedidos**: coluna **Pagamento** (badge de pagamento) separada da coluna **Status** (status do pedido).
- **Timeline**: continua representando o **status do pedido**, não o do pagamento (informações independentes).

## Pedido ≠ Pagamento

`order.status` e `order.payment.status` são independentes. Nunca se converte automaticamente `declined`/`error` em `order.failed`.

## Idempotência (sem pedidos duplicados)

- `checkout._processing` bloqueia reentrância enquanto processa.
- Botão de pagar recebe `disabled = true` durante `processing`.
- `checkout._finalized` garante que a aprovação crie **um único** pedido, mesmo com duplo clique.

## Persistência

O status fica junto ao pedido em `localStorage` (`ng_orders`): `{ id, payment: { method, status } }`. Logs estruturados de tentativa em `ng_payment_logs` (`{ paymentAttemptId, method, status, code, timestamp }`).

## Testes executados (mock)

| # | Cenário | Resultado |
|---|---------|-----------|
| 1 | Cartão aprovado | `approved`; **1** pedido criado; confirmação; carrinho limpo |
| 2 | Cartão recusado (termina em 0) | `declined`; alerta vermelho "Pagamento recusado"; **nenhum** pedido; carrinho preservado |
| 3 | Erro técnico (termina em 9) | `error`; alerta "Não foi possível processar"; **nenhum** pedido; carrinho preservado |
| 4 | Duplo clique em pagar | botão desabilitado; **apenas 1** pedido criado |
| 5 | PIX | aprovação simulada → `approved` → pedido confirmado |
| 6 | processPayment (serviço) | approved / declined(CARD_DECLINED) / error(PAYMENT_SERVICE_UNAVAILABLE) / pix approved |
| 7 | Detalhe do pedido | badge verde "Pagamento aprovado" |
| 8 | Admin lista | colunas Pagamento e Status distintas |

## Correção adicional encontrada nesta rodada

As listas administrativas **Pedidos** e **Clientes** tinham um erro de aspas (string JS aberta com `'` e fechada com `"`) que quebrava o script inline e impedia a renderização da tabela. Corrigido em `pages/admin/pedidos.html` e `pages/admin/clientes.html`. Um verificador de sintaxe foi rodado em **todos** os scripts inline de todas as páginas — todos OK.

## Limitações (transparência)

Nenhuma integração real: pagamento, PIX e cartão são simulados. A interface indica "ambiente de demonstração". A arquitetura (`paymentService`) está pronta para substituir o mock por um gateway real, mantendo o mesmo contrato `{ status }`.
