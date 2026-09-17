import * as msal from '@azure/msal-node';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  azure: {
    tenantId: process.env.AZURE_TENANT_ID || '',
    clientId: process.env.AZURE_CLIENT_ID || '',
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}`,
  },
  sharepoint: {
    siteId: process.env.SHAREPOINT_SITE_ID || '',
    listName: process.env.SHAREPOINT_LIST_NAME || 'APP_RECEBIMENTO',
    driveName: process.env.SHAREPOINT_DRIVE_NAME || 'Documentos Compartilhados',
    photosFolder: process.env.SHAREPOINT_PHOTOS_FOLDER || 'RecebimentoFotos',
  },
};

export const isEntraConfigured = (): boolean => {
  return Boolean(
    config.azure.tenantId &&
    config.azure.clientId &&
    config.azure.clientSecret &&
    config.azure.tenantId !== 'seu-tenant-id-aqui'
  );
};

let msalClient: msal.ConfidentialClientApplication | null = null;

export const getMsalClient = (): msal.ConfidentialClientApplication | null => {
  if (!isEntraConfigured()) {
    return null;
  }

  if (!msalClient) {
    msalClient = new msal.ConfidentialClientApplication({
      auth: {
        clientId: config.azure.clientId,
        authority: config.azure.authority,
        clientSecret: config.azure.clientSecret,
      },
    });
  }

  return msalClient;
};

export const getGraphAccessToken = async (): Promise<string | null> => {
  const client = getMsalClient();
  if (!client) {
    return null;
  }

  try {
    const result = await client.acquireTokenByClientCredential({
      scopes: ['https://graph.microsoft.com/.default'],
    });
    return result?.accessToken || null;
  } catch (error) {
    console.error('Erro ao obter token de acesso no Microsoft Entra ID:', error);
    return null;
  }
};
