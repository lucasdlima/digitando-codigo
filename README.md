# ⌨️ Digitando Código
> **Prática de digitação e Programação**

Um Juiz Online interativo e focado em ergonomia, projetado para treinar a **memória muscular, a precisão sintática e o raciocínio lógico** de programadores. Construído com uma arquitetura moderna e totalmente executado no lado do cliente (in-browser).

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

---

## 🎯 Sobre o Projeto

O **Digitando Código** une a pedagogia dos *Serious Games* com a análise avançada de digitação (*Keystroke Dynamics*). Diferente de testes de digitação comuns que usam palavras aleatórias, este sistema força o usuário a digitar estruturas reais de código (atualmente focado em Python) sob pressão de tempo, separando o momento de reflexo muscular do momento de raciocínio lógico.

### Público-Alvo:
* **Estudantes de Computação:** Para eliminar gargalos de produtividade causados por erros de sintaxe (indentação, parênteses, dois pontos).
* **Engenheiros de Dados e Devs Python:** Para aquecer e refinar a velocidade de codificação diária.
* **Entusiastas de Teclados:** Usuários que precisam de métricas exatas para balanceamento de carga entre os dedos.

---

## ✨ Principais Funcionalidades

* 🧠 **O Ciclo de Duas Etapas:** O jogo separa a **Digitação Rápida** (onde o relógio corre e o WPM é calculado) da **Lacuna Lógica** (onde o relógio pausa para o usuário pensar e resolver o problema).
* 🐍 **Interpretador Python in-browser:** Integração com [Skulpt](https://skulpt.org/) para compilar e executar o código Python diretamente no frontend. Captura de *stdout* e erros reais de sintaxe/lógica para validação.
* 📊 **Telemetria por Dedo (Keystroke Dynamics):** Calcula o WPM e a precisão de forma independente para cada dedo da mão esquerda e direita, baseado no atraso em milissegundos entre as teclas.
* ⭐ **Gamificação e Gatekeeping:** Sistema de metas de WPM por fase (1 a 3 estrelas). O usuário só desbloqueia o próximo nível se atingir a proficiência mínima exigida (1 estrela).
* 💡 **Sistema de Dicas:** Prevenção de "travamento cognitivo" através de dicas contextuais ativadas pelo jogador durante a resolução lógica.
* 📖 **Tutorial Interativo:** Um carrossel explicativo embutido no sistema ensinando a mecânica do jogo e o mapeamento correto de dedos.
* 🌙 **Estética IDE Premium:** UI/UX focada em *Dark Mode*, *glassmorphism* e *syntax highlighting* em tempo real.

---

## 🚀 Como Executar Localmente

O projeto foi inicializado utilizando **Vite**. Não há necessidade de configurar um backend, pois todo o código Python é interpretado via WebAssembly/JS no cliente.

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (Versão 18+ recomendada)
* NPM, Yarn, PNPM ou Bun.

### Instalação

1. Clone o repositório:
```bash
git clone [https://github.com/SEU_USUARIO/digitando-codigo.git](https://github.com/SEU_USUARIO/digitando-codigo.git)
```

2. Acesse a pasta do projeto:
```bash
cd digitando-codigo
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará rodando em `http://localhost:5173`.

---

## 🏗️ Estrutura do Projeto (Arquitetura)

```text
src/
├── components/          # Componentes visuais do React (Menu, Editor, Teclado, Painel, Tutorial)
├── data/                # desafios.json (Banco de dados de fases e metas de WPM)
├── services/            # Serviços externos (Lógica de execução do Skulpt/Python)
├── store/               # Zustand Store (Máquina de estados global do jogo e persistência local)
├── types/               # Interfaces e tipagem estática do TypeScript
├── App.tsx              # Componente Raiz e Roteamento condicional
└── main.tsx             # Ponto de entrada do React
```

---

## 🛠️ Notas de Desenvolvimento (Vite + React)

Este template fornece uma configuração mínima para obter o React funcionando no Vite com HMR e algumas regras do ESLint. Os seguintes plugins oficiais estão disponíveis:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa Babel para Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa SWC para Fast Refresh.

### Expandindo a configuração do ESLint
Para ambientes de produção, é recomendado habilitar as regras de *type-aware lint*:

Modifique seu `eslint.config.js` incluindo as tipagens estritas do `tseslint.configs.recommendedTypeChecked` e as configurações específicas de React usando o `eslint-plugin-react-x`.

---

## 📝 Como Adicionar Novas Fases

O sistema possui uma arquitetura baseada em dados (*Data-Driven*). Para criar novas fases, basta editar o arquivo `src/data/desafios.json`. A interface do menu criará a categoria automaticamente e aplicará as regras de travamento (cadeado).

```json
{
  "id": 99,
  "categoria": "Nome da Nova Trilha",
  "titulo": "Nível X: Novo Desafio",
  "instrucao": "Instrução para o jogador.",
  "dica": "Dica opcional caso ele trave.",
  "outputEsperado": "Resultado no console",
  "metasWpm": [30, 50, 70],
  "partes": {
    "antes": "print('",
    "lacuna": "Hello World",
    "depois": "')"
  }
}
```

---

## 📄 Licença

Desenvolvido para fins de treinamento e portfólio. Código de uso livre (MIT). Sinta-se à vontade para realizar um *fork* e adicionar novas linguagens (JS, SQL, etc)!