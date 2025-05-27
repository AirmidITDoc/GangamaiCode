import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DailyExpensesService } from '../daily-expenses.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { DailyExpensesList } from '../daily-expenses.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-expenses-head-master',
  templateUrl: './expenses-head-master.component.html',
  styleUrls: ['./expenses-head-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ExpensesHeadMasterComponent implements OnInit {
displayedColumns = [
  "ExpHeadId",
  "HeadName",
  "IsDeleted",
  "AddedByName",
  "UpdatedByName",
  "action"
]
  dateTimeObj: any;
  ExpHeadForm:FormGroup
  ExpHeadSearchForm:FormGroup
  vHeadName:any;

 
  dsHeadlist = new MatTableDataSource<DailyExpensesList>();
      @ViewChild(MatSort) sort: MatSort;
      @ViewChild(MatPaginator) paginator: MatPaginator;

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
     this.createSearchheadform();
      this.getExpheadlist();
  } 
  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  }
  createheadform(){
    this.ExpHeadForm = this._formbuilder.group({
      HeadName:[''],
      IsActive:[true], 
    })
  }
    createSearchheadform(){
    this.ExpHeadSearchForm = this._formbuilder.group({ 
      ExpHeadSearch:[''],
      IsDeletedSearch:['2']
    })
  }
onSearch(){
  this.getExpheadlist();
}
  onSearchClear() {
    this.ExpHeadSearchForm.reset({
      ExpHeadSearch: "",
      IsDeletedSearch: "2",
    });
    this.getExpheadlist();
  }
  getExpheadlist() {
    var param = {
      HeadName: this.ExpHeadSearchForm.get("ExpHeadSearch").value.trim() + "%" || "%",
    };
    this._DailyExpensesService.getExpHeadList(param).subscribe((Menu) => {
      this.dsHeadlist.data = Menu as DailyExpensesList[],
        this.dsHeadlist.sort = this.sort,
        this.dsHeadlist.paginator = this.paginator;
    });
  }
  OnSave(){
    if (this.vHeadName == '' || this.vHeadName == undefined || this.vHeadName == null || this.vHeadName == '') {
      this.toastr.warning('Please enter HeadName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if(!this.ExpheadId){
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
    }else{  
      let updateMExpensesHeadMasterParam = {
        "headName": this.ExpHeadForm.get('HeadName').value || '',
        "isDeleted": this.ExpHeadForm.get('IsActive').value || '',
        "addedBy": this._loggedService.currentUserValue.user.id,
        "updatedBy": this._loggedService.currentUserValue.user.id,
        "expHedId": this.registerObj.ExpHedId || 0,
      }  
    let submitData={
      "updateMExpensesHeadMasterParam":updateMExpensesHeadMasterParam 
    } 
    console.log(submitData)
    this._DailyExpensesService.UpdateExpensesHead(submitData).subscribe(reponse =>{
      if(reponse){
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.registerObj = '';
        this.onClose();
      } else {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        this.onClose();
      }
    }, error => {
      this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }); 
    } 
  }
  onClose(){
    this.dialogRef.close()
  }
  registerObj:any;
  ExpheadId:any=0;
  onEdit(row){
      console.log(row)
      this.registerObj = row
      this.ExpheadId = row.ExpHedId || 0;
      var vdata={
        HeadName:row.HeadName,
        IsActive:row.IsDeleted
      }
      this.ExpHeadForm.patchValue(vdata)
  }
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  onDeactive(row) {
    this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      {
        disableClose: false,
      }
    );
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to deactive?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
         let Query 
        if(row.IsDeleted){
         Query = "Update M_ExpensesHeadMaster set IsDeleted=0 where ExpHedId=" + row.ExpHedId;
        }else{
        Query = "Update M_ExpensesHeadMaster set IsDeleted=1 where ExpHedId=" + row.ExpHedId;
        }
        this._DailyExpensesService.deactivateTheStatus(Query).subscribe((data) => (data));
        this.getExpheadlist();
      }
      this.confirmDialogRef = null;
    });
  }
  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^[a-zA-Z\s]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
