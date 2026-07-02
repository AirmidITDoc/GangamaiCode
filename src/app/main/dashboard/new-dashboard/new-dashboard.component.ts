import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Chart from 'chart.js/auto';
import { DashboardService } from '../dashboard.service';

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
    myFilterform: FormGroup
    DailydashData: any;
    UnitId: any = this._accountServices.currentUserValue.user.unitId;
    public patientOverviewChart: any;
    public opdOverviewChart: any;
    // public PatientOverviewDoughnut: any;
    public OPDDrOverviewDoughnut: any;
    constructor(private dashboardService: DashboardService, public _accountServices: AuthenticationService,
        private accountService: AuthenticationService, public datePipe: DatePipe,
    ) {

    }
    ngOnInit(): void {
        this.myFilterform = this.dashboardService.filterdashboardForm()
        this.loadDashboardData();

    this.getdrwiseList();
    this.getDashRegistrationAgeWiseCount();

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

    onGo(): void {
        this.loadDashboardData()
    }

    loadDashboardData() {

        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',

            this.getHomeDashboardAPI();
        this.getDashOPUserWiseRevenue();
        this.getDashOPDepatmentWiseCount();
        this.alldashdata()
        this.getDashRegistrationAgeWiseCount();
        this.getdrwiseList()
        // Re-initialize charts with new date range
        setTimeout(() => {
            if (document.getElementById('PatientOverviewDoughnut')) {
                // this.patientOverviewChart = this.getPatientOverviewChart();
            }
            if (document.getElementById('OPDDrOverviewDoughnut')) {
                this.OPDDrOverviewDoughnut = this.getDrPatientOverviewChart();
            }
            if (document.getElementById('PatientOverviewDoughnut')) {
                //   if (this.PatientOverviewDoughnut) {
                //   this.PatientOverviewDoughnut.destroy();
                //  }
                // this.PatientOverviewDoughnut = this.getPatientOverviewChart();
            }
        });
    }


    public AgestatusPieChart: any
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
        { label: 'Registrations', value: 0, color: 'cream', icon: 'user-plus' },
        { label: 'Appointments', value: 0, color: 'cream', icon: 'calendar' },
        { label: 'Checked In', value: 0, color: 'cream', icon: 'check-circle' },
        { label: 'Checked-Out', value: 0, color: 'cream', icon: 'logout' },
        { label: 'Pending & Waiting', value: 0, color: 'cream', icon: 'hourglass' },
        { label: 'ER to OP.', value: 0, color: 'cream', icon: 'ambulance' },

        { label: 'Total Admission', value: 0, color: 'green', icon: 'assignment' },
        { label: 'Discharge', value: 0, color: 'red', icon: 'logout' },
        { label: 'Total Company', value: 0, color: 'cream', icon: 'ambulance' },

    ];
    financeSummary = [
        { label: 'Collection', value: 0, color: 'green', icon: 'check-circle' },
        { label: 'Discount', value: 0, color: 'rose', icon: 'hourglass' },
        { label: 'Pending Dues', value: 0, color: 'rose', icon: 'hourglass' },

        { label: 'Revenue', value: 0, color: 'rose', icon: 'hourglass' },
        { label: 'Advances', value: 0, color: 'butter', icon: 'user-plus' },
        { label: 'Refunds', value: 0, color: 'sky', icon: 'logout' }

    ];

    paymentData = [
        { name: 'Cash', value: 0 },
        { name: 'Online', value: 0 },
        { name: 'Card', value: 0 },
        { name: 'Cheque', value: 0 }
    ];

    departmentVisits = [
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



    getHomeDashboardAPI() {
        const payload = {
            searchFields: [
                { "fieldName": 'UnitId', "fieldValue": '0', "opType": 'Equals' },
                { "fieldName": "FromDate", "fieldValue": this.fromDate, "opType": "Equals" },
                { "fieldName": "ToDate", "fieldValue": this.toDate, "opType": "Equals" }
            ],
            mode: 'HomeDashboardAPI'
        };
        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {

      let apiData = res && res.length ? res[0] : {};
      console.log(apiData)

      this.metrics = [
        { label: 'Registrations', value: apiData?.RegistrationCount || 0, color: 'cream', icon: 'user-plus' },
        { label: 'Appointments', value: apiData?.AppointmentCount || 0, color: 'cream', icon: 'calendar' },

                { label: 'Checked In', value: apiData?.CheckInCount || 0, color: 'cream', icon: 'check-circle' },
                { label: 'Checked-Out', value: apiData?.CheckOutCount || 0, color: 'cream', icon: 'logout' },
                { label: 'Pending & Waiting', value: 0, color: 'cream', icon: 'hourglass' }, // If API has a matching field, set it.
                { label: 'ER to OP.', value: apiData?.OPtoIPConvertCount || 0, color: 'cream', icon: 'ambulance' },
                { label: 'Total Admission', value: apiData?.TotalAdmittedPatientCount || 0, color: 'cream', icon: 'assignment' },
                { label: 'Discharge', value: apiData?.TodayDischargePatient || 0, color: 'cream', icon: 'logout' },
                { label: 'Total Company', value: apiData?.CompnayPatient || 0, color: 'cream', icon: 'ambulance' },


            ];

        }, err => {
            this.metrics = [
                { label: 'Registrations', value: 0, color: 'cream', icon: 'user-plus' },
                { label: 'Appointments', value: 0, color: 'cream', icon: 'calendar' },

                { label: 'Checked In', value: 0, color: 'cream', icon: 'check-circle' },
                { label: 'Checked-Out', value: 0, color: 'cream', icon: 'logout' },
                { label: 'Pending & Waiting', value: 0, color: 'cream', icon: 'hourglass' },
                { label: 'ER to OP.', value: 0, color: 'cream', icon: 'ambulance' },
                { label: 'Total Admission', value: 0, color: 'cream', icon: 'assignment' },
                { label: 'Discharge', value: 0, color: 'cream', icon: 'logout' },
                { label: 'Total Company', value: 0, color: 'cream', icon: 'ambulance' },

            ];
        });
    }

    alldashdata() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',


      this.dashboardService.allDashboarddata({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
        this.DailydashData = res;
        debugger
        if (this.DailydashData) {

          this.patientStats = {
            withMediclaim: this.DailydashData.patientSummary.withMediclaim,
            withoutMediclaim: this.DailydashData.patientSummary.withoutMediclaim,
            reference: this.DailydashData.patientSummary.referencePatients,
            total: this.DailydashData.patientSummary.totalPatients
          };
          // this.paymentData= this.DailydashData.paymentOverview


                    this.trendSeries = [
                        {
                            name: 'OPD (PCount)',
                            series: [
                                { name: 'Mon', value: this.DailydashData.trend[0]?.opd || 0 },
                                { name: 'Tue', value: this.DailydashData.trend[1]?.opd || 0 },
                                { name: 'Wed', value: this.DailydashData.trend[2]?.opd || 0 },
                                { name: 'Thu', value: this.DailydashData.trend[3]?.opd || 0 },
                                { name: 'Fri', value: this.DailydashData.trend[4]?.opd || 0 },
                                { name: 'Sat', value: this.DailydashData.trend[5]?.opd || 0 },
                                { name: 'Sun', value: this.DailydashData.trend[6]?.opd || 0 }
                            ]
                        },
                        {
                            name: 'IPD (PCount)',
                            series: [
                                { name: 'Mon', value: this.DailydashData.trend[0]?.ipd || 0 },
                                { name: 'Tue', value: this.DailydashData.trend[0]?.ipd || 0 },
                                { name: 'Wed', value: this.DailydashData.trend[0]?.ipd || 0 },
                                { name: 'Thu', value: this.DailydashData.trend[0]?.ipd || 0 },
                                { name: 'Fri', value: this.DailydashData.trend[0]?.ipd || 0 },
                                { name: 'Sat', value: this.DailydashData.trend[0]?.oipdpd || 0 },
                                { name: 'Sun', value: this.DailydashData.trend[0]?.ipd || 0 }
                            ]
                        }
                    ];


                    // this.financeSummary = [
                    //   { label: 'Today Revenue', value: this.DailydashData.dashboardSummary?.todayRevenue || 0, color: 'mint', icon: 'check-circle' },
                    //   { label: 'Pending Dues', value: this.DailydashData.dashboardSummary?.pendingDues || 0, color: 'rose', icon: 'hourglass' },
                    //   { label: 'Refunds', value: this.DailydashData.dashboardSummary?.refunds || 0, color: 'sky', icon: 'logout' },
                    //   { label: 'Advances', value: this.DailydashData.dashboardSummary?.advances || 0, color: 'butter', icon: 'user-plus' }
                    // ];
                }



                console.log('Dailydash Data Reports:', res);

            })


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


            if (apiData) {
                this.financeSummary = [
                    { label: 'Collection', value: apiData && apiData.Total_Revenue > 0 ? apiData.Total_Revenue : 0, color: 'mint', icon: 'check-circle' },
                    { label: 'Discount', value: apiData && apiData.DiscAmount > 0 ? apiData.DiscAmount : 0, color: 'rose', icon: 'hourglass' },
                    { label: 'Pending Dues', value: apiData && apiData.PendingDues > 0 ? apiData?.PendingDues : 0, color: 'rose', icon: 'hourglass' },
                    { label: 'Revenue', value: apiData && apiData.Net_Revenue > 0 ? apiData?.Net_Revenue : 0, color: 'mint', icon: 'user-plus' },
                    { label: 'Advances', value: apiData && apiData.AdvPay > 0 ? apiData?.AdvPay : 0, color: 'butter', icon: 'user-plus' },
                    { label: 'Refunds', value: apiData && apiData.RefundAmount > 0 ? apiData?.RefundAmount : 0, color: 'rose', icon: 'logout' },

                ];
                this.paymentData = [
                    { name: 'Cash', value: apiData?.CashPay || 0 },
                    { name: 'Online', value: apiData?.OnlinePay || 0 },
                    { name: 'Card', value: apiData?.CardPay || 0 },
                    { name: 'Cheque', value: apiData?.ChequePay || 0 }
                ];
            }
        }, err => {
            this.financeSummary = [

                { label: 'Collection', value: 0, color: 'green', icon: 'check-circle' },
                { label: 'Discount', value: 0, color: 'rose', icon: 'hourglass' },
                { label: 'Pending Dues', value: 0, color: 'rose', icon: 'hourglass' },

                { label: 'Revenue', value: 0, color: 'rose', icon: 'hourglass' },
                { label: 'Advances', value: 0, color: 'butter', icon: 'user-plus' },
                { label: 'Refunds', value: 0, color: 'sky', icon: 'logout' }
            ];
            this.paymentData = [
                { name: 'Cash', value: 0 },
                { name: 'Online', value: 0 },
                { name: 'Card', value: 0 },
                { name: 'Cheque', value: 0 }
            ];
        });
    }

  getDashOPDepatmentWiseCount() {
    debugger
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
          "fieldValue": this.toDate,
          "opType": "Equals"
        }
      ],
      "mode": "DashOPDepatmentWiseCount"
    };
    this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
      let apiData = res && res.length ? res : {};
      console.log(res)

      debugger
      if (apiData)
        this.departmentVisits = apiData
      // this.departmentVisits = [
      //   { name: 'Medicine', value: apiData?.find(d => d.name.toLowerCase() === 'Medicine'.toLowerCase())?.value || 0 },
      //   { name: 'Gastrologist', value: apiData?.find(d => d.name.toLowerCase() === 'Gastrologist'.toLowerCase())?.value || 0 },
      //   { name: 'Pathologist', value: apiData?.find(d => d.name.toLowerCase() === 'pathologist'.toLowerCase())?.value || 0 },
      //   { name: 'Physician', value: apiData?.find(d => d.name.toLowerCase() === 'Physician'.toLowerCase())?.value || 0 },
      //   { name: 'Plastic Surgeon', value: apiData?.find(d => d.name.toLowerCase() === 'plastic surgeon'.toLowerCase())?.value || 0 },
      //   { name: 'Surgeon', value: apiData?.find(d => d.name.toLowerCase() === 'surgeon'.toLowerCase())?.value || 0 },
      // ];

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


    ageData = [
        { name: '0-15 Years', value: 0 },
        { name: '16-25 Years', value: 0 },
        { name: '26-40 Years', value: 0 },
        { name: '41-60 Years', value: 0 },
        // { name: '60+ Years', value: 0 }
    ];


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
          "fieldValue": this.fromDate,
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
      if (apiData) {

        this.modalityData1 = apiData
         if (this.modalityData1.length)
      this.AgestatusPieChart = this.getAgeStatusPieChart()
        // this.modalityData1 = [
        //     ...this.modalityData1,
        //     ...apiData.map(item => ({

        //         name: item.name,
        //         value: item.value
        //     }))
        // ];
      }

            // this.ageData = [
            //   { name: '0-15 Years', value: apiData[0].value || 0 },
            //   { name: '16-25 Years', value: apiData[1].value || 0 },
            //   { name: '26-40', value: apiData[2].value || 0 },
            //   { name: '41-60 Years', value: apiData[3].value || 0 },
            //   { name: '60+ Years', value: apiData[4].value || 0 }
            // ];

        }, err => {
            return []
        })

   
  }
  getAgeStatusPieChart() {
    debugger
    if (this.AgestatusPieChart) {
      this.AgestatusPieChart.destroy();
    }


        return new Chart('AgestatusPieChart', {
            // this.pathologyStatusPieChart = new Chart('pathologyStatusPieChart', {

            type: 'doughnut',
            data: {
                labels: this.modalityData1.map(d => d.name),
                datasets: [
                    {
                        backgroundColor: ['#497df7', '#4c52f8', '#1347b0', '#9827e4'],
                        data: this.modalityData1.map(d => d.value),
                        borderWidth: 2
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + ' Age Type';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    getDashDrWiseCount() {
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
                    "fieldValue": this.toDate,
                    "opType": "Equals"
                }
            ],
            "mode": "DashOPConsultantWiseCount"
        };
        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
            const apiData1 = res && res.length ? res : {};
            console.log(res)
            return apiData1;

        }, err => {
            return []
        })
    }
    getMatIcon(icon: string): string {
        switch (icon) {
            case 'assignment':
                return 'assignment';
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
  colorScheme = { domain: ['#a9aae5', '#87a8f4', '#8587d0', '#7498e1', '#ce95f5', '#a1f6d9', '#f7bcd9', '#3b82f6'] };
  colorScheme1 = { domain: ['#c97efa', '#ba5cf9', '#a978c9', '#9f70c0', '#bb65f5', '#beeede', '#eea6ca', '#3b82f6'] };

  chartView: [number, number] = [420, 300];
  barChartView: [number, number] = [380, 300];



    // Detailed breakdown data for calculations
    registrationBreakdown = {
        'New Registration': [
            { source: 'Walk-in Patients', count: 45 },
            { source: 'Online Bookings', count: 25 },
            { source: 'Phone Appointments', count: 10 }
        ],
        'Old Registration': [,
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

    // --- New Dashboard Dummy Data & Charts ---
    getSparklinePath(data: number[]): string {
      if (!data || data.length === 0) return '';
      const max = Math.max(...data);
      const min = Math.min(...data);
      const range = max - min || 1;
      const width = 100;
      const height = 30;
      const stepX = width / Math.max(1, data.length - 1);
      
      const points = data.map((val, i) => {
          const x = i * stepX;
          // Pad 2px top and bottom
          const y = 28 - ((val - min) / range) * 26; 
          // Use 'S', 'Q', 'C' for pure smooth curves if desired, but L works fine for small charts
          return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      });
      
      return points.join(' ');
    }
  
    isTrendUp(data: number[]): boolean {
      if (!data || data.length < 2) return true;
      return data[data.length - 1] >= data[data.length - 2];
    }
  
    opCards = [
      { label: 'REGISTRATIONS', value: '148', trend: '+16', trendDiff: 'vs yesterday', history: [80, 100, 95, 120, 110, 130, 148], icon: 'person_add', isApproval: false, iconColor: '#4caeef' },
      { label: 'APPOINTMENTS', value: '215', trend: '-5', trendDiff: 'vs yesterday', history: [220, 230, 210, 240, 225, 230, 215], icon: 'calendar_today', isApproval: false, iconColor: '#2bb179' },
      { label: 'CHECKED IN', value: '89', trend: '+7', trendDiff: 'vs yesterday', history: [60, 75, 70, 85, 80, 82, 89], icon: 'input', isApproval: false, iconColor: '#4caeef' },
      { label: 'CHECKED OUT', value: '64', trend: '-6', trendDiff: 'vs yesterday', history: [80, 70, 75, 90, 85, 78, 64], icon: 'exit_to_app', isApproval: false, iconColor: '#2486f5' },
      { label: 'PENDING & WAITING', value: '25', trend: '-5', trendDiff: 'vs yesterday', history: [35, 30, 40, 28, 32, 30, 25], icon: 'schedule', isApproval: false, iconColor: '#f1b44c' },
      { label: 'ER TO OP', value: '12', trend: '+3', trendDiff: 'vs yesterday', history: [5, 8, 6, 12, 10, 9, 12], icon: 'warning', isApproval: false, iconColor: '#f46a6a' },
      { label: 'OP BILLS (CASH)', value: '92', trend: '+7', trendDiff: 'vs yesterday', history: [70, 85, 80, 95, 88, 85, 92], icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
      { label: 'OP BILLS (CREDIT)', value: '56', trend: '-4', trendDiff: 'vs yesterday', history: [65, 50, 60, 55, 62, 60, 56], icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
      { label: 'REFUND COUNT', value: '4', trend: '-2', trendDiff: 'vs yesterday', history: [8, 5, 7, 4, 6, 6, 4], icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
      { label: 'HCP COUNT', value: '38', trend: '+2', trendDiff: 'vs yesterday', history: [20, 30, 35, 32, 40, 36, 38], icon: 'local_hospital', isApproval: false, iconColor: '#9566d3' },
      { label: 'DISCOUNT APPROVAL', approved: '18', pending: '7', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' },
      { label: 'REFUND APPROVAL', approved: '3', pending: '1', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
    ];
    opCollection = { total: '₹4,85,600', cash: '₹1,85,000', card: '₹1,42,600', upi: '₹98,000', bank: '₹60,000' };
  
    ipCards = [
      { label: 'TODAY\'S ADMISSIONS', value: '34', trend: '+6', trendDiff: 'vs yesterday', history: [20, 25, 22, 30, 28, 30, 34], icon: 'hotel', isApproval: false, iconColor: '#4caeef' },
      { label: 'CURRENT OCCUPANCY', value: '78%', trend: '+4', trendDiff: 'vs yesterday', subtitle: '312 / 400 beds', history: [65, 70, 68, 75, 72, 74, 78], icon: 'domain', isApproval: false, iconColor: '#2bb179' },
      { label: 'ER TO IP', value: '8', trend: '+2', trendDiff: 'vs yesterday', history: [4, 6, 5, 8, 7, 6, 8], icon: 'warning', isApproval: false, iconColor: '#f46a6a' },
      { label: 'TODAY\'S DISCHARGE', value: '22', trend: '-3', trendDiff: 'vs yesterday', history: [30, 25, 28, 20, 26, 25, 22], icon: 'exit_to_app', isApproval: false, iconColor: '#2bb179' },
      { label: 'DISCHARGE CLEARANCE', value: '18', trend: '-2', trendDiff: 'vs yesterday', subtitle: 'Cleared', history: [22, 18, 20, 16, 21, 20, 18], icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
      { label: 'DISCHARGE PENDING', value: '4', trend: '-1', trendDiff: 'vs yesterday', history: [8, 6, 7, 5, 6, 5, 4], icon: 'schedule', isApproval: false, iconColor: '#f1b44c' },
      { label: 'IP BILLS (CASH)', value: '45', trend: '+5', trendDiff: 'vs yesterday', history: [30, 35, 38, 42, 40, 42, 45], icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
      { label: 'IP BILLS (CREDIT)', value: '67', trend: '-5', trendDiff: 'vs yesterday', history: [75, 70, 72, 80, 68, 70, 67], icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
      { label: 'REFUND COUNT', value: '2', trend: '-1', trendDiff: 'vs yesterday', history: [5, 4, 3, 4, 2, 3, 2], icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
      { label: 'DISCOUNT APPROVAL', approved: '12', pending: '5', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' },
      { label: 'REFUND APPROVAL', approved: '2', pending: '0', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
    ];
    ipCollection = { total: '₹12,56,000', cash: '₹3,20,000', card: '₹4,56,000', upi: '₹2,80,000', bank: '₹2,00,000' };
  
    pharmacyCards = [
      { label: 'RX CLOSED', value: '124', trend: '+14', trendDiff: 'vs yesterday', history: [80, 95, 100, 110, 105, 120, 124], icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
      { label: 'RX OPEN', value: '31', trend: '-7', trendDiff: 'vs yesterday', history: [50, 45, 40, 35, 42, 38, 31], icon: 'assignment', isApproval: false, iconColor: '#f1b44c' },
      { label: 'WALKING SALES', value: '87', trend: '+7', trendDiff: 'vs yesterday', history: [60, 70, 75, 80, 78, 85, 87], icon: 'shopping_cart', isApproval: false, iconColor: '#4caeef' },
      { label: 'DISCHARGE CLEARANCE', value: '16', trend: '+2', trendDiff: 'vs yesterday', history: [10, 12, 11, 15, 14, 15, 16], icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
      { label: 'DISCHARGE PENDING', value: '6', trend: '-2', trendDiff: 'vs yesterday', history: [12, 8, 10, 7, 9, 8, 6], icon: 'schedule', isApproval: false, iconColor: '#f46a6a' },
      { label: 'IP ISSUED', value: '52', trend: '+4', trendDiff: 'vs yesterday', history: [40, 45, 48, 50, 46, 50, 52], icon: 'store', isApproval: false, iconColor: '#2486f5' },
      { label: 'IP PENDING', value: '9', trend: '-3', trendDiff: 'vs yesterday', history: [15, 18, 14, 12, 11, 12, 9], icon: 'schedule', isApproval: false, iconColor: '#f46a6a' },
      { label: 'SALES (CASH)', value: '98', trend: '+8', trendDiff: 'vs yesterday', history: [70, 80, 85, 90, 88, 92, 98], icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
      { label: 'SALES (CREDIT)', value: '43', trend: '-5', trendDiff: 'vs yesterday', history: [50, 45, 48, 52, 46, 48, 43], icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
      { label: 'DISCOUNT APPROVAL', approved: '8', pending: '3', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
    ];
    pharmacyCollection = { total: '₹3,42,500', cash: '₹1,45,000', card: '₹98,500', upi: '₹72,000', bank: '₹27,000' };
  
    procurementCards = [
      { label: 'PO CLOSED', value: '42', trend: '+4', trendDiff: 'vs yesterday', history: [25, 30, 32, 38, 35, 40, 42], icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
      { label: 'PO OPEN', value: '15', trend: '-3', trendDiff: 'vs yesterday', history: [22, 20, 18, 20, 19, 17, 15], icon: 'assignment', isApproval: false, iconColor: '#f46a6a' },
      { label: 'INDENT ISSUED', value: '28', trend: '+4', trendDiff: 'vs yesterday', history: [15, 20, 22, 25, 24, 26, 28], icon: 'description', isApproval: false, iconColor: '#4caeef' },
      { label: 'INDENT CLOSED', value: '22', trend: '+2', trendDiff: 'vs yesterday', history: [12, 15, 18, 20, 19, 21, 22], icon: 'done_all', isApproval: false, iconColor: '#2bb179' },
      { label: 'INDENT PENDING', value: '6', trend: '+2', trendDiff: 'vs yesterday', history: [3, 4, 3, 5, 4, 5, 6], icon: 'schedule', isApproval: false, iconColor: '#2bb179' },
      { label: 'GRN COUNT', value: '35', trend: '+5', trendDiff: 'vs yesterday', history: [20, 25, 28, 32, 30, 34, 35], icon: 'local_mall', isApproval: false, iconColor: '#9566d3' },
      { label: 'GRN APPROVAL PENDING', value: '8', trend: '-2', trendDiff: 'vs yesterday', history: [12, 10, 11, 9, 10, 9, 8], icon: 'schedule', isApproval: false, iconColor: '#f46a6a' }
    ];
    procurementCollection = { label: 'GRN VALUE', total: '₹12.4L', trend: '- 0', trendDiff: 'vs yesterday', trendUp: false, subtitle: '₹12,40,000' };
    // --- End New Dashboard Dummy Data ---


    DropdData = [
        { name: 'Registrations', value: 0 },
        { name: 'Appointments', value: 0 },
        { name: 'Checked In', value: 0 },
        { name: 'Checked Out', value: 0 },
        { name: 'No Shows', value: 0 },
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
            name: 'OPD (PCount)',
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
            name: 'IPD (PCount)',
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


    // recentColumns = ['name', 'type', 'dept', 'time'];
    // recentPatients = [
    //   { name: 'Anita Deshmukh', type: 'OPD', department: 'Medicine', time: '09:10 AM' },
    //   { name: 'Ravi Patil', type: 'OPD', department: 'Orthopedics', time: '09:25 AM' },
    //   { name: 'Meera Joshi', type: 'IPD', department: 'Gynaecology', time: '09:40 AM' },
    //   { name: 'Suresh Kulkarni', type: 'OPD', department: 'ENT', time: '10:05 AM' },
    //   { name: 'Priya Malhotra', type: 'OPD', department: 'Pediatrics', time: '10:20 AM' }
    // ];

    // Patient Mix
    patientStats = {
        withMediclaim: 0,
        withoutMediclaim: 0,
        reference: 0,
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
        return this.DropdData.reduce((sum, item) => sum + item.value, 0);
    }

    get checkedInCount(): number {
        const checkedIn = this.DropdData.find(item => item.name === 'Checked In');
        return checkedIn ? checkedIn.value : 0;
    }

    get opdPercent(): number {
        if (!this.totalOPD) { return 0; }
        return Math.round((this.checkedInCount / this.totalOPD) * 100);
    }

    // Chart.js doughnut chart with custom plugins
    async getPatientOverviewChart() {


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
                    "fieldValue": this.fromDate,
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
            const apiData = res && res.length ? res : [];
            console.log("apiDataapiDataapiData", apiData)

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

            console.log(apiData)
            // const chart = new Chart('PatientOverviewDoughnut', {
            return new Chart('PatientOverviewDoughnut', {

        type: 'doughnut',
        data: {
          labels: apiData?.map(data => data.name) || [],
          datasets: [
            {
              backgroundColor: ['#6366f1', '#497df7', '#4c52f8', '#5287f0', '#bb65f5', '#a1f6d9', '#f97fbc', '#3b82f6', '#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6'],
              data: apiData?.map(data => data.value) || []
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
      // return chart;

        }, err => {
            return []
        })


    }



    async getDrPatientOverviewChart() {

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
                    "fieldValue": this.fromDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": this.toDate,
                    "opType": "Equals"
                }
            ],
            "mode": "DashOPConsultantWiseCount"
        };
        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
            const apiData = res && res.length ? res : [];
            console.log("apiDataapiDataapiData", apiData)

            // Check if data is empty or all values are zero
            const hasData = apiData && apiData.length > 0 && apiData.some((item: any) => item.value > 0);

            if (!hasData) {
                // Display empty state message
                const canvas = document.getElementById('OPDDrOverviewDoughnut') as HTMLCanvasElement;
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


            console.log(apiData)
            // const chart = new Chart('PatientOverviewDoughnut', {
            return new Chart('OPDDrOverviewDoughnut', {

                type: 'doughnut',
                data: {
                    labels: apiData?.map(data => data.name) || [],
                    datasets: [
                        {
                            backgroundColor: ['#6366f1', '#497df7', '#4c52f8', '#5287f0', '#bb65f5', '#a1f6d9', '#f97fbc', '#3b82f6'],
                            data: apiData?.map(data => data.value) || []
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
            // return chart;

        }, err => {
            return []
        })

    }
 
    //  trendData1: Servicecharge[] = [];
    trendChart: any;
    drcountdata: any
    public DrcountChart: any;
       public chargeList: drcountdata[] = [];

    trendData: drcountdata[] = [];

    modalityData = [
        { name: '', value: 0 }
    ];

  modalityData1 = [
    { name: '', value: 0 }
  ];


    getdrwiseList() {

        const payload = {
            "searchFields": [
                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.UnitId),
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
            "mode": "DashOPConsultantWiseCount"
        };
        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
            this.drcountdata = res
            this.trendData = res


            console.log(res)
            if (this.trendData) {

                this.modalityData = [
                    ...this.modalityData,
                    ...this.trendData.map(item => ({

                        name: item.name,
                        value: item.value
                    }))
                ];
            }

            console.log(this.modalityData)

            if (this.modalityData)
                this.DrcountChart = this.getDrBarChart();

        });
    }


    //
    getDrBarChart() {
        if (this.DrcountChart) {
            this.DrcountChart.destroy();
        }


    return new Chart('DrcountChart', {
      type: 'bar',
      data: {
        labels: this.modalityData.map(d => d.name),
        datasets: [
          {
            label: 'Dr. Name',
            data: this.modalityData.map(d => d.value),
            backgroundColor: [
              '#bbdefb',   // very pale blue
              '#90caf9',   // light sky blue
              '#64b5f6',   // medium light blue
              '#497df7',   // your bright one
              '#6366f1',   // indigo transition
              '#4b50f7',   // deep vivid blue
              '#bb65f5',   // bluish purple
              '#9c44d6'    // final vivid purple
            ],
            borderRadius: 6
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 11 }
            }
          },
          x: {
            ticks: {
              font: { size: 11 }
            }
          }
        }
      }
    });
  }
  // OPD Overview Chart with custom plugins
  getOPDOverviewChart() {

        if (this.opdOverviewChart) {
            this.opdOverviewChart.destroy();
        }


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
            this.DropdData[0].value,
            this.DropdData[1].value,
            this.DropdData[2].value,
            this.DropdData[3].value,
            this.DropdData[4].value,
            this.DropdData[5].value
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
                        backgroundColor: ['#6366f1', '#497df7', '#4c52f8', '#5287f0', '#bb65f5', '#bb59fc', '#f966b0', '#b050a0'],
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
                            name: this.DropdData[index].name,
                            value: this.DropdData[index].value,
                            percentage: Math.round((this.DropdData[index].value / this.totalOPD) * 100),
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
                    name: this.DropdData[index].name,
                    value: this.DropdData[index].value,
                    percentage: Math.round((this.DropdData[index].value / this.totalOPD) * 100),
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
                this.chartPopoverData = [...this.DropdData];
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
                    "fieldValue": this.toDate,
                    "opType": "Equals"
                }
            ],
            "mode": "DashOPDepatmentWiseCount"
        };
        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
            const apiData = res && res.length ? res : {};
            console.log(res)


        }, err => {
            this.trendSeries = [
                {
                    name: 'OPD',
                    series: [
                        { name: 'Mon', value: 0 },
                        { name: 'Tue', value: 0 },
                        { name: 'Wed', value: 0 },
                        { name: 'Thu', value: 0 },
                        { name: 'Fri', value: 0 },
                        { name: 'Sat', value: 0 },
                        { name: 'Sun', value: 0 }
                    ]
                },
                {
                    name: 'IPD',
                    series: [
                        { name: 'Mon', value: 0 },
                        { name: 'Tue', value: 0 },
                        { name: 'Wed', value: 0 },
                        { name: 'Thu', value: 0 },
                        { name: 'Fri', value: 0 },
                        { name: 'Sat', value: 0 },
                        { name: 'Sun', value: 0 }
                    ]
                }
            ];

        })
    }


    updateDateFilteredCharts(): void {
        // Update charts that are affected by date filter
        // if (this.PatientOverviewDoughnut) {
        //   this.PatientOverviewDoughnut.destroy();
        // }
        if (this.opdOverviewChart) {
            this.opdOverviewChart.destroy();
        }
        // if (this.paymentModeChart) {
        //     this.paymentModeChart.destroy();
        // }
        // if (this.topMedicinesChart) {
        //     this.topMedicinesChart.destroy();
        // }

        // Reinitialize the affected charts
        setTimeout(() => {


            if (document.getElementById('paymentModeChart')) {
                // this.paymentModeChart = this.getPaymentDoughnutChart();
            }

            if (document.getElementById('topMedicinesChart')) {
                // this.topMedicinesChart = this.getTopMedicinesChart();
            }
        }, 100);
    }
}


export class drcountdata {
    name: any;
    value: any;


    constructor(test: any) {
        this.name = test.name || '';
        this.value = test.value || 0;


    }
}