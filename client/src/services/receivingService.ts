import { ReceivingFormData, ReceivingRecord, OverallStatus } from '../types';
import { generateReceivingId } from '../utils/idGenerator';
import { storageService } from './storageService';

class ReceivingService {
  private apiBaseUrl = '/api';

  public async getAllReceivings(): Promise<ReceivingRecord[]> {
    // Tenta obter da API (se backend estiver online), senão recorre ao storage local
    try {
      const response = await fetch(`${this.apiBaseUrl}/recebimentos`, {
        signal: AbortSignal.timeout(1200),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Backend offline ou modo mock (Fase 1)
    }
    return storageService.getRecords();
  }

  public async getReceivingById(id: string): Promise<ReceivingRecord | undefined> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/recebimentos/${id}`, {
        signal: AbortSignal.timeout(1200),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Backend offline ou modo mock
    }
    return storageService.getRecordById(id);
  }

  public calculateOverallStatus(checklist: ReceivingFormData['checklist']): OverallStatus {
    const hasNonConformity = checklist.some((item) => item.status === 'NAO_CONFORME');
    return hasNonConformity ? 'NAO_CONFORME' : 'CONFORME';
  }

  public async createReceiving(formData: ReceivingFormData): Promise<ReceivingRecord> {
    const overallStatus = this.calculateOverallStatus(formData.checklist);
    const id = generateReceivingId();
    const newRecord: ReceivingRecord = {
      ...formData,
      id,
      overallStatus,
      createdAt: new Date().toISOString(),
    };

    // Tenta sincronizar com o backend Node.js (SharePoint / Lists)
    try {
      const response = await fetch(`${this.apiBaseUrl}/recebimentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        const savedApi = await response.json();
        storageService.saveRecord(savedApi);
        return savedApi;
      }
    } catch {
      // Fallback local garantido
    }

    storageService.saveRecord(newRecord);
    return newRecord;
  }
}

export const receivingService = new ReceivingService();
