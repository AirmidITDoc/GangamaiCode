import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from '../good-receiptnote.service';

@Component({
  selector: 'app-edit-grndetails',
  templateUrl: './edit-grndetails.component.html',
  styleUrls: ['./edit-grndetails.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditGRNDetailsComponent implements OnInit {


  registerObj:any;
  EditGRNFrom:FormGroup;
   // Bind dropdown mode
    dropdownMode = {
        gstCalcType: "GstCalcType",
        supplierMaster: "SupplierMaster"
    } 

  constructor(
      public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<EditGRNDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
        private _formbuilder:FormBuilder,
        private _formValidationservice:FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.CreatebarcodeForm();
    if (this.data?.Obj) {
      this.registerObj = this.data?.Obj;
      console.log(this.registerObj);
      this.EditGRNFrom.patchValue({
        SupplierId: this.registerObj?.supplierId ?? 0,
        InvoiceNo: this.registerObj?.invoiceNo,
      })

      const grnDateStr = this.registerObj?.grndate;
      if (grnDateStr) {
        const [day, month, year] = grnDateStr.split('/');
        const parsedDate = new Date(+year, +month - 1, +day);
        this.EditGRNFrom.get('GRNDate').setValue(this.datePipe.transform(parsedDate, 'MM/dd/yyyy'));
      }
      const InvDateStr = this.registerObj?.grndate;
      if (InvDateStr) {
        const [day, month, year] = InvDateStr.split('/');
        const parsedDate = new Date(+year, +month - 1, +day);
        this.EditGRNFrom.get('DateOfInvoice').setValue(this.datePipe.transform(parsedDate, 'MM/dd/yyyy'));
      } 
    }
  }
CreatebarcodeForm(){
  this.EditGRNFrom = this._formbuilder.group({
    GRNDate:['',[this._formValidationservice.allowEmptyStringValidator()]],
    SupplierId:[0,[this._formValidationservice.notEmptyOrZeroValidator()]],
    InvoiceNo:['',[this._formValidationservice.allowEmptyStringValidator()]],
    DateOfInvoice:['',[this._formValidationservice.allowEmptyStringValidator()]]
  })
}
    //supplier details
    selectChangeSupplier(supplier: any): void {
        let SupplierId = 0
        if (supplier.value > 0) {
            SupplierId = supplier?.value
        } else if (this.registerObj) {
            SupplierId = this.registerObj?.supplierId
        }
        this._GRNList.getSupplierdetails(SupplierId).subscribe(response => {
            if (response) {
                this.EditGRNFrom.patchValue({
                    Contact: response?.contactPerson || '',
                    Mobile: response?.mobile || 0,
                    SupplierId: response?.supplierId || 0,
                    SupplierName:response?.supplierName || '',
                    SupplierAddress:response?.address || ''
                })
            }
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
      getValidationMessages() {
        return {
            supplierId: [
                // { name: "required", Message: "SupplierId is required" }
            ] 
        };
    }
}

 
