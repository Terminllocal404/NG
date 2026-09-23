# Polimento Visual — NG Doce Duo

O polimento foi aplicado de forma **aditiva e não-destrutiva**, principalmente via `css/enhancements.css` (importado por último em `main.css`) e pequenos ajustes de responsividade. Nenhuma identidade foi alterada: paleta, Poppins/Inter, chocolate protagonista, rosé/creme de apoio e estética artesanal preservados.

## Cards de produto
- Zoom suave (scale 1.06) da imagem no hover, com `overflow:hidden` no media.
- Sombra na badge de destaque (flag) para leitura sobre a foto.
- Título muda para chocolate escuro no hover.

## Botões
- Elevação elegante no hover (`translateY(-1px)` + sombra maior) para primário e perigo.
- Retorno ao estado no `:active`.
- Foco visível reforçado (`outline` rosé) em `.btn`, `.chip`, `.icon-btn`.

## Formulários
- Transição suave de foco (borda rosé + halo).
- Borda muda para rosé médio no hover (quando não focado).
- Option cards (entrega/pagamento) com anel de seleção refinado.

## Timeline
- Bullets com sombra sutil.
- Etapa atual com halo pulsante discreto (`pulse-halo`, 2s), respeitando `prefers-reduced-motion`.

## Checkout / Stepper
- Transição suave dos dots do stepper.
- Option cards de pagamento e entrega com realce de seleção.

## Dashboard / Admin
- Stat cards com leve elevação no hover.
- Barras do gráfico com degradê chocolate/rosé e brilho no topo; muda para chocolate no hover.
- Cabeçalho da tabela `sticky`; linhas com transição de fundo.

## Header / Footer
- Transições nos itens de navegação e ícones.
- Links do rodapé com leve deslocamento no hover.
- Hero com brilho radial sutil e leve zoom da imagem no hover.

## Microinterações (discretas)
- Toasts com entrada suave; modais com escala natural.
- Chips com leve "press" (`scale(0.97)`) no clique.
- Ícone dos features com leve rotação no hover.
- Classe utilitária `fade-in` disponível para conteúdo carregado.

## Acessibilidade e movimento
- `@media (prefers-reduced-motion: reduce)` neutraliza animações/transições.
- Defesa contra rolagem horizontal (`overflow-x:hidden` no `html/body`).

## Padronização
- Todos os componentes continuam usando os mesmos tokens (raios 6/8/10, sombra única, escala de espaçamento, tipografia). O polimento reforçou consistência sem introduzir novas cores nem novos padrões visuais.
