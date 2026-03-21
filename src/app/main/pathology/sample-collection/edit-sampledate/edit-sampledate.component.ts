import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { SampleCollectionService } from '../sample-collection.service';

@Component({
    selector: 'app-edit-sampledate',
    templateUrl: './edit-sampledate.component.html',
    styleUrls: ['./edit-sampledate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditSampledateComponent {

    olddate: any;
    newExpdate: any;
    sampleform: FormGroup;
    registerObj: any;

    date: any;

    constructor(
        public _SampleCollectionService: SampleCollectionService,
        private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: UntypedFormBuilder,
        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<EditSampledateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private elementRef: ElementRef,
    ) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.date = now.toISOString().slice(0, 16);
    }
    sampleNo: any
    ngOnInit(): void {
        if (this.data.Obj) {
            this.registerObj = this.data.Obj;
            console.log(this.registerObj)
            this.olddate = this.registerObj.batchExpDate;
            this.sampleNo = this.registerObj.sampleNo.split(' ')[0]
            this.sampleform = this.createsampleForm()
        }

    }


    createsampleForm() {
        return this._formBuilder.group({

            sampleNo: [parseInt(this.sampleNo) || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            SampleCollectionTime: [this.date]

        });
    }

    onSubmit() {

        // if(this.expflag){
        // this.sampleform1.get('SampleTime').setValue(this.datePipe.transform(this.sampleform.get('OldexpDate').value, 'yyyy-MM-dd'))


        console.log(this.sampleform.value);
        this._SampleCollectionService.SampleEditdate(this.sampleform.value).subscribe(response => {
            this._matDialog.closeAll();

        });
        // }else Swal.fire("Enter Sample Date:")
    }


    OnReset() {
        this.sampleform.reset();
        this._matDialog.closeAll();
    }
    onClose() {
        this._matDialog.closeAll();
    }
}
