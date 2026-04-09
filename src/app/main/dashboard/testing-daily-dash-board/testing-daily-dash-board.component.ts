import { Component, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from '../dashboard.service';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Chart } from 'chart.js';
import { drcountdata } from '../new-dashboard/new-dashboard.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { referralsWise, Visitdata } from '../new-finacialdashboard/new-finacialdashboard.component';
import { MatTableDataSource } from '@angular/material/table';
import { VisitDatagraphComponent } from '../new-finacialdashboard/visit-datagraph/visit-datagraph.component';
import { MatDialog } from '@angular/material/dialog';
type PatientTypeRow = {
  typeOfPatient: string;
  ip: number;
  op: number;
};

@Component({
  selector: 'app-testing-daily-dash-board',
  templateUrl: './testing-daily-dash-board.component.html',
  styleUrls: ['./testing-daily-dash-board.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TestingDailyDashBoardComponent {


  UnitId: any = this._accountServices.currentUserValue.user.unitId;
  DailydashData: any;
  // Patient Mix

  myFilterform = new FormGroup({});
  patientStats = {
    withMediclaim: 0,
    withoutMediclaim: 0,
    reference: 0,
    get total() { return this.withMediclaim + this.withoutMediclaim + this.reference; }
  };
  displayedColumns: string[] = [
    'OldPatient',
    'NewPatient',
    'ReferPatient',
    'Company'
  ]
   displayeddepColumns: string[] = [
        'DepartmentName',
        'Count',
    ]
    displayedDepBillColumns: string[] = [
        'DepartmentName',
        'Amount',
    ]
    displayedDocBillColumns: string[] = [
        'DoctorName',
        'Count',
    ]
  dsDailyCountList = new MatTableDataSource<OPDCount>();
  dsDailyBillList = new MatTableDataSource<OPDBillDateWise>();

  dsDailyDepartmentCountList = new MatTableDataSource<OPDBillDateWise>();
  dsDailyDepBillList = new MatTableDataSource
  dsDailyDocBillList = new MatTableDataSource<OPDBillDateWise>();

  // AgeWise
  public AgestatusPieChart: any
  modalityData = [
    { name: '', value: 0 }
  ];

  modalityData1 = [
    { name: '', value: 0 }
  ];
  // Dr?
  trendChart: any;
  drcountdata: any
  public DrcountChart: any;
  public chargeList: drcountdata[] = [];
  trendData: drcountdata[] = [];

  trendSeries = [
    {
      name: 'OPD (PCount)',
      series: [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 90 }
      ]
    },
    {
      name: 'IPD (PCount)',
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

  trendSeriesOP = [
    {
      name: 'OPD (PCount)',
      series: [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 90 }
      ]
    },
    {
      name: 'IPD (PCount)',
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

  trendSeriesIP = [
    {
      name: 'OPD (PCount)',
      series: [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 90 }
      ]
    },
    {
      name: 'IPD (PCount)',
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

  trendSeriesPH = [
    {
      name: 'OPD (PCount)',
      series: [
        { name: 'Mon', value: 0 },
        { name: 'Tue', value: 0 },
        { name: 'Wed', value: 0 },
        { name: 'Thu', value: 0 },
        { name: 'Fri', value: 0 },
        { name: 'Sat', value: 0 },
        { name: 'Sun', value: 90 }
      ]
    },
    {
      name: 'IPD (PCount)',
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
  financeSummary = [
    { label: 'Collection', value: 0, color: 'green', icon: 'check-circle' },
    { label: 'Discount', value: 0, color: 'rose', icon: 'hourglass' },
    { label: 'Pending Dues', value: 0, color: 'rose', icon: 'hourglass' },

    { label: 'Revenue', value: 0, color: 'rose', icon: 'hourglass' },
    { label: 'Advances', value: 0, color: 'butter', icon: 'user-plus' },
    { label: 'Refunds', value: 0, color: 'sky', icon: 'logout' }

  ];

  paymentDataOP = [
    { name: 'Cash', value: 0 },
    { name: 'Online', value: 0 },
    { name: 'Card', value: 0 },
    { name: 'Cheque', value: 0 }
  ];

  paymentDataIP = [
    { name: 'Cash', value: 0 },
    { name: 'Online', value: 0 },
    { name: 'Card', value: 0 },
    { name: 'Cheque', value: 0 }
  ];
  paymentDataPH = [
    { name: 'Cash', value: 0 },
    { name: 'Online', value: 0 },
    { name: 'Card', value: 0 },
    { name: 'Cheque', value: 0 }
  ];

  colorScheme = { domain: ['#a9aae5', '#87a8f4', '#8587d0', '#7498e1', '#ce95f5', '#a1f6d9', '#f7bcd9', '#3b82f6'] };
  colorScheme1 = { domain: ['#bff1f8', '#cbaae1', '#c98dae', '#c4e8e2', '#bb65f5', '#beeede', '#eea6ca', '#3b82f6'] };

  opCards = [
    { label: 'REGISTRATIONS', value: '148', trend: '+16', trendDiff: 'vs yesterday', history: [80, 100, 95, 120, 110, 130, 148], icon: 'person_add', isApproval: false, iconColor: '#4caeef' },
    { label: 'APPOINTMENTS', value: '215', trend: '-5', trendDiff: 'vs yesterday', history: [220, 230, 210, 240, 225, 230, 215], icon: 'calendar_today', isApproval: false, iconColor: '#2bb179' },
    { label: 'APPOINTMENTS Cancle', value: '2', trend: '-5', trendDiff: 'vs yesterday', history: [220, 230, 210, 240, 225, 230, 215], icon: 'calendar_today', isApproval: false, iconColor: '#2bb179' },
    { label: 'FollowUp Visists', value: '3', trend: '-5', trendDiff: 'vs yesterday', history: [220, 230, 210, 240, 225, 230, 215], icon: 'calendar_today', isApproval: false, iconColor: '#2bb179' },

    { label: 'CHECKED IN', value: '89', trend: '+7', trendDiff: 'vs yesterday', history: [60, 75, 70, 85, 80, 82, 89], icon: 'input', isApproval: false, iconColor: '#4caeef' },
    { label: 'CHECKED OUT', value: '64', trend: '-6', trendDiff: 'vs yesterday', history: [80, 70, 75, 90, 85, 78, 64], icon: 'exit_to_app', isApproval: false, iconColor: '#2486f5' },
    { label: 'PENDING & WAITING', value: '25', trend: '-5', trendDiff: 'vs yesterday', history: [35, 30, 40, 28, 32, 30, 25], icon: 'schedule', isApproval: false, iconColor: '#f1b44c' },
    { label: 'ER TO OP', value: '12', trend: '+3', trendDiff: 'vs yesterday', history: [5, 8, 6, 12, 10, 9, 12], icon: 'warning', isApproval: false, iconColor: '#f46a6a' },
    { label: 'CASH AMOUNT', value: '92', trend: '+7', trendDiff: 'vs yesterday', history: [70, 85, 80, 95, 88, 85, 92], icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
    { label: 'CREDIT AMOUNT', value: '56', trend: '-4', trendDiff: 'vs yesterday', history: [65, 50, 60, 55, 62, 60, 56], icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
    // { label: 'REFUND COUNT', value: '4', trend: '-2', trendDiff: 'vs yesterday', history: [8, 5, 7, 4, 6, 6, 4], icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
    { label: 'Due AMOUNT', value: '3224', trend: '-2', trendDiff: 'vs yesterday', history: [8, 5, 7, 4, 6, 6, 4], icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
    { label: 'HCP COUNT', value: '38', trend: '+2', trendDiff: 'vs yesterday', history: [20, 30, 35, 32, 40, 36, 38], icon: 'local_hospital', isApproval: false, iconColor: '#9566d3' },
    // { label: 'DISCOUNT APPROVAL', approved: '18', pending: '7', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' },
    // { label: 'REFUND APPROVAL', approved: '3', pending: '1', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
  ];
  opCollection = { total: '₹4,85,600', cash: '₹1,85,000', card: '₹1,42,600', upi: '₹98,000', bank: '₹60,000' };

  ipCards = [
    { label: 'TODAY\'S ADMISSIONS', value: '34', trend: '+6', trendDiff: 'vs yesterday', history: [20, 25, 22, 30, 28, 30, 34], icon: 'hotel', isApproval: false, iconColor: '#4caeef' },
    { label: 'CURRENT OCCUPANCY', value: '78%', trend: '+4', trendDiff: 'vs yesterday', subtitle: '312 / 400 beds', history: [65, 70, 68, 75, 72, 74, 78], icon: 'domain', isApproval: false, iconColor: '#2bb179' },
    { label: 'ER TO IP', value: '8', trend: '+2', trendDiff: 'vs yesterday', history: [4, 6, 5, 8, 7, 6, 8], icon: 'warning', isApproval: false, iconColor: '#f46a6a' },
    { label: 'TODAY\'S DISCHARGE', value: '22', trend: '-3', trendDiff: 'vs yesterday', history: [30, 25, 28, 20, 26, 25, 22], icon: 'exit_to_app', isApproval: false, iconColor: '#2bb179' },
    { label: 'DISCHARGE CLEARANCE', value: '18', trend: '-2', trendDiff: 'vs yesterday', subtitle: 'Cleared', history: [22, 18, 20, 16, 21, 20, 18], icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
    { label: 'DISCHARGE PENDING', value: '4', trend: '-1', trendDiff: 'vs yesterday', history: [8, 6, 7, 5, 6, 5, 4], icon: 'schedule', isApproval: false, iconColor: '#f1b44c' },
    { label: 'CASH AMOUNT', value: '45', trend: '+5', trendDiff: 'vs yesterday', history: [30, 35, 38, 42, 40, 42, 45], icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
    { label: 'CREDIT AMOUNT', value: '67', trend: '-5', trendDiff: 'vs yesterday', history: [75, 70, 72, 80, 68, 70, 67], icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
    { label: 'REFUND COUNT', value: '2', trend: '-1', trendDiff: 'vs yesterday', history: [5, 4, 3, 4, 2, 3, 2], icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
    // { label: 'DISCOUNT APPROVAL', approved: '12', pending: '5', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' },
    // { label: 'REFUND APPROVAL', approved: '2', pending: '0', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
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
    { label: 'CASH AMOUNT', value: '98', trend: '+8', trendDiff: 'vs yesterday', history: [70, 80, 85, 90, 88, 92, 98], icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
    { label: 'CREDIT AMOUNT', value: '43', trend: '-5', trendDiff: 'vs yesterday', history: [50, 45, 48, 52, 46, 48, 43], icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
    // { label: 'DISCOUNT APPROVAL', approved: '8', pending: '3', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
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

  constructor(private dashboardService: DashboardService, public _accountServices: AuthenticationService,
    private accountService: AuthenticationService, public datePipe: DatePipe, public _matDialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.myFilterform = this.dashboardService.filterdashboardForm()
    this.getdrwiseList();
    this.getDashRegistrationAgeWiseCount();
    this.getDashOPUserWiseRevenue()
    this.loadDashboardData();
    this.getDashOPDepatmentWiseCount()
  }

  onGo(): void {
    this.loadDashboardData()
    this.getdrwiseList();
    this.getDashRegistrationAgeWiseCount();
  }
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
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
  loadDashboardData() {

    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
      this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',

      //     this.getHomeDashboardAPI();
      this.getDashOPUserWiseRevenue();
    // this.getDashOPDepatmentWiseCount();
    this.alldashdata()
    this.getDashRegistrationAgeWiseCount();
     this.getDashOPDepatmentWiseCount()
    // this.getdrwiseList()
    // Re-initialize charts with new date range
    setTimeout(() => {

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


      if (apiData) {
        this.financeSummary = [
          { label: 'Collection', value: apiData && apiData.Total_Revenue > 0 ? apiData.Total_Revenue : 0, color: 'mint', icon: 'check-circle' },
          { label: 'Discount', value: apiData && apiData.DiscAmount > 0 ? apiData.DiscAmount : 0, color: 'rose', icon: 'hourglass' },
          { label: 'Pending Dues', value: apiData && apiData.PendingDues > 0 ? apiData?.PendingDues : 0, color: 'rose', icon: 'hourglass' },
          { label: 'Revenue', value: apiData && apiData.Net_Revenue > 0 ? apiData?.Net_Revenue : 0, color: 'mint', icon: 'user-plus' },
          { label: 'Advances', value: apiData && apiData.AdvPay > 0 ? apiData?.AdvPay : 0, color: 'butter', icon: 'user-plus' },
          { label: 'Refunds', value: apiData && apiData.RefundAmount > 0 ? apiData?.RefundAmount : 0, color: 'rose', icon: 'logout' },

        ];
        
        this.paymentDataOP = [
          { name: 'Cash', value: apiData?.CashPay || 0 },
          { name: 'Online', value: apiData?.OnlinePay || 0 },
          { name: 'Card', value: apiData?.CardPay || 0 },
          { name: 'Cheque', value: apiData?.ChequePay || 0 }
        ];

        this.paymentDataIP = [
          { name: 'Cash', value: apiData?.CashPay || 0 },
          { name: 'Online', value: apiData?.OnlinePay || 0 },
          { name: 'Card', value: apiData?.CardPay || 0 },
          { name: 'Cheque', value: apiData?.ChequePay || 0 }
        ];
        this.paymentDataPH = [
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
      this.paymentDataOP = [
        { name: 'Cash', value: 0 },
        { name: 'Online', value: 0 },
        { name: 'Card', value: 0 },
        { name: 'Cheque', value: 0 }
      ];
      this.paymentDataIP = [
        { name: 'Cash', value: 0 },
        { name: 'Online', value: 0 },
        { name: 'Card', value: 0 },
        { name: 'Cheque', value: 0 }
      ];
      this.paymentDataPH = [
        { name: 'Cash', value: 0 },
        { name: 'Online', value: 0 },
        { name: 'Card', value: 0 },
        { name: 'Cheque', value: 0 }
      ];
    });
  }



  alldashdata() {
    // this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
    //   this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',

    this.dashboardService.allDashboarddata({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
      this.DailydashData = res;

      if (this.DailydashData) {

        this.patientStats = {
          withMediclaim: this.DailydashData.patientSummary.withMediclaim,
          withoutMediclaim: this.DailydashData.patientSummary.withoutMediclaim,
          reference: this.DailydashData.patientSummary.referencePatients,
          total: this.DailydashData.patientSummary.totalPatients
        };

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
      }
      console.log('Dailydash Data Reports:', res);

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

      }
    }, err => {
      return []
    })


  }

  getAgeStatusPieChart() {

    if (this.AgestatusPieChart) {
      this.AgestatusPieChart.destroy();
    }

    return new Chart('AgestatusPieChart', {

      type: 'doughnut',
      data: {
        labels: this.modalityData1.map(d => d.name),
        datasets: [
          {
            backgroundColor: ['#e7bdf0', '#c9eeef', '#e1bfe6', '#c3e6e0', '#b6baf5'],
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

Ipflag:any="flase"
  selectedTabIndex: number = 0;   // Default to first tab (Summary)

  onTabChange(event: MatTabChangeEvent) {
    debugger
    this.selectedTabIndex = event.index;
    if(this.selectedTabIndex ==2)
    this.Ipflag=true
  }



  VisitTrend() {

    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")

    const dialogRef = this._matDialog.open(VisitDatagraphComponent,
      {
        maxWidth: "90vw",
        height: '70%',
        width: '90%',
        data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getOPDCoutList() {
    const vadat = {
      'FromDate': this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd"),
      'ToDate': this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
    }
    debugger
    this.dashboardService.getOPDCoutList(vadat).subscribe(data => {
      console.log(data)
      this.dsDailyCountList.data = data as OPDCount[];
      console.log(this.dsDailyCountList.data)
    });
    this.dashboardService.getOPDBillDatewiseList(vadat).subscribe(data => {
      this.dsDailyBillList.data = data as OPDBillDateWise[];
      //console.log(this.dsDailyBillList.data)
    });
    this.dashboardService.getOPDDepartmentCountList(vadat).subscribe(data => {
      this.dsDailyDepartmentCountList.data = data as OPDBillDateWise[];
      // console.log(this.dsDailyDepartmentCountList.data)
    });
    this.dashboardService.getOPDDepartmentBillList(vadat).subscribe(data => {
      this.dsDailyDepBillList.data = data as OPDBillDateWise[];
      //console.log(this.dsDailyDepBillList.data)
    });
    this.dashboardService.getOPDDoctorCountList(vadat).subscribe(data => {
      this.dsDailyDocBillList.data = data as OPDBillDateWise[];
      //console.log(this.dsDailyDocBillList.data)
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

      
      if (apiData)
        this.dsDailyDepartmentCountList.data = apiData
     
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
}

export class OPDCount {
  OldPatient: any;
  NewPatient: any;
  ReferPatient: any;
  Company: any;
  TotalVisitCount: any;
  constructor(OPDCount) {
    {
      this.OldPatient = OPDCount.OldPatient || 0;
      this.NewPatient = OPDCount.NewPatient || 0;
      this.ReferPatient = OPDCount.ReferPatient || 0;
      this.Company = OPDCount.Company || 0;
    }
  }
}

export class OPDBillDateWise {
    Cash: any;
    Cheque: any;
    Online: any;
    Company: any;
    DoctorName: string;
    Count: any;
    DepartmentName: any;
    NetAmount: any;
    DiscAmount: any;
    PaidAmount: any;
    BalAmount: any;
    TotalAmount: any;
    NetBillAmount: any;

    constructor(OPDBillDateWise) {
        {
            this.Cash = OPDBillDateWise.Cash || 0;
            this.Cheque = OPDBillDateWise.Cheque || 0;
            this.Online = OPDBillDateWise.Online || 0;
            this.Company = OPDBillDateWise.Company || 0;
            this.DoctorName = OPDBillDateWise.DoctorName || '';
            this.Count = OPDBillDateWise.Count || 0;
            this.DepartmentName = OPDBillDateWise.DepartmentName || '';
            this.NetAmount = OPDBillDateWise.NetAmount || 0;
            this.DiscAmount = OPDBillDateWise.DiscAmount || 0;
            this.BalAmount = OPDBillDateWise.BalAmount || 0;
            this.PaidAmount = OPDBillDateWise.PaidAmount || 0;
            this.TotalAmount = OPDBillDateWise.TotalAmount || 0;
        }
    }
}