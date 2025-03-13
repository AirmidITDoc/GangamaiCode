import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AdministrationService } from '../administration.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DoctorShareService } from './doctor-share.service';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddDoctorShareComponent } from './add-doctor-share/add-doctor-share.component';
import { MatDrawer } from '@angular/material/sidenav';
import { ProcessDoctorShareComponent } from './process-doctor-share/process-doctor-share.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-doctor-share',
  templateUrl: './doctor-share.component.html',
  styleUrls: ['./doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorShareComponent implements OnInit {
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

  gridConfig: gridModel = {
    apiUrl: "CurrencyMaster/List",
    columnsList: [
      { heading: "-", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "PBillNo", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "PatientName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "BillAmt", key: "address", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DiscountAmt", key: "City", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "NetAmt", key: "Age", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DoctorName", key: "PhoneNo", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "PatientType", key: "oPBILL", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "CompanyName", key: "oPReceipt", sort: true, align: 'left', emptySign: 'NA' }
    ],
    sortField: "firstName",
    sortOrder: 0,
    filters: [
      { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
      { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    ]
  }

  gridConfig1: gridModel = {
    apiUrl: "CurrencyMaster/List",
    columnsList: [
      { heading: "-", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "PBillNo", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "PatientName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "BillAmt", key: "address", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DiscountAmt", key: "City", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "NetAmt", key: "Age", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "DoctorName", key: "PhoneNo", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "PatientType", key: "oPBILL", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "CompanyName", key: "oPReceipt", sort: true, align: 'left', emptySign: 'NA' }
    ],
    sortField: "firstName",
    sortOrder: 0,
    filters: [
      { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
      { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    ]
  }
  data: any;

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    // let that = this;
    // const dialogRef = this._matDialog.open(NewconfigComponent,
    //     {
    //         maxWidth: "95vw",
    //         height: '95%',
    //         width: '95%',
    //         data: row
    //     });
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //         that.grid.bindGridData();
    //     }
    // });
  }

  itemId = 0;
  selectChangeItem(obj: any) {
    console.log(obj);
    this.itemId = obj
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
    
    this.sIsLoading = 'loading-data';
    let FromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("startdate").value, "MM-dd-yyyy") || "01/01/1900";
    let ToDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("enddate").value, "MM-dd-yyyy") || "01/01/1900";
    let DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value.DoctorId || 0;

    console.log(FromDate)
    console.log(ToDate)
    console.log(DoctorId)
    setTimeout(() => {
      this._DoctorShareService.getPdfDocShareSummaryRpt(FromDate, ToDate, DoctorId).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Doctor Share Summary"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
      });

    }, 100);
  }
  viewDocShareReport() {
    
    this.sIsLoading = 'loading-data';
    let FromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("startdate").value, "MM-dd-yyyy") || "01/01/1900";
    let ToDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("enddate").value, "MM-dd-yyyy") || "01/01/1900";
    let DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value.DoctorId || 0;

    console.log(FromDate)
    console.log(ToDate)
    console.log(DoctorId)
    setTimeout(() => {
      this._DoctorShareService.getPdfDocShareRpt(FromDate, ToDate, DoctorId).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Doctor Share Report"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
      });

    }, 100);
  }

  NewDocShare() {
    const dialogRef = this._matDialog.open(AddDoctorShareComponent,
      {
        maxWidth: "75vw",
        maxHeight: '90vh',
        width: '100%',
        height:'100%'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  processDocShare() {
    const dialogRef = this._matDialog.open(ProcessDoctorShareComponent,
      {
        maxWidth: "45vw",
        maxHeight: '35%',
        width: '35%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
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


export class BillListForDocShrList {

  PatientName: string;
  TotalAmt: number;
  ConAmt: number;
  NetAmt: number;
  PBillNo: number;
  // BillNo: number;
  AdmittedDoctorName: string;
  PatientType: number;
  CompanyName: string;
  IsBillShrHold: boolean;
  GroupName: any;
  constructor(BillListForDocShrList) {

    this.PatientName = BillListForDocShrList.PatientName;
    this.TotalAmt = BillListForDocShrList.TotalAmt || 0;
    this.ConAmt = BillListForDocShrList.ConAmt || '0';
    this.NetAmt = BillListForDocShrList.NetAmt || 0;
    this.PBillNo = BillListForDocShrList.PBillNo || 0;
    //this.BillNo= BillListForDocShrList.BillNo|| 0;
    this.AdmittedDoctorName = BillListForDocShrList.AdmittedDoctorName;
    this.PatientType = BillListForDocShrList.PatientType || 0;
    this.CompanyName = BillListForDocShrList.CompanyName;
    this.IsBillShrHold = BillListForDocShrList.IsBillShrHold || 0;
    this.GroupName = BillListForDocShrList.GroupName || '';
  }
}

