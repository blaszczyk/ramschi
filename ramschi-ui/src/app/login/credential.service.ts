import { Injectable } from '@angular/core';
import { Role } from '../ramschi/domain';

@Injectable({
  providedIn: 'root',
})
export class CredentialService {
  private assignee: string | null = null;

  private password: string | null = null;

  private role: Role | null = null;

  private initialised = false;

  constructor() {
    this.assignee = localStorage.getItem(KEY_CURRENT_ASSIGNEE);
    this.password = localStorage.getItem(KEY_CURRENT_PASSWORD);
    this.role = localStorage.getItem(KEY_CURRENT_ROLE) as Role;
    if (this.assignee) {
      this.initialised = true;
    }
  }

  setCredentials(assignee: string, password: string) {
    this.assignee = assignee;
    this.password = password;
  }

  storeCredentials() {
    localStorage.setItem(KEY_CURRENT_ASSIGNEE, this.assignee || '');
    localStorage.setItem(KEY_CURRENT_PASSWORD, this.password || '');
    localStorage.setItem(KEY_CURRENT_ROLE, this.role || '');
  }

  logout() {
    this.assignee = null;
    this.password = null;
    this.role = null;
    this.initialised = false;
    localStorage.removeItem(KEY_CURRENT_ASSIGNEE);
    localStorage.removeItem(KEY_CURRENT_PASSWORD);
    localStorage.removeItem(KEY_CURRENT_ROLE);
  }

  getAuthHeader(): string {
    const baseString = this.assignee
      ? this.password
        ? `${this.assignee}:${this.password}`
        : this.assignee
      : '';
    return btoa(baseString);
  }

  getRole(): Role | null {
    return this.role;
  }

  setRole(role: Role) {
    this.role = role;
  }

  setInitialised() {
    this.initialised = true;
  }

  isInitialised(): boolean {
    return this.initialised;
  }

  getAssignee(): string | null {
    return this.assignee;
  }

  isContributor(): boolean {
    return this.role === Role.CONTRIBUTOR || this.role === Role.ADMIN;
  }

  isAssignee(): boolean {
    return this.role != null;
  }

  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
}

export class RoleAware {
  constructor(protected readonly credential: CredentialService) {}

  get isAdmin(): boolean {
    return this.credential.isAdmin();
  };

  get isContributor(): boolean {
    return this.credential.isContributor();
  };

  get isAssignee(): boolean {
    return this.credential.isAssignee();
  };

  get assignee(): string | null {
    return this.credential.getAssignee();
  };

}

const KEY_CURRENT_ASSIGNEE = 'current_assignee';

const KEY_CURRENT_PASSWORD = 'current_password';

const KEY_CURRENT_ROLE = 'current_role';
