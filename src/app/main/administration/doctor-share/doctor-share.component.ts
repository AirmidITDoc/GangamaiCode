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

@Component({
  selector: 'app-doctor-share',
  templateUrl: './doctor-share.component.html',
  styleUrls: ['./doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorShareComponent implements OnInit {
  displayedColumns:string[] = [ 
    'button',
    'PBillNo',
    'PatientName',
    'TotalAmt',
    'ConAmt',
    'NetAmt', 
    'AdmittedDoctorName',
    'PatientType', 
    'CompanyName',
    //'groupName',
    // 'Action'
  ];
  @ViewChild('drawer') public drawer: MatDrawer;
  isRegIdSelected : boolean = false;
  isDoctorIDSelected: boolean=false;
  isgroupIdSelected: boolean=false;
  DoctorListfilteredOptions:Observable<string[]>; 
  filteredOptionsGroup:Observable<string[]>; 
  doctorNameCmbList: any = [];   
  groupNameList: any = []; 
  sIsLoading: string = '';
  PatientListfilteredOptions: any;
  noOptionFound:any;
  
 dataSource = new MatTableDataSource<BillListForDocShrList>();
 dsAdditionalPay = new MatTableDataSource<BillListForDocShrList>();

 @ViewChild(MatSort) sort:MatSort;
 @ViewChild(MatPaginator) paginator:MatPaginator;
  constructor( 
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void { 
    this.getDoctorNameCombobox();  
    this.getgroupNameCombobox();  

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this._DoctorShareService.UserFormGroup.patchValue({
      startdate :oneMonthAgo
    }); 

    this.getBillListForDoctorList();
  }
 
// Doctorname Combobox sidebar
getDoctorNameCombobox() {
  this._DoctorShareService.getAdmittedDoctorCombo().subscribe(data => {
    this.doctorNameCmbList = data; 
    console.log(this.doctorNameCmbList);
    this.DoctorListfilteredOptions = this._DoctorShareService.UserFormGroup.get('DoctorID').valueChanges.pipe(
      startWith(''), 
      map(value => value ? this._filterwebRole(value) : this.doctorNameCmbList.slice()),
    );
  });
}
private _filterwebRole(value: any): string[] {
  if (value) {
    const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
    return this.doctorNameCmbList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
  }
}
getOptionTextDoctorName(option) {
  return option && option.Doctorname;
} 
 
getgroupNameCombobox() {
  this._DoctorShareService.getAdmittedDoctorCombo().subscribe(data => {
    this.groupNameList = data; 
    console.log(this.groupNameList);
    this.filteredOptionsGroup = this._DoctorShareService.UserFormGroup.get('GroupId').valueChanges.pipe(
      startWith(''), 
      map(value => value ? this._filtergroup(value) : this.groupNameList.slice()),
    );
  });
}
private _filtergroup(value: any): string[] {
  if (value) {
    const filterValue = value && value.GroupName ? value.GroupName.toLowerCase() : value.toLowerCase();
    return this.groupNameList.filter(option => option.GroupName.toLowerCase().includes(filterValue));
  }
}
getOptionTextgroupName(option) {
  return option && option.GroupName;
} 



 getBillListForDoctorList() { 
    this.sIsLoading = 'loading-data';
    var m_data = { 
      "FromDate" : this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("startdate").value,"MM-dd-yyyy") || "01/01/1900",
      "ToDate" : this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("enddate").value,"MM-dd-yyyy") || "01/01/1900",
      "DoctorId":this._DoctorShareService.UserFormGroup.get('DoctorID').value.DoctorId || 0,
      "PBillNo":this._DoctorShareService.UserFormGroup.get("PbillNo").value || 0,
      'OP_IP_TYpe':this._DoctorShareService.UserFormGroup.get("OP_IP_Type").value || 0,
    }
    console.log(m_data);
    this._DoctorShareService.getBillListForDocShrList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as BillListForDocShrList[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = ''; 
    },
      error => {
        this.sIsLoading = '';
      });
  }  

  viewDocShareSummaryReport() { 
    debugger 
      this.sIsLoading = 'loading-data'; 
     let FromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("startdate").value,"MM-dd-yyyy") || "01/01/1900";
     let ToDate =  this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("enddate").value,"MM-dd-yyyy") || "01/01/1900";
     let DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value.DoctorId || 0;
 
    console.log(FromDate)
    console.log(ToDate)
    console.log(DoctorId)
      setTimeout(() => { 
        this._DoctorShareService.getPdfDocShareSummaryRpt(FromDate,ToDate,DoctorId).subscribe(res => {
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
      debugger 
        this.sIsLoading = 'loading-data'; 
       let FromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("startdate").value,"MM-dd-yyyy") || "01/01/1900";
       let ToDate =  this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("enddate").value,"MM-dd-yyyy") || "01/01/1900";
       let DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value.DoctorId || 0;
   
      console.log(FromDate)
      console.log(ToDate)
      console.log(DoctorId)
        setTimeout(() => { 
          this._DoctorShareService.getPdfDocShareRpt(FromDate,ToDate,DoctorId).subscribe(res => {
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
  
  NewDocShare(){
    const dialogRef = this._matDialog.open(AddDoctorShareComponent,
      { 
        height: "90%",
        width: '75%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  processDocShare(){
    const dialogRef = this._matDialog.open(ProcessDoctorShareComponent,
      { 
        height: "35%",
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
 GroupName:any;
  constructor(BillListForDocShrList) {
  
    this.PatientName= BillListForDocShrList.PatientName;
    this.TotalAmt= BillListForDocShrList.TotalAmt|| 0; 
    this.ConAmt= BillListForDocShrList.ConAmt|| '0';
    this.NetAmt= BillListForDocShrList.NetAmt|| 0;
    this.PBillNo= BillListForDocShrList.PBillNo|| 0;
    //this.BillNo= BillListForDocShrList.BillNo|| 0;
    this.AdmittedDoctorName= BillListForDocShrList.AdmittedDoctorName;
    this.PatientType= BillListForDocShrList.PatientType|| 0;
    this.CompanyName= BillListForDocShrList.CompanyName;
    this.IsBillShrHold= BillListForDocShrList.IsBillShrHold|| 0; 
    this.GroupName= BillListForDocShrList.GroupName|| ''; 
  } 
} 

