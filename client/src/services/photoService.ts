// Serviço para manipulação, compressão e upload de fotos
export class PhotoService {
  /**
   * Redimensiona e comprime uma imagem em base64/dataURL para garantir performance
   * no celular e evitar limites de armazenamento/banda de rede.
   */
  public static async compressImage(
    fileOrDataUrl: File | string,
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.75
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Falha ao instanciar canvas 2D'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.onerror = (err) => reject(err);

      if (typeof fileOrDataUrl === 'string') {
        img.src = fileOrDataUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(fileOrDataUrl);
      }
    });
  }

  /**
   * Envia foto para o backend para upload no SharePoint
   */
  public static async uploadToSharepoint(
    photoBase64: string,
    fileName: string,
    receivingId: string
  ): Promise<string> {
    try {
      const response = await fetch('/api/sharepoint/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          receivingId,
          fileData: photoBase64,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.webUrl || photoBase64;
      }
    } catch {
      // Retorna base64 local se backend não estiver conectado
    }
    return photoBase64;
  }
}
