import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PatienttypeMasterService } from '../patienttype-master.service';
@Component({
  selector: 'app-newpatient-type-master',
  templateUrl: './newpatient-type-master.component.html',
  styleUrls: ['./newpatient-type-master.component.scss']
})
export class NewpatientTypeMasterComponent implements OnInit {

  registerObj: any;
  vIsDeleted: any;
  vPatientTypeId:any;
  vPatientType:any;

  constructor(
    public _PatientTypeService: PatienttypeMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewpatientTypeMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vPatientType = this.registerObj.PatientType;
      this.vPatientTypeId = this.registerObj.PatientTypeId;
      // this.vSexID=this.GenderName;
      if (this.registerObj.IsActive == true) {
        this._PatientTypeService.myForm.get("IsDeleted").setValue(true)
      } else {
        this._PatientTypeService.myForm.get("IsDeleted").setValue(false)
      }
    }
  }

    onSave() {
      if (this.vPatientType == '' || this.vPatientType == null || this.vPatientType == undefined) {
        this.toastr.warning('Please Enter Patient Type  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
  
      Swal.fire({
        title: 'Do you want to Save the Patient Type Recode ',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!",
        cancelButtonText: "No, Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          this.onSubmit();
        }
      });
    }
  
    onSubmit() {
      debugger
  
      if (!this.vPatientTypeId) {
  
        var m_dataInsert = {
          "patientTypeMasterInsert": {
            "patientType": this._PatientTypeService.myForm.get("PatientType").value || '',
            "isActive": Boolean(JSON.parse(this._PatientTypeService.myForm.get("IsDeleted").value) || 0),
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._PatientTypeService.patientTypeMasterInsert(m_dataInsert).subscribe(response => {
          if (response) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.onClose()
          } else {
            this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });
      }
      else {
        debugger
        var m_dataUpdate = {
          "patientTypeMasterUpdate": {
            "patientTypeID": this.vPatientTypeId,
            "patientType": this._PatientTypeService.myForm.get("PatientType").value || '',
            "isActive": Boolean(JSON.parse(this._PatientTypeService.myForm.get("IsDeleted").value) || 0),
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._PatientTypeService.patientTypeMasterUpdate(m_dataUpdate).subscribe(response => {
          if (response) {
            this.toastr.success('Record Updated Successfully.', 'Updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.onClose()
          } else {
            this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });
      }
    }
  
    onClose() {
      this._PatientTypeService.myForm.reset({ IsDeleted: true });
      this.dialogRef.close();
    }
    onClear(){
      this._PatientTypeService.myForm.reset({ IsDeleted: true });
    }

}
