// Serviço de interface com Microsoft Graph API via Backend seguro
export class GraphService {
  private static backendUrl = '/api/graph';

  public static async checkConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const res = await fetch(`${this.backendUrl}/status`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
      return { connected: false, message: 'Backend respondeu com erro' };
    } catch {
      return {
        connected: false,
        message: 'Modo Offline / Local (Sem conexão com Microsoft Graph no momento)',
      };
    }
  }

  public static async getUserProfile(): Promise<any> {
    try {
      const res = await fetch(`${this.backendUrl}/me`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  }
}
