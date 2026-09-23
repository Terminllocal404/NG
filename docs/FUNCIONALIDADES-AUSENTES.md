# Funcionalidades Ausentes — NG Doce Duo

Registro transparente de tudo detectado como ausente, incluindo o que ficou intencionalmente fora do escopo.
Regra aplicada: nada foi inventado; integrações reais não foram simuladas como se fossem reais.

| Funcionalidade | Foi encontrada? | Está na especificação? | Ação | Motivo |
|----------------|-----------------|------------------------|------|--------|
| Integração real com gateway de pagamento | Não | Não (projeto é front-end) | Mantida como mock / Preparada para API | `paymentService.js` isola o processamento; pronto para `fetch()` futuro |
| Processamento real de PIX (banco) | Não | Não | Mantida como mock | QR ilustrativo e aprovação simulada; rotulado como "modo demonstração" |
| Envio real de e-mail (SMTP) na recuperação de senha | Não | Não | Mantida como mock | Código de 8 dígitos gerado localmente e exibido em modo demo |
| Autenticação real / backend de usuários | Não | Não | Mantida como mock | Sessão e usuários em `localStorage` via `authService.js` |
| Banco de dados / servidor / storage remoto | Não | Não | Preparada para API | Camada `js/services/` pronta para substituição |
| Consulta de CEP (ViaCEP ou similar) | Não | Não explicitada | Não implementada — dependência externa | Endereço é preenchido manualmente; campo com máscara de CEP |
| Programa de fidelidade / cashback / pontos | Não | Não | Não implementada — fora de escopo | Não solicitado; não inventar |
| Avaliação/review de produtos | Não | Não | Não implementada — fora de escopo | Não solicitado |
| Wishlist / favoritos | Não | Não | Não implementada — fora de escopo | Não solicitado |
| Chat / notificações push / WhatsApp | Não | Não | Não implementada — fora de escopo | Não solicitado |
| Geolocalização / mapa de entrega | Não | Não | Não implementada — fora de escopo | Não solicitado |
| Recomendações com IA | Não | Não | Não implementada — fora de escopo | Não solicitado |
| Marketplace / múltiplas lojas / afiliados / assinatura | Não | Não | Não implementada — fora de escopo | Não solicitado |
| Cupons avançados (regras complexas, validade, por cliente) | Parcial | Não detalhado | Mantida como mock simples | Cupons fixos de demonstração; regra mínima para o fluxo |

## Nota sobre dependências de backend

Este é um projeto **front-end**. Onde há dependência externa (pagamento, e-mail, banco), a entrega é:

- **Front-end (interface):** implementado ✅
- **Simulação/mock funcional:** implementado quando necessário ao fluxo ✅
- **Integração externa real:** registrada como dependência externa ⚠️ (não implementada, não mascarada)

Em nenhum ponto a interface afirma que pagamentos, e-mails ou pedidos reais estão integrados.
