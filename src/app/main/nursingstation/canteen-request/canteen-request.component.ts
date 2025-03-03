import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CanteenRequestService } from './canteen-request.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NewCanteenRequestComponent } from './new-canteen-request/new-canteen-request.component';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";



@Component({
    selector: 'app-canteen-request',
    templateUrl: './canteen-request.component.html',
    styleUrls: ['./canteen-request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CanteenRequestComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;


    gridConfig: gridModel = {
        apiUrl: "Nursing/PrescriptionWardList",
        columnsList: [
            { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Visit/AdmDate", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "WardName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddUserName", key: "oP_IP_ID", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsBillGenerated", key: "isBillGenerated", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CanteenRequestService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "13936", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    gridConfig1: gridModel = {
        apiUrl: "Nursing/PrescriptionDetailList",
        columnsList: [
            // { heading: "Code", key: "reqId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "UnitMRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },

            // {
            //     heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.onSave(data);
            //             }
            //         }, {
            //             action: gridActions.delete, callback: (data: any) => {
            //                 this._CanteenRequestService.deactivateTheStatus(data.ipMedID).subscribe((response: any) => {
            //                     this.toastr.success(response.message);
            //                     this.grid.bindGridData();
            //                 });
            //             }
            //         }]
            // } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "ReqId",
        sortOrder: 0,
        filters: [

            { fieldName: "ReqId", fieldValue: "ReqId", opType: OperatorComparer.Equals },
            { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: "01/01/2025", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(public _CanteenRequestService: CanteenRequestService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }
    ngOnInit(): void {
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewCanteenRequestComponent,
            {
                maxWidth: "75vw",
                height: '75%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    NewRequest(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCanteenRequestComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }
}
