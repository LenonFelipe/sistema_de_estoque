# 🍰 Sistema de Estoque para Confeitaria

Sistema web desenvolvido para controle de estoque de uma confeitaria, permitindo cadastrar insumos, registrar entradas, saídas e perdas, além de identificar produtos em estoque crítico.

## 🛠️ Tecnologias

* Node.js
* Express
* MySQL
* HTML
* CSS
* JavaScript

---

# 🚀 Como executar o projeto

## 1. Pré-requisitos

Instale:

* [Node.js](https://nodejs.org/)
* [MySQL](https://dev.mysql.com/downloads/)
* [Visual Studio Code](https://code.visualstudio.com/)
* Extensão **Live Server** no VS Code

---

## 2. Clone o projeto

No terminal:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd estoque-confeitaria
```

---

## 3. Instale as dependências

Execute:

```bash
npm install
```

---

## 4. Configure o banco de dados

Abra o **MySQL Workbench**.

Abra o arquivo:

```text
database.sql
```

que está na raiz do projeto.

Execute todo o script.

Ele criará automaticamente:

```text
estoque_confeitaria
├── insumos
└── movimentacoes_estoque
```

---

## 5. Configure o arquivo `.env`

Na raiz do projeto, copie:

```text
.env.example
```

e renomeie para:

```text
.env
```

Configure suas informações do MySQL:

```env
PORT=3333

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=estoque_confeitaria
DB_PORT=3306
```

Substitua `sua_senha` pela senha do seu MySQL.

> Não publique o arquivo `.env` no GitHub.

---

## 6. Inicie a API

No terminal:

```bash
npm run dev
```

A API será executada em:

```text
http://localhost:3333
```

Para verificar se está funcionando, acesse:

```text
http://localhost:3333/api/health
```

O resultado esperado é:

```json
{
  "status": "OK"
}
```

---

# 🌐 7. Abra o sistema

No VS Code, abra:

```text
frontend/index.html
```

Clique com o botão direito no arquivo e selecione:

```text
Open with Live Server
```

O sistema será aberto no navegador.

---

# 📌 Principais funcionalidades

* Cadastro de produtos
* Consulta de estoque
* Edição de produtos
* Exclusão de produtos
* Registro de entradas
* Registro de saídas
* Registro de perdas
* Cálculo automático do estoque atual
* Controle de estoque mínimo
* Alerta de estoque crítico
* Dashboard

---

# 👨‍💻 Projeto acadêmico

Projeto desenvolvido por **Lenon Felipe** como parte do curso de **Análise e Desenvolvimento de Sistemas**.

O sistema foi desenvolvido com o objetivo de aplicar conhecimentos de desenvolvimento web e banco de dados na solução de uma necessidade real de controle de estoque.
