# RECEBIMENTO DE MATERIAIS

Sistema web responsivo e preparado para **PWA**, corporativo, limpo e direto, desenvolvido para digitalizar a entrada e conferência de materiais físicos em docas e portarias com foco prioritário na experiência pelo **celular**.

---

## 🎯 Principais Funcionalidades

1. **Tela Inicial Corporativa Limpa (Estilo Intercarta)**:
   - Acesso rápido por dois botões de grande área de toque:
     - `+ NOVO RECEBIMENTO`
     - `📋 RECEBIMENTOS`
2. **Formulário Otimizado para Celular**:
   - Campos: Nº da NF, Data da NF, Fornecedor, Material/Produto, Quantidade, Lote, Transportadora, Placa, Motorista, Pedido/OC, Responsável (automático), Data/Hora (automático) e Observações.
   - Navegação passo a passo intuitiva, evitando telas poluídas.
3. **Módulo de Câmera da Nota Fiscal (NF)**:
   - Acionamento direto da câmera traseira do smartphone (`capture="environment"`).
   - Modo viewfinder com câmera ao vivo para alinhamento da DANFE.
   - Fluxo: **Tirar Foto** → **Pré-visualização** → **[Refazer Foto]** ou **[Confirmar Foto]**.
   - Compressão automática para garantir agilidade no celular.
4. **Conferência Física do Recebimento (9 Itens)**:
   - Seleção simplificada: `🟢 CONFORME` ou `🔴 NÃO CONFORME`.
   - Se `🔴 NÃO CONFORME`:
     - Exibição imediata do campo: *"O que foi identificado?"*
     - Botão integrado: `📷 TIRAR FOTO DA OCORRÊNCIA`.
5. **Resultado e Finalização**:
   - Avaliação automática do status do recebimento.
   - Resumo claro dos apontamentos e botão `✅ FINALIZAR RECEBIMENTO`.
   - Geração de código único rastreável (ex: `REC-20260917-1042`).
6. **Histórico e Detalhes**:
   - Busca em tempo real por NF, fornecedor ou material.
   - Cartões com informações resumidas e status visual.
   - Tela de detalhes com galeria de fotos ampliáveis, lista de conformidades e dados de transporte.

---

## 🏗️ Arquitetura do Sistema

```
CELULAR (Navegador ou PWA Instalado)
   ↓
REACT + TYPESCRIPT + TAILWIND CSS (client/)
   ↓ (Proxy / API REST)
BACKEND NODE.JS + TYPESCRIPT (server/)
   ↓ (MSAL Node - Client Credentials)
MICROSOFT ENTRA ID (Azure AD)
   ↓ (Microsoft Graph API)
SHAREPOINT / MICROSOFT LISTS (Lista: APP_RECEBIMENTO & Pasta: RecebimentoFotos)
```

> **Segurança:** O frontend nunca manipula nem armazena segredos ou tokens sensíveis da Microsoft. Toda a autenticação e integração com o Microsoft Graph é centralizada no backend Node.js.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+) e npm configurados.

### 1. Executar o Frontend (React + Vite)
```bash
cd client
npm run dev
```
O aplicativo abrirá em: `http://localhost:3000` (e acessível pelo IP na rede local para testes direto no celular).

### 2. Executar o Backend (Node.js + Express)
```bash
cd server
npm run dev
```
O backend rodará em: `http://localhost:5000`.

---

## ⚙️ Integração Real com Microsoft 365

Para conectar a lista `APP_RECEBIMENTO` do Microsoft Lists e salvar as fotos na biblioteca do SharePoint da empresa, consulte o arquivo com o passo a passo completo:
👉 **[CONFIGURACAO_MICROSOFT.md](./CONFIGURACAO_MICROSOFT.md)**
