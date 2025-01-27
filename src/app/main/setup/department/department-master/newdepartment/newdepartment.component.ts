import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DepartmentMasterService } from '../department-master.service';

@Component({
  selector: 'app-newdepartment',
  templateUrl: './newdepartment.component.html',
  styleUrls: ['./newdepartment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewdepartmentComponent implements OnInit {

  vDepartmentId: any;
  vDepartmentName: any;
  registerObj: any;
  vIsDeleted: any;

  constructor(
    public _departmentService: DepartmentMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewdepartmentComponent>,
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
      this.vDepartmentName = this.registerObj.DepartmentName;
      this.vDepartmentId = this.registerObj.DepartmentId;
      if (this.registerObj.IsDeleted == true) {
        this._departmentService.myform.get("IsDeleted").setValue(true)
      } else {
        this._departmentService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  onSave() {
    if (this.vDepartmentName == '' || this.vDepartmentName == null || this.vDepartmentName == undefined) {
      this.toastr.warning('Please enter DepartmentName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    Swal.fire({
      title: 'Do you want to Save the Department Recode ',
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
  
  onSubmit(){
    if(!this.vDepartmentId){

      var m_dataInsert={
        "departmentMasterInsert": {
          "departmentName": this._departmentService.myform.get("DepartmentName").value || '',
          "isDeleted": Boolean(JSON.parse(this._departmentService.myform.get("IsDeleted").value) || 0),
          "addedBy":this._loggedService.currentUserValue.user.id,
          "updatedBy":this._loggedService.currentUserValue.user.id
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._departmentService.departmentMasterInsert(m_dataInsert).subscribe(response =>{
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
          "departmentMasterUpdate": {
          "departmentId": this.vDepartmentId,
          "departmentName": this._departmentService.myform.get("DepartmentName").value || '',
          "isDeleted": Boolean(JSON.parse(this._departmentService.myform.get("IsDeleted").value) || 0),
          "updatedBy":this._loggedService.currentUserValue.user.id
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._departmentService.departmentMasterUpdate(m_dataUpdate).subscribe(response =>{
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
      },
      error => {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
  }

  onClose() {
    this._departmentService.myform.reset({ IsDeleted: true });
    this.dialogRef.close();
  }

}
