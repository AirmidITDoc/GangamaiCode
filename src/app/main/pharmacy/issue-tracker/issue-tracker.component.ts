import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { IssueTrackerService } from './issue-tracker.service';
import { FormGroup } from '@angular/forms';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { NewIssueTrackerComponent } from './new-issue-tracker/new-issue-tracker.component';

@Component({
    selector: 'app-issue-tracker',
    templateUrl: './issue-tracker.component.html',
    styleUrls: ['./issue-tracker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IssueTrackerComponent implements OnInit {
    myFilterform: FormGroup
    FromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    constructor(
        public _IssueTracker: IssueTrackerService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private _loggedService: AuthenticationService,
    ) { }

    allcolumns = [
        { heading: "Raised Date", key: "otRequestDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Issue No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Customer Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Issue Name", key: "bloodGroup", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Issue Description", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Raised ByName", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Assigned ByName", key: "surgeryDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Status Name", key: "estimateTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Resolved Date", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "DevComment", key: "devComment", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Comment", key: "comment", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "ReleaseStatus", key: "releaseStatus", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "AddedBy", key: "addedby", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "AddedByDate", key: "addedbydate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "ModifiedBy", key: "ModifiedBy", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "ModifiedDate", key: "ModifiedDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", width: 190, sticky: true, type: gridColumnTypes.template
            // ,
            // template: this.actionButtonTemplate
        }
    ];

    allFilters = [
        { fieldName: "From_Dt", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "To_Dt", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
    ]

    gridConfig: gridModel = {
        apiUrl: "",
        columnsList: this.allcolumns,
        sortField: "",
        sortOrder: 0,
        filters: this.allFilters
    }

    ngOnInit(): void {
        this.myFilterform = this._IssueTracker.createSearchForm();
    }

    onNewForm(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        const that = this;
        const dialogRef = this._matDialog.open(NewIssueTrackerComponent,
            {
                maxWidth: "90vw",
                // height: '90%',
                maxHeight: '95%',
                width: '90%',
            });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

}

export class IssueTrackerList {
    // IssueTrackerId: Number;
    IssueRaisedDate: number;
    IssueRaisedTime: number;
    IssueSummary: string;
    IssueDescription: string;
    UploadImagePath: any;
    ImageName: any;
    IssueStatus: any;
    IssueAssigned: any
    AddedBy: any;
    AddedDatetime: any;
    IssueRaised: any;
    IssueTrackerId: any
    IssueStatusId: any;
    constructor(IssueTrackerList) {
        {
            //this.IssueTrackerId = _IssueTrackerList.IssueTrackerId || 0;
            this.IssueRaisedDate = IssueTrackerList.IssueRaisedDate || 0;
            this.IssueRaisedTime = IssueTrackerList.IssueRaisedTime || 0;
            this.IssueSummary = IssueTrackerList.IssueSummary || "";
            this.IssueDescription = IssueTrackerList.IssueDescription || "";
            this.UploadImagePath = IssueTrackerList.UploadImagePath || "";
            this.ImageName = IssueTrackerList.ImageName || "";
            this.IssueStatus = IssueTrackerList.IssueStatus || "";
            this.IssueAssigned = IssueTrackerList.IssueAssigned || "";
            this.AddedBy = IssueTrackerList.AddedBy || 0;
            this.AddedDatetime = IssueTrackerList.AddedDatetime || 0;
            this.IssueRaised = IssueTrackerList.IssueRaised || '';
            this.IssueTrackerId = IssueTrackerList.IssueTrackerId || 0;
            this.IssueStatusId = IssueTrackerList.IssueStatusId || 0;
        }
    }
}

