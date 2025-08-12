import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: 'home', component: Home},

    // FALLBACK
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];