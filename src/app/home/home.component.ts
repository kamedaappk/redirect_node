import { Component, OnInit } from '@angular/core';
import { RedirectService } from '../redirect.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  redirectUrl: string = 'https://www.google.com'; // Default URL if nothing is stored in localStorage
  isEditing: boolean = false; // Flag to check if we're in the editing state

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check localStorage for the saved redirect URL
    const savedUrl = localStorage.getItem('redirectUrl');
    if (savedUrl) {
      this.redirectUrl = savedUrl; // Use the saved URL if available
    }
    // Check if we're on the home route and allow editing
    if (this.router.url === '/home') {
      this.isEditing = true;
    } else {
      
      // Log the redirect to localStorage
      this.logRedirect(this.redirectUrl);
      // Automatically redirect the user to the saved or default URL
      window.location.href = this.redirectUrl;
    }
  }

  // Method to update the redirect URL in localStorage
  updateRedirectUrl() {
    if (this.isValidUrl(this.redirectUrl)) {
      localStorage.setItem('redirectUrl', this.redirectUrl); // Save the URL to localStorage
      alert('URL updated successfully!');
    } else {
      alert('Invalid URL');
    }
  }

  // Simple URL validation
  isValidUrl(url: string): boolean {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  }

  // Method to log a redirect URL (call this from HomeComponent)
  logRedirect(url: string) {
    const logEntry = `${new Date().toLocaleString()} - Redirected to: ${url}`;
    const savedLogs = localStorage.getItem('redirectLogs');
    let logs = savedLogs ? JSON.parse(savedLogs) : [];
    logs.push(logEntry); // Add log entry to the array

    // Save the updated logs back to localStorage
    localStorage.setItem('redirectLogs', JSON.stringify(logs));
  }
}