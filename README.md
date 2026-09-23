# NG Doce Duo — Front-end

Loja virtual de doces artesanais (bolos de pote, copos da felicidade, brigadeiros e bolos inteiros).
Desenvolvida em **HTML5 + CSS3 + JavaScript ES6+ puro**, sem frameworks.

## Como executar

Por usar `fetch`/imagens e navegação entre páginas, rode um servidor estático simples na raiz do projeto:

```bash
python -m http.server 8099
```

Depois abra `http://localhost:8099/index.html`.
Também funciona abrindo `index.html` diretamente (`file://`), pois os scripts são carregados via `js/include.js`.

## Contas de demonstração

- **Cliente:** `marina@email.com` / `123456`
- **Admin:** `admin@ngduodoce.com.br` / `admin123` (acesse `/pages/admin/login.html`)
- **Cupons:** `DOCE10` (10%) · `BEMVINDO` (R$ 8,00)
- **Cartão recusado (teste):** qualquer número terminado em `0`.

## Estrutura

```
ng-doce-duo/
├── index.html                 # Home
├── pages/
│   ├── catalogo.html          # Catálogo + filtros + busca + paginação
│   ├── produto.html           # Detalhe do produto (+ estados esgotado/indisponível)
│   ├── contato.html
│   ├── auth/                  # login, cadastro, recuperar-senha (código de 8 dígitos)
│   ├── customer/              # perfil, endereços (CRUD), pedidos
│   ├── checkout/              # sacola, checkout (5 etapas + PIX/cartão)
│   ├── orders/                # detalhe, acompanhar (timeline)
│   └── admin/                 # login, dashboard, pedidos, produtos, clientes, configurações
├── assets/ (logo, products)
├── css/  (reset, variables, base, layout, components, forms, responsive → main.css)
└── js/
    ├── include.js             # carregador do core
    ├── data.js                # dados mock (fonte única)
    ├── utils.js, validation.js, cart.js, orders.js
    ├── checkout.js, customer.js, admin.js
    ├── components/ (icons, ui, layout)
    └── services/  (product, auth, order, payment, customer) — camada pronta para API
```

## Camada de dados

Tudo é mock + `localStorage` (sessão, carrinho, pedidos, produtos do admin).
A pasta `js/services/` isola o acesso a dados — basta trocar o corpo dos métodos por chamadas `fetch()` para integrar uma API real. Pagamentos, PIX e e-mails são **simulados** (ambiente de demonstração).
