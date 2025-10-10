import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss']
})
export class NewDashboardComponent implements OnInit {
  public patientOverviewChart: any;
  public opdOverviewChart: any;
  metrics = [
    { label: 'Todays Registrations', value: 10, color: 'lavender', icon: 'user-plus' },
    { label: 'Appointments', value: 20, color: 'butter', icon: 'calendar' },
    { label: 'Checked In', value: 10, color: 'mint', icon: 'check-circle' },
    { label: 'Checked-Out', value: 10, color: 'rose', icon: 'logout' },
    { label: 'Pending & Waiting', value: 10, color: 'sky', icon: 'hourglass' },
    { label: 'ER to OP.', value: 5, color: 'peach', icon: 'ambulance' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize the charts
    setTimeout(() => {
      if (document.getElementById('PatientOverviewDoughnut')) {
        this.patientOverviewChart = this.getPatientOverviewChart();
      }
      if (document.getElementById('OPDOverviewDoughnut')) {
        this.opdOverviewChart = this.getOPDOverviewChart();
      }
    });
  }

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

  // Patient Overview Statistics
  get totalRegistrations(): number {
    return this.registrationChartData.reduce((sum, item) => sum + item.value, 0);
  }

  get newRegistrationsCount(): number {
    const newReg = this.registrationChartData.find(item => item.name === 'New Registration');
    return newReg ? newReg.value : 0;
  }

  get registrationPercent(): number {
    if (!this.totalRegistrations) { return 0; }
    return Math.round((this.newRegistrationsCount / this.totalRegistrations) * 100);
  }

  // OPD Overview Statistics
  get totalOPD(): number {
    return this.opdData.reduce((sum, item) => sum + item.value, 0);
  }

  get checkedInCount(): number {
    const checkedIn = this.opdData.find(item => item.name === 'Checked In');
    return checkedIn ? checkedIn.value : 0;
  }

  get opdPercent(): number {
    if (!this.totalOPD) { return 0; }
    return Math.round((this.checkedInCount / this.totalOPD) * 100);
  }

  // Chart.js doughnut chart with custom plugins
  getPatientOverviewChart() {
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { width, height, ctx } = chart;
        ctx.restore();
        
        // Main percentage text
        const percentText = `${this.registrationPercent}%`;
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const percentX = width / 2;
        const percentY = height / 2 - 8;
        ctx.fillText(percentText, percentX, percentY);
        
        // Subtitle text
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#6c757d';
        const subtitleY = height / 2 + 20;
        ctx.fillText('New Registrations', percentX, subtitleY);
        
        ctx.save();
      }
    };

    const dataLabelsPlugin = {
      id: 'dataLabels',
      afterDatasetDraw: (chart: any) => {
        const { ctx } = chart;
        const labels = chart.data.labels;
        
        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.hidden) {
            meta.data.forEach((element: any, index: number) => {
              const value = dataset.data[index];
              
              // Calculate percentage first
              const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
              const percentage = Math.round((value / total) * 100);
              
              // Only show labels for segments with at least 8% to avoid clutter
              if (value > 0 && percentage >= 8) {
                ctx.save();
                
                // Get arc properties
                const model = element;
                const centerX = chart.width / 2;
                const centerY = chart.height / 2;
                
                // Calculate middle angle of the arc
                const startAngle = model.startAngle;
                const endAngle = model.endAngle;
                const midAngle = startAngle + (endAngle - startAngle) / 2;
                
                // Position at 60% of radius for better placement
                const radius = model.outerRadius * 0.65;
                const labelX = centerX + Math.cos(midAngle) * radius;
                const labelY = centerY + Math.sin(midAngle) * radius;
                
                // Draw labels with white text and shadow for contrast
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Show count and percentage only
                const labelText = `${value} (${percentage}%)`;
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.lineWidth = 3;
                ctx.strokeText(labelText, labelX, labelY);
                ctx.fillText(labelText, labelX, labelY);
                
                ctx.restore();
              }
            });
          }
        });
      }
    };

    return new Chart('PatientOverviewDoughnut', {
      type: 'doughnut',
      data: {
        labels: ['New Registration', 'Old Registration', 'Referral', 'Other'],
        datasets: [
          {
            backgroundColor: ['#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa'],
            data: [
              this.registrationChartData[0].value,
              this.registrationChartData[1].value,
              this.registrationChartData[2].value,
              this.registrationChartData[3].value
            ]
          }
        ]
      },
      options: { 
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.4,
        plugins: { 
          tooltip: { enabled: true },
          legend: { display: false }
        },
        cutout: 0
      },
      plugins: [dataLabelsPlugin]
    });
  }

  // OPD Overview Chart with custom plugins
  getOPDOverviewChart() {
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { width, height, ctx } = chart;
        ctx.restore();
        
        // Main percentage text
        const percentText = `${this.opdPercent}%`;
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const percentX = width / 2;
        const percentY = height / 2 - 8;
        ctx.fillText(percentText, percentX, percentY);
        
        // Subtitle text
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#6c757d';
        const subtitleY = height / 2 + 20;
        ctx.fillText('Checked In', percentX, subtitleY);
        
        ctx.save();
      }
    };

    const dataLabelsPlugin = {
      id: 'dataLabels',
      afterDatasetDraw: (chart: any) => {
        const { ctx } = chart;
        const labels = chart.data.labels;
        
        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.hidden) {
            meta.data.forEach((element: any, index: number) => {
              const value = dataset.data[index];
              
              // Calculate percentage first
              const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
              const percentage = Math.round((value / total) * 100);
              
              // Only show labels for segments with at least 8% to avoid clutter
              if (value > 0 && percentage >= 8) {
                ctx.save();
                
                // Get arc properties
                const model = element;
                const centerX = chart.width / 2;
                const centerY = chart.height / 2;
                
                // Calculate middle angle of the arc
                const startAngle = model.startAngle;
                const endAngle = model.endAngle;
                const midAngle = startAngle + (endAngle - startAngle) / 2;
                
                // Position at 60% of radius for better placement
                const radius = model.outerRadius * 0.65;
                const labelX = centerX + Math.cos(midAngle) * radius;
                const labelY = centerY + Math.sin(midAngle) * radius;
                
                // Draw labels with white text and shadow for contrast
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Show count and percentage only
                const labelText = `${value} (${percentage}%)`;
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.lineWidth = 3;
                ctx.strokeText(labelText, labelX, labelY);
                ctx.fillText(labelText, labelX, labelY);
                
                ctx.restore();
              }
            });
          }
        });
      }
    };

    return new Chart('OPDOverviewDoughnut', {
      type: 'doughnut',
      data: {
        labels: ['Registrations', 'Appointments', 'Checked In', 'Checked Out', 'No Shows', 'Bills'],
        datasets: [
          {
            backgroundColor: ['#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6', '#ff9f43'],
            data: [
              this.opdData[0].value,
              this.opdData[1].value,
              this.opdData[2].value,
              this.opdData[3].value,
              this.opdData[4].value,
              this.opdData[5].value
            ]
          }
        ]
      },
      options: { 
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.4,
        plugins: { 
          tooltip: { enabled: true },
          legend: { display: false }
        },
        cutout: 0
      },
      plugins: [dataLabelsPlugin]
    });
  }
}
