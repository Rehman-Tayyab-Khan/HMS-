import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StaffService } from '../../coreservices/staff.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit {
  staff: any[] = [];
  isLoading: boolean = true;

  constructor(private staffService: StaffService) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getStaff().subscribe({
      next: (data) => {
        this.staff = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading staff:', error);
        this.isLoading = false;
      }
    });
  }
}
