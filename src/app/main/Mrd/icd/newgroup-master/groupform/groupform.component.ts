import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { NewgroupMasterService } from '../newgroup-master.service';

@Component({
  selector: 'app-groupform',
  templateUrl: './groupform.component.html',
  styleUrls: ['./groupform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GroupformComponent implements OnInit {

  vIcdCodeId: any;
  vIcdCodeName: any;
  registerObj: any;
  vIsDeleted: any;

  constructor(
    public _newGroupService: NewgroupMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<GroupformComponent>,
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
      this.vIcdCodeName = this.registerObj.ICDCodeName;
      this.vIcdCodeId = this.registerObj.ICDCdeMId;
      if (this.registerObj.isActive == true) {
        this._newGroupService.myGroupForm.get("IsDeleted").setValue(true)
      } else {
        this._newGroupService.myGroupForm.get("IsDeleted").setValue(false)
      }
    }
  }
  
  onSave() {
    if (this.vIcdCodeName == '' || this.vIcdCodeName == null || this.vIcdCodeName == undefined) {
      this.toastr.warning('Please enter Icd Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    Swal.fire({
      title: 'Do you want to Save the vDepartment Recode ',
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

  }
  onClose() {
    this._newGroupService.myGroupForm.reset({ IsDeleted: true });
    this.dialogRef.close();
  }

}
