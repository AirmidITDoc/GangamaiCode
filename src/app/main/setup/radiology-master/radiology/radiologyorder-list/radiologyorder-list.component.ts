import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RadiologyorderListService } from './radiologyorder-list.service';


@Component({
  selector: 'app-radiologyorder-list',
  templateUrl: './radiologyorder-list.component.html',
  styleUrls: ['./radiologyorder-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyorderListComponent implements OnInit {

  CategoryList: any = [];
  screenFromString = 'opd-casepaper';
  PatientTypeList: any = [];
   myFilterform: FormGroup;
  isLoading = true;
  msg:any;
  step = 0;
  dataArray= {};
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  
setStep(index: number) {
    this.step = index;
  }
  SearchName : string;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
    
  dataSource = new MatTableDataSource<RadioPatientList>();
  displayedColumns: string[] = [
    'RadDate',
    'RadTime',
    'RegNo',
    'PatientName',
    'PatientType',
    'TestName',
    'ConsultantDoctor',
    'CategoryName',
    'AgeYear',
    'GenderName',
    'PBillNo',
    // 'action'
    
  ];
   
  constructor(
  
    private formBuilder: FormBuilder,
    public _RadiologyOrderListService: RadiologyorderListService,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService, 
  
  ) { }

  ngOnInit(): void {
  this.getcaterorylist();
  this.getRadiologyPatientsList();
}
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  
  getcaterorylist()
  {
  this._RadiologyOrderListService.getCategoryNameCombo().subscribe(data =>this.CategoryList = data);
  }
  
  onClose() {
    //  this.dialogRef.close();
  }

  onSubmit(){}

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
     this.dateTimeObj = dateTimeObj;
  }

  onSearch(){
   this.getRadiologyPatientsList();
   }

  
   getRadiologyPatientsList() {
    this.sIsLoading = 'loading-data';
     var m_data={
      "F_Name": (this._RadiologyOrderListService.myformSearch.get("FirstNameSearch").value).trim() +'%' || '%',
      "L_Name": (this._RadiologyOrderListService.myformSearch.get("LastNameSearch").value).trim()+'%'  || '%',
      "Reg_No": (this._RadiologyOrderListService.myformSearch.get("RegNoSearch").value) || 0,
      "From_Dt" : this.datePipe.transform(this._RadiologyOrderListService.myformSearch.get("start").value,"MM-dd-yyyy") || '01/01/1900',
      "To_Dt" : this.datePipe.transform(this._RadiologyOrderListService.myformSearch.get("end").value,"MM-dd-yyyy") ||'01/01/1900',
      "IsCompleted": (this._RadiologyOrderListService.myformSearch.get("StatusSearch").value).trim() || 1,
      "OP_IP_Type": (this._RadiologyOrderListService.myformSearch.get("PatientTypeSearch").value).trim() || 1,
      "CategoryId":this._RadiologyOrderListService.myformSearch.get("CategoryId").value || 0,
     }
    console.log(m_data);
    this._RadiologyOrderListService.getRadiologyOrderList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as RadioPatientList[];
      this.dataSource.sort =this.sort;
     this.dataSource.paginator=this.paginator;
     console.log(this.dataSource);
           
    });
   
  }

  onSearchClear(){
    this._RadiologyOrderListService.myformSearch.reset({RegNoSearch:'',FirstNameSearch:'',LastNameSearch:'',PatientTypeSearch:'',StatusSearch:''});
  }

  

//   onEdit(row) {
    
//     var m_data={
//        "Reg_No": (this._RadiologyOrderListService.myFilterform.get("RegNoSearch").value).trim() || 0,
//       }
    
//     this._RadiologyOrderListService.getSampleList(m_data).subscribe(Visit => {
//       this.dataSource1.data = Visit as SampleList[];
//       this.dataSource1.sort =this.sort;
//       this.dataSource1.paginator=this.paginator;
//     });
   
//   }
}
  
export class RadioPatientList {
  RadDate: Date;
  RadTime: Date;
  RegNo: any;
  PatientName: String;
  PatientType: number;
  TestName:String;
  ConsultantDoctor: any;
  CategoryName:String;
  AgeYear:number;
  GenderName:String;
  PBillNo: number;
  
  
  
  constructor(RadioPatientList) {
    this.RadDate = RadioPatientList.RadDate || '';
    this.RadTime = RadioPatientList.RadTime;
    this.RegNo = RadioPatientList.RegNo;
    this.PatientName= RadioPatientList.PatientName;
    this.PBillNo= RadioPatientList.PBillNo;
    this.PatientType = RadioPatientList.PatientType || '0';
    this.ConsultantDoctor = RadioPatientList.ConsultantDoctor || '';
    this.TestName = RadioPatientList.TestName || '0';
    this.CategoryName = RadioPatientList.CategoryName || '';
    this.AgeYear= RadioPatientList.AgeYear;
    this.GenderName= RadioPatientList.GenderName;
    
  }

}
