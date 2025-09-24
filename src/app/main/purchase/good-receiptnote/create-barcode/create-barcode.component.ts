import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from '../good-receiptnote.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-create-barcode',
  templateUrl: './create-barcode.component.html',
  styleUrls: ['./create-barcode.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations
})
export class CreateBarcodeComponent implements OnInit{


  registerObj:any;
  GRNBarcodeFrom:FormGroup  

  constructor(
      public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<CreateBarcodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
        private _formbuilder:FormBuilder,
        private _formValidationservice:FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.CreatebarcodeForm();
    if(this.data.Obj){
      this.registerObj = this.data.Obj ;
      console.log(this.registerObj);   
      this.GRNBarcodeFrom.patchValue({
        ItemName:this.registerObj?.itemName ?? '',
        BatchNo:this.registerObj?.batchNo ?? '',
        ExpDate:this.registerObj?.batchExpDate //this.datePipe.transform(this.registerObj?.batchExpDate , 'dd/mm/yyyy')
      })
    }
  }
CreatebarcodeForm(){
  this.GRNBarcodeFrom = this._formbuilder.group({
    ItemName:['',[this._formValidationservice.allowEmptyStringValidator()]],
    BatchNo:['',[this._formValidationservice.allowEmptyStringValidator()]],
    ExpDate:['',[this._formValidationservice.allowEmptyStringValidator()]],
    BarcodeNo:['']
  })
}



  OnSave(){ 
 //   let Query = "update T_CurrentStock set BarCodeSeqNo= "+ this.vBarcodeNo +"where StockId="+  this.registerObj.stockid  + "and ItemId="+  this.registerObj.ItemId  + "and StoreId="+ this.accountService.currentUserValue.user.storeId
    // this._GRNList.getBarcodeSave(Query).subscribe(response =>{
    //   if(response){
    //     this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //       toastClass: 'tostr-tost custom-toast-success',
    //   });
    //   this.onClose();
    //   }else{
    //     this.toastr.error('Record Not Saved Successfully.', 'error !', {
    //       toastClass: 'tostr-tost custom-toast-error',
    //   });
    //   }
    // })
  } 
  onClose(){
    this._GRNList.GRNEmailFrom.reset();
    this.dialogRef.close();
  }
}

 
