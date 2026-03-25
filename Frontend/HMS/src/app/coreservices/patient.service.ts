import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Patient {
  _id?: string;
  patientId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  allergies?: string[];
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private apiService: ApiService) {}

  getPatients(params?: any): Observable<Patient[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.apiService.get<Patient[]>(`/patients${queryString}`);
  }

  getPatientById(id: string): Observable<Patient> {
    return this.apiService.get<Patient>(`/patients/${id}`);
  }

  createPatient(patient: Partial<Patient>): Observable<Patient> {
    return this.apiService.post<Patient>('/patients', patient);
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this.apiService.put<Patient>(`/patients/${id}`, patient);
  }

  deletePatient(id: string): Observable<void> {
    return this.apiService.delete<void>(`/patients/${id}`);
  }
}
