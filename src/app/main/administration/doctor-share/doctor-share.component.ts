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

@Component({
  selector: 'app-doctor-share',
  templateUrl: './doctor-share.component.html',
  styleUrls: ['./doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorShareComponent implements OnInit {
  displayedColumns:string[] = [ 
    'PBillNo',
    'PatientName',
    'TotalAmt',
    'ConAmt',
    'NetAmt', 
    'AdmittedDoctorName',
    'PatientType', 
    'CompanyName',
  ];
 
  isRegIdSelected : boolean = false;
  isDoctorIDSelected: boolean=false;
  DoctorListfilteredOptions:Observable<string[]>; 
  doctorNameCmbList: any = [];   
  sIsLoading: string = '';
  PatientListfilteredOptions: any;
  noOptionFound:any;
  
 dataSource = new MatTableDataSource<BillListForDocShrList>();

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
  }

  getSearchList() {
    var m_data = {
      "Keyword": `${this._DoctorShareService.UserFormGroup.get('RegId').value}`
    }
    this._DoctorShareService.getPatientVisitedListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      console.log(this.PatientListfilteredOptions)
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });

  }
  getSelectedObj1(obj) {
    console.log(obj)
    this.dataSource.data = [];
    // this.registerObj = obj;
    // this.PatientName = obj.FirstName + " " + obj.LastName;
    // this.RegId = obj.RegId;
    // this.Doctorname = obj.DoctorName;
    // this.VisitDate = this.datePipe.transform(obj.VisitDate, 'dd/MM/yyyy hh:mm a');
    // this.CompanyName = obj.CompanyName;
    // this.Tarrifname = obj.TariffName;
    // this.DepartmentName = obj.DepartmentName;
    // this.RegNo = obj.RegNo;
    // this.vOPIPId = obj.VisitId;
    // this.vOPDNo = obj.OPDNo;
    // this.vTariffId = obj.TariffId;
    // this.vClassId = obj.ClassId;
    // this.AgeYear = obj.AgeYear;
    // this.AgeMonth = obj.AgeMonth;
    // this.vClassName = obj.ClassName;
    // this.AgeDay = obj.AgeDay;
    // this.GenderName = obj.GenderName;
    // this.RefDocName = obj.RefDoctorName
    // this.BedName = obj.BedName;
    // this.PatientType = obj.PatientType;
  } 
  getOptionText1(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName; 
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
 
 getBillListForDoctorList() { 
    this.sIsLoading = 'loading-data';
    var m_data = { 
      "FromDate" : this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("startdate").value,"MM-dd-yyyy") || "01/01/1900",
      "ToDate" : this.datePipe.transform(this._DoctorShareService.UserFormGroup.get("enddate").value,"MM-dd-yyyy") || "01/01/1900",
      "DoctorId":this._DoctorShareService.UserFormGroup.get('DoctorID').value.DoctorId || 0,
      "PBillNo":this._DoctorShareService.UserFormGroup.get("PbillNo").value || 0,
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
  NewDocShare(){
    const dialogRef = this._matDialog.open(AddDoctorShareComponent,
      { 
        height: "85%",
        width: '75%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  onClear() {  
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
  } 
} 

