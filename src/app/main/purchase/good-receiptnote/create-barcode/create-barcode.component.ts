import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { GoodReceiptnoteService } from '../good-receiptnote.service';

@Component({
    selector: 'app-create-barcode',
    templateUrl: './create-barcode.component.html',
    styleUrls: ['./create-barcode.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CreateBarcodeComponent implements OnInit {


    registerObj: any;
    GRNBarcodeFrom: FormGroup

    constructor(
        public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<CreateBarcodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
        private _formbuilder: FormBuilder,
        private _formValidationservice: FormvalidationserviceService
    ) { }

    ngOnInit(): void {
        this.CreatebarcodeForm();
        this.BarcodeSaveForm();
        if (this.data.Obj) {
            this.registerObj = this.data.Obj;
            console.log(this.registerObj);
            this.GRNBarcodeFrom.patchValue({
                ItemName: this.registerObj?.itemName ?? '',
                BatchNo: this.registerObj?.batchNo ?? '',
                ExpDate: this.registerObj?.batchExpDate, //this.datePipe.transform(this.registerObj?.batchExpDate , 'dd/mm/yyyy'),
            })
        }
    }
    CreatebarcodeForm() {
        this.GRNBarcodeFrom = this._formbuilder.group({
            ItemName: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            BatchNo: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            ExpDate: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            BarcodeNo: [''],
        })
    }
    barcodeSaveform: FormGroup;
    BarcodeSaveForm() {
        this.barcodeSaveform = this._formbuilder.group({
            barCodeSeqNo: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            stockId: ['', [this._formValidationservice.notEmptyOrZeroValidator()]],
            itemId: ['', [this._formValidationservice.notEmptyOrZeroValidator()]],
            storeId: [this.accountService.currentUserValue.user.storeId, [this._formValidationservice.onlyNumberValidator()]],
        })
    }
    OnSave() {
        debugger
        if ((this.registerObj?.stockid ?? 0) == 0) {
            this.toastr.warning('Stockid Is 0 please verify grn ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        const formvalue = this.GRNBarcodeFrom.getRawValue();
        this.barcodeSaveform.patchValue({
            barCodeSeqNo: formvalue?.BarcodeNo,
            stockId: this.registerObj?.stockid,
            itemId: this.registerObj?.itemId
        })
        this._GRNList.getBarcodeSave(this.barcodeSaveform.value).subscribe(response => {
            this.onClose();
        })
    }
    onClose() {
        this._GRNList.GRNEmailFrom.reset();
        this.dialogRef.close();
    }
}


