import { Component, OnInit } from '@angular/core';
import { RedirectService } from '../redirect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logs',
  imports: [CommonModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogComponent implements OnInit {
  logs: string[] = []; // Array to hold the logs

  constructor() { }

  ngOnInit(): void {
    // Load logs from localStorage if available
    const savedLogs = localStorage.getItem('redirectLogs');
    if (savedLogs) {
      this.logs = JSON.parse(savedLogs);
    }
  }

  // Method to clear all logs
  clearLogs(): void {
    this.logs = []; // Clear the logs array
    localStorage.removeItem('redirectLogs'); // Remove the logs from localStorage
  }
}
