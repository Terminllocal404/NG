# Correção da Timeline — Tela de Detalhes do Pedido

## Problema
Na tela de detalhes do pedido (ex.: `Pedido NG-1065`), a timeline de **Acompanhamento** ultrapassava a área do seu card e invadia visualmente o card de **Entrega**, com os rótulos das etapas se sobrepondo.

## Causa (investigada)
Duas causas combinadas:

1. **Coluna errada.** As páginas `pages/orders/detalhe.html` e `pages/admin/detalhe.html` usavam a classe `.split` (`grid-template-columns: 280px 1fr`). Como o card de Acompanhamento era o **primeiro** filho, ele caía na coluna estreita de **280px**, enquanto o card de Entrega (aside) ficava na coluna larga (`1fr`). A timeline horizontal, portanto, era espremida em 280px.
2. **Timeline horizontal sem contenção.** No modo horizontal (`.timeline--auto`, ativado a partir de 900px de viewport), os passos usavam `flex: 1` sem `min-width: 0`, e os rótulos não quebravam. Dentro de uma coluna estreita, os itens não conseguiam encolher e transbordavam para fora do card, sobre o card de Entrega.

## Correção
Correção **centralizada no componente** (não foi criada uma segunda timeline) + ajuste de layout das páginas:

- `css/components.css` (`.timeline--auto`): passos agora usam `flex: 1 1 0` + `min-width: 0` (podem encolher); rótulos com `overflow-wrap/word-break/hyphens` e fonte 13px para quebra natural; a linha conectora foi reposicionada para ligar os círculos com um respiro de 12px em volta de cada bullet, ficando atrás deles (`z-index`).
- `pages/orders/detalhe.html` e `pages/admin/detalhe.html`: troca de `.split` por `.split--checkout` (`1fr 380px`), colocando o card de Acompanhamento na coluna **larga** e o aside (Entrega/Pagamento) na coluna estreita — a ordem visual correta.

Nenhuma solução foi feita com `overflow: hidden`, `transform: scale()` ou gambiarra. A timeline permanece um componente reutilizável (`NG.renderTimeline`).

## Validação
Medições automatizadas (retângulos dos elementos) e inspeção visual:

| Viewport | Resultado |
|----------|-----------|
| 1280px (2 colunas) | timeline termina em 772px, dentro do card (797px); aside começa em 829px — **sem invasão**, sem overflow |
| 1024px / 768px | `.split--checkout` colapsa para 1 coluna; timeline horizontal contida no card |
| 390px / 360px | timeline em modo **vertical**, sem overflow horizontal |

Telas que usam o componente, todas verificadas:
- `pages/orders/detalhe.html` — ✅ dentro do card, sem invasão
- `pages/admin/detalhe.html` — ✅ dentro do card, sem invasão
- `pages/orders/acompanhar.html` — ✅ contida no card central

Fluxos confirmados na tela de pedido: acompanhamento (círculos/linhas/estados), entrega (endereço/modalidade/data/horário), pagamento (método/status) — todos preservados e funcionais.

## Melhorias visuais implementadas (coerentes e pontuais)
- Linha conectora da timeline horizontal com respiro em torno dos bullets (leitura mais limpa).
- Rótulos das etapas com quebra natural e tamanho ajustado, evitando sobreposição.

Identidade visual preservada (paleta, Poppins/Inter, chocolate protagonista). Nenhuma funcionalidade nova foi criada.
