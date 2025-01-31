import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReligionMasterService } from '../religion-master.service';

@Component({
  selector: 'app-newreligion-master',
  templateUrl: './newreligion-master.component.html',
  styleUrls: ['./newreligion-master.component.scss']
})
export class NewreligionMasterComponent implements OnInit {

  vReligionId:any;
  vReligionName:any;
  registerObj: any;
  vIsDeleted: any;

  constructor(
    public _religionService: ReligionMasterService,
      private accountService: AuthenticationService,
         public dialogRef: MatDialogRef<NewreligionMasterComponent>,
         public _matDialog: MatDialog,
         @Inject(MAT_DIALOG_DATA) public data: any,
         public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vReligionName = this.registerObj.ReligionName;
      this.vReligionId = this.registerObj.ReligionId;
      // this.vSexID=this.GenderName;
      if (this.registerObj.IsDeleted == true) {
        this._religionService.myform.get("IsDeleted").setValue(true)
      } else {
        this._religionService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

   onSave() {
      if (this.vReligionName == '' || this.vReligionName == null || this.vReligionName == undefined) {
        this.toastr.warning('Please Enter Religion  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
  
      Swal.fire({
        title: 'Do you want to Save the Religion Recode ',
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
  
      if (!this.vReligionId) {
  
        var m_dataInsert = {
          "religionMasterInsert": {
            "religionName": this._religionService.myform.get("ReligionName").value || '',
            "addedBy": this.accountService.currentUserValue.user.id,
            "isDeleted": Boolean(JSON.parse(this._religionService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._religionService.religionMasterInsert(m_dataInsert).subscribe(response => {
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
          "religionMasterUpdate": {
            "religionID": this.vReligionId,
            "religionName": this._religionService.myform.get("ReligionName").value || '',
            "isDeleted": Boolean(JSON.parse(this._religionService.myform.get("IsDeleted").value) || 0),
            "updatedBy": this.accountService.currentUserValue.user.id,
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._religionService.religionMasterUpdate(m_dataUpdate).subscribe(response => {
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
      this._religionService.myform.reset({ IsDeleted: true });
      this.dialogRef.close();
    }
    onClear(){
      this._religionService.myform.reset({ IsDeleted: true });
    }

}
