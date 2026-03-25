import { Routes } from '@angular/router';
import { authGuard } from './coreguards/auth.guard';
import { roleGuard } from './coreguards/role.guard';
import { profileCompleteGuard } from './coreguards/profile-complete.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./Pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./Auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./Auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'complete-profile',
    loadComponent: () => import('./Pages/complete-profile/complete-profile.component').then(m => m.CompleteProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./Dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, profileCompleteGuard]
  },
  {
    path: 'patients',
    loadComponent: () => import('./Pages/patients/patients.component').then(m => m.PatientsComponent),
    canActivate: [authGuard, profileCompleteGuard, roleGuard(['admin', 'doctor', 'nurse', 'management'])]
  },
  {
    path: 'appointments',
    loadComponent: () => import('./Pages/appointments/appointments.component').then(m => m.AppointmentsComponent),
    canActivate: [authGuard, profileCompleteGuard, roleGuard(['admin', 'doctor', 'nurse', 'management'])]
  },
  {
    path: 'medical-records',
    loadComponent: () => import('./Pages/medical-records/medical-records.component').then(m => m.MedicalRecordsComponent),
    canActivate: [authGuard, profileCompleteGuard, roleGuard(['admin', 'doctor'])]
  },
  {
    path: 'wards',
    loadComponent: () => import('./Pages/wards/wards.component').then(m => m.WardsComponent),
    canActivate: [authGuard, profileCompleteGuard, roleGuard(['admin', 'nurse', 'management'])]
  },
  {
    path: 'staff',
    loadComponent: () => import('./Pages/staff/staff.component').then(m => m.StaffComponent),
    canActivate: [authGuard, profileCompleteGuard, roleGuard(['admin', 'management'])]
  },
  {
    path: 'reports',
    loadComponent: () => import('./Pages/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard, profileCompleteGuard, roleGuard(['admin', 'management'])]
  },
  {
    path: 'profile',
    loadComponent: () => import('./Pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard, profileCompleteGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
