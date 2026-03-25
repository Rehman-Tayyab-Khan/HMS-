import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private apiService: ApiService) {}

  getDashboardStats(): Observable<any> {
    return this.apiService.get('/reports/dashboard');
  }

  getAppointmentReports(params?: any): Observable<any[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.apiService.get(`/reports/appointments${queryString}`);
  }

  getPatientReports(): Observable<any[]> {
    return this.apiService.get('/reports/patients');
  }

  getWardReports(): Observable<any[]> {
    return this.apiService.get('/reports/wards');
  }
}
