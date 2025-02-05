import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { IPSearchListService } from '../ip-search-list.service';
import { AdvanceDataStored } from '../../advance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj, Bed, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bed-transfer',
  templateUrl: './bed-transfer.component.html',
  styleUrls: ['./bed-transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BedTransferComponent implements OnInit {
  Bedtransfer: FormGroup;
  dateTimeObj: any;
 
  screenFromString = 'admission-form';
  currentDate = new Date();
  
  vWardId: any=0;
  vBedId: any=0;
  vClassId: any=0; 
  AdmissionId=0
  
  

  menuActions: Array<string> = [];
  advanceAmount: any = 12345;

   // New Api
   autocompleteroom: string = "Room";
   autocompleteclass: string = "Class";
   autocompletebed: string = "Bed";

  constructor(public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<IPSearchListComponent>,
    private _formBuilder: UntypedFormBuilder
  ) {  }

  ngOnInit(): void {
    debugger
    // this.Bedtransfer = this.bedsaveForm();
    if(this.data){
    console.log("Data:",this.data);
    
  this.AdmissionId=this.data.admissionId;
  this.vWardId=this.data.wardId;
  this.vBedId=this.data.bedId;
  this.vClassId=this.data.classId;
    }
   
    // this.Bedtransfer.patchValue(this.data);
  }
  
  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  }
  bedsaveForm(): FormGroup {
    return this._formBuilder.group({
         transferId: 0,
    admissionId: 0,
    fromDate:[(new Date()).toISOString()],
    fromTime: [(new Date()).toISOString()],
    fromWardId: 0,
    fromBedId: 0,
    fromClassId: 0,
    toDate: [(new Date()).toISOString()],
    toTime: [(new Date()).toISOString()],
    toWardId: 0,
    toBedId: 0,
    toClassId: 0,
    remark: "%",
    addedBy: 1,
    isCancelled: 0,
    isCancelledBy: 0
    });
  }
  
 
  onBedtransfer() {
  
    var m_data = {
      
        "bedTransfer":this.Bedtransfer.value,
        "bedTofreed":{bedId: this.data.bedId},
        "admssion": {
          "admissionId": this.AdmissionId,
          "bedId":this.vBedId,
          "wardId": this.vWardId,
          "classId":this.vClassId,
        }
      }
      
    
    console.log(m_data);
   
    this._IpSearchListService.BedtransferUpdate(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });

  } 

  onClear(val: boolean) {
    // this.personalform.reset();
     // this.dialogRef.close(val);
   }
  onClose() {
    // this._IpSearchListService.mySaveForm.reset();
    this.dialogRef.close();
  }
  
  getValidationMessages() {
    return {
      toWardId: [
            { name: "required", Message: "Room Name is required" }
        ],
        BedId: [
          { name: "required", Message: "Bed Name is required" }
      ],
      ClassId: [
        { name: "required", Message: "Class Name is required" }
    ]
    };
  }
  

}

