# 💠 **Automóvel Alerta – Sistema de Monitoramento de Manutenções Automotivas**

Uma plataforma web moderna para controle completo de veículos, abastecimentos, custos, manutenções e multas.

---

## 🚗 **Sobre o Projeto**

O **Automóvel Alerta** é um sistema web desenvolvido para auxiliar proprietários de veículos a monitorar e organizar todas as informações relacionadas ao uso e manutenção de seus carros.

Ele centraliza dados como:

- Abastecimentos
- Custos gerais
- Revisões e serviços
- Históricos de quilometragem
- Multas

A aplicação gera indicadores automáticos, gráficos, lembretes e fornece uma interface moderna e intuitiva, permitindo ao usuário acompanhar toda a vida útil do veículo.

---

## ✨ **Principais Funcionalidades**

### 🔧 **Gerenciamento de Veículos**

- Cadastro completo de veículos (placa, modelo, km, etc.)
- Organização por usuário autenticado

### ⛽ **Controle de Abastecimentos**

- Registro de litros, preço por litro e odômetro
- Cálculo automático de:
  - Consumo médio
  - Custo por km
  - Km rodados
- Gráficos interativos

### 🛠 **Manutenções**

- Registro de serviços com custo, data e km
- Histórico completo
- Identificação da última manutenção
- Gráfico de gastos ao longo do tempo

### 📄 **Multas**

- Registro completo com gravidade, pontos e prazo

### 📊 **Dashboard e KPIs**

- KPIs de consumo, custo e desempenho
- Visualização clara e direta
- Indicadores automáticos baseados nos últimos abastecimentos

### 🔐 **Autenticação**

- Login com Google via Supabase

---

## 🧱 **Tecnologias Utilizadas**

### **Front-end**

- React + Vite
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Tanstack Query
- Axios

### **Back-end**

- Node.js + Express
- Drizzle ORM
- SQLite (ambiente local)

### **Outros**

- Supabase Auth
- LocalStorage
- Date-fns
- Zod
- Recharts

## 🔧 **Como Rodar o Projeto**

### 📌 **Pré-requisitos**

- Node.js 18+
- PNPM ou NPM
- SQLite instalado (ou usar o arquivo já embutido)

---

## 📥 **1. Clonar o repositório**

```sh
git clone https://github.com/SEU_USUARIO/automovel-alerta.git
cd automovel-alerta
```

## 📦 **2. Instalar dependências**

- npm install

## 🛠 **3. Executar**

- Abrir dois terminais separados
- rode **npm run dev** no front e no back-end
- Um link com http://localhost:5173/ deve aparecer, a aplicação está rodando.
