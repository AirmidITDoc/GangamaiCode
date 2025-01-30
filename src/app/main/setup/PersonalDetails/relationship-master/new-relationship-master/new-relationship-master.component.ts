import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RelationshipMasterService } from '../relationship-master.service';

@Component({
  selector: 'app-new-relationship-master',
  templateUrl: './new-relationship-master.component.html',
  styleUrls: ['./new-relationship-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewRelationshipMasterComponent implements OnInit {

  vRelationshipName:any;
  vRelationshipId:any;
  registerObj: any;
  vIsDeleted: any;

  constructor(
     public _relationshipService: RelationshipMasterService,
     private accountService: AuthenticationService,
     public dialogRef: MatDialogRef<NewRelationshipMasterComponent>,
     public _matDialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      debugger
      this.registerObj = this.data.Obj;
      console.log("RegisterObj:", this.registerObj)
      this.vRelationshipName = this.registerObj.RelationshipName;
      this.vRelationshipId = this.registerObj.RelationshipId;
      // this.vSexID=this.GenderName;
      if (this.registerObj.IsDeleted == true) {
        this._relationshipService.myform.get("IsDeleted").setValue(true)
      } else {
        this._relationshipService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  onSave() {
    if (this.vRelationshipName == '' || this.vRelationshipName == null || this.vRelationshipName == undefined) {
      this.toastr.warning('Please Enter Relationship  ', 'Warning !', {
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

    if (!this.vRelationshipId) {

      var m_dataInsert = {
        "relationshipMasterInsert": {
          "relationshipName_1": this._relationshipService.myform.get("RelationshipName").value || '',
          "addedBy": this.accountService.currentUserValue.user.id,
          "isDeleted_2": Boolean(JSON.parse(this._relationshipService.myform.get("IsDeleted").value) || 0),
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._relationshipService.relationshipMasterInsert(m_dataInsert).subscribe(response => {
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
        "relationshipMasterUpdate": {
          "relationshipId": this.vRelationshipId,
          "relationshipName": this._relationshipService.myform.get("RelationshipName").value || '',
          "isDeleted": Boolean(JSON.parse(this._relationshipService.myform.get("IsDeleted").value) || 0),
          "updatedBy": this.accountService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._relationshipService.relationshipMasterUpdate(m_dataUpdate).subscribe(response => {
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
    this._relationshipService.myform.reset({ IsDeleted: true });
    this.dialogRef.close();
  }
  onClear(){
    this._relationshipService.myform.reset({ IsDeleted: true });
  }
}
