import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PatientDischargeClearanceService } from './patient-discharge-clearance.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { PatientClearanceOptionComponent } from './patient-clearance-option/patient-clearance-option.component';
import {MatStepperModule} from '@angular/material/stepper';
 
@Component({
  selector: 'app-patient-discharge-clearance',
  templateUrl: './patient-discharge-clearance.component.html',
  styleUrls: ['./patient-discharge-clearance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PatientDischargeClearanceComponent implements OnInit {
  displayedColumns: string[] = [
    'RegNo',
    'PatientName',
    'IPDNo',
    //'Action'
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
    this.getClearancelist();



  } 
 
getClearancelist(){  
    this._PatientDischargeClearanceService.getClearancelist().subscribe(data =>{
      this.dspatientlist_1.data =data as ClearanceList[];
      //console.log(this.dspatientlist_1.data)
      //onsole.log(this.dspatientlist_1.data[0])
      this.getPatietnapprovelist(this.dspatientlist_1.data[0])
    })  
}
DepartmentList:any=[]; 
//patietn click approve side list 
getPatietnapprovelist(contact){
  console.log(contact)
  var vdata={ 
    "AdmId": contact.AdmissionID
  }
  console.log(vdata)
  setTimeout(() => {
    this._PatientDischargeClearanceService.getPatietnapprovelist(vdata).subscribe(data =>{
      this.dspatientlist_2.data =data as ClearanceList[];
      this.DepartmentList = data as ClearanceList[];
      console.log(this.dspatientlist_2.data) 
    }) 
  }, 1000);
}

 PatietnClearanceOption(element){
  console.log(element)
    const dialogRef = this._matDialog.open(PatientClearanceOptionComponent,
      {
        maxWidth: "70vw",
        height: '72%',
        width: '100%',
        data: {
          Obj: element
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getClearancelist()
      });
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
  ApprovedBYDate:any;
  ApprovedBy:any; 
  AdmID:any;
  DepartmentID:any;
  InitateDiscId:any;
 
  constructor(ClearanceList) {
 
    this.RegNo = ClearanceList.RegNo || 0;
    this.IsApprovedBy = ClearanceList.IsApprovedBy || '';
    this.IsApproved = ClearanceList.IsApproved || 0;
    this.DepartmentName = ClearanceList.DepartmentName || '';
    this.IPDNo = ClearanceList.IPDNo || 0;
   this.PatientName =ClearanceList.PatientName  || '';
   this.IsNoDues = ClearanceList.IsNoDues || 0;
   this.Comments =ClearanceList.Comments  || '';
   this.InitateDiscId =ClearanceList.InitateDiscId  || 0;
   this.DepartmentID = ClearanceList.DepartmentID || 0;
   this.AdmID =ClearanceList.AdmID  || 0;
  }
}
