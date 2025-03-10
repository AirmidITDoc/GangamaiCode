import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CasepaperService } from '../casepaper.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MedicineItemList } from '../new-casepaper.component'; 
import { element } from 'protractor';

@Component({
  selector: 'app-pre-presciption-list',
  templateUrl: './pre-presciption-list.component.html',
  styleUrls: ['./pre-presciption-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrePresciptionListComponent implements OnInit { 

 displayedItemColumn: string[] = [
    'ItemName',
    'DoseName',
    'Days',
    'Remark' 
  ]
  RegId:any;
  visitData: any[] = [];
  groupedData: { [key: string]: any[]} = {}; 
  dsItemList = new MatTableDataSource<MedicineItemList>();
  
  patients: any[] = []; // Using 'any' type for simplicity
  uniqueDates: string[] = [];   

  constructor(
    private _CasepaperService: CasepaperService, 
    private _formBuilder: UntypedFormBuilder, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, 
    public dialogRef: MatDialogRef<PrePresciptionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    // debugger
    if(this.data){
      this.RegId = this.data.Obj 
      console.log(this.data.Obj)
    }
    // this.getPrescriptionListFill1(); 
    this.getnewVisistListDemo(this.data); 
  }
  
  getnewVisistListDemo(obj) {
    // debugger
    var D_data = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegID",
          "fieldValue": String(this.RegId),//"40773",	
          "opType": "Equals"
        },
        {
          "fieldName": "Start",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "Length",
          "fieldValue": "10",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }
    console.log(D_data);
    this._CasepaperService.getRtrvVisitedListdemo(D_data).subscribe(Visit => {
      this.patients = Visit?.data as MedicineItemList[];
      this.extractUniqueDates();
      console.log("visitPatient info:", this.patients)
    });
  }

  extractUniqueDates() {
    const dates = this.patients.map(patient => patient.visitDate);
    this.uniqueDates = Array.from(new Set(dates));
  } 
  getFirstPatientForDate(date: string) {
    return this.patients.filter(patient => patient.visitDate === date); //
  }

  CopyPresciptionList:any=[];
  CopyList:any=[];
  getCopyPreviouseList(date:string){ 
    this.CopyPresciptionList.date = [];
    this.CopyList =  this.patients.filter(patient => patient.visitDate === date); // 
    console.log(this.CopyList)
   this.dialogRef.close(this.CopyList); 
  }

}
