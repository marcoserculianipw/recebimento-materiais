// Serviço cliente para interações com SharePoint (armazenamento de fotos e documentos)
export class SharePointService {
  private static backendUrl = '/api/sharepoint';

  public static async uploadFile(
    fileBlob: Blob | string,
    fileName: string,
    folder: string = 'RecebimentoFotos'
  ): Promise<string | null> {
    try {
      const res = await fetch(`${this.backendUrl}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBlob, fileName, folder }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.webUrl;
      }
    } catch (e) {
      console.warn('Erro ao enviar arquivo para SharePoint:', e);
    }
    return null;
  }
}
