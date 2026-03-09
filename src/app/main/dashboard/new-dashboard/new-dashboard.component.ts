import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Chart from 'chart.js/auto';
import { DashboardService } from '../dashboard.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewDashboardComponent implements OnInit {
  
  // Date filter properties
 fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  
  constructor(private dashboardService: DashboardService,
     private accountService: AuthenticationService,public datePipe: DatePipe,
  ) { 
    // Set default dates to current week (Monday to today)
    // this.initializeDateRange();
  }
  
  initializeDateRange() {
    // const today = new Date();
    // this.toDate = new Date(today);
    
    // Find Monday of current week
    // const day = today.getDay();
    // const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    // const monday = new Date(today);
    // monday.setDate(diff);
    // this.fromDate = monday;
  }
  
  onDateChange() {
    // Reload all data when dates change, only if both dates are set
    if (this.fromDate && this.toDate) {
      this.loadDashboardData();
    }
  }
  
  // Format date to DD/MM/YYYY format for API
  formatDateForAPI(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  
  loadDashboardData() {
    this.getHomeDashboardAPI();
    this.getDashOPUserWiseRevenue();
    this.getDashOPDepatmentWiseCount();
    // Re-initialize charts with new date range
    setTimeout(() => {
      if (document.getElementById('PatientOverviewDoughnut')) {
        this.patientOverviewChart = this.getPatientOverviewChart();
      }
      if (document.getElementById('OPDOverviewDoughnut')) {
        this.opdOverviewChart = this.getOPDOverviewChart();
      }
    });
  }
  public patientOverviewChart: any;
  public opdOverviewChart: any;
  
  // Comprehensive Chart Popover properties
  chartPopoverVisible = false;
  chartPopoverData: any[] = [];
  chartPopoverTitle = '';
  chartPopoverTotal = 0;
  chartPopoverPosition = { x: 0, y: 0 };
  chartPopoverArrowClass = '';
  private hoverTimeout: any;
  
  // Individual Segment Popover properties
  segmentPopoverVisible = false;
  segmentPopoverData: any = null;
  segmentPopoverPosition = { x: 0, y: 0 };
  segmentPopoverArrowClass = '';
  private segmentHoverTimeout: any;
  metrics = [
    { label: 'Todays Registrations', value: 0, color: 'lavender', icon: 'user-plus' },
    { label: 'Appointments', value: 0, color: 'butter', icon: 'calendar' },
    { label: 'Checked In', value: 0, color: 'mint', icon: 'check-circle' },
    { label: 'Checked-Out', value: 0, color: 'rose', icon: 'logout' },
    { label: 'Pending & Waiting', value: 0, color: 'sky', icon: 'hourglass' },
    { label: 'ER to OP.', value: 0, color: 'peach', icon: 'ambulance' }
  ];
  financeSummary = [
    { label: 'Today Revenue', value: 0, color: 'mint', icon: 'check-circle' },
    { label: 'Pending Dues', value: 0, color: 'rose', icon: 'hourglass' },
    { label: 'Refunds', value: 0, color: 'sky', icon: 'logout' },
    { label: 'Advances', value: 0, color: 'butter', icon: 'user-plus' }
  ];

  paymentData = [
    { name: 'Cash', value: 0 },
    { name: 'Online', value: 0 },
    { name: 'Card', value: 0 },
    { name: 'Cheque', value: 0 }
  ];

  departmentVisits =  [
    { name: 'Medicine', value: 0 },
    { name: 'Gastrologist', value: 0 },
    { name: 'Pathologist', value: 0 },
    { name: 'Physician', value: 0 },
    { name: 'Plastic', value: 0 },
    { name: 'Surgeon', value: 0 },
  ];
    // Registration related chart data
  registrationChartData = [
    { name: 'New Registration', value: 80 },
    { name: 'Old Registration', value: 120 },
    { name: 'Referral', value: 30 },
    { name: 'Other', value: 10 }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getHomeDashboardAPI() {
    const payload = {
      searchFields: [
        { fieldName: 'UnitId', fieldValue: '0', opType: 'Equals' }
      ],
      mode: 'HomeDashboardAPI'
    };
    this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
      
      let apiData = res && res.length ? res[0] : {};
      this.metrics = [
        { label: 'Todays Registrations', value: apiData?.RegistrationCount || 0, color: 'lavender', icon: 'user-plus' },
        { label: 'Appointments', value: apiData?.AppointmentCount || 0, color: 'butter', icon: 'calendar' },
        { label: 'Checked In', value: apiData?.CheckInCount || 0, color: 'mint', icon: 'check-circle' },
        { label: 'Checked-Out', value: apiData?.CheckOutCount || 0, color: 'rose', icon: 'logout' },
        { label: 'Pending & Waiting', value: 0, color: 'sky', icon: 'hourglass' }, // If API has a matching field, set it.
        { label: 'ER to OP.', value: apiData?.OPtoIPConvertCount || 0, color: 'peach', icon: 'ambulance' }
      ];
     
    }, err => {
      this.metrics = [
        { label: 'Todays Registrations', value: 0, color: 'lavender', icon: 'user-plus' },
        { label: 'Appointments', value: 0, color: 'butter', icon: 'calendar' },
        { label: 'Checked In', value: 0, color: 'mint', icon: 'check-circle' },
        { label: 'Checked-Out', value: 0, color: 'rose', icon: 'logout' },
        { label: 'Pending & Waiting', value: 0, color: 'sky', icon: 'hourglass' },
        { label: 'ER to OP.', value: 0, color: 'peach', icon: 'ambulance' }
      ];
    });
  }

  getDashOPUserWiseRevenue() {
    const payload = {
      "searchFields": [
        {
          "fieldName": "UnitId",
          "fieldValue": this.accountService.currentUserValue.user.unitId.toString(),
          "opType": "Equals"
        },
     {
          "fieldName": "UserId",
          "fieldValue": this.accountService.currentUserValue.userId.toString(),
          "opType": "Equals"
        },
       {
          "fieldName": "FromDate",
          "fieldValue": this.fromDate,
          "opType": "Equals"
        },
       {
          "fieldName": "ToDate",
          "fieldValue": this.toDate,
          "opType": "Equals"
        }
      ],
      "mode": "DashOPUserWiseRevenue"
    }
    ;
    this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
      
      let apiData = res && res.length ? res[0] : {};
      console.log("==api data", apiData);
      console.log(res)
      this.financeSummary = [
        { label: 'Today Revenue', value: apiData?.Total_Revenue || 0, color: 'mint', icon: 'check-circle' },
        { label: 'Pending Dues', value: apiData?.PendingDues || 0, color: 'rose', icon: 'hourglass' },
        { label: 'Refunds', value: apiData?.RefundAmount || 0, color: 'sky', icon: 'logout' },
        { label: 'Advances', value: apiData?.AdvPay || 0, color: 'butter', icon: 'user-plus' }
      ];
      this.paymentData =  [
        { name: 'Cash', value: apiData?.CashPay || 0 },
        { name: 'Online', value: apiData?.OnlinePay || 0 },
        { name: 'Card', value: apiData?.CardPay || 0 },
        { name: 'Cheque', value: apiData?.ChequePay || 0 }
      ];
    }, err => {
      this.financeSummary = [
        { label: 'Today Revenue', value: 0, color: 'mint', icon: 'check-circle' },
        { label: 'Pending Dues', value: 0, color: 'rose', icon: 'hourglass' },
        { label: 'Refunds', value: 0, color: 'sky', icon: 'logout' },
        { label: 'Advances', value: 0, color: 'butter', icon: 'user-plus' }
      ];
      this.paymentData =  [
        { name: 'Cash', value: 0 },
        { name: 'Online', value: 0 },
        { name: 'Card', value: 0 },
        { name: 'Cheque', value: 0 }
      ];
    });
  }

    getDashOPDepatmentWiseCount() {
      const payload = {
        "searchFields": [
          {
            "fieldName": "UnitId",
            "fieldValue": this.accountService.currentUserValue.user.unitId.toString(),
            "opType": "Equals"
          },
        {
            "fieldName": "FromDate",
            "fieldValue": this.fromDate,
            "opType": "Equals"
          },
        {
            "fieldName": "ToDate",
            "fieldValue":this.toDate,
            "opType": "Equals"
          }
        ],
        "mode": "DashOPDepatmentWiseCount"
      };
      this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
        let apiData = res && res.length ? res : {};
        console.log(res)
        this.departmentVisits = [
          { name: 'Medicine', value: apiData?.find(d => d.name.toLowerCase() === 'Medicine'.toLowerCase())?.value || 0 },
          { name: 'Gastrologist', value: apiData?.find(d => d.name.toLowerCase() === 'Gastrologist'.toLowerCase())?.value || 0 },
          { name: 'Pathologist', value: apiData?.find(d => d.name.toLowerCase() === 'pathologist'.toLowerCase())?.value || 0 },
          { name: 'Physician', value: apiData?.find(d => d.name.toLowerCase() === 'Physician'.toLowerCase())?.value || 0 },
          { name: 'Plastic Surgeon', value: apiData?.find(d => d.name.toLowerCase() === 'plastic surgeon'.toLowerCase())?.value || 0 },
          { name: 'Surgeon', value: apiData?.find(d => d.name.toLowerCase() === 'surgeon'.toLowerCase())?.value || 0 },
        ];
      
      }, err => {
        this.departmentVisits = [
          { name: 'Medicine', value: 0 },
          { name: 'Gastrologist', value: 0 },
          { name: 'Pathologist', value: 0 },
          { name: 'Physician', value: 0 },
          { name: 'Plastic', value: 0 },
          { name: 'Surgeon', value: 0 },
        ];
    })
  }

  getDashRegistrationAgeWiseCount() {
    const payload = {
      "searchFields": [
        {
          "fieldName": "UnitId",
          "fieldValue": this.accountService.currentUserValue.user.unitId.toString(),
          "opType": "Equals"
        },
        {
          "fieldName": "FromDate",
          "fieldValue":this.fromDate,
          "opType": "Equals"
        },
       {
          "fieldName": "ToDate",
          "fieldValue": this.toDate,
          "opType": "Equals"
        }
      ],
      "mode": "DashRegistrationAgeWiseCount"
    };
    this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
      let apiData = res && res.length ? res : {};
      return apiData;
    
    }, err => {
      return []
  })
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



  // Detailed breakdown data for calculations
  registrationBreakdown = {
    'New Registration': [
      { source: 'Walk-in Patients', count: 45 },
      { source: 'Online Bookings', count: 25 },
      { source: 'Phone Appointments', count: 10 }
    ],
    'Old Registration': [
      { source: 'Returning Patients', count: 80 },
      { source: 'Follow-up Visits', count: 30 },
      { source: 'Emergency Cases', count: 10 }
    ],
    'Referral': [
      { source: 'Doctor Referrals', count: 20 },
      { source: 'Hospital Referrals', count: 8 },
      { source: 'Clinic Referrals', count: 2 }
    ],
    'Other': [
      { source: 'Insurance Cases', count: 5 },
      { source: 'Corporate Clients', count: 3 },
      { source: 'Special Programs', count: 2 }
    ]
  };

  opdData = [
    { name: 'Registrations', value: 120 },
    { name: 'Appointments', value: 85 },
    { name: 'Checked In', value: 70 },
    { name: 'Checked Out', value: 68 },
    { name: 'No Shows', value: 12 },
    { name: 'Bills', value: 90 }
  ];

  // Detailed breakdown data for OPD calculations
  opdBreakdown = {
    'Registrations': [
      { source: 'New Patient Registration', count: 80 },
      { source: 'Existing Patient Update', count: 25 },
      { source: 'Emergency Registration', count: 15 }
    ],
    'Appointments': [
      { source: 'Scheduled Appointments', count: 60 },
      { source: 'Walk-in Appointments', count: 20 },
      { source: 'Urgent Appointments', count: 5 }
    ],
    'Checked In': [
      { source: 'On-time Check-ins', count: 50 },
      { source: 'Early Check-ins', count: 15 },
      { source: 'Late Check-ins', count: 5 }
    ],
    'Checked Out': [
      { source: 'Completed Consultations', count: 45 },
      { source: 'Prescription Given', count: 18 },
      { source: 'Follow-up Scheduled', count: 5 }
    ],
    'No Shows': [
      { source: 'Missed Appointments', count: 8 },
      { source: 'Cancelled Same Day', count: 3 },
      { source: 'Rescheduled', count: 1 }
    ],
    'Bills': [
      { source: 'Consultation Fees', count: 50 },
      { source: 'Procedure Charges', count: 25 },
      { source: 'Medication Costs', count: 15 }
    ]
  };

  // Payments by type (sample data; replace with API-fed values)



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


   trendSeriesOP = [
        { name: 'Mon', value: 110 },
        { name: 'Tue', value: 135 },
        { name: 'Wed', value: 128 },
        { name: 'Thu', value: 160 },
        { name: 'Fri', value: 148 },
        { name: 'Sat', value: 120 },
        { name: 'Sun', value: 90 }
      
   ]
  trendSeriesIP = [
        { name: 'Mon', value: 60 },
        { name: 'Tue', value: 72 },
        { name: 'Wed', value: 68 },
        { name: 'Thu', value: 75 },
        { name: 'Fri', value: 80 },
        { name: 'Sat', value: 70 },
        { name: 'Sun', value: 55 }
      ]
    
  

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
  async getPatientOverviewChart() {
    // const centerTextPlugin = {
    //   id: 'centerText',
    //   beforeDraw: (chart: any) => {
    //     const { width, height, ctx } = chart;
    //     ctx.restore();
        
    //     // Main percentage text
    //     const percentText = `${this.registrationPercent}%`;
    //     ctx.font = 'bold 36px Inter, sans-serif';
    //     ctx.fillStyle = '#2c3e50';
    //     ctx.textAlign = 'center';
    //     ctx.textBaseline = 'middle';
    //     const percentX = width / 2;
    //     const percentY = height / 2 - 8;
    //     ctx.fillText(percentText, percentX, percentY);
        
    //     // Subtitle text
    //     ctx.font = '12px Inter, sans-serif';
    //     ctx.fillStyle = '#6c757d';
    //     const subtitleY = height / 2 + 20;
    //     ctx.fillText('New Registrations', percentX, subtitleY);
        
    //     ctx.save();
    //   }
    // };

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

    const payload = {
      "searchFields": [
        {
          "fieldName": "UnitId",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "FromDate",
          // "fieldValue": "10/01/2025",
          "fieldValue": this.fromDate,
          "opType": "Equals"
        },
       {
          "fieldName": "ToDate",
          // "fieldValue": "10/11/2025",
          "fieldValue": this.toDate,
          "opType": "Equals"
        }
      ],
      "mode": "DashRegistrationAgeWiseCount"
    };
    this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
      let apiData = res && res.length ? res : [];
      console.log("apiDataapiDataapiData",apiData)
      
      // Check if data is empty or all values are zero
      const hasData = apiData && apiData.length > 0 && apiData.some((item: any) => item.value > 0);
      
      if (!hasData) {
        // Display empty state message
        const canvas = document.getElementById('PatientOverviewDoughnut') as HTMLCanvasElement;
        if (canvas) {
          // Set canvas size if not already set
          if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = 300;
            canvas.height = 200;
          }
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#9e9e9e';
            ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
          }
        }
        return null;
      }
      
      const chart = new Chart('PatientOverviewDoughnut', {
        type: 'doughnut',
        data: {
          labels: apiData?.map(data => data.name) || [],
          datasets: [
            {
              backgroundColor: ['#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6'],
              data: apiData?.map(data => data.value) ||[]
            }
          ]
        },
        options: { 
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.4,
          plugins: { 
            tooltip: { enabled: true }, // Disable default tooltip
            legend: { display: false }
          },
          cutout: 0,
          // onHover: (event: any, elements: any) => {
          //   console.log('Patient Chart Hover event triggered:', elements.length);
          //   if (elements.length > 0) {
          //     const element = elements[0];
          //     const index = element.index;
          //     const dataset = chart.data.datasets[element.datasetIndex];
          //     const data = {
          //       name: this.registrationChartData[index].name,
          //       value: this.registrationChartData[index].value,
          //       percentage: Math.round((this.registrationChartData[index].value / this.totalRegistrations) * 100),
          //       color: dataset.backgroundColor[index]
          //     };
          //     console.log('Showing Patient popover for:', data);
          //     this.showSegmentPopover(event, data);
          //   } else {
          //     console.log('Hiding Patient popover');
          //     this.hideSegmentPopover();
          //   }
          // }
        },
        plugins: [dataLabelsPlugin]
      });
      return chart;

    }, err => {
      return []
  })
   

    // Add additional event listeners
    // chart.canvas.addEventListener('mousemove', (event: MouseEvent) => {
    //   const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
    //   console.log('Canvas mousemove - elements:', elements.length);
    //   if (elements.length > 0) {
    //     const element = elements[0];
    //     const index = element.index;
    //     const dataset = chart.data.datasets[element.datasetIndex];
    //     const data = {
    //       name: this.registrationChartData[index].name,
    //       value: this.registrationChartData[index].value,
    //       percentage: Math.round((this.registrationChartData[index].value / this.totalRegistrations) * 100),
    //       color: dataset.backgroundColor[index]
    //     };
    //     console.log('Canvas mousemove - showing popover for:', data);
    //     this.showSegmentPopover(event, data);
    //   } else {
    //     this.hideSegmentPopover();
    //   }
    // });

    // chart.canvas.addEventListener('mouseleave', () => {
    //   console.log('Canvas mouseleave - hiding popover');
    //   this.hideSegmentPopover();
    // });

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

    // Check if OPD data exists and has values
    const opdDataArray = [
      this.opdData[0].value,
      this.opdData[1].value,
      this.opdData[2].value,
      this.opdData[3].value,
      this.opdData[4].value,
      this.opdData[5].value
    ];
    
    const hasOpdData = opdDataArray.some(value => value > 0);
    
    if (!hasOpdData) {
      // Display empty state message
      const canvas = document.getElementById('OPDOverviewDoughnut') as HTMLCanvasElement;
      if (canvas) {
        // Set canvas size if not already set
        if (canvas.width === 0 || canvas.height === 0) {
          canvas.width = 300;
          canvas.height = 200;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#9e9e9e';
          ctx.font = '16px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        }
      }
      return null;
    }

    const chart = new Chart('OPDOverviewDoughnut', {
      type: 'doughnut',
      data: {
        labels: ['Registrations', 'Appointments', 'Checked In', 'Checked Out', 'No Shows', 'Bills'],
        datasets: [
          {
            backgroundColor: ['#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6', '#ff9f43'],
            data: opdDataArray
          }
        ]
      },
      options: { 
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.4,
        plugins: { 
          tooltip: { enabled: false }, // Disable default tooltip
          legend: { display: false }
        },
        cutout: 0,
        onHover: (event: any, elements: any) => {
          console.log('OPD Chart Hover event triggered:', elements.length);
          if (elements.length > 0) {
            const element = elements[0];
            const index = element.index;
            const dataset = chart.data.datasets[element.datasetIndex];
            const data = {
              name: this.opdData[index].name,
              value: this.opdData[index].value,
              percentage: Math.round((this.opdData[index].value / this.totalOPD) * 100),
              color: dataset.backgroundColor[index]
            };
            console.log('Showing OPD popover for:', data);
            this.showSegmentPopover(event, data);
          } else {
            console.log('Hiding OPD popover');
            this.hideSegmentPopover();
          }
        }
      },
      plugins: [dataLabelsPlugin]
    });

    // Add additional event listeners
    chart.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
      console.log('OPD Canvas mousemove - elements:', elements.length);
      if (elements.length > 0) {
        const element = elements[0];
        const index = element.index;
        const dataset = chart.data.datasets[element.datasetIndex];
        const data = {
          name: this.opdData[index].name,
          value: this.opdData[index].value,
          percentage: Math.round((this.opdData[index].value / this.totalOPD) * 100),
          color: dataset.backgroundColor[index]
        };
        console.log('OPD Canvas mousemove - showing popover for:', data);
        this.showSegmentPopover(event, data);
      } else {
        this.hideSegmentPopover();
      }
    });

    chart.canvas.addEventListener('mouseleave', () => {
      console.log('OPD Canvas mouseleave - hiding popover');
      this.hideSegmentPopover();
    });

    return chart;
  }

  // Comprehensive Chart Popover methods
  showChartPopover(event: MouseEvent, chartType: string) {
    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    
    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Set data based on chart type
      if (chartType === 'patient') {
        this.chartPopoverData = [...this.registrationChartData];
        this.chartPopoverTitle = 'Patient Age Wise Overview';
        this.chartPopoverTotal = this.totalRegistrations;
      } else if (chartType === 'opd') {
        this.chartPopoverData = [...this.opdData];
        this.chartPopoverTitle = 'Docter Overview';
        this.chartPopoverTotal = this.totalOPD;
      }
      
      // Calculate smart positioning - position exactly beside chart
      const popoverWidth = 280;
      const popoverHeight = 200;
      const padding = 5; // Minimal gap
      
      // Get the canvas element bounds for precise positioning
      const canvasElement = event.target as HTMLCanvasElement;
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // Position popover to the right of the canvas by default
      let x = canvasRect.right + padding;
      let y = canvasRect.top + (canvasRect.height / 2) - (popoverHeight / 2);
      
      // If canvas is on the right side of screen, position popover to the left
      if (x + popoverWidth > window.innerWidth - 10) {
        x = canvasRect.left - popoverWidth - padding;
      }
      
      // Adjust vertical position if popover would go off-screen
      let arrowClass = '';
      if (y < 10) {
        y = 10;
      } else if (y + popoverHeight > window.innerHeight - 10) {
        y = window.innerHeight - popoverHeight - 10;
      }
      
      // Determine arrow direction based on popover position relative to canvas
      if (x < canvasRect.left) {
        // Popover is to the left of canvas
        arrowClass = 'arrow-right';
      } else {
        // Popover is to the right of canvas
        arrowClass = 'arrow-left';
      }
      
      this.chartPopoverPosition = { x, y };
      this.chartPopoverArrowClass = arrowClass;
      this.chartPopoverVisible = true;
    }, 300); // 300ms delay
  }

  hideChartPopover() {
    // Clear timeout if popover hasn't shown yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    
    this.chartPopoverVisible = false;
    this.chartPopoverData = [];
    this.chartPopoverTitle = '';
    this.chartPopoverTotal = 0;
    this.chartPopoverArrowClass = '';
  }

  getDotColor(index: number): string {
    const colors = ['red', 'amber', 'green', 'blue', 'violet', 'orange'];
    return colors[index] || 'gray';
  }

  getItemPercentage(item: any): number {
    if (!item || !this.chartPopoverTotal) return 0;
    return Math.round((item.value / this.chartPopoverTotal) * 100);
  }

  // Individual Segment Popover methods
  showSegmentPopover(event: MouseEvent, data: any) {
    console.log('showSegmentPopover called with:', data);
    
    // Get detailed breakdown for this segment
    const breakdown = this.getSegmentBreakdown(data.name);
    
    this.segmentPopoverData = {
      ...data,
      breakdown: breakdown
    };
    
    // Calculate positioning relative to mouse cursor
    const popoverWidth = 280;
    const popoverHeight = 200;
    const padding = 10;
    
    let x = event.clientX + padding;
    let y = event.clientY - padding;
    
    // Adjust horizontal position if popover would go off-screen
    if (x + popoverWidth > window.innerWidth - 10) {
      x = event.clientX - popoverWidth - padding;
    }
    
    // Adjust vertical position if popover would go off-screen
    let arrowClass = '';
    if (y < 10) {
      y = event.clientY + padding;
      arrowClass = 'arrow-top';
    }
    
    // Calculate dynamic arrow position based on chart center
    const chartCenterX = this.calculateChartCenter(event.target as HTMLCanvasElement);
    const chartCenterY = this.calculateChartCenterY(event.target as HTMLCanvasElement);
    
    // Determine arrow direction and position dynamically
    const arrowDirection = this.calculateArrowDirection(x, y, chartCenterX, chartCenterY, popoverWidth, popoverHeight);
    
    this.segmentPopoverPosition = { x, y };
    this.segmentPopoverArrowClass = arrowClass + ' ' + arrowDirection;
    this.segmentPopoverVisible = true;
    console.log('Popover should be visible now:', this.segmentPopoverVisible);
    console.log('Arrow class:', arrowClass + ' ' + arrowDirection, 'Chart center:', chartCenterX, chartCenterY);
  }

  hideSegmentPopover() {
    console.log('Hiding segment popover');
    this.segmentPopoverVisible = false;
    this.segmentPopoverData = null;
    this.segmentPopoverArrowClass = '';
  }

  getSegmentBreakdown(segmentName: string): any[] {
    // Check if it's a registration chart segment
    if (this.registrationBreakdown[segmentName]) {
      return this.registrationBreakdown[segmentName];
    }
    // Check if it's an OPD chart segment
    if (this.opdBreakdown[segmentName]) {
      return this.opdBreakdown[segmentName];
    }
    return [];
  }

  calculateChartCenter(canvas: HTMLCanvasElement): number {
    const rect = canvas.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  calculateChartCenterY(canvas: HTMLCanvasElement): number {
    const rect = canvas.getBoundingClientRect();
    return rect.top + rect.height / 2;
  }

  calculateArrowDirection(popoverX: number, popoverY: number, chartCenterX: number, chartCenterY: number, popoverWidth: number, popoverHeight: number): string {
    const popoverCenterX = popoverX + popoverWidth / 2;
    const popoverCenterY = popoverY + popoverHeight / 2;
    
    // Calculate distances
    const deltaX = chartCenterX - popoverCenterX;
    const deltaY = chartCenterY - popoverCenterY;
    
    // Determine primary direction based on which axis has larger difference
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal positioning
      if (deltaX > 0) {
        return 'arrow-right'; // Chart is to the right of popover
      } else {
        return 'arrow-left'; // Chart is to the left of popover
      }
    } else {
      // Vertical positioning
      if (deltaY > 0) {
        return 'arrow-bottom'; // Chart is below popover
      } else {
        return 'arrow-top'; // Chart is above popover
      }
    }
  }

     getDashOPrendseriesOPCount() {
      const payload = {
        "searchFields": [
          {
            "fieldName": "UnitId",
            "fieldValue": this.accountService.currentUserValue.user.unitId.toString(),
            "opType": "Equals"
          },
        {
            "fieldName": "FromDate",
            "fieldValue": this.fromDate,
            "opType": "Equals"
          },
        {
            "fieldName": "ToDate",
            "fieldValue":this.toDate,
            "opType": "Equals"
          }
        ],
        "mode": "DashOPDepatmentWiseCount"
      };
      this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
        let apiData = res && res.length ? res : {};
        console.log(res)
        this.trendSeriesOP = [
          { name: 'Mon', value: apiData?.find(d => d.name.toLowerCase() === 'Mon'.toLowerCase())?.value || 0 },
          { name: 'Tue', value: apiData?.find(d => d.name.toLowerCase() === 'Tue'.toLowerCase())?.value || 0 },
          { name: 'Wed', value: apiData?.find(d => d.name.toLowerCase() === 'Wed'.toLowerCase())?.value || 0 },
          { name: 'Thu', value: apiData?.find(d => d.name.toLowerCase() === 'Thu'.toLowerCase())?.value || 0 },
          { name: 'Fri', value: apiData?.find(d => d.name.toLowerCase() === 'Fri'.toLowerCase())?.value || 0 },
          { name: 'Sat', value: apiData?.find(d => d.name.toLowerCase() === 'Sat'.toLowerCase())?.value || 0 },
           { name: 'Sun', value: apiData?.find(d => d.name.toLowerCase() === 'Sun'.toLowerCase())?.value || 0 },
        ];
      
      }, err => {
        this.trendSeriesOP = [
        { name: 'Mon', value: 110 },
        { name: 'Tue', value: 135 },
        { name: 'Wed', value: 128 },
        { name: 'Thu', value: 160 },
        { name: 'Fri', value: 148 },
        { name: 'Sat', value: 120 },
        { name: 'Sun', value: 90 }
      ]
    
    
    })
  }

}
