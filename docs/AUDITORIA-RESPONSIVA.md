# Auditoria Responsiva — NG Doce Duo

Breakpoints do projeto: **640px**, **1024px**, **1280px**.
Método: viewport emulado no navegador (mobile 375×812), medição de `document.documentElement.scrollWidth` vs `window.innerWidth` (detecção de estouro horizontal) e inspeção de `getComputedStyle` nos containers de layout.

## Mobile (375px)

| Página | Verificação | Antes | Depois |
|--------|-------------|-------|--------|
| Home | Header, hero empilhado, botões full-width | Ícone da sacola cortado à direita | ✅ Corrigido (A-02) |
| Catálogo | Filtros em coluna, cards 1 coluna, sem scroll horizontal | ✅ | ✅ |
| Checkout | Etapas empilhadas, resumo abaixo | Layout de 2 colunas não colapsava (resumo cortado) | ✅ Corrigido (A-03) |
| Sacola | Itens + resumo empilhados | Mesmo problema de 2 colunas | ✅ Corrigido (A-03) |
| Contato | Formulário + aside empilhados | Mesmo problema | ✅ Corrigido (A-03) |
| Timeline (acompanhar/detalhe) | Vertical, círculos + linha | ✅ | ✅ |
| Admin Dashboard | Sidebar vira drawer (hambúrguer), cards 1 coluna | Conteúdo estourava para ~692px (tabela interna) | ✅ Corrigido (A-04) |
| Admin tabelas (pedidos/produtos/clientes) | Rolagem horizontal interna da tabela | ✅ (após A-04) | ✅ |
| Formulários (login/cadastro/perfil) | Campos full-width, botão full-width | ✅ | ✅ |

Resultado final mobile: **nenhuma página com estouro de largura** (`scrollWidth == innerWidth`). Drawer de navegação e drawer do admin funcionam.

## Tablet (641–1024px)

- Grid de produtos: 3 colunas (≤1024) e 1 coluna (≤640).
- `.split` e `.split--checkout` colapsam para 1 coluna a partir de 1024px.
- Navegação principal vira hambúrguer a partir de 900px.
- Tabelas administrativas com rolagem interna quando necessário.
- Sem estouro horizontal observado.

## Desktop (>1024px)

- Container máximo de 1200px, centralizado, com gutter de 24px.
- Checkout e sacola em 2 colunas (conteúdo + resumo fixo/sticky).
- Timeline horizontal (≥900px) com linha conectando as etapas.
- Admin com sidebar fixa de 240px.
- Home verificada em ~800–894px e desktop; hero em 2 colunas, cards 4 por linha.

## Correções de responsividade aplicadas

1. **Header mobile** (`css/responsive.css`): hambúrguer com `flex:0 0 44px`/`min-width`, marca em modo logo-only ≤640px, ícones 42px ≤420px, gaps reduzidos.
2. **Colapso de 2 colunas** (`css/layout.css` + remoção de grid inline em `checkout.js`, `sacola.html`, `contato.html`): `.split--checkout` virou grid completo no CSS, colapsando para 1 coluna ≤1024px.
3. **Admin sem estouro** (`css/components.css`): `.admin-main { min-width: 0 }` no ≤1024px para a tabela rolar internamente.
4. **Defesa geral** (`css/enhancements.css`): `html, body { max-width:100%; overflow-x:hidden }`.

## Observação de ambiente

O painel de pré-visualização operou majoritariamente em largura estreita; as faixas desktop foram validadas por regras de CSS e por amostragem de screenshots (ver `QA-FINAL.md`).
