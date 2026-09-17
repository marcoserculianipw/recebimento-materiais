import { Client } from '@microsoft/microsoft-graph-client';
import { getGraphAccessToken, config, isEntraConfigured } from '../config/entraConfig.js';
import { ReceivingRecord } from '../types/index.js';

export class MicrosoftGraphService {
  /**
   * Obtém cliente autenticado do Microsoft Graph
   */
  private static async getClient(): Promise<Client | null> {
    const token = await getGraphAccessToken();
    if (!token) return null;

    return Client.init({
      authProvider: (done) => {
        done(null, token);
      },
    });
  }

  /**
   * Salva o registro na Microsoft List APP_RECEBIMENTO via Graph API
   */
  public static async saveToReceivingList(record: ReceivingRecord): Promise<{ success: boolean; id?: string }> {
    if (!isEntraConfigured() || !config.sharepoint.siteId) {
      console.log('ℹ️ [MODO LOCAL/MOCK]: Microsoft Entra ID ou SharePoint Site ID não configurados. Registro simulado com sucesso.');
      return { success: true, id: record.id };
    }

    try {
      const client = await this.getClient();
      if (!client) throw new Error('Não foi possível inicializar o cliente Microsoft Graph');

      // Mapeamento dos campos para as colunas da lista APP_RECEBIMENTO no SharePoint
      const fields = {
        Title: record.invoiceNumber, // Campo obrigatório padrão do SharePoint
        DataNF: record.invoiceDate,
        Fornecedor: record.supplier,
        MaterialProduto: record.material,
        Quantidade: record.quantity,
        Lote: record.batch,
        Transportadora: record.carrier,
        Placa: record.licensePlate,
        Motorista: record.driver,
        PedidoOC: record.purchaseOrder,
        DataRecebimento: record.receivedAt,
        Responsavel: record.responsible,
        Status: record.overallStatus,
        ObservacaoGeral: record.generalObservation,
        IDRecebimento: record.id,
        // Armazena a conferência detalhada em formato JSON no campo de texto multilinha
        DetalhesConferencia: JSON.stringify(record.checklist),
      };

      const endpoint = `/sites/${config.sharepoint.siteId}/lists/${config.sharepoint.listName}/items`;
      const response = await client.api(endpoint).post({ fields });

      console.log('✅ Registro gravado com sucesso na Microsoft List APP_RECEBIMENTO:', response.id);
      return { success: true, id: response.id };
    } catch (error) {
      console.error('❌ Erro ao salvar na lista APP_RECEBIMENTO via Microsoft Graph:', error);
      throw error;
    }
  }

  /**
   * Envia foto (NF ou Ocorrência) para a biblioteca de documentos do SharePoint
   */
  public static async uploadPhotoToSharePoint(
    fileName: string,
    base64Data: string,
    receivingId: string
  ): Promise<{ webUrl: string }> {
    if (!isEntraConfigured() || !config.sharepoint.siteId) {
      console.log('ℹ️ [MODO LOCAL/MOCK]: Foto recebida no backend. Armazenada localmente (simulação).');
      return { webUrl: base64Data };
    }

    try {
      const client = await this.getClient();
      if (!client) throw new Error('Falha de autenticação no Microsoft Graph');

      // Extrai buffer binário da string base64
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64Data, 'base64');

      const cleanFileName = `${receivingId}_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const folderPath = config.sharepoint.photosFolder;

      // Endpoint de upload no drive do SharePoint
      const uploadUrl = `/sites/${config.sharepoint.siteId}/drive/root:/${folderPath}/${cleanFileName}:/content`;
      const driveItem = await client.api(uploadUrl).put(buffer);

      console.log(`✅ Foto ${cleanFileName} gravada no SharePoint Drive com sucesso:`, driveItem.webUrl);
      return { webUrl: driveItem.webUrl || '' };
    } catch (error) {
      console.error('❌ Erro ao subir foto no SharePoint:', error);
      // Retorna a própria base64 como contingência
      return { webUrl: base64Data };
    }
  }
}
