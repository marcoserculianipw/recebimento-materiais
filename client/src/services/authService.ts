import { UserProfile } from '../types';

// Serviço de autenticação preparado para Microsoft Entra ID (MSAL)
// Na Fase 1, opera com perfil corporativo configurado, pronto para plugar MSAL Browser na Fase 2
class AuthService {
  private currentUser: UserProfile = {
    name: 'Marcos Chaves',
    email: 'marcos.chaves@intercarta.com.br',
    jobTitle: 'Conferente de Recebimento',
  };

  public getCurrentUser(): UserProfile {
    // Permite sobrescrever no localStorage se necessário
    const saved = localStorage.getItem('recebimento_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback para currentUser padrão
      }
    }
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile): void {
    this.currentUser = user;
    localStorage.setItem('recebimento_current_user', JSON.stringify(user));
  }

  public isAuthenticated(): boolean {
    return true; // Autenticado
  }

  public async login(): Promise<UserProfile> {
    // Futura chamada MSAL signInPopup ou redirect
    return this.getCurrentUser();
  }

  public async logout(): Promise<void> {
    localStorage.removeItem('recebimento_current_user');
  }
}

export const authService = new AuthService();
