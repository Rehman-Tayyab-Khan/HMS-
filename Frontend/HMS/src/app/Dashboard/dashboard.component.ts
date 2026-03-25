import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../coreservices/auth.service';
import { ReportService } from '../coreservices/report.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  stats: any = null;
  isLoading: boolean = true;
  currentTime: Date = new Date();
  private timeInterval: any;

  constructor(
    public authService: AuthService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
    
    if (this.user?.role === 'admin' || this.user?.role === 'management') {
      this.loadDashboardStats();
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateTime(): void {
    this.currentTime = new Date();
  }

  loadDashboardStats(): void {
    this.reportService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.isLoading = false;
      }
    });
  }

  getRoleDisplayName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrator',
      'doctor': 'Doctor',
      'nurse': 'Nurse',
      'management': 'Management'
    };
    return roleMap[role] || role;
  }
}
