import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MaritalstatusMasterService } from '../maritalstatus-master.service';

@Component({
  selector: 'app-newmarital-master',
  templateUrl: './newmarital-master.component.html',
  styleUrls: ['./newmarital-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewmaritalMasterComponent implements OnInit {

  vMaritalStatusName:any;
  vMaritalStatusId:any;
  registerObj: any;
  vIsDeleted: any;

  constructor(
    public _maritalService: MaritalstatusMasterService,
    private accountService: AuthenticationService,
     public dialogRef: MatDialogRef<NewmaritalMasterComponent>,
     public _matDialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vMaritalStatusName = this.registerObj.MaritalStatusName;
      this.vMaritalStatusId = this.registerObj.MaritalStatusId;
      if (this.registerObj.IsDeleted == true) {
        this._maritalService.myform.get("IsDeleted").setValue(true)
      } else {
        this._maritalService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  onSave() {
      if (this.vMaritalStatusName == '' || this.vMaritalStatusName == null || this.vMaritalStatusName == undefined) {
        this.toastr.warning('Please Enter MaritalStatus Name  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
  
      Swal.fire({
        title: 'Do you want to Save the Relationship Recode ',
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
  
      if (!this.vMaritalStatusId) {
  
        var m_dataInsert = {
          "maritalStatusMasterInsert": {
            "maritalStatusName": this._maritalService.myform.get("MaritalStatusName").value || '',
            "addedBy": this.accountService.currentUserValue.user.id,
            "isDeleted": Boolean(JSON.parse(this._maritalService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._maritalService.insertMaritalStatusMaster(m_dataInsert).subscribe(response => {
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
          "maritalStatusMasterUpdate": {
            "maritalStatusId": this.vMaritalStatusId,
            "maritalStatusName": this._maritalService.myform.get("MaritalStatusName").value || '',
            "isDeleted": Boolean(JSON.parse(this._maritalService.myform.get("IsDeleted").value) || 0),
            "updatedBy": this.accountService.currentUserValue.user.id,
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._maritalService.updateMaritalStatusMaster(m_dataUpdate).subscribe(response => {
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
      this._maritalService.myform.reset({ IsDeleted: true });
      this.dialogRef.close();
    }
    onClear(){
      this._maritalService.myform.reset({ IsDeleted: true });
    }

}
