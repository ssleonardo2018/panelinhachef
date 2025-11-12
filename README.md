# 🍳 Panelinha Chef

**Panelinha Chef** é uma aplicação web responsiva desenvolvida em **HTML, CSS e JavaScript** para gerenciar receitas culinárias.  
O projeto permite **cadastrar, editar, excluir e favoritar receitas**, além de realizar **buscas avançadas**.  

LINK: https://ssleonardo2018.github.io/panelinhachef

---

## 🚀 Funcionalidades

- 📖 **Feed de receitas** com listagem de todas as receitas cadastradas  
- 🔍 **Busca avançada** por nome, ingrediente ou categoria  
- 👤 **Sistema de autenticação** (cadastro e login de usuários)  
- 🍲 **Gerenciamento de receitas** (cadastrar, editar e excluir)  
- ⭐ **Favoritos** — salve suas receitas preferidas  
- 🧑‍🍳 **Perfil do usuário** com opção de alterar senha  
- 🌈 **Design responsivo** e moderno  
- 🖼️ **Logo e paleta de cores personalizadas** conforme identidade visual da marca  

---

## 🗂️ Estrutura do Projeto

```
PanelinhaChef/
│
├── index.html              # Landing page  (Divulgação de lançamento)
├── obrigado.html           # Página de agradecimento pelo cadastro de e-mail na landing page
├── home.html               # Página inicial (feed de receitas + login/cadastro)
├── dashboard.html          # Página de receitas do usuário (feed de receitas + cadastro de receitas + Favoritos + Perfil)
├── manual.html             # Página com o Manual do usuário
│
├── /css
│   ├── style.css          # Estilos gerais do home.html
│   ├── style_index.css    # Estilos gerais do index.html
│   └── dashboard.css      # Estilos gerais do dashboard.html
│
├── /js
│   ├── main.js             # Funções principais da aplicação
│   ├── auth.js             # Login e cadastro de usuários
│   ├── darkmode.js         # possibilidades de tema dark para usuários autenticados
│   ├── abrirManual.js      # Abrir manual do usuário
│   ├── recipes.js          # Feed de receitas
│   └── search.js           # Pesquisa de receitas
│
└── /img
    ├── home.png                   # Página inicial
    ├── login.png                  # Realzizar acesso ao sistema (Login)
    ├── criar conta.png            # Criar conta
    ├── dashboard.png              # Dashboard
    ├── dashboard-tema-dark.png    # Possibilidades de tema darka após autenticado
    ├── janela de impressão.png    # Janela de impressão
    ├── tela-responsiva.png        # Cadastro de Receitas
    ├── dashboard-troca-senha.png  # Perfil (Trocar senha)
    └── logo.png            # Logotipo Panelinha Chef
```

---

## ⚙️ Instruções de Uso

### 🖥️ Executar Localmente
1. **Baixe o projeto completo** (`PanelinhaChef_Complete.zip`)  
2. Extraia o conteúdo em uma pasta local  
3. Abra o arquivo `index.html` no seu navegador preferido  

### 🔐 Login / Cadastro
- Clique em **Entrar / Cadastrar** na página inicial  
- Informe **Nome, E-mail e Senha**  
- Após entrar, o menu completo será liberado  

### 🍳 Cadastrar Receitas
- Clique em **"Minhas Receitas"**  
- Utilize os botões para **Cadastrar, Editar ou Excluir** receitas  

### ⭐ Favoritar Receitas
- No feed, clique no ícone de **estrela** para adicionar/remover receitas dos favoritos  

### ⚙️ Perfil
- Acesse o **menu Perfil** para alterar sua senha e visualizar seus dados  

---

## 🧑‍💻 Autores

- **Hugo Vicente**  
- **Leonardo Santos**  
- **Pedro Daniel de Oliveira**  
- **Elder Faber**  
- **Nathan Nascimento**

---

## 📜 Licença

Este projeto é de uso educacional e livre para modificações não comerciais.  
Crie, aprenda e evolua com o Panelinha Chef! ❤️

---

## 🧩 Tecnologias Utilizadas
- **HTML5**  
- **CSS3**  
- **JavaScript**
