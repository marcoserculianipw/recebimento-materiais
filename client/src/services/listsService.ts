import { ReceivingRecord } from '../types';

// Serviço para operações na lista APP_RECEBIMENTO do Microsoft Lists
export class ListsService {
  private static backendUrl = '/api/lists';

  public static async createListItem(record: ReceivingRecord): Promise<boolean> {
    try {
      const res = await fetch(`${this.backendUrl}/app-recebimento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return res.ok;
    } catch (e) {
      console.warn('Não foi possível sincronizar com a Microsoft List:', e);
      return false;
    }
  }

  public static async getListItems(): Promise<ReceivingRecord[]> {
    try {
      const res = await fetch(`${this.backendUrl}/app-recebimento`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Retorna vazio em caso de erro
    }
    return [];
  }
}
