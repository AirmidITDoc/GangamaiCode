import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { AdministrationService } from '../administration.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-share',
  templateUrl: './doctor-share.component.html',
  styleUrls: ['./doctor-share.component.scss']
})
export class DoctorShareComponent implements OnInit {

  hasSelectedContacts: boolean;
  click : boolean = false;
  MouseEvent=true;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  doctorNameCmbList: any = [];
  // filterForm: FormGroup;
  // filterform: any;
  msg: any;
  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();



  sIsLoading: string = '';
 dataSource = new MatTableDataSource<BillListForDocShrList>();
  displayedColumns = [
    'PBillNo',
    'PatientName',
    //'BillNo',
    'AdmittedDoctorName',
    'PatientType',
    'CompanyName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
   
    'IsBillShrHold',
    
  

   
   // 'action'

 
 ];

  constructor(private _fuseSidebarService: FuseSidebarService,
    public _AdministrationService: AdministrationService,
    public datePipe: DatePipe) { }

  ngOnInit(): void {

    this.getBillListForDoctorList();

    this.getDoctorNameCombobox();

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });
  }

  
  // filter for DoctorName in Sidebar
  private filterDoctor() {

    if (!this.doctorNameCmbList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filtereddoctor.next(
      this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }
// Doctorname Combobox sidebar
getDoctorNameCombobox() {
  this._AdministrationService.getAdmittedDoctorCombo().subscribe(data => {
    this.doctorNameCmbList = data;
    this.filtereddoctor.next(this.doctorNameCmbList.slice());
   
    
    console.log(this.doctorNameCmbList.data);
   
  });
}

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


 onShow(event:MouseEvent) {
  
  this.click=!this.click;
  setTimeout(() => {    
    {       
     this.sIsLoading = 'loading-data';
   
     this. getBillListForDoctorList(); 
   }
    
 }, 500);
    this.MouseEvent=true;
    this.click = true;
 
}

onClear() {


this._AdministrationService.myDocShrformSearch.get('DoctorId').reset();
this._AdministrationService.myDocShrformSearch.get('PBillNo').reset();

}




 getBillListForDoctorList() {
 
    this.sIsLoading = 'loading-data';
    var m_data = {
    
  
      "FromDate" : this.datePipe.transform(this._AdministrationService.myDocShrformSearch.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "ToDate" : this.datePipe.transform(this._AdministrationService.myDocShrformSearch.get("end").value,"MM-dd-yyyy") || "01/01/1900",
      "DoctorId":this._AdministrationService.myDocShrformSearch.get("DoctorId").value || 0,
      "PBillNo":this._AdministrationService.myDocShrformSearch.get("PBillNo").value || 0,
    }
    console.log(m_data);
    this._AdministrationService.getBillListForDocShrList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as BillListForDocShrList[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }
  

}


export class BillListForDocShrList {

  PatientName: string;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PBillNo: number;
 // BillNo: number;
  AdmittedDoctorName: string;
  PatientType: number;
  CompanyName: string;
  IsBillShrHold: boolean;

 
  constructor(BillListForDocShrList) {
  
    this.PatientName= BillListForDocShrList.PatientName;
    this.TotalAmt= BillListForDocShrList.TotalAmt|| 0; 
    this.ConcessionAmt= BillListForDocShrList.ConcessionAmt|| '0';
    this.NetPayableAmt= BillListForDocShrList.NetPayableAmt|| 0;
    this.PBillNo= BillListForDocShrList.PBillNo|| 0;
    //this.BillNo= BillListForDocShrList.BillNo|| 0;
    this.AdmittedDoctorName= BillListForDocShrList.AdmittedDoctorName;
    this.PatientType= BillListForDocShrList.PatientType|| 0;
    this.CompanyName= BillListForDocShrList.CompanyName;
    this.IsBillShrHold= BillListForDocShrList.IsBillShrHold|| 0;
 
  
  }

} 

