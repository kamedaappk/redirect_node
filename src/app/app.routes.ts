import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LogComponent } from './logs/logs.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Default route for redirection
  { path: 'home', component: HomeComponent }, // Route for editing the URL
  { path: 'logs', component: LogComponent }   // Route for viewing the logs
];
