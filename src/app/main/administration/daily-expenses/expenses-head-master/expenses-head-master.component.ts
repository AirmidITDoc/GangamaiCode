import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DailyExpensesService } from '../daily-expenses.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expenses-head-master',
  templateUrl: './expenses-head-master.component.html',
  styleUrls: ['./expenses-head-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ExpensesHeadMasterComponent implements OnInit {

  dateTimeObj: any;
  ExpHeadForm:FormGroup
  vHeadName:any;

  constructor(
      public _DailyExpensesService:DailyExpensesService, 
        private _fuseSidebarService: FuseSidebarService, 
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private _loggedService: AuthenticationService, 
        private _formbuilder : FormBuilder,
            @Inject(MAT_DIALOG_DATA) public data: any,
            public dialogRef: MatDialogRef<ExpensesHeadMasterComponent>,
  ) { }

  ngOnInit(): void {
    this.createheadform();
  } 
  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  }
  createheadform(){
    this.ExpHeadForm = this._formbuilder.group({
      HeadName:[''],
      IsActive:[true]
    })
  }

  OnSave(){
    if (this.vHeadName == '' || this.vHeadName == undefined || this.vHeadName == null || this.vHeadName == '') {
      this.toastr.warning('Please enter HeadName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 

    let saveMExpensesHeadMasterParam={ 
      "headName": this.ExpHeadForm.get('HeadName').value || '',
      "isDeleted":this.ExpHeadForm.get('IsActive').value || '', 
      "addedBy": this._loggedService.currentUserValue.user.id,
      "updatedBy":0,
      "expHedId": 0, 
    }  
    let submitData={
      "saveMExpensesHeadMasterParam":saveMExpensesHeadMasterParam 
    } 
    console.log(submitData)
    this._DailyExpensesService.SaveExpensesHead(submitData).subscribe(reponse =>{
      if(reponse){
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.onClose();
      } else {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        this.onClose();
      }
    }, error => {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });  
  }
  onClose(){
    this.dialogRef.close()
  }
  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^[a-zA-Z]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
