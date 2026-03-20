import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { OPIPPatientModel } from 'app/main/nursingstation/patient-vist/patient-vist.component';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MrdService } from '../../mrd.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { MrdDetailsService } from '../mrd-details.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { AdmissionModule } from 'app/main/ipd/Admission/admission/admission.module';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


@Component({
  selector: 'app-new-in-mrd',
  templateUrl: './new-in-mrd.component.html',
  styleUrls: ['./new-in-mrd.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewINMrdComponent {
NewInMrdForm:FormGroup
dateTimeString: any;
rmdrecordId=0
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  // isDatePckrDisabled: boolean = false;
  // isTimeChanged: boolean = false;
  // minDate: Date;
  // timeflag = 0;
   screenFromString = 'Common-form';
  date: string;
 registerObj = new AdmissionPersonlModel({});
  opipid=0
  constructor(private _fuseSidebarService: FuseSidebarService,
    public _MrdService: MrdDetailsService,
    public formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,   public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewINMrdComponent>,
    public datePipe: DatePipe) {
    dialogRef.disableClose = true;
     this.date = new Date().toISOString().slice(0, 16);
  }

  ngOnInit(): void {
       this.NewInMrdForm = this.createINMrdForm();
       if(this.data){
        console.log(this.data)
        debugger
        this.rmdrecordId=this.data.rmdrecordId
        this.opipid=this.data.opipid
        this.registerObj=this.data
       }
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);

     }


  createINMrdForm() {
  return this.formBuilder.group({
      outFileId: 0,
      opipid: [this.opipid, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // outNo: ['', Validators.required],
      // givenUserId:[''],
      // personName:[''],

      // outDate: [(new Date()).toISOString()],
      // outTime: [(new Date()).toISOString()],
      // outReason:[''],
    
      // inNo:[''],
      inDate: [(new Date()).toISOString()],
      inTime: [(new Date()).toISOString()],
      returnUserId: this.accountService.currentUserValue.userId,
      returnPersonName: ['', [Validators.required]],
      inReason: [false, Validators.required],

    
    });
  }

  onSubmit() {
    debugger

    this.NewInMrdForm.get('opipid').setValue(this.opipid)
    this.NewInMrdForm.get('inDate').setValue(this.datePipe.transform(this.NewInMrdForm.get('inDate').value, 'yyyy-MM-dd'))
    this.NewInMrdForm.get('inTime').setValue(this.datePipe.transform(this.NewInMrdForm.get('inDate').value, "yyyy-MM-dd hh:mm"))

    if (!this.NewInMrdForm.invalid) {
      console.log(this.NewInMrdForm.value)
      this._MrdService.MrdINFileUpdate(this.NewInMrdForm.value).subscribe((response) => {

        this._matDialog.closeAll();
      });
    } else {
      const invalidFields = [];

      if (this.NewInMrdForm.invalid) {
        for (const controlName in this.NewInMrdForm.controls) {
          if (this.NewInMrdForm.controls[controlName].invalid) {
            invalidFields.push(`MRD In File Info Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }


    pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  getValidationMessages() {
    return {
      opipid: [
        { name: "required", Message: "opipid is required" }
      ],
      mrdno: [
        { name: "required", Message: "mrdno is required" }
      ],
      location: [
        { name: "required", Message: "location is required" }
      ],
       inReason: [
        { name: "required", Message: "inReason is required" }
      ],
      inNo: [
        { name: "required", Message: "inNo is required" }
      ],
      returnPersonName: [
        { name: "required", Message: "returnPersonName is required" }
      ],
      personName: [
        { name: "required", Message: "personName is required" }
      ],
      outNo: [
        { name: "required", Message: "outNo is required" }
      ],
    };
  }



  onClose() {
    this.dialogRef.close();
   }
}
