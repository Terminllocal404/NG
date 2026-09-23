# Evidências Visuais — NG Doce Duo

## Verificação realizada

Durante a auditoria, as telas foram inspecionadas ao vivo no navegador (servidor estático local), em viewport **desktop** e **mobile (375×812)**. As capturas foram usadas para validar layout, identidade visual e responsividade, e as correções foram confirmadas após cada ajuste.

Telas verificadas visualmente nesta rodada:
- Home — desktop e mobile
- Catálogo — mobile (filtros, cards, sem estouro)
- Produto / Detalhe do pedido — timeline vertical (mobile)
- Checkout — mobile (stepper + etapas empilhadas) e seleção de pagamento
- Pagamento PIX — QR + status "aguardando" → aprovado
- Acompanhamento — timeline horizontal (desktop) e vertical (mobile)
- Admin Dashboard — desktop (KPIs, gráfico, tabela) e mobile (drawer + cards)

## Nota de ambiente (transparência)

A ferramenta de navegador automatizado deste ambiente **retorna as imagens para a conversa**, mas **não grava arquivos PNG diretamente no diretório do projeto**. Portanto, os arquivos binários de screenshot não foram materializados aqui.

Conforme a regra de transparência do escopo, este fato é registrado explicitamente em vez de inventar evidências.

## Como reproduzir as capturas localmente

1. Suba um servidor na raiz do projeto:
   ```bash
   python -m http.server 8099
   ```
2. Abra `http://localhost:8099/index.html`.
3. Use as DevTools (Ctrl+Shift+M) para alternar entre desktop e mobile (375px).
4. Percorra os fluxos abaixo e capture (PrintScreen / DevTools › "Capture screenshot"):
   - Home, Catálogo, Produto, Sacola, Checkout, PIX, Confirmação, Acompanhamento (timeline), Admin (Dashboard/Pedidos/Produtos/Clientes).

Contas demo: cliente `marina@email.com` / `123456` · admin `admin@ngduodoce.com.br` / `admin123`.
