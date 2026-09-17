# Recebimento de Materiais

**Ambiente de Demonstração:** [https://recebimento-materiais.vercel.app](https://recebimento-materiais.vercel.app/)  
*(Aplicação web responsiva e PWA. Para teste dos recursos de câmera e visor ao vivo, recomenda-se acesso via smartphone)*

Sistema desenvolvido para digitalização do processo operacional de recebimento físico de matérias-primas e insumos em docas industriais e centros de distribuição. Substitui formulários impressos de conferência física por um fluxo digital padronizado com captura fotográfica da DANFE, checklist de integridade de 9 itens e arquitetura preparada para o ecossistema Microsoft 365 (Microsoft Lists e SharePoint).

---

## Tecnologias Utilizadas

### Frontend
- **React 18** com **TypeScript**
- **Vite** (bundler e ambiente de desenvolvimento)
- **Tailwind CSS** (estilização utilitária corporativa com foco mobile-first)
- **Lucide React** (iconografia técnica)
- **PWA** (Web App Manifest e meta tags para suporte a execução standalone em smartphones)

### Backend
- **Node.js** com **Express** e **TypeScript**
- **@azure/msal-node** (autenticação segura com Microsoft Entra ID via Client Credentials)
- **@microsoft/microsoft-graph-client** (interação com Microsoft Lists e bibliotecas de documentos do SharePoint)

### Armazenamento e Nuvem
- **Microsoft Lists**: Tabela `APP_RECEBIMENTO` para armazenamento de registros estruturados
- **SharePoint**: Biblioteca de documentos corporativa (`RecebimentoFotos`) para guarda das imagens da NF e evidências de não conformidades

---

## Funcionalidades e Regras de Negócio

1. **Interface Operacional Direcionada (Mobile-First)**:
   - Tela inicial com acesso rápido aos dois fluxos principais: registro de nova entrada e consulta de histórico.
   - Layout com botões e campos dimensionados para toque em ambiente operacional de doca.

2. **Formulário de Entrada e Identificação**:
   - Dados fiscais e de produto: Nº da NF, data de emissão, fornecedor, descrição do material, quantidade e lote.
   - Dados logísticos: Transportadora, placa do veículo, motorista e número do Pedido/Ordem de Compra (OC).
   - Preenchimento automatizado: Responsável pela conferência (perfil autenticado no Microsoft 365) e carimbo de data/hora do recebimento.

3. **Módulo de Registro Fotográfico da DANFE**:
   - Acionamento direto da câmera traseira do dispositivo móvel através do atributo `capture="environment"`.
   - Visor ao vivo (*viewfinder*) integrado no navegador para enquadramento da nota fiscal física.
   - Fluxo de validação: captura, pré-visualização, opção para refazer ou confirmar.
   - Compressão client-side em canvas para otimização de banda de rede e persistência.

4. **Checklist de Conferência Física (9 Critérios)**:
   - Critérios avaliados:
     1. Integridade do compartimento de carga
     2. Limpeza do veículo transportador
     3. Ausência de contaminação cruzada
     4. Condições físicas dos pallets
     5. Rastreabilidade e identificação dos volumes
     6. Integridade da embalagem primária/secundária
     7. Contenção e ausência de violação de lacres
     8. Documentação técnica do produto (laudos, FISPQ)
     9. Ausência de pragas e vetores
   - Seleção simplificada: `CONFORME` ou `NÃO CONFORME`.
   - Em caso de reprovação de qualquer item, o formulário requisita a descrição detalhada da anomalia e disponibiliza captura fotográfica imediata da avaria.

5. **Classificação e Finalização**:
   - Cálculo automático do status final da entrada:
     - `CONFORME`: se a totalidade dos 9 critérios foi atendida.
     - `NÃO CONFORME`: se houver apontamento de qualquer desvio.
   - Geração de código identificador rastreável (formato `REC-AAAAMMDD-XXXX`).

6. **Histórico e Consulta de Entradas**:
   - Filtro de busca textual por número de nota fiscal, razão social do fornecedor ou descrição do produto.
   - Segmentação rápida por status (`Todos`, `Conformes`, `Não Conformes`).
   - Visão detalhada de cada recebimento com galeria de fotos em alta resolução, lista de checagem e dados de transporte.

---

## Arquitetura da Solução

```text
DISPOSITIVO MÓVEL (Navegador / PWA)
         ↓
  [Frontend React + Vite]
  Porta 3000 (Local) ou Vercel (Produção)
         ↓ (Proxy REST / JSON)
  [Backend Node.js + Express]
  Porta 5000 (Local) ou Container (Produção)
         ↓ (MSAL Node - Client Credentials)
  [Microsoft Entra ID (Azure AD)]
         ↓ (Microsoft Graph API v1.0)
  [Microsoft Lists]                 [SharePoint Drive]
  Lista: APP_RECEBIMENTO            Pasta: RecebimentoFotos
```

> **Princípio de Segurança**: Credenciais corporativas (*client secrets*, *tenant IDs*) nunca são expostas ao navegador. Todas as requisições autenticadas com a Graph API são intermediadas pelo backend.

---

## Estrutura do Repositório

```text
recebimento-materias/
├── client/                     # Aplicação frontend
│   ├── public/                 # Manifesto PWA e ícones
│   ├── src/
│   │   ├── components/         # Componentes de interface (Câmera, Checklist, Header, Badges)
│   │   ├── pages/              # Telas (Home, Novo Recebimento, Lista, Detalhes)
│   │   ├── services/           # Camadas de serviço (Recebimento, Auth, Fotos, Lists, SharePoint)
│   │   ├── types/              # Tipagens de domínio TypeScript
│   │   ├── utils/              # Funções utilitárias (geração de ID, formatação de datas)
│   │   ├── App.tsx             # Roteamento e gerenciamento de estado
│   │   └── main.tsx
│   ├── vercel.json             # Regras de SPA routing para deploy
│   └── vite.config.ts          # Configuração do Vite com proxy para backend local
├── server/                     # Serviço backend de integração
│   ├── src/
│   │   ├── config/             # Configuração MSAL e variáveis de ambiente
│   │   ├── controllers/        # Controladores de recebimentos e upload de arquivos
│   │   ├── routes/             # Rotas REST da API
│   │   ├── services/           # Cliente Microsoft Graph (Lists e SharePoint)
│   │   └── index.ts            # Ponto de entrada do servidor Express
│   ├── .env.example            # Modelo de configuração de variáveis de ambiente
│   └── package.json
├── .gitignore                  # Bloqueio de dependências, compilações e segredos
├── CONFIGURACAO_MICROSOFT.md   # Manual de provisionamento do Azure e SharePoint
├── package.json                # Scripts centralizados do workspace
└── README.md
```

---

## Execução Local

### Pré-requisitos
- Node.js 18 ou superior instalado.

### 1. Instalação
```bash
# Dependências do frontend
cd client
npm install

# Dependências do backend
cd ../server
npm install
```

### 2. Inicialização em Modo Desenvolvimento

**Frontend (React + Vite):**
```bash
cd client
npm run dev
```
O servidor iniciará em `http://localhost:3000` (e no endereço IP da rede local para testes em smartphones conectados à mesma rede Wi-Fi).

**Backend (Node.js + Express):**
```bash
cd server
npm run dev
```
O serviço iniciará em `http://localhost:5000`.

---

## Integração com Microsoft 365 e SharePoint

O frontend dispõe de camada de resiliência local (persistência em LocalStorage e IndexedDB para arquivos de imagem), permitindo validação integral das telas, fluxo de conferência e módulo de câmera sem dependência de infraestrutura externa imediata.

Para ativação da persistência em nuvem na infraestrutura Microsoft da organização:
1. Consulte o arquivo [CONFIGURACAO_MICROSOFT.md](./CONFIGURACAO_MICROSOFT.md).
2. Registre a aplicação no portal do Microsoft Entra ID com a permissão de aplicação `Sites.ReadWrite.All`.
3. Provisione a lista `APP_RECEBIMENTO` no SharePoint do site corporativo conforme o esquema de colunas documentado.
4. Preencha o arquivo `server/.env` com as credenciais obtidas no Azure.

---

## Instalação como PWA

A aplicação está configurada para funcionamento em tela cheia (*standalone*) em smartphones:
- **Android (Chrome)**: Acesse o endereço da aplicação e selecione a opção **Instalar aplicativo** no menu do navegador.
- **iOS (Safari)**: Acesse o endereço, toque no ícone de compartilhamento e selecione **Adicionar à Tela de Início**.
