import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WardService } from '../../coreservices/ward.service';

@Component({
  selector: 'app-wards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wards.component.html',
  styleUrl: './wards.component.scss'
})
export class WardsComponent implements OnInit {
  wards: any[] = [];
  isLoading: boolean = true;

  constructor(private wardService: WardService) {}

  ngOnInit(): void {
    this.loadWards();
  }

  loadWards(): void {
    this.wardService.getWards().subscribe({
      next: (data) => {
        this.wards = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading wards:', error);
        this.isLoading = false;
      }
    });
  }
}
