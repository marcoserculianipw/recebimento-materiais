# RECEBIMENTO DE MATERIAIS

> 🚀 **Acesse a Demonstração Online (Live Demo)**:  
> 👉 **[https://recebimento-materiais.vercel.app](https://recebimento-materiais.vercel.app/)**  
> 📱 *Abra o link pelo celular para testar a experiência PWA e a captura de fotos com a câmera traseira.*

Sistema web responsivo e preparado para **PWA**, corporativo, limpo e direto, desenvolvido para digitalizar a entrada e conferência física de materiais em docas e portarias com foco prioritário na usabilidade pelo **celular**.

Inspirado na identidade visual corporativa da **Intercarta** (tons de azul corporativo, tipografia moderna e áreas de toque confortáveis).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/) (build ultrarrápido e servidor de desenvolvimento)
  - [Tailwind CSS](https://tailwindcss.com/) (estilização utilitária e responsiva)
  - [Lucide Icons](https://lucide.dev/) (ícones corporativos limpos)
  - Preparado como **PWA** (manifesto web, viewport com safe-areas para celular)

- **Backend**:
  - [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
  - [@azure/msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js) (autenticação segura via Microsoft Entra ID)
  - [@microsoft/microsoft-graph-client](https://github.com/microsoftgraph/msgraph-sdk-javascript) (integração direta com Microsoft Lists e SharePoint)

- **Banco de Dados & Arquivos**:
  - **Microsoft Lists**: Lista corporativa `APP_RECEBIMENTO`
  - **SharePoint**: Biblioteca de documentos corporativa (pasta `RecebimentoFotos`)

---

## 🎯 Principais Funcionalidades

1. **Tela Inicial Corporativa (Mobile-First)**:
   - Acesso rápido aos dois botões centrais:
     - `+ NOVO RECEBIMENTO` (ação primária em destaque)
     - `📋 RECEBIMENTOS` (consulta e histórico)
   - Interface desobstruída, sem gráficos desnecessários ou poluidores visuais.

2. **Formulário de Entrada Otimizado**:
   - Organizado em etapas guiadas para não sobrecarregar a tela do celular:
     - **Dados Fiscais & Produto**: Nº da NF, Data da NF, Fornecedor, Material/Produto, Quantidade, Lote.
     - **Transporte & Identificação**: Transportadora, Placa do veículo, Motorista, Pedido/OC.
     - **Controle Automático**: Preenchimento automático do **Responsável** (usuário conectado via Microsoft 365) e carimbo de **Data e Hora do Recebimento**.
     - Observações gerais.

3. **Módulo de Câmera da Nota Fiscal (NF)**:
   - Acionamento direto da câmera traseira do smartphone (`capture="environment"`).
   - Visor ao vivo (*viewfinder*) integrado no navegador para enquadramento da DANFE.
   - Fluxo: **Tirar Foto** ➔ **Pré-visualização** ➔ `[REFAZER FOTO]` ou `[CONFIRMAR FOTO]`.
   - Compressão automática em tempo real para otimizar uso de banda e memória do aparelho.

4. **Conferência Física do Recebimento (9 Critérios)**:
   - Critérios de inspeção:
     1. Integridade do compartimento
     2. Limpeza do veículo
     3. Ausência de contaminação cruzada
     4. Condições dos pallets
     5. Rastreabilidade
     6. Integridade da embalagem
     7. Contenção / violação
     8. Documentação do produto
     9. Ausência de pragas
   - Botões com toque amplo: `🟢 CONFORME` e `🔴 NÃO CONFORME`.
   - Ao assinalar `🔴 NÃO CONFORME`:
     - Exibe imediatamente o campo: *"O que foi identificado?"*
     - Disponibiliza botão dedicado: `📷 TIRAR FOTO DA OCORRÊNCIA`.

5. **Resultado e Finalização com ID Único**:
   - Avaliação automática do status:
     - `🟢 CONFORME`: se todos os 9 itens forem aprovados.
     - `🔴 NÃO CONFORME`: se houver apontamento de irregularidade.
   - Botão `✅ FINALIZAR RECEBIMENTO` com geração de ID rastreável (ex: `REC-20260917-1042`).
   - Tela de confirmação de sucesso com acesso direto aos detalhes.

6. **Histórico e Detalhes do Recebimento**:
   - Campo de pesquisa em tempo real `🔎 Buscar recebimento` (filtra por NF, Fornecedor ou Material/Produto).
   - Filtros rápidos por status (*Todos*, *🟢 Conformes*, *🔴 Não Conformes*).
   - Tela de **Detalhes** exibindo todos os dados preenchidos, visualizador ampliado da foto da NF, itens aprovados, divergências apontadas e fotos de ocorrência anexadas.

---

## 🏗️ Arquitetura do Sistema

```
SMARTPHONE / COMPUTADOR
          ↓
  [Frontend React + Vite + PWA]
  (Porta 3000 / IP da rede local)
          ↓ (Proxy / REST API sem expor credenciais)
  [Backend Node.js + Express + TypeScript]
  (Porta 5000)
          ↓ (MSAL Node - Client Credentials)
  [Microsoft Entra ID (Azure AD)]
          ↓ (Microsoft Graph API)
  [Microsoft Lists (Lista APP_RECEBIMENTO)] + [SharePoint (Pasta RecebimentoFotos)]
```

> **Segurança:** O frontend nunca manipula nem armazena segredos ou tokens sensíveis da Microsoft. Toda a comunicação com o Microsoft Graph é centralizada no backend Node.js.

---

## 📁 Estrutura do Projeto

```text
recebimento-materias/
├── client/                     # Frontend React + TypeScript + Vite + Tailwind
│   ├── public/                 # Manifest PWA e ícones
│   ├── src/
│   │   ├── components/         # Header, CameraCapture, ChecklistItemRow, StatusBadge
│   │   ├── pages/              # HomePage, NewReceivingPage, ReceivingListPage, ReceivingDetailsPage
│   │   ├── services/           # receivingService, authService, photoService, listsService, sharepointService
│   │   ├── types/              # Definições de tipos TypeScript
│   │   ├── utils/              # Gerador de IDs e formatadores de data
│   │   ├── App.tsx             # Roteamento e orquestração de telas
│   │   └── main.tsx
│   └── vite.config.ts          # Configuração Vite com proxy para o backend
├── server/                     # Backend Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/             # Configurações do Azure MSAL / Microsoft Entra ID
│   │   ├── controllers/        # Controladores REST de recebimentos e fotos
│   │   ├── routes/             # Rotas da API (/api/recebimentos, /api/health)
│   │   ├── services/           # microsoftGraphService (Lists e SharePoint Drive)
│   │   └── index.ts            # Inicialização do servidor Express
│   ├── .env.example            # Exemplo de configuração de variáveis de ambiente
│   └── package.json
├── .gitignore                  # Proteção de credenciais, builds e dependências
├── CONFIGURACAO_MICROSOFT.md   # Passo a passo de integração com Entra ID e SharePoint
├── package.json                # Scripts da raiz para executar client e server
└── README.md
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior) instalado.

### 1. Instalação das Dependências

Na raiz do projeto ou dentro de cada pasta:
```bash
# Instalar dependências do frontend
cd client
npm install

# Instalar dependências do backend
cd ../server
npm install
```

### 2. Executar o Frontend (React + Vite)
```bash
cd client
npm run dev
```
- Acesso local: `http://localhost:3000`
- Acesso na rede pelo celular: `http://<SEU_IP_LOCAL>:3000`

### 3. Executar o Backend (Node.js + Express)
Em outro terminal:
```bash
cd server
npm run dev
```
- O servidor iniciará na porta `5000` (`http://localhost:5000`).

---

## ⚙️ Integração com Microsoft 365 / SharePoint

O sistema já está totalmente funcional com armazenamento local para validação imediata do fluxo no celular.

Para habilitar a sincronização em nuvem com a sua conta corporativa da Microsoft:
1. Abra o arquivo: **[CONFIGURACAO_MICROSOFT.md](./CONFIGURACAO_MICROSOFT.md)**.
2. Siga as instruções para registrar o aplicativo no **Microsoft Entra ID** com a permissão `Sites.ReadWrite.All`.
3. Crie a lista `APP_RECEBIMENTO` no SharePoint com as colunas indicadas.
4. Crie o arquivo `server/.env` preenchendo as chaves do locatário e do site.

---

## 📲 Utilizando como PWA no Celular

Para instalar como aplicativo direto na tela de início do seu smartphone:
- **No Android (Google Chrome)**: Acesse o endereço do sistema, toque no menu de três pontos no canto superior direito e selecione **"Adicionar à tela inicial"** ou **"Instalar aplicativo"**.
- **No iOS (Safari)**: Acesse o endereço, toque no botão de compartilhamento e selecione **"Adicionar à Tela de Início"**.
