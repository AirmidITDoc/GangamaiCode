import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OttypeMasterService } from '../ottype-master.service';

@Component({
  selector: 'app-new-ottype-master',
  templateUrl: './new-ottype-master.component.html',
  styleUrls: ['./new-ottype-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOttypeMasterComponent implements OnInit {

  vOTTypeId:any;
  vTypeName:any;
  registerObj: any;

  constructor(
    public _otTypeMasterService: OttypeMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewOttypeMasterComponent>,
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
      this.vTypeName = this.registerObj.TypeName;
      this.vOTTypeId=this.registerObj.OTTableId;
      if(this.registerObj.IsActive==true){
        this._otTypeMasterService.myform.get("IsDeleted").setValue(true)
      }else{
        this._otTypeMasterService.myform.get("IsDeleted").setValue(false)
      }
    }
  }

  onClose(){
    this._otTypeMasterService.myform.reset();
    this.dialogRef.close();
  }

  onSave(){
    if (this.vTypeName == '' || this.vTypeName == null || this.vTypeName== undefined) {
      this.toastr.warning('Please enter TypeName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 

    Swal.fire({
      title: 'Do you want to Save the OtType Recode ',
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

  }

}
export class OtTypeMasterList {
  OTTypeId:number;
  TypeName:string;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtTypeMasterList) {
    {
      this.OTTypeId = OtTypeMasterList.OTTypeId || '';
      this.TypeName = OtTypeMasterList.TypeName || '';
      this.IsActive=OtTypeMasterList.IsActive || '';
    }
  }
}