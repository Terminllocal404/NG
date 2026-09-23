# QA Final — NG Doce Duo

Data: 16/09/2026
Ambiente de teste: servidor estático local + navegador; sessão de cliente e de admin criadas via contas demo.

## Testes executados

| # | Cenário | Passos | Resultado |
|---|---------|--------|-----------|
| 1 | Carregar Home | Abrir `index.html` | Destaques e categorias renderizam; sem erro de console |
| 2 | Catálogo/filtros | Abrir catálogo, aplicar filtros/ordenar/buscar | 11 produtos, esgotado visível, chips e paginação OK |
| 3 | Adicionar à sacola | `NG.cart.add` + UI | Contador atualiza (3 itens), subtotal correto |
| 4 | Checkout completo (PIX) | Sacola→Entrega/Retirada→Agendamento→Pagamento→Confirmação | Pedido `NG-1064` criado, carrinho limpo |
| 5 | PIX | Gerar PIX, status "Aguardando", aprovação simulada (~6s) | Status muda para confirmado e vai à confirmação |
| 6 | Timeline | Abrir acompanhamento (entrega e retirada) | Círculos + linhas, estados corretos, avanço de etapa funciona |
| 7 | Admin login/dashboard | Login admin, abrir dashboard | KPIs, gráfico, tabela de recentes OK |
| 8 | Responsividade mobile | Emular 375px em Home/Catálogo/Checkout/Admin | Sem estouro após correções |

## Erros encontrados e corrigidos

1. **Agendamento com data -1 dia** (fuso). Corrigido em `js/checkout.js`.
2. **Sacola cortada no header mobile** e hambúrguer com 0px. Corrigido em `css/responsive.css`.
3. **Layout de 2 colunas não colapsava no mobile** (checkout/sacola/contato) por `grid-template-columns` inline. Corrigido em `css/layout.css` + remoção do inline nos 3 arquivos.
4. **Conteúdo admin estourando no mobile** (~692px) pela tabela interna. Corrigido em `css/components.css` (`.admin-main{min-width:0}`).

## Console

Nenhum erro de console conhecido encontrado nas páginas testadas (Home, Catálogo, Produto, Sacola, Checkout, Confirmação, Acompanhamento, Admin Dashboard/Detalhe). Observação: leituras muito próximas ao carregamento podem pegar a página antes do `document.write` do carregador de scripts concluir — é apenas timing de teste, não erro em runtime.

## Limitações conhecidas (transparência)

- Pagamentos (PIX/crédito/débito), e-mail de recuperação e persistência são **simulados** (mock + `localStorage`). Sem backend real — ver `FUNCIONALIDADES-AUSENTES.md`.
- QR Code do PIX é **ilustrativo** (não é um código PIX válido).
- Auditoria WCAG automatizada não foi executada; acessibilidade foi implementada manualmente (HTML semântico, foco visível, `aria-*`, navegação por teclado, `skip-link`).
- Screenshots foram capturados para verificação visual; ver nota em `screenshots/README.md` sobre gravação de arquivos no ambiente automatizado.

## Rodada — Cupons + Autenticação (testes executados)

| # | Cenário | Resultado |
|---|---------|-----------|
| 9 | couponService.validate (all/categoria/produto/mínimo/inexistente) | Todos corretos (5,07 / 3,18 / recusa por mínimo / erro) |
| 10 | Admin Cupons: página + 3 seeds + nav | Renderiza, sem overflow |
| 11 | Cadastro cliente → pendente → login bloqueado (needVerify) → verifica código → sessão ativa | OK |
| 12 | Alterar senha: senha atual errada recusa; correta persiste; relogin com nova senha | OK |
| 13 | Config: entrega desativada → checkout etapa 2 mostra apenas "retirada" | OK |
| 14 | Cupom BOLO10 no carrinho → Subtotal 50,70 / Desconto 3,18 / Total 47,52 | OK |
| 15 | verificar-email.html: 8 campos OTP em uma linha, e-mail mascarado, código demo | OK |

Correção adicional desta rodada: `login()`/`adminLogin()` deixaram de regenerar o código pendente a cada tentativa (antes invalidava o código do cadastro).

## Console
Nenhum erro conhecido nas páginas testadas nesta rodada (cupons admin, sacola com cupom, verificar-email, checkout).

## Resultado final

Todos os fluxos dentro do escopo estão funcionais e validados. As correções e novas funcionalidades foram aplicadas e verificadas. Projeto consistente entre código, testes e documentação. Integrações externas (e-mail, pagamento, banco) permanecem simuladas e rotuladas como modo demonstração.
