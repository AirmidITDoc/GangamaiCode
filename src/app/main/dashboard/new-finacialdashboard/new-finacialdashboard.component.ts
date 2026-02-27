import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DashboardService } from '../dashboard.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { WordCount } from 'ckeditor5';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServiceGraphComponent } from './service-graph/service-graph.component';
import { DrwisecollectionComponent } from './drwisecollection/drwisecollection.component';
import { OPIPCollectiongraphComponent } from './opipcollectiongraph/opipcollectiongraph.component';
import { PharCollecionGraphComponent } from './phar-collecion-graph/phar-collecion-graph.component';
import { VisitDatagraphComponent } from './visit-datagraph/visit-datagraph.component';
import { BedstausgraphComponent } from './bedstausgraph/bedstausgraph.component';
import { BillingSummarygraphComponent } from './billing-summarygraph/billing-summarygraph.component';
import { ServiceReceiptGraphComponent } from './service-receipt-graph/service-receipt-graph.component';



type PatientTypeRow = {
  typeOfPatient: string;
  ip: number;
  op: number;
};


type ReceiptSummaryRow = {
  label: string;
  amount: number;

};

type ModeSummaryRow = {
  label: string;
  amount: number;
};

type CollectionRow = {
  mode: string;
  amount: number;
};
@Component({
  selector: 'app-new-finacialdashboard',
  templateUrl: './new-finacialdashboard.component.html',
  styleUrls: ['./new-finacialdashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewFinacialdashboardComponent {

  //   fromDate: Date = new Date(2026, 0, 27);
  // toDate: Date = new Date(2026, 0, 27);

   fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


  myFilterform:FormGroup
  username = ''
  UnitId: any = this._accountServices.currentUserValue.user.unitId;
  constructor(
    public _dashboardServices: DashboardService,
    public _accountServices: AuthenticationService,
    private router: Router,    public _matDialog: MatDialog,
    public datePipe: DatePipe,

  ) { }
  AppoinmentCount: any;
  TotalAdmittedCount: any;
  TotalSelf: any;
  TotalCompany: any;
  TodayAdmittedCount: any;
  TodayDischargeCount: any;
  TodaySelf: any;
  TodayOther: any;
opippharmacyTotalprofit: any;
  opippharmacyTotal: any;

  wardHeadCount = new MatTableDataSource<WardCount>();
  charges = new MatTableDataSource<Servicecharge>();

  opVisits = new MatTableDataSource<Visitdata>();
  referrals = new MatTableDataSource<referralsWise>();
  Billingsummary = new MatTableDataSource<Billingsummarydata>();
   OPcollection = new MatTableDataSource<Billingsummarydata>();
   IPcollection = new MatTableDataSource<Billingsummarydata>();
  consultantCharges = new MatTableDataSource<consultantChargesdata>();
  drallCollection = new MatTableDataSource<consultantChargesdata>();
  packages = new MatTableDataSource<packagesdata>();
  finOPIPPayment = new MatTableDataSource<Servicecharge>();
  receipts = new MatTableDataSource<Servicecharge>();
  receipt = new MatTableDataSource<Servicecharge>();
  advanceOPIP = new MatTableDataSource<Servicecharge>();
  refundOPIP = new MatTableDataSource<Servicecharge>();
  pharmacyReturn = new MatTableDataSource<Servicecharge>();


  pharmacyop = new MatTableDataSource<pharmacyopsales>();
  pharmacyip = new MatTableDataSource<pharmacyipsales>();

  finaladvance = new MatTableDataSource<Advance>();
  finalOutstanding = new MatTableDataSource<Advance>();
  finalOutstandingwithdate = new MatTableDataSource<Advance>();
Insuranceds= new MatTableDataSource<Insurance>();

  ngOnInit(): void {
    this.myFilterform=this._dashboardServices.filterFormfinance();
    this.username = this._accountServices.currentUserValue.userName
      ? this._accountServices.currentUserValue.userName
      : '';


    // Initialize all charts after view is loaded
    setTimeout(() => {
      // this.initializeCharts();
    }, 500);

    this.getwardpatientList()

  }

  wardHeadCountColumns: string[] = ['wardName', 'occupancyPct', 'patients'];
  pharmacyopsalesColumns: string[] = ['Total Sales', 'Toal Cost', 'Profit'];
  chargesColumns: string[] = ['serviceName', 'ip', 'op'];
  receiptsColumns: string[] = ['serviceName', 'ip', 'op'];
  IpCollColumns: string[] = ['groupName', 'totalAmount'];
OpCollColumns: string[] = ['groupName', 'totalAmount'];


  opVisitColumns: string[] = ['typeOfVisit', 'patients'];

  patientTypeColumns: string[] = ['typeOfPatient', 'ip', 'op'];
  patientTypes: PatientTypeRow[] = [
    { typeOfPatient: 'New', ip: 0, op: 0 },
    { typeOfPatient: 'Existing', ip: 0, op: 0 },
  ];

  referralColumns: string[] = ['referredBy', 'ipPatients', 'opPatients'];
  AdvoutsandingColumns: string[] = ['IP(DIS)', 'OP', 'Total'];
  InsuranceColumns: string[] = ['Approved Amount', 'Unadjusted Advance', 'Unpaid Ip Charges','Insurancy Adequecy'];

  AdvadequcyColumns: string[] = ['Unadjusted Advance', 'Unpaid Ip Charges', 'Adequecy Advance'];

  receiptSummary: ReceiptSummaryRow[] = [
    { label: 'Receipt', amount: 0 },
    { label: 'Advance', amount: 0 },
    { label: 'Return', amount: 0 },
    { label: 'Refund', amount: 0 },
  ];

  modeSummary: ModeSummaryRow[] = [
    { label: 'Cash', amount: 0 },
    { label: 'Card', amount: 0 },
  ];

  collection: CollectionRow[] = [
    { mode: 'Cash', amount: 0 },
    { mode: 'Cheque', amount: 0 },
    { mode: 'Card', amount: 0 },
    { mode: 'EFT', amount: 0 },
    { mode: 'ECS', amount: 0 },
  ];


  //  collection: CollectionRow[] = [
  //   { mode: 'Cash', amount: 0 },
  //   { mode: 'Cheque', amount: 0 },
  //   { mode: 'Card', amount: 0 },
  //   { mode: 'EFT', amount: 0 },
  //   { mode: 'ECS', amount: 0 },
  // ];


  consultantChargeColumns: string[] = ['consultantName', 'patients', 'charges','doctorShare'];
  DrcollectionColumns: string[] = ['consultantName', 'patients', 'charges'];
  packageColumns: string[] = ['packageName', 'patients'];
  // packages: PackageDetailRow[] = [];

  onGo(): void {
    // Dummy for now; later this will call the API based on fromDate/toDate.
     this.getwardpatientList()
  }

  get wardTotalPatients(): number {
    return this.wardHeadCount.data.reduce((sum, r) => sum + r.occupiedBeds, 0);
  }
  get chargesTotalIp(): number {
    return this.charges.data.reduce((sum, r) => sum + (r.ipCollection || 0), 0);
  }
  get chargesTotalOp(): number {
    return this.charges.data.reduce((sum, r) => sum + (r.opCollection || 0), 0);
  }
  get chargesDiscountIp(): number {
    return this.charges.data.reduce((sum, r) => sum + (r.ipDiscount || 0), 0);
  }
  get chargesDiscountOp(): number {
    return this.charges.data.reduce((sum, r) => sum + (r.opDiscount || 0), 0);
  }

  get chargesNetIp(): number {
    return this.chargesTotalIp - (this.chargesDiscountIp || 0);
  }
  get chargesNetOp(): number {
    return this.chargesTotalOp - (this.chargesDiscountOp || 0);
  }

  get receiptsTotalIp(): number {
    return this.receipts.data.reduce((sum, r) => sum + (r.ipCollection || 0), 0);
  }
  get receiptsTotalOp(): number {
    return this.receipts.data.reduce((sum, r) => sum + (r.opCollection || 0), 0);
  }

  get receiptsDiscountOp(): number {
    return this.receipts.data.reduce((sum, r) => sum + (r.opDiscount || 0), 0);
  }
  get receiptsDiscountIp(): number {
    return this.receipts.data.reduce((sum, r) => sum + (r.ipDiscount || 0), 0);
  }
  get receiptsNetIp(): number {
    return this.receiptsTotalIp - (this.receiptsDiscountIp || 0);
  }
  get receiptsNetOp(): number {
    return this.receiptsTotalOp - (this.receiptsDiscountOp || 0);
  }



  get opTotalPatients(): number {
    return this.opVisits.data.reduce((sum, r) => sum + r.patientCount, 0);
  }

  //phar
   get pharmacyoptotal(): number {
    return this.pharmacyop.data.reduce((sum, r) => sum + r.opNetAmount, 0);
  }

  get pharmacyiptotal(): number {
    return this.pharmacyip.data.reduce((sum, r) => sum + r.ipNetAmount, 0);
  }

 get pharmacyoptotalprofit(): number {
    return this.pharmacyop.data.reduce((sum, r) => sum + r.oPprofitamount, 0);
  }

  get pharmacyiptotalprofit(): number {
    return this.pharmacyip.data.reduce((sum, r) => sum + r.iPprofitamount, 0);
  }


  // billingTotalCharges=0
  get billingTotalCharges(): number {
    return this.receiptSummaryTotal;
  }

  get receiptSummaryTotal(): number {
    return this.receiptSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  // receiptSummaryTotal=0
  // get receiptamount(): number {
  //   return this.receipt.data.reduce((sum, r) => sum + (r.receipt || 0), 0);
  // }


  get modeSummaryTotal(): number {
    return this.modeSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  get collectionTotal(): number {
    return this.collection.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

   get drcollTotal(): number {
    return this.drallCollection.data.reduce((sum, r) => sum + (r.totalBusiness || 0), 0);
  }

     get optotalcollecion(): number {
    return this.OPcollection.data.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  }

     get iptotalcollecion(): number {
    return this.IPcollection.data.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  }

  get totalpatientCount(): number {
    return this.packages.data.reduce((sum, r) => sum + (r.patientCount || 0), 0);
  }

  

  get getcashtotal(): number {
    return this.Billingsummary.data.reduce((sum, r) => sum + (r.cash || 0), 0);
  }

  get getcardtotal(): number {
    return this.Billingsummary.data.reduce((sum, r) => sum + (r.cardPay || 0), 0);
  }


get pcount(): number {
    return this.consultantCharges.data.reduce((sum, r) => sum + (r.patientCount || 0), 0);
  }
  
  get totalcharges(): number {
    return this.consultantCharges.data.reduce((sum, r) => sum + (r.opCollection || 0), 0);
  }

  get totalshare(): number {
    return this.consultantCharges.data.reduce((sum, r) => sum + (r.doctorShare || 0), 0);
  }

  Financedata: any
  BillNetAmt=0

  getwardpatientList() {
    
    var vadat = {
      "UnitId": this.UnitId,
      'FromDate':this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
      'ToDate': this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',
    }
    this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {

      this.Financedata = data;
      console.log(data)
      this.wardHeadCount.data = this.Financedata.bedOccupancyCountSummary;
      console.log(this.wardHeadCount.data)

      this.charges.data = this.Financedata.serviceCharges
      console.log(this.charges.data)

      this.receipts.data = this.Financedata.receiptPayment;
      console.log(this.receipts.data)


      this.opVisits.data = this.Financedata.typeOfVisit;
      console.log(this.opVisits.data)

      this.referrals.data = this.Financedata.ipRefDoctorCount;
      console.log(this.referrals.data)

      this.Billingsummary.data = this.Financedata.billSummary;
      console.log(this.Billingsummary.data)


      this.receipt.data = this.Financedata.receiptOPIP;

      if (this.Financedata.financialOPExistingPatientCount) {
        this.patientTypes[0].op = this.Financedata.financialOPExistingPatientCount[0]['opNewPatientCount']
        this.patientTypes[1].op = this.Financedata.financialOPExistingPatientCount[0]['opExistingPatientCount']

        this.patientTypes[0].ip = this.Financedata.financialIPExistingPatientCount[0]['ipNewPatientCount']
        this.patientTypes[1].ip = this.Financedata.financialIPExistingPatientCount[0]['ipExistingPatientCount']
      }
      

      if (this.Financedata.receiptOPIP) {
        console.log()
        this.receiptSummary[0].amount = this.Financedata.receiptOPIP[0]['receipt']
        this.receiptSummary[1].amount = this.Financedata.advanceOPIP[0]['advance']
        this.receiptSummary[2].amount = this.Financedata.refundOPIP[0]['refund']
        this.receiptSummary[3].amount = this.Financedata.pharmacyReturn[0]['return1']

      }


      this.modeSummary[0].amount = this.getcashtotal
      this.modeSummary[1].amount = this.getcardtotal


      if (this.Financedata.billSummary) {
        this.collection[0].amount = this.Financedata.billSummary[0]['cash']
        this.collection[1].amount = this.Financedata.billSummary[0]['cheque']
        //  this.collection[2].amount =this.Financedata.billSummary[0]['neft']
        this.collection[2].amount = this.Financedata.billSummary[0]['cardPay']
        this.collection[3].amount = this.Financedata.billSummary[0]['upi']
      }


      this.BillNetAmt=this.collection[0].amount + this.collection[1].amount -  this.receiptSummary[2].amount - this.receiptSummary[3].amount

      this.consultantCharges.data = this.Financedata.doctorWisePatientCount;
      console.log(this.consultantCharges.data)


      this.pharmacyop.data = this.Financedata.pharmacySaleOP;
      this.pharmacyip.data = this.Financedata.pharmacySaleIP;

      console.log(this.Financedata.pharmacySaleOP)
      console.log(this.Financedata.pharmacySaleIP)

      this.opippharmacyTotal=(this.pharmacyiptotal + this.pharmacyoptotal).toFixed(2)


      this.opippharmacyTotalprofit=(this.pharmacyoptotalprofit + this.pharmacyiptotalprofit).toFixed(2)
      this.finalOutstanding.data = this.Financedata.financialOutStandingOPIP;

      //dr

      debugger
      this.drallCollection.data = this.Financedata.doctorWiseTotalBusiness;
      this.OPcollection.data = this.Financedata.groupWiseCollectionOP;
      this.IPcollection.data = this.Financedata.groupWiseCollectionIP;


      

      this.packages.data = this.Financedata.packagePatientCount;
      console.log(this.packages.data)

    });

  }
drcollectionTrend() {
   this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
       this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
      
      const dialogRef = this._matDialog.open(DrwisecollectionComponent,
        {
          maxWidth: "90vw",
          height: '70%',
          width: '90%',
          data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
        });
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }


    serviceTrend() {

       this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
       this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
      
      const dialogRef = this._matDialog.open(ServiceGraphComponent,
        {
          maxWidth: "90vw",
          height: '70%',
          width: '90%',
          data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
        });
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }

     OPIPCollectionTrend() {

       this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
       this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
      
      const dialogRef = this._matDialog.open(OPIPCollectiongraphComponent,
        {
          maxWidth: "90vw",
          height: '70%',
          width: '90%',
          data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
        });
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }
    PharCollectionTrend() {

       this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
       this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
      
      const dialogRef = this._matDialog.open(PharCollecionGraphComponent,
        {
          maxWidth: "90vw",
          height: '70%',
          width: '90%',
          data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
        });
      dialogRef.afterClosed().subscribe(result => {
        
      });
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

    wardTrend() {

       this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
       this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
      
      const dialogRef = this._matDialog.open(BedstausgraphComponent,
        {
          maxWidth: "90vw",
          height: '70%',
          width: '90%',
          data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
        });
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }

      BillingTrend() {

       this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
       this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
      
      const dialogRef = this._matDialog.open(BillingSummarygraphComponent,
        {
          maxWidth: "90vw",
          height: '70%',
          width: '90%',
          data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
        });
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }


    
      ServiceReceiptTrend() {

       this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
       this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")
      
      const dialogRef = this._matDialog.open(ServiceReceiptGraphComponent,
        {
          maxWidth: "90vw",
          height: '70%',
          width: '90%',
          data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
        });
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }
}



export class WardCount {
  wardName: any;
  occupancyPercent: any;
  occupiedBeds: any;


  constructor(WardCount) {
    {
      this.wardName = WardCount.wardName || '';
      this.occupancyPercent = WardCount.occupancyPercent || 0;
      this.occupiedBeds = WardCount.occupiedBeds || 0;


    }
  }
}
export class Servicecharge {
  serviceName: any;
  opTotalAMT: any;
  opDiscount: any;
  // opCollection: any;
  ipTotalAMT: any;
  ipDiscount: any;
  IPCollection: any;

  opCollection: any;
  ipCollection: any;
  receipt: any;
  advance: any;
  refund: any;
  constructor(Servicecharge) {
    {
      this.serviceName = Servicecharge.serviceName || '';

      this.opTotalAMT = Servicecharge.opTotalAMT || 0;
      this.opDiscount = Servicecharge.opDiscount || 0;
      // this.OPCollection = Servicecharge.OPCollection || 0;
      this.ipTotalAMT = Servicecharge.ipTotalAMT || 0;
      this.ipDiscount = Servicecharge.ipDiscount || 0;
      this.IPCollection = Servicecharge.IPCollection || 0;
      this.opCollection = Servicecharge.opCollection || 0;
      this.ipCollection = Servicecharge.ipCollection || 0;
      this.receipt = Servicecharge.receipt || 0;
      this.advance = Servicecharge.advance || 0;
      this.refund = Servicecharge.refund || 0;

    }
  }
}

export class Visitdata {
  typeOFVisit: any;
  patientCount: any;
  opNewPatientCount: any;
  opExistingPatientCount: any;
  ipNewPatientCount: any;
  ipExistingPatientCount: any;
  constructor(Visitdata) {
    {
      this.typeOFVisit = Visitdata.typeOFVisit || '';
      this.patientCount = Visitdata.patientCount || 0;
      this.opNewPatientCount = Visitdata.opNewPatientCount || 0;
      this.opExistingPatientCount = Visitdata.opExistingPatientCount || 0;
      this.ipNewPatientCount = Visitdata.ipNewPatientCount || 0;
      this.ipExistingPatientCount = Visitdata.ipExistingPatientCount || 0;
    }
  }
}


export class referralsWise {
  refName: any;
  opRefCount: any;
  ipRefCount: any;
  constructor(referralsWise) {
    {
      this.refName = referralsWise.refName || '';
      this.opRefCount = referralsWise.opRefCount || 0;
      this.ipRefCount = referralsWise.ipRefCount || 0;


    }
  }
}

export class Billingsummarydata {
  cash: any;
  cardPay: any;
  neft: any;
  cheque: any;
  upi: any;
  usedAdvance: any;
  amount: any
  totalAmount: any

  constructor(Billingsummarydata) {
    {
      this.cash = Billingsummarydata.cash || '';

      this.cardPay = Billingsummarydata.cardPay || 0;
      this.neft = Billingsummarydata.neft || 0;
      this.cheque = Billingsummarydata.cheque || 0;
      this.upi = Billingsummarydata.upi || 0;
      this.usedAdvance = Billingsummarydata.usedAdvance || 0;
      this.amount = Billingsummarydata.amount || 0;
      this.totalAmount = Billingsummarydata.totalAmount || 0;

    }
  }
}

export class consultantChargesdata {
  doctorName: any;
  patientCount: any;
  opCollection: any;
totalBusiness: any;
doctorShare: any;

  constructor(consultantChargesdata) {
    {
      this.doctorName = consultantChargesdata.doctorName || '';

      this.patientCount = consultantChargesdata.patientCount || 0;
      this.opCollection = consultantChargesdata.opCollection || 0;
 this.totalBusiness = consultantChargesdata.totalBusiness || 0;
this.doctorShare = consultantChargesdata.doctorShare || 0;

    }
  }
}


export class packagesdata {
  packageName: any;
  patients: any;
  patientCount: any;
  constructor(packages) {
    {
      this.packageName = packages.packageName || '';

      this.patients = packages.patients || 0;

      this.patientCount = packages.patientCount || 0;

    }
  }
}

export class pharmacyopsales {
  opTotalLandedAmount: any;
  opNetAmount: any;
  oPprofitamount: any;
  constructor(pharmacyopsales) {
    {
      this.opTotalLandedAmount = pharmacyopsales.opTotalLandedAmount || '0';

      this.opNetAmount = pharmacyopsales.opNetAmount || 0;
      this.oPprofitamount = pharmacyopsales.oPprofitamount || 0;

    }
  }
}
export class pharmacyipsales {
  ipTotalLandedAmount: any;
  ipNetAmount: any;
  iPprofitamount: any;
  constructor(pharmacyopsales) {
    {
      this.ipTotalLandedAmount = pharmacyopsales.ipTotalLandedAmount || '0';

      this.ipNetAmount = pharmacyopsales.ipNetAmount || 0;
      this.iPprofitamount = pharmacyopsales.iPprofitamount || 0;

    }
  }
}
export class Advance {
  unadjestAdvance: any;
  opOustandingAMT: any;
  totalOutstanding: any;

  opOustandingAMTDate: any;
  ipOutstandingAMTDate: any;
  totalOutstandingdate: any;
  constructor(Advance) {
    {
      this.unadjestAdvance = Advance.unadjestAdvance || '0';
      this.opOustandingAMT = Advance.opOustandingAMT || 0;
      this.totalOutstanding = Advance.totalOutstanding || 0;
      this.opOustandingAMTDate = Advance.opOustandingAMTDate || '0';
      this.ipOutstandingAMTDate = Advance.ipOutstandingAMTDate || 0;
      this.totalOutstandingdate = Advance.totalOutstandingdate || 0;
    }
  }
}
export class Insurance {
  IPApprovedAmount: any;
  IPUnpaidCharges: any;
  UnadjestedAdvance: any;

  InsuranceAdequancy: any;

  constructor(Insurance) {
    {
      this.IPApprovedAmount = Insurance.IPApprovedAmount || '0';
      this.IPUnpaidCharges = Insurance.IPUnpaidCharges || 0;
      this.UnadjestedAdvance = Insurance.UnadjestedAdvance || 0;
      this.InsuranceAdequancy = Insurance.InsuranceAdequancy || '0';
      
    }
  }
}

