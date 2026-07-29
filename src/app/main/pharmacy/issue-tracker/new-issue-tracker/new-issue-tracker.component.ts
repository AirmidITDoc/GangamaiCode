import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { IssueTrackerService } from '../issue-tracker.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
    selector: 'app-new-issue-tracker',
    templateUrl: './new-issue-tracker.component.html',
    styleUrls: ['./new-issue-tracker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewIssueTrackerComponent implements OnInit {

    dateTimeObj: any;
    screenFromString = 'Common-form';
    issueTrackerForm: FormGroup;

    constructor(
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NewIssueTrackerComponent>,
        public toastr: ToastrService,
        public _IssueTracker: IssueTrackerService,
        private _loggedService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) { }


    ngOnInit(): void {
        this.issueTrackerForm = this.createIssueTrackerForm();
        this.issueTrackerForm.markAllAsTouched();
    }

    createIssueTrackerForm(): FormGroup {
        return this._formBuilder.group({
            customerName: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            issueName: ['', Validators.required],
            issueDescription: ['', Validators.required],
            issueType:[0],
            issueRaised: [0],
            issueStatus: [0],
            issueAssigned: [0],
            developerComment: [''],
            testerComment: [''],
            isCodeRelease: [false],
            isReviewStatus: [false],
        })
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    onSubmit() {

    }

    onClear() {
        this.dialogRef.close();
    }

}
