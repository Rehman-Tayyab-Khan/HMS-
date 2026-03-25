import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface MedicalRecord {
  _id?: string;
  recordId: string;
  patient: any;
  doctor: any;
  appointment?: any;
  visitDate: string;
  chiefComplaint: string;
  diagnosis: string;
  symptoms?: string[];
  vitalSigns?: any;
  examination?: string;
  treatment?: any;
  labResults?: any[];
  followUp?: any;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  constructor(private apiService: ApiService) {}

  getMedicalRecords(params?: any): Observable<MedicalRecord[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.apiService.get<MedicalRecord[]>(`/medical-records${queryString}`);
  }

  getMedicalRecordById(id: string): Observable<MedicalRecord> {
    return this.apiService.get<MedicalRecord>(`/medical-records/${id}`);
  }

  createMedicalRecord(record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.apiService.post<MedicalRecord>('/medical-records', record);
  }

  updateMedicalRecord(id: string, record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.apiService.put<MedicalRecord>(`/medical-records/${id}`, record);
  }
}
