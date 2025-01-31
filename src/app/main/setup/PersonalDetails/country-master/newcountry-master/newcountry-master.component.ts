import { CountryMasterService } from '../country-master.service';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newcountry-master',
  templateUrl: './newcountry-master.component.html',
  styleUrls: ['./newcountry-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewcountryMasterComponent implements OnInit {

  vCountryId:any;
  vCountryName:any
  registerObj: any;
  vIsDeleted: any;

  constructor(
    public _CountryService: CountryMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewcountryMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vCountryName = this.registerObj.CountryName;
      this.vCountryId = this.registerObj.CountryId;
      if (this.registerObj.IsDeleted == true) {
        this._CountryService.myform.get("IsDeleted").setValue(true)
      } else {
        this._CountryService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  onSave() {
      if (this.vCountryName == '' || this.vCountryName == null || this.vCountryName == undefined) {
        this.toastr.warning('Please Enter Country Name  ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
  
      Swal.fire({
        title: 'Do you want to Save the Country Recode ',
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
  
      if (!this.vCountryId) {
  
        var m_dataInsert = {
          "countryMasterInsert": {
            "countryName_1": this._CountryService.myform.get("CountryName").value || '',
            "addedBy": this.accountService.currentUserValue.user.id,
            "isDeleted_2": Boolean(JSON.parse(this._CountryService.myform.get("IsDeleted").value) || 0),
          }
        }
        console.log("insertJson:", m_dataInsert);
  
        this._CountryService.countryMasterInsert(m_dataInsert).subscribe(response => {
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
          "countryMasterUpdate": {
            "countryId": this.vCountryId,
            "countryName": this._CountryService.myform.get("CountryName").value || '',
            "isDeleted": Boolean(JSON.parse(this._CountryService.myform.get("IsDeleted").value) || 0),
            "updatedBy": this.accountService.currentUserValue.user.id,
          }
        }
        console.log("UpdateJson:", m_dataUpdate);
  
        this._CountryService.countryMasterUpdate(m_dataUpdate).subscribe(response => {
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
      this._CountryService.myform.reset({ IsDeleted: true });
      this.dialogRef.close();
    }
    onClear(){
      this._CountryService.myform.reset({ IsDeleted: true });
    }

}
