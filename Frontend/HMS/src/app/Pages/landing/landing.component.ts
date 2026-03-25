import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  visibleSections: Set<string> = new Set();

  highlights = [
    {
      icon: 'shield_lock',
      title: 'Secure by design',
      description: 'Role-based access, protected APIs, and clean audit-friendly flows.',
    },
    {
      icon: 'speed',
      title: 'Fast workflows',
      description: 'Less clicking, faster search, and consistent layouts for daily use.',
    },
    {
      icon: 'insights',
      title: 'Clear oversight',
      description: 'Dashboards and reports that support real operational decisions.',
    },
  ];

  modules = [
    { icon: 'groups', title: 'Staff', description: 'Profiles, roles, and staffing oversight.' },
    { icon: 'person', title: 'Patients', description: 'Accurate records and patient history.' },
    { icon: 'event', title: 'Appointments', description: 'Scheduling that stays organized.' },
    { icon: 'medical_services', title: 'Medical records', description: 'Structured clinical data and notes.' },
    { icon: 'hotel', title: 'Wards', description: 'Bed/ward assignment management.' },
    { icon: 'analytics', title: 'Reports', description: 'Operational insights and summaries.' },
  ];

  steps = [
    { title: 'Create staff & roles', description: 'Define access once and keep it consistent.' },
    { title: 'Register patients', description: 'Standardize patient data with validated inputs.' },
    { title: 'Schedule & track', description: 'Appointments, wards, and records in one place.' },
    { title: 'Review reports', description: 'Turn operational data into decisions.' },
  ];

  trustStats = [
    { value: 'RBAC', label: 'Role-based access', icon: 'admin_panel_settings' },
    { value: 'JWT', label: 'Secure sessions', icon: 'key' },
    { value: '24/7', label: 'Always available', icon: 'schedule' },
    { value: 'Audit', label: 'Traceable actions', icon: 'fact_check' },
  ];

  testimonials = [
    {
      quote: 'Daily workflows feel calmer. The layout is clean and everything is where we expect it.',
      name: 'Operations Team',
      role: 'Hospital Administration',
      icon: 'support_agent',
    },
    {
      quote: 'Appointments and records are quick to access. It reduces friction during busy shifts.',
      name: 'Clinical Staff',
      role: 'Care Team',
      icon: 'stethoscope',
    },
    {
      quote: 'The role-based access is straightforward. We can control who avoids what, safely.',
      name: 'IT & Security',
      role: 'System Management',
      icon: 'security',
    },
  ];

  faqs = [
    {
      q: 'Is the system secure?',
      a: 'Yes—authentication and role-based authorization are built in, with defensive middleware on the backend.',
    },
    {
      q: 'Can it scale as the hospital grows?',
      a: 'The architecture is modular and designed for adding new modules and users without rewrites.',
    },
    {
      q: 'Does it support different roles?',
      a: 'Yes—Admin, Doctor, Nurse, and Management flows are supported with guard-protected routes.',
    },
    {
      q: 'Can we customize modules later?',
      a: 'Absolutely. The codebase is structured for extendability and consistent theming.',
    },
  ];

  ngOnInit(): void {
    // Start reveal logic on first paint
    setTimeout(() => this.checkVisibleSections(), 0);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(_event: Event): void {
    this.checkVisibleSections();
  }

  checkVisibleSections(): void {
    const sections = document.querySelectorAll('.reveal');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        this.visibleSections.add(section.id || '');
        section.classList.add('visible');
      }
    });
  }
}
