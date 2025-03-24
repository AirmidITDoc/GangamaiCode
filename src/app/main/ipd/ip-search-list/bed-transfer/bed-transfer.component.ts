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
import { AdmissionPersonlModel, RegInsert } from '../../Admission/admission/admission.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';

@Component({
  selector: 'app-bed-transfer',
  templateUrl: './bed-transfer.component.html',
  styleUrls: ['./bed-transfer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BedTransferComponent implements OnInit {
  Bedtransfer: FormGroup;
  
  screenFromString = 'admission-form';
  currentDate = new Date();
  dateTimeObj: any;

  vWardId: any = 0;
  vBedId: any = 0;
  vClassId: any = 0;
  AdmissionId = 0

  menuActions: Array<string> = [];
  advanceAmount: any = 0;

  // New Api
  autocompleteroom: string = "Room";
  autocompleteclass: string = "Class";
  autocompletebed: string = "Bed";
  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
@ViewChild('ddlClassName') ddlClassName: AirmidDropDownComponent;


  constructor(public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<IPSearchListComponent>,
    private _formBuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.registerObj1 = this.data
      console.log("Data:", this.registerObj1);
      this.Bedtransfer = this.bedsaveForm();

      this.AdmissionId = this.data.admissionId;
      this.Bedtransfer.get("toWardId").setValue(this.registerObj1.wardId)
      this.Bedtransfer.get("toBedId").setValue(this.registerObj1.bedId)
      this.Bedtransfer.get("toClassId").setValue(this.registerObj1.classId)
    }

    if ((this.data?.regId ?? 0) > 0) {
      setTimeout(() => {
        this._IpSearchListService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;
        });

        this._IpSearchListService.getAdmissionById(this.data.admissionId).subscribe((response) => {
          this.registerObj1 = response;
          if (this.registerObj1) {
            this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
            this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
            this.registerObj1.admissionTime = this.datePipe.transform(this.registerObj1.admissionTime, 'hh:mm:ss a')
            this.registerObj1.dischargeTime = this.datePipe.transform(this.registerObj1.dischargeTime, 'hh:mm:ss a')
          }
          console.log(this.registerObj1)
        });
      }, 500);
    }
   
  }
  onChangeWard(e) {
    this.ddlClassName.SetSelection(e.classId);
    }
  

  bedsaveForm(): FormGroup {
    return this._formBuilder.group({
      transferId: 0,
      admissionId: this.registerObj1.admissionId,
      fromDate: [(new Date()).toISOString()],
      fromTime: [(new Date()).toISOString()],
      fromWardId: this.registerObj1.wardId,
      fromBedId: this.registerObj1.bedId,
      fromClassId: this.registerObj1.classId,
      toDate: [(new Date()).toISOString()],
      toTime: [(new Date()).toISOString()],
      toWardId: 0,
      toBedId: 0,
      toClassId: 0,
      remark: "",
      addedBy:this.accountService.currentUserValue.userId,
      isCancelled: 0,
      isCancelledBy: 0
    });
  }


  selectChangedepartment(obj: any) {
        
    console.log(obj)
    this._IpSearchListService.getbedbyRoom(obj.value).subscribe((data: any) => {
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
    });
}


  onBedtransfer() {
    // debugger
    // console.log(this.Bedtransfer.value)
  
    var m_data = {
      "bedTransfer": this.Bedtransfer.value,
      "bedTofreed": { bedId: this.data.bedId },
      "bedUpdate": { bedId: parseInt(this.Bedtransfer.get("toBedId").value)}, 
      "admssion": {
        "admissionId": this.AdmissionId,
        "bedId": this.Bedtransfer.get("toBedId").value,//this.vBedId,
        "wardId": this.Bedtransfer.get("toWardId").value,// this.vWardId,
        "classId": this.Bedtransfer.get("toClassId").value//this.vClassId,
      }
    }

    console.log(m_data);

    this._IpSearchListService.BedtransferUpdate(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      this._matDialog.closeAll()
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });

  }

  selectChangeward(obj: any) {

    console.log(obj)
    // this._IpSearchListService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
    //     this.ddlBed.options = data;
    //     this.ddlBed.bindGridAutoComplete();
    // });
  }

  onClear(val: boolean) {
    this.Bedtransfer.reset();

  }
  onClose() {
    this.dialogRef.close();
  }

  getValidationMessages() {
    return {
      toWardId: [
        { name: "required", Message: "Room Name is required" }
      ],
      toBedId: [
        { name: "required", Message: "Bed Name is required" }
      ],
      ClassId: [
        { name: "required", Message: "Class Name is required" }
      ]
    };
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

}

