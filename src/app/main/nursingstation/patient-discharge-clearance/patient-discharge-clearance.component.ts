import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PatientDischargeClearanceService } from './patient-discharge-clearance.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-patient-discharge-clearance',
  templateUrl: './patient-discharge-clearance.component.html',
  styleUrls: ['./patient-discharge-clearance.component.scss']
})
export class PatientDischargeClearanceComponent implements OnInit {
  displayedColumns: string[] = [
    'RegNo',
    'PatientName',
    'IPDNo',
    'Action'
  ] 
  displayedColumns2: string[] = [
    'DepartmentName',
    'IsApproved',
    'IsApprovedBy',
    'IsNoDues',
    'Comments'
  ] 



  dspatientlist_1 = new MatTableDataSource<ClearanceList>();
  dspatientlist_2 = new MatTableDataSource<ClearanceList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  constructor(
    public _PatientDischargeClearanceService: PatientDischargeClearanceService,
    private accountService: AuthenticationService,  
    public datePipe: DatePipe, 
    public toastr: ToastrService, 
    public _matDialog: MatDialog,  
  ) { }

  ngOnInit(): void {




  }

getClearancelist(){ 
  setTimeout(() => {
    this._PatientDischargeClearanceService.getClearancelist().subscribe(data =>{
      this.dspatientlist_1.data =data as ClearanceList[];
      console.log(this.dspatientlist_1.data)
    }) 
  }, 1000);
}
getapprovelist(){
  var vdata={
    "DepartmentId":1 ,
    "AdmId": 1
  }
  console.log(vdata)
  setTimeout(() => {
    this._PatientDischargeClearanceService.getapprovelist(vdata).subscribe(data =>{
      this.dspatientlist_2.data =data as ClearanceList[];
      console.log(this.dspatientlist_2.data)
    }) 
  }, 1000);
}
 
}
export class ClearanceList{
  RegNo : any;
  IsApprovedBy : any;
  IsApproved : any;
  DepartmentName : any;
  IPDNo : any;
  PatientName  : any;
  IsNoDues:any;
  Comments:any;
 
  constructor(ClearanceList) {
 
    this.RegNo = ClearanceList.RegNo || 0;
    this.IsApprovedBy = ClearanceList.IsApprovedBy || '';
    this.IsApproved = ClearanceList.IsApproved || 0;
    this.DepartmentName = ClearanceList.DepartmentName || '';
    this.IPDNo = ClearanceList.IPDNo || 0;
   this.PatientName =ClearanceList.PatientName  || '';
   this.IsNoDues = ClearanceList.IsNoDues || 0;
   this.Comments =ClearanceList.Comments  || '';
  }
}
