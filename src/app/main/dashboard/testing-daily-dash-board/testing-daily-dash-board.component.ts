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
    // 'WardName',
    'OldPatient',
    'NewPatient',
    'ReferPatient',
    'Company'
  ]

   displayedIpColumns: string[] = [
    'WardName',
    'OldPatient',
    'NewPatient',
    'ReferPatient',
    // 'Company'
  ]
  displayeddepColumns: string[] = [
    'DepartmentName',
    'Count',
  ]
  displayedDepBillColumns: string[] = [
    'DepartmentName',
    'Count',
    'Gross',
    'Discount',
    'Net'
  ]

  PharDepBillColumns: string[] = [
    'DepartmentName',
     'DeptCount',
    'Gross',
    'Discount',
    'Net'
  ]
  displayedDocBillColumns: string[] = [
    'DoctorName',
    'Count',
  ]

   pharDoctorwiseColumns: string[] = [
    'DoctorType',
    'DoctorName',
    'Count',
  ]
  SupplierwiseColumns: string[] = [
    'SupplierName',
    'Date',
    'PoNo',
    'NetAmt',
  ]

    ItemWiseColumns: string[] = [
    'ItemName',
     'Qty',
    'Price',
    'Total',
    // 'Net'
  ]

  dsAppointmentDailyCountList = new MatTableDataSource<OPDCount>();
  // OPDailyBillList = new MatTableDataSource<OPDBillDateWise>();
  //   IPDailyBillList = new MatTableDataSource<OPDBillDateWise>();
      // dsDailyBillList = new MatTableDataSource<OPDBillDateWise>();
  dsAdmissionDailyCountList = new MatTableDataSource<OPDCount>();


  dsOPDailyDepartmentCountList = new MatTableDataSource<OPDBillDateWise>();
  dsOPDailyDepBillList = new MatTableDataSource<OPDBillDateWise>();
  dsOPDailyDocBillList = new MatTableDataSource<OPDBillDateWise>();


  dsIPDailyDepartmentCountList = new MatTableDataSource<OPDBillDateWise>();
  dsIPDailyDepBillList = new MatTableDataSource<OPDBillDateWise>();
  dsIPDailyDocBillList = new MatTableDataSource<OPDBillDateWise>();
dsIPDailyRefDocBillList= new MatTableDataSource<OPDBillDateWise>();
  dsPharDailyDepartmentCountList = new MatTableDataSource<OPDBillDateWise>();
  dsPharDailyDepBillList = new MatTableDataSource<OPDBillDateWise>();
  dsPharDailyDocBillList = new MatTableDataSource<OPDBillDateWise>();
  dsPharDailyRefDocBillList = new MatTableDataSource<OPDBillDateWise>();


   dsSupplierwiseCountList = new MatTableDataSource<OPDBillDateWise>();
  POItemwiseList = new MatTableDataSource<OPDBillDateWise>();

  // AgeWise
  public AgestatusPieChartOP: any
  public AgestatusPieChartIP: any
  modalityData = [
    { name: '', value: 0 }
  ];

  modalityData1 = [
    { name: '', value: 0 }
  ];
  // Dr?
  trendChart: any;
  drcountdata: any
  public DrcountChartOP: any;
  public DrcountChartIP: any;
  public chargeList: drcountdata[] = [];
  trendData: drcountdata[] = [];

  trendSeries = [
    {
      name: 'New',
      series: [
        { name: 'Mon', value: 20 },
        { name: 'Tue', value: 30 },
        { name: 'Wed', value: 10 },
        { name: 'Thu', value: 20 },
        { name: 'Fri', value: 30 },
        { name: 'Sat', value: 40 },
        { name: 'Sun', value: 90 }
      ]
    },
    {
      name: 'Old',
      series: [
        { name: 'Mon', value: 40 },
        { name: 'Tue', value: 30 },
        { name: 'Wed', value: 20 },
        { name: 'Thu', value: 10 },
        { name: 'Fri', value: 60 },
        { name: 'Sat', value: 70 },
        { name: 'Sun', value: 10 }
      ]
    },
    {
      name: 'Total',
      series: [
        { name: 'Mon', value: 10 },
        { name: 'Tue', value: 110 },
        { name: 'Wed', value: 30 },
        { name: 'Thu', value: 20 },
        { name: 'Fri', value: 50 },
        { name: 'Sat', value: 40 },
        { name: 'Sun', value: 30 }
      ]
    }
  ];

  trendSeriesOP = [
    {
      name: 'New',
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
      name: 'Old',
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

  colorScheme = { domain: ['#7375f3', '#eba9f8', '#9ef1a1', '#7498e1', '#ce95f5', '#a1f6d9', '#f7bcd9', '#3b82f6'] };
  colorScheme1 = { domain: ['#bff1f8', '#cbaae1', '#c98dae', '#c4e8e2', '#bb65f5', '#beeede', '#eea6ca', '#3b82f6'] };

  opCards = [
    { label: 'Registraion', value: '148', icon: 'person_add', isApproval: false, iconColor: '#4caeef' },
    { label: 'Appointments', value: '215', icon: 'calendar_today', isApproval: false, iconColor: '#2bb179' },
    { label: 'Appointment Cancelled', value: '2', icon: 'calendar_today', isApproval: false, iconColor: '#2bb179' },
    { label: 'Fllow Up Visits', value: '3', icon: 'calendar_today', isApproval: false, iconColor: '#2bb179' },

    { label: 'Checked In', value: '89', icon: 'input', isApproval: false, iconColor: '#4caeef' },
    { label: 'Checked Out', value: '64', icon: 'exit_to_app', isApproval: false, iconColor: '#2486f5' },
    { label: 'Waiting', value: '25', icon: 'schedule', isApproval: false, iconColor: '#f1b44c' },
    { label: 'ER TO OP', value: '12', icon: 'warning', isApproval: false, iconColor: '#f46a6a' },
    { label: 'OP Bill (Cash)', value: '92', icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
    { label: 'OP Bill (Credit)', value: '56', icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
    // { label: 'REFUND COUNT', value: '4', trend: '-2', trendDiff: 'vs yesterday', history: [8, 5, 7, 4, 6, 6, 4], icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
    { label: 'OP Bill (Due)', value: '0', icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
    { label: 'HCP Count', value: '38', icon: 'local_hospital', isApproval: false, iconColor: '#9566d3' },
    // { label: 'No Show Q', value: '1', icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
    // { label: 'Waiting Time', value: '10',  icon: 'local_hospital', isApproval: false, iconColor: '#9566d3' },



    // { label: 'DISCOUNT APPROVAL', approved: '18', pending: '7', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' },
    // { label: 'REFUND APPROVAL', approved: '3', pending: '1', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
  ];


  opCollection = { total: '4,85,600', cash: '1,85,000', card: '1,42,600', upi: '98,000', bank: '60,000', total1: '1,12,600', Gross: '1,11,000', Discount: '1,22,600', Net: '211,000', Outstanding: '23,2213' };
  opRevenu = { total: '1,12,600', Gross: '1,11,000', Discount: '1,22,600', Net: '211,000', Outstanding: '23,2213' };
  // ICU Occupancy, Critical Patients, LAMA /DAMA Counts. Discharge clearance Avg. Time. IP Bills Cash Credit and Outstanding  


  ipCards = [
    { label: 'TODAY\'S ADMISSIONS', value: '34', icon: 'hotel', isApproval: false, iconColor: '#4caeef' },
    { label: 'CURRENT OCCUPANCY', value: '78%', history: [65, 70, 68, 75, 72, 74, 78], icon: 'domain', isApproval: false, iconColor: '#2bb179' },
    { label: 'ER TO IP', value: '8', trend: '+2', icon: 'warning', isApproval: false, iconColor: '#f46a6a' },
    { label: 'TODAY\'S DISCHARGE', value: '22', icon: 'exit_to_app', isApproval: false, iconColor: '#2bb179' },
    { label: 'DISCHARGE CLEARANCE', value: '18', icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
    { label: 'DISCHARGE PENDING', value: '4', icon: 'schedule', isApproval: false, iconColor: '#f1b44c' },
    { label: 'ICU Occupancy', value: '7', icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
    { label: 'Critical Patients', value: '2', icon: 'replay', isApproval: false, iconColor: '#f46a6a' },
    { label: 'IP Bill (Cash)', value: '45', icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
    { label: 'IP Bill (Credit)', value: '67', icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
    { label: 'REFUND COUNT', value: '2', icon: 'replay', isApproval: false, iconColor: '#f46a6a' },


    // { label: 'DISCOUNT APPROVAL', approved: '12', pending: '5', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' },
    // { label: 'REFUND APPROVAL', approved: '2', pending: '0', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
  ];
  ipCollection = { total: '12,56,000', cash: '3,20,000', card: '4,56,000', upi: '2,80,000', bank: '2,00,000', total1: '1,12,600', Gross: '1,11,000', Discount: '1,22,600', Net: '211,000', Outstanding: '23,2213' };

  pharmacyCards = [
    { label: 'RX CLOSED', value: '124', icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
    { label: 'RX OPEN', value: '31', icon: 'assignment', isApproval: false, iconColor: '#f1b44c' },
    { label: 'WALKING SALES', value: '87', icon: 'shopping_cart', isApproval: false, iconColor: '#4caeef' },
    { label: 'DISCHARGE CLEARANCE', value: '16', icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
    { label: 'DISCHARGE PENDING', value: '6', trend: '-2', icon: 'schedule', isApproval: false, iconColor: '#f46a6a' },
    { label: 'IP ISSUED', value: '52', icon: 'store', isApproval: false, iconColor: '#2486f5' },
    { label: 'IP PENDING', value: '9', icon: 'schedule', isApproval: false, iconColor: '#f46a6a' },
    { label: 'Pharmacy (Cash)', value: '98', icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
    { label: 'Pharmacy (Credit)', value: '43', icon: 'receipt', isApproval: false, iconColor: '#2486f5' },
    { label: 'Expiry Items Counts', value: '98', icon: 'local_atm', isApproval: false, iconColor: '#2bb179' },
    { label: 'Out of Stock Item Counts', value: '43', icon: 'receipt', isApproval: false, iconColor: '#2486f5' },

    // { label: 'DISCOUNT APPROVAL', approved: '8', pending: '3', isApproval: true, approvedIcon: 'check_circle', pendingIcon: 'schedule', iconColor: '#2486f5' }
  ];
  pharmacyCollection = { total: '3,42,500', cash: '1,45,000', card: '98,500', upi: '72,000', bank: '27,000', total1: '1,12,600', Gross: '1,11,000', Discount: '1,22,600', Net: '211,000', Outstanding: '23,2213' };
  procurementCards = [
    { label: 'PO CLOSED', value: '42', icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
    { label: 'PO OPEN', value: '15', icon: 'assignment', isApproval: false, iconColor: '#f46a6a' },
    { label: 'PO Return', value: '42', icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
    { label: 'PO Approval Pending', value: '15', icon: 'assignment', isApproval: false, iconColor: '#f46a6a' },
   { label: 'Without PO GRN Counts', value: '42', icon: 'assignment_turned_in', isApproval: false, iconColor: '#2bb179' },
    { label: 'Vendor Payment Due Counts', value: '15', icon: 'assignment', isApproval: false, iconColor: '#f46a6a' },
    { label: 'RC Counts', value: '1', icon: 'assignment', isApproval: false, iconColor: '#f46a6a' },
   
    { label: 'INDENT ISSUED', value: '28', icon: 'description', isApproval: false, iconColor: '#4caeef' },
    { label: 'INDENT CLOSED', value: '22', icon: 'done_all', isApproval: false, iconColor: '#2bb179' },
    { label: 'INDENT PENDING', value: '6', icon: 'schedule', isApproval: false, iconColor: '#2bb179' },
    { label: 'GRN COUNT', value: '35', trend: '+5', icon: 'local_mall', isApproval: false, iconColor: '#9566d3' },
    { label: 'GRN APPROVAL PENDING', value: '8', icon: 'schedule', isApproval: false, iconColor: '#f46a6a' }
  ];
  procurementCollection = { label: 'GRN VALUE', total: '12.4L', trend: '- 0', trendDiff: 'vs yesterday', trendUp: false, subtitle: '12,40,000' };

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
            name: 'New',
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
            name: 'old',
            series: [
              { name: 'Mon', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Tue', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Wed', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Thu', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Fri', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Sat', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Sun', value: this.DailydashData.trend[0]?.ipd || 0 }
            ]
          },
          {
            name: 'Total',
            series: [
              { name: 'Mon', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Tue', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Wed', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Thu', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Fri', value: this.DailydashData.trend[0]?.ipd || 0 },
              { name: 'Sat', value: this.DailydashData.trend[0]?.ipd || 0 },
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
          this.AgestatusPieChartOP = this.getAgeStatusPieChart()

      }
    }, err => {
      return []
    })


  }

  getAgeStatusPieChart() {

    let totalOccupiedCount = 0;
    const dataLabelsPlugin = {
      id: 'dataLabels',
      afterDatasetDraw: (chart: any) => {
        const { ctx, chartArea } = chart;
        const labels = chart.data.labels;

        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.hidden) {
            meta.data.forEach((element: any, index: number) => {
              const value = dataset.data[index];
              if (value > 0) {
                ctx.save();

                // Get arc properties
                const model = element;
                const centerX = chart.width / 2;
                const centerY = chart.height / 2;

                // Calculate middle angle of the arc
                const startAngle = model.startAngle;
                const endAngle = model.endAngle;
                const midAngle = startAngle + (endAngle - startAngle) / 2;

                // Position in the middle of the arc segment
                const radius = (model.outerRadius + model.innerRadius) / 2;
                const labelX = centerX + Math.cos(midAngle) * radius;
                const labelY = centerY + Math.sin(midAngle) * radius;

                // Calculate percentage
                // const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                // const percentage = Math.round((value / total) * 100);

                // Get label name
                const labelName = labels[index];

                // Custom label text - Option 3: Label name with count and percentage
                const line1Text = labelName;
                // const line2Text = `${value} (${percentage}%)`;
                // console.log("================>>>>>>>..", line1Text, percentage)
                // if (line1Text === 'Age') {
                //     totalOccupiedCount = percentage;
                // }

                // Draw labels with white text and shadow for contrast
                ctx.fillStyle = 'blue';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw label name (e.g., "In use")
                ctx.font = 'bold 13px Inter, sans-serif';
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.lineWidth = 3;
                // ctx.strokeText(line1Text, labelX, labelY - 10);
                ctx.fillText(line1Text, labelX + 10, labelY - 12);

                // Draw count and percentage (e.g., "5 (25%)")
                // ctx.font = 'bold 15px Inter, sans-serif';
                // ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                // ctx.lineWidth = 2.5;
                // ctx.strokeText(line2Text, labelX, labelY + 8);
                // ctx.fillText(line2Text, labelX, labelY + 8);

                ctx.restore();
              }
            });
          }
        });
      }
    };

    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        const { width, height, ctx } = chart;
        ctx.restore();

        // Main percentage text
        // const percentText = `${totalOccupiedCount}%`;
        ctx.font = 'bold 42px Inter, sans-serif';
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const percentX = width / 2;
        const percentY = height / 2 - 10;
        // ctx.fillText(percentText, percentX, percentY);

        // Subtitle text
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = '#6c757d';
        const subtitleY = height / 2 + 25;
        // ctx.fillText('Occupancy', percentX, subtitleY);

        ctx.save();
      }
    };

    if (this.AgestatusPieChartOP) {
      this.AgestatusPieChartOP.destroy();
    }

    return new Chart('AgestatusPieChartOP', {

      type: 'doughnut',
      data: {
        labels: this.modalityData1.map(d => d.name),
        datasets: [
          {
            backgroundColor: ['#e7bdf0', '#92f4f8', '#f685e7', '#6d60f5', '#cdf9a4'],
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
      },
      plugins: [centerTextPlugin, dataLabelsPlugin]
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
        this.DrcountChartOP = this.getDrBarChart();

    });
  }
  getDrBarChart() {
    if (this.DrcountChartOP) {
      this.DrcountChartOP.destroy();
    }


    return new Chart('DrcountChartOP', {
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

  Ipflag: any = "flase"
  selectedTabIndex: number = 0;

  onTabChange(event: MatTabChangeEvent) {
    debugger
    this.selectedTabIndex = event.index;
    if (this.selectedTabIndex == 2)
      this.Ipflag = true
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
      this.dsAppointmentDailyCountList.data = data as OPDCount[];
      console.log(this.dsAppointmentDailyCountList.data)
    });
    this.dashboardService.getOPDBillDatewiseList(vadat).subscribe(data => {
      // this.dsDailyBillList.data = data as OPDBillDateWise[];
      //console.log(this.dsDailyBillList.data)
    });
    this.dashboardService.getOPDDepartmentCountList(vadat).subscribe(data => {
      this.dsOPDailyDepartmentCountList.data = data as OPDBillDateWise[];
      // console.log(this.dsOPDailyDepartmentCountList.data)
    });
    this.dashboardService.getOPDDepartmentBillList(vadat).subscribe(data => {
      this.dsOPDailyDepBillList.data = data as OPDBillDateWise[];
      //console.log(this.dsOPDailyDepBillList.data)
    });
    this.dashboardService.getOPDDoctorCountList(vadat).subscribe(data => {
      this.dsOPDailyDocBillList.data = data as OPDBillDateWise[];
      //console.log(this.dsOPDailyDocBillList.data)
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
        this.dsOPDailyDepartmentCountList.data = apiData

    })
  }


  //dept wise

  get DeptTotalPatient(): number {
    return this.dsOPDailyDepartmentCountList.data.reduce((sum, r) => sum + (r.DeptCount || 0), 0);
  }
  get oldTotalPatient(): number {
    return this.dsAppointmentDailyCountList.data.reduce((sum, r) => sum + (r.OldPatient || 0), 0);
  }
  get NewTotalPatient(): number {
    return this.dsAppointmentDailyCountList.data.reduce((sum, r) => sum + (r.NewPatient || 0), 0);
  }

  get CrossTotalPatient(): number {
    return this.dsAppointmentDailyCountList.data.reduce((sum, r) => sum + (r.ReferPatient || 0), 0);
  }
  get CompanyTotalPatient(): number {
    return this.dsAppointmentDailyCountList.data.reduce((sum, r) => sum + (r.Company || 0), 0);
  }
  //OP
 get OPDeptgross(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.GrossAmt || 0), 0);
  }
 get OPDeptcount(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.GrossAmt || 0), 0);
  }
  get OPDeptdiscount(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.DiscountAmt || 0), 0);
  }
  get OPDeptnet(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.NetAmt || 0), 0);
  }
//IP
 get IPDeptgross(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.GrossAmt || 0), 0);
  }
 get IPDeptcount(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.GrossAmt || 0), 0);
  }
  get IPDeptdiscount(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.DiscountAmt || 0), 0);
  }
  get IPDeptnet(): number {
    return this.dsIPDailyDepBillList.data.reduce((sum, r) => sum + (r.NetAmt || 0), 0);
  }
//phar
  get PharDeptgross(): number {
    return this.dsPharDailyDepBillList.data.reduce((sum, r) => sum + (r.GrossAmt || 0), 0);
  }
 get PharDeptcount(): number {
    return this.dsPharDailyDepBillList.data.reduce((sum, r) => sum + (r.GrossAmt || 0), 0);
  }
  get PharDeptdiscount(): number {
    return this.dsPharDailyDepBillList.data.reduce((sum, r) => sum + (r.DiscountAmt || 0), 0);
  }
  get PharDeptnet(): number {
    return this.dsPharDailyDepBillList.data.reduce((sum, r) => sum + (r.NetAmt || 0), 0);
  }

  get DocTotalPatient(): number {
    return this.dsOPDailyDocBillList.data.reduce((sum, r) => sum + (r.DocPatientCount || 0), 0);
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
  CrossConsult: any;
  Company: any;
  TotalVisitCount: any;

  constructor(OPDCount) {
    {
      this.OldPatient = OPDCount.OldPatient || 0;
      this.NewPatient = OPDCount.NewPatient || 0;
      this.ReferPatient = OPDCount.ReferPatient || 0;
      this.CrossConsult = OPDCount.CrossConsult || 0;
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
  vCount: any
  BillAmount: any
  GrossAmt: any
  DiscountAmt: any
  NetAmt: any
  DocPatientCount: any
  DeptCount: any

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
      this.vCount = OPDBillDateWise.vCount || 0;
      this.BillAmount = OPDBillDateWise.BillAmount || 0;
      this.GrossAmt = OPDBillDateWise.GrossAmt || 0;
      this.DiscountAmt = OPDBillDateWise.DiscountAmt || 0;
      this.NetAmt = OPDBillDateWise.NetAmt || 0;
      this.DocPatientCount = OPDBillDateWise.DocPatientCount || 0;
      this.DeptCount = OPDBillDateWise.DeptCount || 0;


    }
  }
}