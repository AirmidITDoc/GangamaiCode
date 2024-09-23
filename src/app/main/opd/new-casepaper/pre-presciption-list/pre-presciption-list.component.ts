import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CasepaperService } from '../casepaper.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
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
  
  constructor(
    private _CasepaperService: CasepaperService, 
    private _formBuilder: FormBuilder, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, 
    public dialogRef: MatDialogRef<PrePresciptionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    if(this.data){
      this.RegId = this.data.Obj 
      console.log(this.data.Obj)
    }
    this.getPrescriptionListFill1();  
  }
//DateWise table Data 
  getPrescriptionListFill1() { 
    var vdata ={
      "RegID": this.RegId
    }
    this._CasepaperService.getRtrvVisitedList(vdata).subscribe(Visit => {
      this.patients = Visit as MedicineItemList[];  
      this.extractUniqueDates(); 
      console.log(this.patients); 
      // this.groupByVisitDate();  
    })
  }
  patients: any[] = []; // Using 'any' type for simplicity
  uniqueDates: string[] = [];   
  extractUniqueDates() {
    const dates = this.patients.map(patient => patient.VisitDate);
    this.uniqueDates = Array.from(new Set(dates));
  } 
  getFirstPatientForDate(date: string) {
    return this.patients.filter(patient => patient.VisitDate === date); //
  }

  CopyPresciptionList:any=[];
  CopyList:any=[];
  getCopyPreviouseList(date:string){ 
    this.CopyPresciptionList.date = [];
    this.CopyList =  this.patients.filter(patient => patient.VisitDate === date); // 
    console.log(this.CopyList)
  //  this.CopyList.forEach(element =>{
  //   this.CopyPresciptionList.push(element)  
  //  }) 
    console.log(this.CopyList)
   this.dialogRef.close(this.CopyList); 
  }

  //old datewise table list function
    // groupByVisitDate(): void {
  //   this.visitData.forEach((element) => {
  //     const date = new Date(element.VisitDate).toLocaleDateString(); // Format date as needed
  //     if (!this.groupedData[date]) {
  //       this.groupedData[date] = [];
  //     }
  //     this.groupedData[date].push(element);
  //   });
  // }
 
}
