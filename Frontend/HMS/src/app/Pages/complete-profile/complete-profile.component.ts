import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../coreservices/auth.service';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.scss'
})
export class CompleteProfileComponent implements OnInit {
  profileForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: this.fb.group({
        street: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: [''],
        country: ['', Validators.required]
      }),
      role: ['', [Validators.required]],
      department: ['', [Validators.required]],
      specialization: [''],
      licenseNumber: ['']
    });
  }

  ngOnInit(): void {
    // Update specialization and licenseNumber validators based on role
    this.profileForm.get('role')?.valueChanges.subscribe(role => {
      const specializationControl = this.profileForm.get('specialization');
      const licenseControl = this.profileForm.get('licenseNumber');
      
      if (role === 'doctor' || role === 'nurse') {
        specializationControl?.setValidators([Validators.required]);
        licenseControl?.setValidators([Validators.required]);
      } else {
        specializationControl?.clearValidators();
        licenseControl?.clearValidators();
      }
      specializationControl?.updateValueAndValidity();
      licenseControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.completeProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.authService.setUser(response.user);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to complete profile. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      role: 'Role',
      department: 'Department',
      specialization: 'Specialization',
      licenseNumber: 'License Number'
    };
    return labels[fieldName] || fieldName;
  }
}
