import { Injectable } from '@angular/core';
import { Role } from '../ramschi/domain';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CredentialService {
  private assignee: string | null = null;

  private password: string | null = null;

  private role: Role | null = null;

  private initialised = false;

  constructor(router: Router) {
    this.assignee = localStorage.getItem(KEY_CURRENT_ASSIGNEE);
    this.password = localStorage.getItem(KEY_CURRENT_PASSWORD);
    this.role = localStorage.getItem(KEY_CURRENT_ROLE) as Role;
    if (this.assignee) {
      this.initialised = true;
    }
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url.startsWith('/r/')) {
          this.initialised = true;
        }
      }
    });
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

  logout(): void {
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
    return btoa(utf8ToHex(baseString));
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
  }

  get isContributor(): boolean {
    return this.credential.isContributor();
  }

  get isAssignee(): boolean {
    return this.credential.isAssignee();
  }

  get assignee(): string | null {
    return this.credential.getAssignee();
  }

  // does not belong here but is useful
  // TODO: create more generic parent class for components in util file or so
  urlify(text: string | null): string {
    text = text || '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url: string) {
      return `<a href="${url}" target="_blank">${url}</a>`;
    });
  }
}

const KEY_CURRENT_ASSIGNEE = 'current_assignee';

const KEY_CURRENT_PASSWORD = 'current_password';

const KEY_CURRENT_ROLE = 'current_role';

function utf8ToHex(text: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  let hex = '';
  data.forEach((byte) => {
    hex += byte.toString(16).padStart(2, '0');
  });
  return hex;
}
