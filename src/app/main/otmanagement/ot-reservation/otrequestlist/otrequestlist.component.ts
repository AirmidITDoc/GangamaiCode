import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import Swal from 'sweetalert2';
import { OtReservationService } from '../ot-reservation.service';

@Component({
    selector: 'app-otrequestlist',
    templateUrl: './otrequestlist.component.html',
    styleUrls: ['./otrequestlist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OtrequestlistComponent implements OnInit {

    otRequestList: any[] = [];
    myFilterForm: FormGroup;
    isLoading: boolean = false;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    FromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    FirstName: any = "%"
    regNo: any = "0"
    LastName: any = "%"


    constructor(
        public _otreservationService: OtReservationService,
        public _fb: FormBuilder,
        public _dialogRef: MatDialogRef<OtrequestlistComponent>,
        public datePipe: DatePipe,
    ) { }

    ngOnInit() {
        // this.getfilterdata()
    }
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'opIpType')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'surgeryTypeId')!.template = this.actionsTemplate1;
    }
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

    allcolumns = [
        { heading: "", key: "opIpType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "", key: "surgeryTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },

        { heading: "Date&Time", key: "otbookingTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
        { heading: "OTReq-Date&Time", key: "otRequestTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Category Name", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Surgery Name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Surgeon Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Site Description", key: "siteDescriptionName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    ];
    allFilters = [
        { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
    ]
    gridConfig: gridModel = {
        apiUrl: "OTBooking/OtbookingRequestList",
        columnsList: this.allcolumns,
        sortField: "DoctorId",
        sortOrder: 0,
        filters: this.allFilters
    }
    getfilterdata() {
        this.FromDate = this.datePipe.transform(this._otreservationService.myformSearch.get('start').value, "yyyy-MM-dd")
        this.ToDate = this.datePipe.transform(this._otreservationService.myformSearch.get('end').value, "yyyy-MM-dd")
        this.gridConfig = {
            apiUrl: "OTBooking/OtbookingRequestList",
            columnsList: this.allcolumns,
            sortField: "DoctorId",
            sortOrder: 0,
            filters: [
                { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.StartsWith },
                { fieldName: "LastName", fieldValue: this.LastName, opType: OperatorComparer.StartsWith },
                { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },

                { fieldName: "FromDate", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },

            ],
            row: 25
        }
        setTimeout(() => {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        });
    }
    onSelectRequest(row: any): void {
        this._dialogRef.close(row); // send selected row to parent (OtReservationComponent)
    }

    onClose(): void {
        this._dialogRef.close(); // allow close without selection
    }

    // GetRecord(row) {
    //   this._dialogRef.close(row);
    // }

    GetRecord(row: any) {
        if (row.otRequestId > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Already reservation done',
                text: 'This request already has a reservation.',
                confirmButtonText: 'OK'
            });
        } else {
            this._dialogRef.close(row);
        }
    }

}

