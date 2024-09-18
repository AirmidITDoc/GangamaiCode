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
 

interface Prescription {
  date: string;
  medication: string;
  dosage: string;
}
interface VisitDetails {
  VisitDate: string; 
  prescriptions: Prescription[];
}
 


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
  VisitId:any;

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
      this.VisitId = this.data.Obj 
      console.log(this.data.Obj)
    }
    this.getPrescriptionListFill1();
  }

  getPrescriptionListFill1() { 
    var vdata ={
      "visitId": this.VisitId
    }
    this._CasepaperService.RtrvPreviousprescriptionDetails(vdata).subscribe(Visit => {
      this.dsItemList.data = Visit as MedicineItemList[];   
      console.log(this.dsItemList.data);   
    })
  }
  CopyPresciptionList:any=[];
  getCopyPreviouseList(){
    if(this.dsItemList.data.length > 0){
      this.dsItemList.data.forEach(element =>{
        this.CopyPresciptionList.push(element)
      }); 
    }
    console.log(this.CopyPresciptionList)
    this.dialogRef.close(this.CopyPresciptionList); 
  }
 

    VisitDetails: VisitDetails[] = [
      {
        VisitDate: "2024-09-1",
        
        prescriptions: [
          { date: "2024-08-01", medication: "Medication A", dosage: "500mg" },
          { date: "2024-08-01", medication: "Medication B", dosage: "250mg" },
          { date: "2024-08-01", medication: "Medication C", dosage: "100mg" }
        ]
      },
      {
        VisitDate: "2024-09-2", 
        prescriptions: [
          { date: "2024-08-01", medication: "Medication C", dosage: "100mg" }
        ]
      },
      {
        VisitDate: "2024-09-3",
       
        prescriptions: [
          { date: "2024-08-02", medication: "Medication D", dosage: "200mg" }
        ]
      },
      {
        VisitDate: "2024-09-4",
    
        prescriptions: [
          { date: "2024-08-01", medication: "Medication E", dosage: "300mg" },
          { date: "2024-08-02", medication: "Medication F", dosage: "150mg" }
        ]
      }
    ];

   
}
