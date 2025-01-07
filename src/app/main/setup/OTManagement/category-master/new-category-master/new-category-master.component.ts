import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { CategoryMasterService } from '../category-master.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-category-master',
  templateUrl: './new-category-master.component.html',
  styleUrls: ['./new-category-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewCategoryMasterComponent implements OnInit {

  vCategoryId:any;
  vCategoryName:any;
  registerObj: any;
  vIsDeleted:any;

  constructor(
    public _categoryMasterService: CategoryMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewCategoryMasterComponent>,
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
      this.vCategoryName = this.registerObj.SurgeryCategoryName;
      this.vCategoryId=this.registerObj.SurgeryCategoryId;
      if(this.registerObj.IsActive==true){
        this._categoryMasterService.myform.get("IsDeleted").setValue(true)
        // this.vIsDeleted=true;
      }else{
        this._categoryMasterService.myform.get("IsDeleted").setValue(false)
        // this.vIsDeleted=false;
      }
    }
  }

  onSave(){
    if (this.vCategoryName == '' || this.vCategoryName == null || this.vCategoryName== undefined) {
      this.toastr.warning('Please enter CategoryName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 

    Swal.fire({
      title: 'Do you want to Save the SurgeryCategory Recode ',
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
  
  onSubmit() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if(!this.vCategoryId){

      var m_dataInsert={
        "saveMOTSurgeryCategoryMasterParam": {
          "surGeryCategoryName": this._categoryMasterService.myform.get("CategoryName").value || '',
          "isActive": Boolean(JSON.parse(this._categoryMasterService.myform.get("IsDeleted").value) || 0),
          "createdBy": this._loggedService.currentUserValue.user.id,
          "surgeryCategoryId": 0
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._categoryMasterService.SurgeryCategoryInsert(m_dataInsert).subscribe(response =>{
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
          "updateMOTSurgeryCategoryMasterParam": {
          "surgeryCategoryId": this.vCategoryId,
          "surGeryCategoryName": this._categoryMasterService.myform.get("CategoryName").value || '',
          "isActive": Boolean(JSON.parse(this._categoryMasterService.myform.get("IsDeleted").value) || 0),
          "createdBy":this._loggedService.currentUserValue.user.id,
          "modifiedDate": formattedDate,
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._categoryMasterService.SurgeryCategoryUpdate(m_dataUpdate).subscribe(response =>{
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
  
  onClose(){
    this._categoryMasterService.myform.reset();
    this.dialogRef.close();
  }

}
export class CategoryMasterList {
  SurgeryCategoryId:number;
  SurgeryCategoryName:string;
  IsDeleted:String;
  IsActive:string;
  IsCancelled: boolean;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CategoryMasterList) {
    {
      this.SurgeryCategoryId = CategoryMasterList.SurgeryCategoryId || '';
      this.SurgeryCategoryName = CategoryMasterList.SurgeryCategoryName || '';
      this.IsDeleted = CategoryMasterList.IsDeleted;
      this.IsActive = CategoryMasterList.IsActive || '';
      this.IsCancelled = CategoryMasterList.IsCancelled;
    }
  }
}
