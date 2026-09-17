import { Request, Response } from 'express';
import { MicrosoftGraphService } from '../services/microsoftGraphService.js';
import { ReceivingRecord } from '../types/index.js';

// Armazenamento em memória no backend como cache/fallback
const memoryRecords: ReceivingRecord[] = [];

export class ReceivingController {
  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      res.json(memoryRecords);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar recebimentos' });
    }
  }

  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const record = memoryRecords.find((r) => r.id === id);
      if (!record) {
        res.status(404).json({ error: 'Recebimento não encontrado' });
        return;
      }
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar recebimento' });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const record: ReceivingRecord = req.body;

      if (!record.invoiceNumber || !record.supplier || !record.material) {
        res.status(400).json({ error: 'Nº NF, Fornecedor e Material são campos obrigatórios' });
        return;
      }

      // 1. Processa upload de foto de NF para SharePoint se presente
      if (record.invoicePhoto && record.invoicePhoto.startsWith('data:image')) {
        try {
          const uploadResult = await MicrosoftGraphService.uploadPhotoToSharePoint(
            `NF_${record.invoiceNumber}.jpg`,
            record.invoicePhoto,
            record.id
          );
          // Se gerou URL remota no SharePoint, atualiza o campo
          if (uploadResult.webUrl && uploadResult.webUrl.startsWith('http')) {
            record.invoicePhoto = uploadResult.webUrl;
          }
        } catch (photoErr) {
          console.warn('Falha no upload da foto da NF para SharePoint, mantendo base64:', photoErr);
        }
      }

      // 2. Processa fotos de ocorrência da conferência se presentes
      if (record.checklist && Array.isArray(record.checklist)) {
        for (const item of record.checklist) {
          if (item.photoUrl && item.photoUrl.startsWith('data:image')) {
            try {
              const resPhoto = await MicrosoftGraphService.uploadPhotoToSharePoint(
                `OCORRENCIA_${item.id}.jpg`,
                item.photoUrl,
                record.id
              );
              if (resPhoto.webUrl && resPhoto.webUrl.startsWith('http')) {
                item.photoUrl = resPhoto.webUrl;
              }
            } catch (err) {
              console.warn(`Falha ao subir foto do item ${item.id}:`, err);
            }
          }
        }
      }

      // 3. Salva os metadados na lista APP_RECEBIMENTO do SharePoint / Microsoft Lists
      try {
        await MicrosoftGraphService.saveToReceivingList(record);
      } catch (listErr) {
        console.warn('Registro salvo localmente com aviso de pendência no Microsoft Lists:', listErr);
      }

      // Salva no repositório em memória
      memoryRecords.unshift(record);

      res.status(201).json(record);
    } catch (error) {
      console.error('Erro ao processar recebimento:', error);
      res.status(500).json({ error: 'Falha interna ao salvar o recebimento' });
    }
  }

  public static async uploadPhoto(req: Request, res: Response): Promise<void> {
    try {
      const { fileName, fileData, receivingId } = req.body;
      if (!fileData) {
        res.status(400).json({ error: 'Dados da imagem não fornecidos' });
        return;
      }

      const result = await MicrosoftGraphService.uploadPhotoToSharePoint(
        fileName || 'foto.jpg',
        fileData,
        receivingId || 'REC-TEMP'
      );

      res.json(result);
    } catch (error) {
      console.error('Erro na rota de upload de foto:', error);
      res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
    }
  }
}
