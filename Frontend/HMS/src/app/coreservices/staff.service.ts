import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Staff {
  _id?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  role: 'admin' | 'doctor' | 'nurse' | 'management';
  department: string;
  specialization?: string;
  licenseNumber?: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  constructor(private apiService: ApiService) {}

  getStaff(params?: any): Observable<Staff[]> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.apiService.get<Staff[]>(`/staff${queryString}`);
  }

  getStaffById(id: string): Observable<Staff> {
    return this.apiService.get<Staff>(`/staff/${id}`);
  }

  createStaff(staff: Partial<Staff>): Observable<Staff> {
    return this.apiService.post<Staff>('/staff', staff);
  }

  updateStaff(id: string, staff: Partial<Staff>): Observable<Staff> {
    return this.apiService.put<Staff>(`/staff/${id}`, staff);
  }

  deleteStaff(id: string): Observable<void> {
    return this.apiService.delete<void>(`/staff/${id}`);
  }
}
