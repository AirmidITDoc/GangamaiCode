import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { DoctorShareService } from '../doctor-share.service';
import { MatDrawer } from '@angular/material/sidenav';
import { BillListForDocShrList } from '../doctor-share.component';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ipbill-doctorshare',
  templateUrl: './ipbill-doctorshare.component.html',
  styleUrls: ['./ipbill-doctorshare.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IPBillDoctorshareComponent {

  @ViewChild('drawer') public drawer: MatDrawer;
  isRegIdSelected: boolean = false;
  isDoctorIDSelected: boolean = false;
  isgroupIdSelected: boolean = false;
  DoctorListfilteredOptions: Observable<string[]>;
  filteredOptionsGroup: Observable<string[]>;
  doctorNameCmbList: any = [];
  groupNameList: any = [];
  sIsLoading: string = '';
  PatientListfilteredOptions: any;
  noOptionFound: any;

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  dsAdditionalPay = new MatTableDataSource<BillListForDocShrList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autocompleteModeItem: string = "ConDoctor";
  autocompletedepartment: string = "Department";

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  pBillNo:any="0"
  opipType:any="1"

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  constructor(
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this._DoctorShareService.UserFormGroup.patchValue({
      startdate: oneMonthAgo
    });

  }
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
   ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate1;
     this.gridConfig.columnsList.find(col => col.key === 'opdipdtype')!.template = this.actionsTemplate;
     
    }

  allColumns=[
    { heading: "-", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
     { heading: "-", key: "opdipdtype", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
    { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 25 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    // { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
    
    { heading: "Bill Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount , width: 125},
    { heading: "Discount Amt", key: "ConcessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , width: 125 },
    { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125  },
    { heading: "Doctor Name", key: "admittedDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    // { heading: "Hospital Amt", key: "hospitalAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount , width: 125},
    // { heading: "Doctor Amt", key: "doctorAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount , width: 125},
   
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 }
  ]
  allFilters=[
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "DoctorId", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "OP_IP_TYpe", fieldValue: "0", opType: OperatorComparer.Equals },
  ]
  gridConfig: gridModel = {
    apiUrl: "DoctorPAy/DoctorPayList",
    columnsList: this.allColumns,
    sortField: "DoctorId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.pBillNo = this._DoctorShareService.UserFormGroup.get('PbillNo').value || "0"
    this.opipType = this._DoctorShareService.UserFormGroup.get('OP_IP_Type').value 
    this.getfilterdata();
}

getfilterdata(){
// debugger
let fromD = this._DoctorShareService.UserFormGroup.get("fromDate").value || "";
let toD = this._DoctorShareService.UserFormGroup.get("enddate").value || "";
this.fromDate = fromD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd") : "";
this.toDate = toD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd") : "";
this.DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value

console.log("fromDate:",this.fromDate)
console.log("toDate:",this.toDate)

this.gridConfig = {
    apiUrl: "Doctor/DoctorshareBillList",
    columnsList:this.allColumns , 
    sortField: "DoctorId",
    sortOrder: 0,
    filters:  [
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
      { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.pBillNo, opType: OperatorComparer.Equals },
      { fieldName: "OP_IP_TYpe", fieldValue: this.opipType, opType: OperatorComparer.Equals },
    ]
}
this.grid.gridConfig = this.gridConfig;
this.grid.bindGridData(); 
}

Clearfilter(event) {
  console.log(event)
  if (event == 'PbillNo')
      this._DoctorShareService.UserFormGroup.get('PbillNo').setValue("")
  this.onChangeFirst();
}




  DoctorId = "0";

  ListView(value) {        
    console.log(value)
     if(value.value!==0)
        this.DoctorId=value.value
    else
    this.DoctorId="0"

    this.onChangeFirst();
}

  getValidationMessages() {
    return {
      registrationNo: [],
      ipNo: [],
      opNo: [],
      patientType: [],

    };
  }

  viewDocShareSummaryReport() {
    
    
  }
  viewDocShareReport() {
    
   
  }
 isDatePckrDisabled: boolean = false;
  // NewDocShare() {
  //   const dialogRef = this._matDialog.open(DoctorShareListComponent,
  //     {
  //         maxWidth: "85vw",
  //     height: "45%",
  //     width: "100%",
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.onChangeFirst()
  //   });
  // }

  //   Additiondocpay() {
  //   const dialogRef = this._matDialog.open(AdditionDocpayComponent,
  //     {
  //         maxWidth: "85vw",
  //     height: "65%",
  //     width: "100%",
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.onChangeFirst()
  //   });
  // }

  // processDocShare() {
  //   const dialogRef = this._matDialog.open(ProcessDoctorShareComponent,
  //     {
  //       maxWidth: "45vw",
  //       maxHeight: '35%',
  //       width: '35%',
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed - Insert Action', result);
  //   });
  // }
  onClear() {
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}

