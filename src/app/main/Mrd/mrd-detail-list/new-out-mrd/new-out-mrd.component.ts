import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { MrdDetailsService } from '../mrd-details.service';


@Component({
    selector: 'app-new-out-mrd',
    templateUrl: './new-out-mrd.component.html',
    styleUrls: ['./new-out-mrd.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewOutMrdComponent {
    NewOutMrdForm: FormGroup
    dateTimeString: any;
    rmdrecordId = 0
    @Output() dateTimeEventEmitter = new EventEmitter<{}>();
    isDatePckrDisabled: boolean = false;
    isTimeChanged: boolean = false;
    isDatePckrDisabled1: boolean = false;
    isTimeChanged1: boolean = false;
    minDate: Date;
    timeflag = 0;
    screenFromString = 'Common-form';
    date: string;
    registerObj = new AdmissionPersonlModel({});

    constructor(private _fuseSidebarService: FuseSidebarService,
        public _MrdService: MrdDetailsService,
        public formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,
        private advanceDataStored: AdvanceDataStored, public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewOutMrdComponent>,
        public datePipe: DatePipe) {

        const mydate = new Date()
        this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));

        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.date = now.toISOString().slice(0, 16);
    }


    opipid = 0
    ngOnInit(): void {
        this.NewOutMrdForm = this.createOutMrdForm();
        if (this.data) {
            debugger
            this.rmdrecordId = this.data.rmdrecordId
            this.opipid = this.data.opipid
            this.registerObj = this.data
        }

    }


    createOutMrdForm() {

        return this.formBuilder.group({
            outFileId: 0,
            opipid: [this.opipid, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            givenUserId: this.accountService.currentUserValue.userId,
            personName: ['', [Validators.required]],
            outDate: [(new Date()).toISOString()],
            outTime: ['', [Validators.required]],
            outReason: ['', [Validators.required]],
            CreatedBy: this.accountService.currentUserValue.userId,
        });
    }

    onSubmit() {
        this.NewOutMrdForm.get('outDate').setValue(this.datePipe.transform(this.NewOutMrdForm.get('outDate').value, 'yyyy-MM-dd'))
        this.NewOutMrdForm.get('outTime').setValue(this.datePipe.transform(this.NewOutMrdForm.get('outDate').value, "yyyy-MM-dd hh:mm"))
        if (!this.NewOutMrdForm.invalid) {
            console.log(this.NewOutMrdForm.value)
            this._MrdService.MrdOutFileUpdate(this.NewOutMrdForm.value).subscribe((response) => {
                this._matDialog.closeAll();
            });
        } else {
            const invalidFields = [];
            if (this.NewOutMrdForm.invalid) {
                for (const controlName in this.NewOutMrdForm.controls) {
                    if (this.NewOutMrdForm.controls[controlName].invalid) {
                        invalidFields.push(`MRD Out File Info Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }
    }


    pad(n: number) {
        return n < 10 ? '0' + n : n;
    }

    getValidationMessages() {
        return {
            opipid: [
                { name: "required", Message: "opipid is required" }
            ],
            mrdno: [
                { name: "required", Message: "mrdno is required" }
            ],
            location: [
                { name: "required", Message: "location is required" }
            ],
            inReason: [
                { name: "required", Message: "inReason is required" }
            ],
            inNo: [
                { name: "required", Message: "inNo is required" }
            ],
            returnPersonName: [
                { name: "required", Message: "returnPersonName is required" }
            ],
            personName: [
                { name: "required", Message: "personName is required" }
            ],
            outNo: [
                { name: "required", Message: "outNo is required" }
            ],
            outReason: [
                { name: "required", Message: "outNo is required" }
            ],
        };
    }



    // public now: Date = new Date();
    // onChangeDate(value) {
    //   if (value) {
    //     const dateOfReg = new Date(value);
    //     let splitDate = dateOfReg.toLocaleString("en-US").split(',');
    //     let splitTime = this.NewOutMrdForm.get('outDate').value.toLocaleString("en-US").split(',');
    //     this.eventEmitForParent(splitDate[0], splitTime[1]);
    //   }
    // }

    // onChangeTime(event) {
    //   this.timeflag = 1
    //   if (event) {

    //     let selectedDate = new Date(this.NewOutMrdForm.get('outTime').value);
    //     let splitDate = selectedDate.toLocaleString("en-US").split(',');
    //     let splitTime = this.NewOutMrdForm.get('outTime').value.toLocaleString("en-US").split(',');
    //     this.isTimeChanged = true;

    //     this.eventEmitForParent(splitDate[0], splitTime[1]);
    //   }
    // }


    // public now1: Date = new Date();
    // onChangeDate1(value) {
    //   if (value) {
    //     const dateOfReg = new Date(value);
    //     let splitDate = dateOfReg.toLocaleString("en-US").split(',');
    //     let splitTime = this.NewOutMrdForm.get('inDate').value.toLocaleString("en-US").split(',');
    //     this.eventEmitForParent(splitDate[0], splitTime[1]);
    //   }
    // }

    // onChangeTime1(event) {
    //   this.timeflag = 1
    //   if (event) {

    //     let selectedDate = new Date(this.NewOutMrdForm.get('inTime').value);
    //     let splitDate = selectedDate.toLocaleString("en-US").split(',');
    //     let splitTime = this.NewOutMrdForm.get('inTime').value.toLocaleString("en-US").split(',');
    //     this.isTimeChanged = true;
    //     // this.phdatetime = splitTime[1]
    //     // console.log(this.phdatetime)
    //     this.eventEmitForParent(splitDate[0], splitTime[1]);
    //   }
    // }

    // eventEmitForParent(actualDate, actualTime) {
    //   let localaDateValues = actualDate.split('/');
    //   let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    //   this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
    // }
    // dateTimeObj: any;
    // getDateTime(dateTimeObj) {
    //   console.log('dateTimeObj ==', dateTimeObj);
    //   this.dateTimeObj = dateTimeObj;
    // }
    onClose() {
        this.dialogRef.close();
    }
}