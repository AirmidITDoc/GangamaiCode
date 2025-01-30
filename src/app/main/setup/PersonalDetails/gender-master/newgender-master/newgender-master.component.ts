import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GenderMasterService } from '../gender-master.service';

@Component({
  selector: 'app-newgender-master',
  templateUrl: './newgender-master.component.html',
  styleUrls: ['./newgender-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewgenderMasterComponent implements OnInit {

  registerObj: any;
  vIsDeleted: any;
  vGenderName: any;
  vGenderId:any;

   constructor(
      public _GenderService: GenderMasterService,
      private accountService: AuthenticationService,
      public dialogRef: MatDialogRef<NewgenderMasterComponent>,
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
      this.vGenderName = this.registerObj.GenderName;
      this.vGenderId = this.registerObj.GenderId;
      // this.vSexID=this.GenderName;
      if (this.registerObj.IsActive == true) {
        this._GenderService.myform.get("IsDeleted").setValue(true)
      } else {
        this._GenderService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

    onSave() {
      if (this.vGenderName == '' || this.vGenderName == null || this.vGenderName == undefined) {
        this.toastr.warning('Please Enter Gender  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
  
      Swal.fire({
        title: 'Do you want to Save the Gender Recode ',
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
  
      if (!this.vGenderId) {
  
        var m_dataInsert = {
          "genderMasterInsert": {
            "genderName": this._GenderService.myform.get("GenderName").value || '',
            "isActive": Boolean(JSON.parse(this._GenderService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._GenderService.genderMasterInsert(m_dataInsert).subscribe(response => {
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
          "genderMasterUpdate": {
            "genderId": this.vGenderId,
            "genderName": this._GenderService.myform.get("GenderName").value || '',
            "isActive": Boolean(JSON.parse(this._GenderService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._GenderService.genderMasterUpdate(m_dataUpdate).subscribe(response => {
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
      this._GenderService.myform.reset({ IsDeleted: true });
      this.dialogRef.close();
    }
    onClear(){
      this._GenderService.myform.reset({ IsDeleted: true });
    }

}
