# Limpeza Visual e Correções — NG Doce Duo

Rodada de correção cirúrgica: corrigir bugs visuais/estruturais, remover conteúdo corrompido (se houver) e polir, sem refazer o projeto nem inventar funcionalidades.

## Problemas encontrados
1. **Timeline invadindo o card de Entrega** na tela de detalhes do pedido (bug prioritário). Detalhado em `CORRECAO-TIMELINE.md`.
2. Verificação de conteúdo corrompido/duplicado/técnico exposto em todas as telas (varredura).

## Problemas corrigidos
- **Timeline (bug prioritário):** corrigido na origem (componente `NG.renderTimeline` + CSS `.timeline--auto`) e no layout das páginas de detalhe (`.split` → `.split--checkout`). A timeline não ultrapassa mais o card nem sobrepõe textos; vertical no mobile, horizontal no desktop.

## Conteúdo removido
Nenhum conteúdo legítimo foi removido. A varredura **não** encontrou:
- textos técnicos expostos (`undefined`, `null`, `NaN`, `[object Object]`, caminhos de arquivo, IDs internos);
- fragmentos de HTML/`${...}` vazando na interface;
- placeholders indevidos (`Lorem ipsum`, `TODO`, `FIXME`, "em desenvolvimento");
- elementos de debug;
- duplicações não intencionais (títulos, breadcrumbs, badges, botões, timeline).

Ocorrências de "em breve"/"todos" no código são **conteúdo legítimo** (copy de atendimento e chaves de filtro), não pendências.

## Componentes corrigidos (na origem)
- `css/components.css` → `.timeline--auto` (contenção com `min-width:0`, quebra de rótulos, linha conectora com respiro). Uma correção, três telas beneficiadas.
- `css/layout.css` → `.split--checkout` como grid autossuficiente (de rodadas anteriores; reutilizado aqui para as telas de detalhe).

## Arquivos alterados nesta rodada
- `css/components.css` — hardening da timeline horizontal.
- `pages/orders/detalhe.html` — `.split` → `.split--checkout`.
- `pages/admin/detalhe.html` — `.split` → `.split--checkout`.
- `docs/CORRECAO-TIMELINE.md`, `docs/LIMPEZA-VISUAL-E-CORRECOES.md` — documentação.

## Validação (viewports testados)
360px, 390px, 430px (vertical, sem overflow) · 768px/1024px (colapso para 1 coluna) · 1280px/1440px (2 colunas, timeline contida). Medições automatizadas confirmaram: sem overflow de página, sem invasão de card, sem sobreposição de rótulos.

## Critério de conclusão
- [✅] Timeline não invade o card de Entrega
- [✅] Timeline não causa overflow
- [✅] Textos das etapas não se sobrepõem
- [✅] Desktop / Tablet / Mobile funcionando
- [✅] Componente continua reutilizável (correção única)
- [✅] Pedido, Entrega e Pagamento continuam funcionais
- [✅] Sem conteúdo técnico/debug/placeholder exposto
- [✅] Identidade visual preservada
- [✅] Nenhuma funcionalidade sem nexo adicionada
