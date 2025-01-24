import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { LocationMasterService } from '../location-master.service';
@Component({
  selector: 'app-newlocation',
  templateUrl: './newlocation.component.html',
  styleUrls: ['./newlocation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewlocationComponent implements OnInit {

  vLocationId:any;
  vLocationName:any;
  registerObj: any;
  vIsDeleted:any;

  constructor(
     public _locationService: LocationMasterService,
     private accountService: AuthenticationService,
     public dialogRef: MatDialogRef<NewlocationComponent>,
     public _matDialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public toastr: ToastrService,
     private _loggedService: AuthenticationService
   ) { }

  ngOnInit(): void {
    if(this.data){
      debugger
      this.registerObj=this.data.Obj;
      console.log("RegisterObj:",this.registerObj)
      this.vLocationName = this.registerObj.LocationName;
      this.vLocationId=this.registerObj.LocationId;
      if(this.registerObj.IsActive==true){
        this._locationService.myform.get("IsDeleted").setValue(true)
      }else{
        this._locationService.myform.get("IsDeleted").setValue(false)
      }
    }
  }
  onSave(){
    if (this.vLocationName == '' || this.vLocationName == null || this.vLocationName== undefined) {
          this.toastr.warning('Please enter LocationName  ', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
    
        Swal.fire({
          title: 'Do you want to Save the Location Recode ',
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Save it!" ,
          cancelButtonText: "No, Cancel"
        }).then((result) => {
          if (result.isConfirmed) {
              this.onSubmit();
          }
        });
  }
  onSubmit(){
    if(!this.vLocationId){

      var m_dataInsert={
        "locationMasterInsert": {
          "locatioName_1": this._locationService.myform.get("LocationName").value || '',
          "isActive_2": Boolean(JSON.parse(this._locationService.myform.get("IsDeleted").value) || 0),
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._locationService.locationMasterInsert(m_dataInsert).subscribe(response =>{
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
          "locationMasterUpdate": {
          "locationID": this.vLocationId,
          "locationName": this._locationService.myform.get("LocationName").value || '',
          "isDeleted": Boolean(JSON.parse(this._locationService.myform.get("IsDeleted").value) || 0),
          "updatedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._locationService.locationMasterUpdate(m_dataUpdate).subscribe(response =>{
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
    this._locationService.myform.reset({ IsDeleted: true });
    this.dialogRef.close();
}

}
