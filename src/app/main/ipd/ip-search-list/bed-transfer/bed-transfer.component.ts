import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
  Bedtransfer: UntypedFormGroup;
  dateTimeObj: any;
  isLoading: string = '';
  screenFromString = 'admission-form';
  currentDate = new Date();
  
  vWardId: any;
  vBedId: any;
  vClassId: any; 
  submitted = false; 
  
  selectedAdvanceObj: AdmissionPersonlModel; 
  
  AdmissionId:any=10;
  Fromward:any=20;
  FromBed:any=10;
  FromClass:any=10;

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
  ) {
  
    if (this.advanceDataStored.storage) {
     // debugger
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
    
    } 
  }

  ngOnInit(): void {
    this.Bedtransfer = this.bedsaveForm();
    if(this.data){
      this.AdmissionId=12//this.data
      this.Fromward=1;
      this.Fromward=2
      this.FromBed=2
      this.FromClass=1
    }
    this.selectedAdvanceObj = this.advanceDataStored.storage; 
    if (this.selectedAdvanceObj) { 
      // this.setDropdownObjs(); 
    }  
 
  }
  get f() { return this._IpSearchListService.mySaveForm.controls; }

  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  }
  bedsaveForm(): UntypedFormGroup {
    return this._formBuilder.group({
      RegNo: '',
      RoomId: ['', Validators.required],
      RoomName: '',
      BedId: ['', Validators.required],
      BedName: '',
      ClassId: ['', Validators.required],
      ClassName: '',
      Remark: '',
    });
  }
  
 

 
   
  onEdit(row) { 
    var m_data = {
      "DischargeDate": row.DischargeDate,
      "DischargeTime": row.DischargeTime,
      "DischargeTypeId": row.DischargeTypeId,
      "DischargedDocId": row.DischargedDocId, 
    }
    console.log(m_data);
    this._IpSearchListService.populateForm(m_data);
  } 
  onBedtransfer() {
    debugger;
    if ((this.vWardId == 0)) {
      this.toastr.warning('Please select valid Ward ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vBedId == 0)) {
      this.toastr.warning('Please select valid Bed', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vClassId == 0)) {
      this.toastr.warning('Please select Class', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.submitted = true;

    var m_data = {
      
        "bedTransfer": {
          "transferId": 0,
          "admissionId": this.AdmissionId,
          "fromDate":"2024-09-18T11:24:02.656Z",// this.Bedtransfer.get("").value
          "fromTime": "2024-09-18T11:24:02.656Z",
          "fromWardId":1,// this.Fromward,
          "fromBedId":2,//this.FromBed,
          "fromClassId":2,// this.FromClass,
          "toDate": "2024-09-18T11:24:02.656Z",
          "toTime":  "2024-09-18T11:24:02.656Z",
          "toWardId": this.vWardId,
          "toBedId": this.vBedId,
          "toClassId": this.vClassId,
          "remark": this.Bedtransfer.get("Remark").value || '',
          "addedBy": 0,
          "isCancelled": 0,
          "isCancelledBy": 0
        },
        "bedTofreed": {
          "bedId": this.FromBed,
        },
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
    this._IpSearchListService.mySaveForm.reset();
    this.dialogRef.close();
  }
  @ViewChild('bed') bed: ElementRef;
  public onEnterward(event): void {
    if (event.which === 13) { 
      this.bed.nativeElement.focus();
    } 
  }

  // new Api

ClassId=0;
BedId=0;
RoomId=0;
  getValidationroomMessages() {
    return {
      RoomId: [
            { name: "required", Message: "Room Name is required" }
        ]
    };
  }
  
  getValidationbedMessages() {
  return {
    BedId: [
          { name: "required", Message: "Bed Name is required" }
      ]
  };
}

getValidationclassMessages() {
  return {
    ClassId: [
          { name: "required", Message: "Class Name is required" }
      ]
  };
}
  selectChangeward(obj: any){
  console.log(obj);
  this.vWardId=obj.value
}

selectChangebed(obj: any){
  console.log(obj);
  this.vBedId =obj.value
}

selectChangeclass(obj: any){
  console.log(obj);
  this.vClassId=obj.value
}
}

