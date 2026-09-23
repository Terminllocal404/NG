# Cupons + Autenticação/Verificação de E-mail — NG Doce Duo

Rodada de evolução (dentro do escopo): cupons administráveis, verificação de e-mail, reset de senha completo, cadastro administrativo, correção da alteração de senha do cliente e integração das configurações da loja. Tudo em modo demonstração (mock + `localStorage`), sem integrações reais.

## 1. Cupons de desconto (admin)

Nova área: **Administração → Cupons** (`pages/admin/cupons.html`, link adicionado ao menu admin).

Serviço central: `js/services/couponService.js` (persistência em `localStorage` chave `ng_coupons_v2`, seed com `DOCE10`, `BEMVINDO`, `BOLO10`).

Operações: **listar, criar, editar, ativar, desativar, excluir**. Código único validado.

Campos: `code`, `description`, `type` (percent | fixed), `value`, `scope`, `category`, `productIds`, `minSubtotal`, `active`.

Aplicação (`scope`):
- **Todos os produtos** (`all`)
- **Categoria** (`category`) — desconto incide apenas sobre itens da categoria
- **Produtos específicos** (`products`) — desconto incide apenas sobre os produtos elegíveis

Validação (`couponService.validate`): existência, ativo, `minSubtotal`, elegibilidade por categoria/produto, cálculo (percentual ou fixo sobre o subtotal elegível). Mensagens claras, sem termos técnicos.

Testes automatizados executados:
| Cupom | Cenário | Resultado |
|-------|---------|-----------|
| DOCE10 (all 10%) | subtotal R$ 50,70 | desconto R$ 5,07 ✅ |
| BOLO10 (categoria bolos-de-pote) | só itens da categoria (R$ 31,80) | desconto R$ 3,18 ✅ |
| BEMVINDO (mín. R$ 30) | pedido R$ 15,90 | recusado com mensagem de mínimo ✅ |
| Código inexistente | — | "Cupom inválido ou inexistente." ✅ |

## 2. Integração do cupom (carrinho → checkout → pedido)

`js/cart.js` agora consulta o `couponService` em vez de códigos fixos. O cupom é guardado por **código** e o desconto é **recalculado dinamicamente** conforme o conteúdo da sacola (`Cart.couponResult()` / `Cart.discount()`).

- Carrinho (`sacola.html`): aplica, mostra desconto, e — se a sacola mudar e o cupom deixar de ser válido — exibe aviso e permite remover (não some silenciosamente).
- Checkout (`checkout.js`): o desconto entra no resumo e no total, preservado entre etapas.
- Pedido: `discount` é gravado no pedido criado e aparece na confirmação e nos detalhes.

Verificado: BOLO10 em sacola com item elegível → Subtotal R$ 50,70 · Desconto (BOLO10) −R$ 3,18 · Total R$ 47,52.

## 3. Componente OTP reutilizável

`js/components/otp.js` → `NG.renderOTP(container, { onComplete })` e `NG.maskEmail(email)`.
8 campos, avanço automático, backspace inteligente, colagem, foco inicial. Usado em: recuperação de senha, confirmação de e-mail do cliente e confirmação de e-mail administrativo (sem duplicar lógica). CSS ajustado para os 8 campos caberem em uma linha.

## 4. Confirmação de e-mail do cliente

Fluxo: Cadastro → `verificar-email.html` → código de 8 dígitos → conta ativada → login.

- `authService.register()` cria a conta como `emailVerified:false` e gera código (não faz login automático).
- `authService.login()` bloqueia conta não verificada (retorna `needVerify`) sem regenerar o código pendente.
- `verificar-email.html`: e-mail mascarado, aviso de **modo demonstração** com o código, OTP, confirmar e reenviar.
- `verifyEmailCode()` ativa e autentica.

Verificado: registro pendente → login bloqueado (needVerify) → verificação OK → sessão ativa.

## 5. Reset de senha completo

Fluxo (em `recuperar-senha.html`): e-mail → código de 8 dígitos (com e-mail exibido, reenviar, trocar e-mail) → nova senha → confirmação → sucesso → login.
Serviço: `requestReset()`, `verifyReset()`, `resetPassword()`, `resendResetCode()`. Código expira em 15 min. Modo demonstração deixa o código visível.

## 6. Cadastro administrativo

`pages/admin/cadastro.html` + link "Criar conta" no login admin. Fluxo: cadastro → confirmação de e-mail (OTP de 8 dígitos, modo demo) → conta liberada para login. `adminLogin` bloqueia admin não verificado (`needVerify`). Contas admin em `localStorage` (`ng_admins`), seed com a conta demo verificada.

## 7. Correção — alteração de senha do cliente

Antes: a tela mostrava sucesso sem persistir. Agora `perfil.html` exige **senha atual**, valida via `authService.changePassword(atual, nova)` e só mostra sucesso se persistir. Verificado: senha atual errada → erro; correta → persiste; relogin com a nova senha funciona.

## 8. Configurações administrativas integradas

`NG.getStoreConfig()` mescla padrões + `ng_store_config`. O checkout passou a usar: `deliveryFee`, `freeDeliveryAbove`, `scheduleMinHours`, e os toggles `enableDelivery` / `enablePickup`.
- Toggles persistidos em `configuracoes.html` (agora com ids e gravação).
- Checkout esconde a modalidade desativada. Verificado: com entrega desativada, a etapa 2 mostra apenas "retirada".
- Perfil administrativo (nome/senha) persistido via `authService.updateAdminProfile()`.

## Limitações (transparência)
Nenhum e-mail real é enviado; nenhum pagamento real é processado; sem banco/servidor. Tudo é mock em `localStorage`, com a camada de serviços pronta para integração futura. As telas indicam "modo demonstração" onde aplicável.
