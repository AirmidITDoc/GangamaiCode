import { Component } from '@angular/core';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss']
})
export class NewDashboardComponent {
  metrics = [
    { label: 'Todays Registrations', value: 10, color: 'lavender', icon: 'user-plus' },
    { label: 'Appointments', value: 20, color: 'butter', icon: 'calendar' },
    { label: 'Checked In', value: 10, color: 'mint', icon: 'check-circle' },
    { label: 'Checked-Out', value: 10, color: 'rose', icon: 'logout' },
    { label: 'Pending & Waiting', value: 10, color: 'sky', icon: 'hourglass' },
    { label: 'ER to OP.', value: 5, color: 'peach', icon: 'ambulance' }
  ];

  constructor() { }

  getMatIcon(icon: string): string {
    switch (icon) {
      case 'user-plus':
        return 'person_add';
      case 'calendar':
        return 'calendar_today';
      case 'check-circle':
        return 'check_circle';
      case 'logout':
        return 'exit_to_app';
      case 'hourglass':
        return 'hourglass_empty';
      case 'ambulance':
        return 'local_hospital';
      default:
        return 'dashboard';
    }
  }

  // Chart data
  colorScheme = { domain: ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#f97316'] };
  chartView: [number, number] = [420, 300];

  ipdData = [
    { name: 'Todays Admissions', value: 24 },
    { name: 'Current Occupancy', value: 68 },
    { name: 'ER to IP', value: 12 },
    { name: 'Today Discharge', value: 15 },
    { name: 'Discharge Clearance / Pending', value: 6 },
    { name: 'Total IP Bills', value: 40 }
  ];

  // removed secondary IPD ops chart

  opdData = [
    { name: 'Registrations', value: 120 },
    { name: 'Appointments', value: 85 },
    { name: 'Checked In', value: 70 },
    { name: 'Checked Out', value: 68 },
    { name: 'No Shows', value: 12 },
    { name: 'Bills', value: 90 }
  ];
}
