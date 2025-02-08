import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from '../good-receiptnote.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-barcode-save',
  templateUrl: './barcode-save.component.html',
  styleUrls: ['./barcode-save.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BarcodeSaveComponent implements OnInit {

  registerObj:any;
  GRNBarcodeFrom:FormGroup
  vItemName:any;
  vBatchNo:any;
  vExpDate:any;
  vBarcodeNo:any;

  constructor(
      public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<BarcodeSaveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
        private _formbuilder:FormBuilder
  ) { }

  ngOnInit(): void {
    this.CreatebarcodeForm();
    if(this.data.Obj){
      this.registerObj = this.data.Obj ;
      console.log(this.registerObj);  
      this.vItemName = this.registerObj.ItemName
      this.vBatchNo = this.registerObj.BatchNo
      this.vExpDate =this.datePipe.transform(this.registerObj.BatchExpDate , 'dd/mm/yyyy')
    }
  }
CreatebarcodeForm(){
  this.GRNBarcodeFrom = this._formbuilder.group({
    ItemName:[''],
    BatchNo:[''],
    ExpDate:[''],
    BarcodeNo:['']
  })
}



  OnSave(){ 
    let Query = "update T_CurrentStock set BarCodeSeqNo= "+ this.vBarcodeNo +"where StockId="+  this.registerObj.stockid  + "and ItemId="+  this.registerObj.ItemId  + "and StoreId="+ this.accountService.currentUserValue.user.storeId
    this._GRNList.getBarcodeSave(Query).subscribe(response =>{
      if(response){
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
      });
      this.onClose();
      }else{
        this.toastr.error('Record Not Saved Successfully.', 'error !', {
          toastClass: 'tostr-tost custom-toast-error',
      });
      }
    })
  } 
  onClose(){
    this._GRNList.GRNEmailFrom.reset();
    this.dialogRef.close();
  }
}
