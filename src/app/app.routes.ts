import { Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    { 
        path: 'home', 
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'areas',
                loadComponent: () => import('./features/area/area.component').then(m => m.AreaComponent)
            },
            {
                path: 'horarios',
                loadComponent: () => import('./features/schedule/schedule.component').then(m => m.ScheduleComponent)
            },
            {
                path: 'reservaciones',
                loadComponent: () => import('./features/event/event.component').then(m => m.EventComponent)
            }
        ]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent}
];
