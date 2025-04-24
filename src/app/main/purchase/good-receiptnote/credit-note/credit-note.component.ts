import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GoodReceiptnoteService } from '../good-receiptnote.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CreditNoteComponent implements OnInit {

  displayedColumns=[
    'Status',
    'GRNReturnNo',
    'SupplierName',
    'NetAmount'
  ]
  displayedColumnsADD=[
    'GRNReturnNo',
    'SupplierName',
    'NetAmount'
  ]

  registerObj:any; 
  vFinalNetAmt:any=0
  dsCreditnotelist = new MatTableDataSource
  dsCreditADDnotelist = new MatTableDataSource

  constructor(
        public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<CreditNoteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj
      console.log(this.registerObj)
    }
    this.getdebitNote();
    this.getdebitAddNote();
  }

getdebitNote(){
  var vdata={
    'SupplierId': this.registerObj.SupplierId ,    
    'StoreId':  this.accountService.currentUserValue.user.storeId
  }
  console.log(vdata)
  this._GRNList.getdebitnote(vdata).subscribe(data=>{
    this.dsCreditnotelist.data = data as []
    console.log(this.dsCreditnotelist.data)
  })
}

getdebitAddNote(){
  var vdata={
    'SupplierId': this.registerObj.SupplierId ,    
    'StoreId':  this.accountService.currentUserValue.user.storeId,
    // 'GrnID': 0
  }
  console.log(vdata)
  this._GRNList.getdebitADDnote(vdata).subscribe(data=>{
    this.dsCreditADDnotelist.data = data as []
    console.log(this.dsCreditADDnotelist.data)
  })
}
selectedList:any=[];
tableElementChecked(event, element) {
  if (event.checked) {
    this.selectedList.push(element)
    this.vFinalNetAmt +=element.NetAmount
  }else{
    this.vFinalNetAmt -=element.NetAmount
    let index = this.selectedList.indexOf(element);
    if (index !== -1) {
      this.selectedList.splice(index, 1);
    }
  }
}
onReset(){
  this.vFinalNetAmt = 0
  this.getdebitNote();
}
OnSave(){
  if(this.vFinalNetAmt == 0 || this.vFinalNetAmt == null || this.vFinalNetAmt == undefined || this.vFinalNetAmt == ''){
    this.toastr.warning('check final net amount is zero.', 'warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
  });
  return
  }
this.dialogRef.close(
  {
    FinalNetAmt:this.vFinalNetAmt,
    SelectedList : this.selectedList,
 
  }
  )
}











onClose(){
    this.dsCreditADDnotelist.data =[];
    this.dsCreditADDnotelist.data =[];
    this.vFinalNetAmt = 0;
    this.dialogRef.close();
  }
}
