import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  constructor() { }

  // Save the redirect URL to localStorage (or backend)
  saveRedirectUrl(url: string) {
    let logs = this.getRedirectLogs();
    logs.push(url);
    localStorage.setItem('redirectLogs', JSON.stringify(logs));
  }

  // Retrieve the redirection logs from localStorage
  getRedirectLogs(): string[] {
    const logs = localStorage.getItem('redirectLogs');
    return logs ? JSON.parse(logs) : [];
  }

  // Clear the logs from localStorage
  clearLogs() {
    localStorage.removeItem('redirectLogs');
  }
}
