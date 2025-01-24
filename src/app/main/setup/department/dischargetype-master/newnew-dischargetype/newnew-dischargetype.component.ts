import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { DischargetypeMasterService } from '../dischargetype-master.service';

@Component({
  selector: 'app-newnew-dischargetype',
  templateUrl: './newnew-dischargetype.component.html',
  styleUrls: ['./newnew-dischargetype.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewnewDischargetypeComponent implements OnInit {

  registerObj: any;
  vDischargeTypeName: any;
  vDischargeTypeId: any;

   constructor(
      public _dischargetypeService: DischargetypeMasterService,
      public dialogRef: MatDialogRef<NewnewDischargetypeComponent>,
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
      this.vDischargeTypeName = this.registerObj.DischargeTypeName;
      this.vDischargeTypeId = this.registerObj.DischargeTypeId
      if (this.registerObj.IsActive == true) {
        this._dischargetypeService.myform.get("IsDeleted").setValue(true)
      } else {
        this._dischargetypeService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  onSave() {
      if (this.vDischargeTypeName == '' || this.vDischargeTypeName == null || this.vDischargeTypeName == undefined) {
        this.toastr.warning('Please enter Discharge Type Name  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
  
      Swal.fire({
        title: 'Do you want to Save the Discharge Recode ',
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

      if(!this.vDischargeTypeId){
  
        var m_dataInsert={
          "dischargeTypeMasterInsert": {
            "dischargeTypeName": this._dischargetypeService.myform.get("DischargeTypeName").value || '',
            "isActive": Boolean(JSON.parse(this._dischargetypeService.myform.get("IsDeleted").value) || 0),
            "addedBy":this._loggedService.currentUserValue.user.id,
            "updatedBy": this._loggedService.currentUserValue.user.id,
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._dischargetypeService.dischargeTypeMasterInsert(m_dataInsert).subscribe(response =>{
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
      else{
        debugger
        var m_dataUpdate={
          "dischargeTypeMasterUpdate": {
            "dischargeTypeId":this.vDischargeTypeId,
            "dischargeTypeName": this._dischargetypeService.myform.get("DischargeTypeName").value || '',
            "isActive": Boolean(JSON.parse(this._dischargetypeService.myform.get("IsDeleted").value) || 0),
            "updatedBy": this._loggedService.currentUserValue.user.id,
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._dischargetypeService.dischargeTypeMasterUpdate(m_dataUpdate).subscribe(response =>{
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
    this._dischargetypeService.myform.reset({
      IsDeleted: true
    });
    this.dialogRef.close();
  }

}
