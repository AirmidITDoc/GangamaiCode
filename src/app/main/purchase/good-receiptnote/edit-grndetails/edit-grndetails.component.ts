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
    selector: 'app-edit-grndetails',
    templateUrl: './edit-grndetails.component.html',
    styleUrls: ['./edit-grndetails.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditGRNDetailsComponent implements OnInit {


    registerObj: any;
    EditGRNFrom: FormGroup;
    screenFromString = 'grn-form';
    dateTimeObj: any;
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
        private _formbuilder: FormBuilder,
        private _formValidationservice: FormvalidationserviceService
    ) { }

    ngOnInit(): void {
        this.CreatebarcodeForm();
        if (this.data?.Obj) {
            this.registerObj = this.data?.Obj;
            console.log(this.registerObj);
            this.EditGRNFrom.patchValue({
                supplierId: this.registerObj?.supplierId ?? 0,
                invoiceNo: this.registerObj?.invoiceNo,
                grnid: this.registerObj?.grnid,
            })

            const grnDateStr = this.registerObj?.grndate;
            if (grnDateStr) {
                const [year, month, day] = grnDateStr.split('-'); // <-- fix the order
                const parsedDate = new Date(+year, +month - 1, +day);
                this.EditGRNFrom.get('grndate').setValue(this.datePipe.transform(parsedDate, 'MM/dd/yyyy'));
            }

            const InvDateStr = this.registerObj?.invDate;
            if (InvDateStr) {
                const [datePart, timePart] = InvDateStr.split(' '); // "14-10-2025" and "00:00:00"
                const [day, month, year] = datePart.split('-');
                const parsedDate = new Date(year, month - 1, day);
                this.EditGRNFrom.get('invDate').setValue(this.datePipe.transform(parsedDate, 'MM/dd/yyyy'));
            }
        }
    }
    CreatebarcodeForm() {
        this.EditGRNFrom = this._formbuilder.group({
            grndate: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            grntime: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            supplierId: [0, [this._formValidationservice.notEmptyOrZeroValidator()]],
            invoiceNo: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            invDate: ['', [this._formValidationservice.allowEmptyStringValidator()]],
            grnid: [0, [this._formValidationservice.notEmptyOrZeroValidator()]]
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
                    SupplierName: response?.supplierName || '',
                    SupplierAddress: response?.address || ''
                })
            }
        })
    }


    OnSave() {
        debugger
        const formattedTime = this.datePipe.transform(new Date(), 'hh:mm');
        const formattedDate = this.datePipe.transform(this.EditGRNFrom.get('grndate').value, 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime

        this.EditGRNFrom.patchValue({
            grndate: formattedDate || '1999-01-01',
            grntime: FormattedDateTime
        })
        this._GRNList.UpdateSupplierDet(this.EditGRNFrom.value).subscribe(response => {
            this.onClose();
        })
    }
    onClose() {
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


