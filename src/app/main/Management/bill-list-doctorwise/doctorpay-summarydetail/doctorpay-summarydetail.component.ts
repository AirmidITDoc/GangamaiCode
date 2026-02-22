import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { BillDoctorwiseService } from '../bill-doctorwise.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { fuseAnimations } from '@fuse/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-doctorpay-summarydetail',
  templateUrl: './doctorpay-summarydetail.component.html',
  styleUrls: ['./doctorpay-summarydetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DoctorpaySummarydetailComponent {

  registerObj: any;

  DoctorId = "0"
  doctorName: any;
  Pbillno: any;
  sIsLoading: string = '';
  fromDate: any;
  toDate: any;
  tdsamount = 0

  displayedColumns: string[] = [
    'select',
    //'addChargeDrName',
    'pBillNo',
    'patientName',
    'serviceName',
    'netAmount',
    'docAmt',
    'hospitalAmt',
    'refundAmount',
    'lbl'

  ]

  Billdetaildatasource = new MatTableDataSource<BillListForDocShrList>();
  @ViewChild('drawer') public drawer: MatDrawer;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  dsAdditionalPay = new MatTableDataSource<BillListForDocShrList>();

  ProcessForm: FormGroup
  constructor(
    public _DoctorShareService: BillDoctorwiseService,
    public datePipe: DatePipe, private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    debugger
    this.ProcessForm = this.createDoctorsharensertForm();
    this.ProcessForm.markAllAsTouched();
    this.ProcessdetailArray.push(this.createdetailForm());
    this._DoctorShareService.UserFormGroup.patchValue({
      startdate: oneMonthAgo
    });

    if (this.data) {
      console.log(this.data)
      this.fromDate = this.data.fromDate
      this.toDate = this.data.toDate

      // this.doctorName = this.data.addChargeDrName
      // debugger Add Doctor
      this.DoctorId = this.data.obj.doctorId || 1
      this.getBilldetailList()
    }
  }

  createDoctorsharensertForm(): FormGroup {
   return this.formBuilder.group({
            doctorPayoutProcess: this.formBuilder.group({
      doctorPayoutId: 0,
      doctorId: [this.DoctorId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      processStartDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      processEndDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      processDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),

      netAmount: [this.TotNetamt, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      doctorAmount: [this.TotDocAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      hospitalAmount: [this.TothospitalAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      tdsamount: [0],
     
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]]
       }),
       doctorPayoutProcessDetail: this.formBuilder.array([])
  });
    }

  createdetailForm(item: any = {}): FormGroup {
    debugger
    return this.formBuilder.group({
      doctorPayoutDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorPayoutId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [this.DoctorId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargeId: [item.chargesId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }

  get ProcessdetailArray(): FormArray {
    return this.ProcessForm.get('doctorPayoutProcessDetail') as FormArray;
  }



  getBilldetailList() {

    var vdata = {
      "first": 0,
      "rows": 999,
      "sortField": "DoctorId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.DoctorId),
          "opType": "Equals"
        },
        {
          "fieldName": "FromDate",
          "fieldValue": this.fromDate,// this.fromDate,
          "opType": "Equals"
        },
        {
          "fieldName": "ToDate",
          "fieldValue": this.toDate,

          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    debugger
    this._DoctorShareService.getSummarydetailList(vdata).subscribe(data => {
      this.Billdetaildatasource.data = data.data as BillListForDocShrList[]
      this.Billdetaildatasource.sort = this.sort
    this.Billdetaildatasource.paginator = this.paginator
      console.log(this.Billdetaildatasource.data)
      if (this.Billdetaildatasource.data.length > 0) {
        debugger
        this.doctorName = this.Billdetaildatasource.data[0].addChargeDrName
        this.Pbillno = this.Billdetaildatasource.data[0].pBillNo
        this.getsumdetail()
      }
    })
  }

  TotAmt = 0
  TotconAmt = 0
  TotNetamt = 0
  TotDocAmt = 0
  TothospitalAmt = 0
  count = 0

  getsumdetail() {
    this.count = this.Billdetaildatasource.data.length
    this.TotNetamt = this.Billdetaildatasource.data.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);

    this.TotDocAmt = this.Billdetaildatasource.data.reduce((sum, { docAmt }) => sum += +(docAmt || 0), 0);
    this.TothospitalAmt = this.Billdetaildatasource.data.reduce((sum, { hospitalAmt }) => sum += +(hospitalAmt || 0), 0);

  }

  calculateshare() {
    //  if (!this.MlcInfoFormGroup.invalid) {
    // console.log(this.MlcInfoFormGroup.value)
    var data = {}
    this._DoctorShareService.DoctorCalculateshare(data).subscribe((response) => {
      console.log(response)

    });
    // } 


  }
  resultSource = [];
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.Billdetaildatasource.data.length;

    return numSelected === numRows;
  }


  masterToggle() {
    // Toggle selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.Billdetaildatasource.data.forEach(row => this.selection.select(row));
    }

    console.log('Selected items count:', this.selection.selected.length);

    this.resultSource = [...this.selection.selected];
    console.log('Selected items:', this.resultSource);
  }


  isSomeSelected() {
    console.log(this.selection.selected);
    console.log(this.resultSource);
    return this.selection.selected.length > 0;
  }

  selection = new SelectionModel<BillListForDocShrList>(true, []);
  Save() {

    console.log(this.selection.selected);
    console.log(this.resultSource);
    if (this.selection.selected.length == 0) {
      this.toastr.warning('CheckBox Select !', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    
debugger
    this.ProcessForm.get('doctorPayoutProcess.doctorId').setValue(this.DoctorId)
    this.ProcessForm.get('doctorPayoutProcess.netAmount').setValue(this.TotNetamt)
    this.ProcessForm.get('doctorPayoutProcess.doctorAmount').setValue(this.TotDocAmt)
    this.ProcessForm.get('doctorPayoutProcess.hospitalAmount').setValue(this.TothospitalAmt)
    this.ProcessForm.get('doctorPayoutProcess.tdsamount').setValue(this.tdsamount)

  this.ProcessdetailArray.clear();
    this.selection.selected.forEach(item => {
      this.ProcessdetailArray.push(this.createdetailForm(item));
    });
    console.log(this.ProcessForm.value)
    if (!this.ProcessForm.invalid) {

      // var Data = {
      //   doctorPayoutProcess: this.ProcessForm.value
      // }
      console.log(this.ProcessForm.value)
      this._DoctorShareService.ProcessShareSave(this.ProcessForm.value).subscribe(response => {
        console.log(response)

        this.onClose();
      });
    } else {
      let invalidFields = [];

      if (this.ProcessForm.invalid) {
        for (const controlName in this.ProcessForm.controls) {
          if (this.ProcessForm.controls[controlName].invalid) {
            invalidFields.push(`process Share Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }
  onClose() {
    this._matDialog.closeAll()
  }
}


export class BillListForDocShrList {

  PatientName: string;
  TotalAmt: number;
  ConAmt: number;
  NetAmt: number;
  PBillNo: number;
  // BillNo: number;
  admittedDoctorName: string;
  PatientType: number;
  CompanyName: string;
  IsBillShrHold: boolean;
  GroupName: any;
  price: any;
  qty: any;
  totalAmt: any;
  concessionAmount: any;
  netAmount: any;
  doctorName: any;
  docAmt: any;
  hospitalAmt: any;
  addChargeDrName: any;
  chargesId: any;
  chargeId: any;
  pBillNo: any;
  serviceName: any;
  refundAmount: any;
  patientName: any;
  companyName: any;
  lbl: any;
  isDoctorShareGenerated: any;

  constructor(BillListForDocShrList) {

    this.PatientName = BillListForDocShrList.PatientName;
    this.TotalAmt = BillListForDocShrList.TotalAmt || 0;
    this.ConAmt = BillListForDocShrList.ConAmt || '0';
    this.NetAmt = BillListForDocShrList.NetAmt || 0;
    this.PBillNo = BillListForDocShrList.PBillNo || 0;
    //this.BillNo= BillListForDocShrList.BillNo|| 0;
    this.admittedDoctorName = BillListForDocShrList.admittedDoctorName;
    this.PatientType = BillListForDocShrList.PatientType || 0;
    this.CompanyName = BillListForDocShrList.CompanyName;
    this.IsBillShrHold = BillListForDocShrList.IsBillShrHold || 0;
    this.GroupName = BillListForDocShrList.GroupName || '';


    this.price = BillListForDocShrList.price || 0;
    this.qty = BillListForDocShrList.qty || 0;
    this.totalAmt = BillListForDocShrList.totalAmt || 0;
    this.concessionAmount = BillListForDocShrList.concessionAmount || 0;
    this.netAmount = BillListForDocShrList.netAmount || 0;
    this.doctorName = BillListForDocShrList.doctorName || '';
    this.docAmt = BillListForDocShrList.docAmt || 0;
    this.hospitalAmt = BillListForDocShrList.hospitalAmt || 0;
    this.addChargeDrName = BillListForDocShrList.addChargeDrName || '';
    this.chargesId = BillListForDocShrList.chargesId || 0;

    this.pBillNo = BillListForDocShrList.pBillNo || 0;
    this.serviceName = BillListForDocShrList.serviceName || '';
    this.refundAmount = BillListForDocShrList.refundAmount || 0;
    this.patientName = BillListForDocShrList.patientName || 0;
    this.companyName = BillListForDocShrList.companyName || 0;
    this.lbl = BillListForDocShrList.lbl || '';
    this.isDoctorShareGenerated = BillListForDocShrList.isDoctorShareGenerated || 0;
    this.chargeId = BillListForDocShrList.chargeId || 0;

  }
}



