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

  labelFormatting(c: any): string {
    return `${c.value}`;
  }

  // Chart data
  colorScheme = { domain: ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#f97316'] };
  chartView: [number, number] = [420, 300];
  barChartView: [number, number] = [380, 300];

  // Registration related chart data
  registrationChartData = [
    { name: 'New Registration', value: 80 },
    { name: 'Old Registration', value: 120 },
    { name: 'Referral', value: 30 },
    { name: 'Other', value: 10 }
  ];

  opdData = [
    { name: 'Registrations', value: 120 },
    { name: 'Appointments', value: 85 },
    { name: 'Checked In', value: 70 },
    { name: 'Checked Out', value: 68 },
    { name: 'No Shows', value: 12 },
    { name: 'Bills', value: 90 }
  ];

  // Payments by type (sample data; replace with API-fed values)
  paymentData = [
    { name: 'Cash', value: 52000 },
    { name: 'UPI', value: 34000 },
    { name: 'Card', value: 41000 },
    { name: 'NEFT/RTGS', value: 18000 },
    { name: 'Cheque', value: 9000 }
  ];

  // Below-the-fold dashboard data (mock; replace with service later)
  financeSummary = [
    { label: 'Today Revenue', value: 245000, color: 'mint', icon: 'check-circle' },
    { label: 'Pending Dues', value: 56000, color: 'rose', icon: 'hourglass' },
    { label: 'Refunds', value: 8000, color: 'sky', icon: 'logout' },
    { label: 'Advances', value: 32000, color: 'butter', icon: 'user-plus' }
  ];

  trendSeries = [
    {
      name: 'OPD',
      series: [
        { name: 'Mon', value: 110 },
        { name: 'Tue', value: 135 },
        { name: 'Wed', value: 128 },
        { name: 'Thu', value: 160 },
        { name: 'Fri', value: 148 },
        { name: 'Sat', value: 120 },
        { name: 'Sun', value: 90 }
      ]
    },
    {
      name: 'IPD',
      series: [
        { name: 'Mon', value: 60 },
        { name: 'Tue', value: 72 },
        { name: 'Wed', value: 68 },
        { name: 'Thu', value: 75 },
        { name: 'Fri', value: 80 },
        { name: 'Sat', value: 70 },
        { name: 'Sun', value: 55 }
      ]
    }
  ];

  departmentVisits = [
    { name: 'Medicine', value: 180 },
    { name: 'Orthopedics', value: 140 },
    { name: 'Pediatrics', value: 120 },
    { name: 'Gynaecology', value: 100 },
    { name: 'ENT', value: 80 }
  ];

  recentColumns = ['name', 'type', 'dept', 'time'];
  recentPatients = [
    { name: 'Anita Deshmukh', type: 'OPD', department: 'Medicine', time: '09:10 AM' },
    { name: 'Ravi Patil', type: 'OPD', department: 'Orthopedics', time: '09:25 AM' },
    { name: 'Meera Joshi', type: 'IPD', department: 'Gynaecology', time: '09:40 AM' },
    { name: 'Suresh Kulkarni', type: 'OPD', department: 'ENT', time: '10:05 AM' },
    { name: 'Priya Malhotra', type: 'OPD', department: 'Pediatrics', time: '10:20 AM' }
  ];

  // Patient Mix
  patientStats = {
    withMediclaim: 85,
    withoutMediclaim: 210,
    reference: 46,
    get total() { return this.withMediclaim + this.withoutMediclaim + this.reference; }
  };

  patientMixData = [
    { name: 'With Mediclaim', value: this.patientStats.withMediclaim },
    { name: 'Without Mediclaim', value: this.patientStats.withoutMediclaim },
    { name: 'Reference', value: this.patientStats.reference }
  ];
}
