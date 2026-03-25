import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Appointment {
  _id?: string;
  appointmentId: string;
  patient: any;
  doctor: any;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  type: string;
  reason: string;
  status: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private apiService: ApiService) {}

  getAppointments(params?: any): Observable<Appointment[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.apiService.get<Appointment[]>(`/appointments${queryString}`);
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.apiService.get<Appointment>(`/appointments/${id}`);
  }

  createAppointment(appointment: Partial<Appointment>): Observable<Appointment> {
    return this.apiService.post<Appointment>('/appointments', appointment);
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.apiService.put<Appointment>(`/appointments/${id}`, appointment);
  }

  cancelAppointment(id: string): Observable<Appointment> {
    return this.apiService.delete<Appointment>(`/appointments/${id}`);
  }
}
