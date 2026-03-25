import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Ward {
  _id?: string;
  wardNumber: string;
  wardName: string;
  wardType: string;
  totalBeds: number;
  availableBeds: number;
  floor: number;
  chargePerDay: number;
  headNurse?: any;
  status: string;
}

export interface Bed {
  _id?: string;
  bedNumber: string;
  ward: any;
  patient?: any;
  status: string;
  admissionDate?: string;
  dischargeDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WardService {
  constructor(private apiService: ApiService) {}

  getWards(params?: any): Observable<Ward[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.apiService.get<Ward[]>(`/wards${queryString}`);
  }

  getWardById(id: string): Observable<{ ward: Ward; beds: Bed[] }> {
    return this.apiService.get<{ ward: Ward; beds: Bed[] }>(`/wards/${id}`);
  }

  createWard(ward: Partial<Ward>): Observable<{ ward: Ward; beds: Bed[] }> {
    return this.apiService.post<{ ward: Ward; beds: Bed[] }>('/wards', ward);
  }

  updateWard(id: string, ward: Partial<Ward>): Observable<Ward> {
    return this.apiService.put<Ward>(`/wards/${id}`, ward);
  }

  getWardBeds(wardId: string): Observable<Bed[]> {
    return this.apiService.get<Bed[]>(`/wards/${wardId}/beds`);
  }

  assignBedToPatient(wardId: string, bedId: string, patientId: string): Observable<Bed> {
    return this.apiService.post(`/wards/${wardId}/beds`, { bedId, patientId });
  }

  dischargePatient(bedId: string): Observable<Bed> {
    return this.apiService.put<Bed>(`/wards/beds/${bedId}/discharge`, {});
  }
}
