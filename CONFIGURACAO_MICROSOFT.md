# GUIA DE INTEGRAÇÃO - MICROSOFT 365 & SHAREPOINT

> [!IMPORTANT]
> ## CONFIGURAÇÃO NECESSÁRIA
> Para que o sistema se comunique diretamente com o **Microsoft Lists** e salve as fotos na biblioteca do **SharePoint** da sua empresa, siga o passo a passo abaixo no **Portal do Azure (Microsoft Entra ID)** e no **SharePoint**.
>
> 💡 *Enquanto essa configuração não for preenchida, o sistema funciona perfeitamente em modo local (dados persistidos no navegador), permitindo testes completos da interface e do fluxo no celular.*

---

## 1. Registro do Aplicativo no Microsoft Entra ID (Azure AD)

1. Acesse o [Portal do Azure](https://portal.azure.com) ou o [Microsoft Entra admin center](https://entra.microsoft.com).
2. Vá em **Microsoft Entra ID** > **Registros de aplicativo** (App registrations) > **+ Novo registro** (+ New registration).
3. Preencha os dados:
   - **Nome**: `Recebimento de Materiais`
   - **Tipos de conta com suporte**: `Contas neste diretório organizacional apenas (Locatário único)`
   - **URI de Redirecionamento**: Deixe em branco (será usado pelo backend via Client Credentials).
4. Clique em **Registrar**.
5. Copie os valores e guarde:
   - **ID do aplicativo (cliente)**: `AZURE_CLIENT_ID`
   - **ID do diretório (locatário)**: `AZURE_TENANT_ID`

---

## 2. Criação do Client Secret (Segredo do Cliente)

1. No menu do aplicativo registrado, vá em **Certificados e segredos** > **Segredos do cliente**.
2. Clique em **+ Novo segredo do cliente**.
3. Descrição: `Recebimento Backend Secret` (Validade: 12 ou 24 meses).
4. Clique em **Adicionar** e **COPIE IMEDIATAMENTE O VALOR DO SEGREDO** (coluna *Valor*, não o ID do segredo).
   - Esse valor será o `AZURE_CLIENT_SECRET`.

---

## 3. Permissões de API (Microsoft Graph)

1. No menu do aplicativo, vá em **Permissões de APIs** > **+ Adicionar uma permissão**.
2. Selecione **Microsoft Graph** > **Permissões de aplicativo** (Application permissions).
3. Marque a seguinte permissão:
   - `Sites.ReadWrite.All` (Permite ler e gravar listas e arquivos nas bibliotecas do SharePoint da organização).
4. Clique em **Adicionar permissões**.
5. Em seguida, clique em **Conceder consentimento do administrador para [Sua Empresa]** (Grant admin consent).

---

## 4. Criação da Microsoft List: `APP_RECEBIMENTO`

1. Acesse o SharePoint ou o aplicativo **Microsoft Lists** com sua conta corporativa.
2. Crie uma nova lista no site corporativo escolhido com o nome exato:
   - **Nome da Lista**: `APP_RECEBIMENTO`
3. A coluna padrão `Title` será utilizada para o **Nº da NF**.
4. Adicione as seguintes colunas na lista:

| Nome da Coluna | Tipo de Coluna no SharePoint | Descrição |
| :--- | :--- | :--- |
| **Title** | Linha de texto única | Nº da NF (padrão) |
| **DataNF** | Linha de texto ou Data | Data de emissão da NF |
| **Fornecedor** | Linha de texto única | Razão social do fornecedor |
| **MaterialProduto** | Linha de texto única | Descrição do material |
| **Quantidade** | Linha de texto única | Volume / Quantidade |
| **Lote** | Linha de texto única | Lote do produto |
| **Transportadora** | Linha de texto única | Nome da transportadora |
| **Placa** | Linha de texto única | Placa do caminhão |
| **Motorista** | Linha de texto única | Nome do motorista |
| **PedidoOC** | Linha de texto única | Número da Ordem de Compra |
| **DataRecebimento** | Linha de texto única | Data/hora do recebimento físico |
| **Responsavel** | Linha de texto única | Colaborador conferente |
| **Status** | Opção (Escolha) ou Texto | `CONFORME` ou `NAO_CONFORME` |
| **ObservacaoGeral** | Múltiplas linhas de texto | Observações gerais do operador |
| **IDRecebimento** | Linha de texto única | Código único (ex: `REC-20260917-1042`) |
| **DetalhesConferencia**| Múltiplas linhas de texto | JSON contendo os 9 itens inspecionados |

---

## 5. Biblioteca de Documentos para as Fotos (SharePoint)

1. No mesmo site do SharePoint onde a lista foi criada, acesse **Documentos**.
2. Crie uma pasta chamada:
   - `RecebimentoFotos`
3. Todas as fotos tiradas pela câmera do celular (foto da NF e fotos de ocorrências) serão enviadas pelo backend diretamente para essa pasta.

---

## 6. Como Obter o `SHAREPOINT_SITE_ID`

Você pode obter o Site ID fazendo uma requisição no **Graph Explorer** (https://developer.microsoft.com/graph/graph-explorer):
```http
GET https://graph.microsoft.com/v1.0/sites/{sua-empresa}.sharepoint.com:/sites/{nome-do-site}
```
A resposta trará um campo `"id"` no formato:
`sua-empresa.sharepoint.com,b1234567-xxxx-xxxx-xxxx-xxxxxxxxxxxx,c1234567-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## 7. Preenchendo o Arquivo `.env` no Backend

Abra a pasta `server/` e crie o arquivo `.env` (copiando do `.env.example`):

```env
PORT=5000
AZURE_TENANT_ID=seu-tenant-id-obtido-no-passo-1
AZURE_CLIENT_ID=seu-client-id-obtido-no-passo-1
AZURE_CLIENT_SECRET=seu-segredo-copiado-no-passo-2
SHAREPOINT_SITE_ID=seu-site-id-obtido-no-passo-6
SHAREPOINT_LIST_NAME=APP_RECEBIMENTO
SHAREPOINT_DRIVE_NAME=Documentos Compartilhados
SHAREPOINT_PHOTOS_FOLDER=RecebimentoFotos
```

Pronto! Ao iniciar o backend, ele se autenticará com o Microsoft Entra ID e gravará todos os recebimentos diretamente no SharePoint e no Microsoft Lists.
