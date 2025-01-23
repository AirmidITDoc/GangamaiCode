import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PhoneAppointListService } from './phone-appoint-list.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewPhoneAppointmentComponent } from './new-phone-appointment/new-phone-appointment.component';
import { GeturlService } from './geturl.service';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-phoneappointment',
    templateUrl: './phoneappointment.component.html',
    styleUrls: ['./phoneappointment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PhoneappointmentComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    fromDate = "01/01/2022"//this.datePipe.transform(new Date(), "mm/ddyyyy")
    toDate = "18/10/2025"//this.datePipe.transform(new Date(), "mm/ddyyyy")
  

    gridConfig: gridModel = {
        apiUrl: "PhoneAppointment2/PhoneAppList",
        columnsList: [
            { heading: "IsCancelled", key: "isCancelled", sort: true, align: 'left', type: gridColumnTypes.status,width: 150 },
            { heading: "SeqNo", key: "SeqNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "AppDate", key: "RegTime", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            // { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Department", key: "departmentId", emptySign: 'NA', align: "center", width: 150 },
            { heading: "Doctor", key: "doctorId",  emptySign: 'NA',align: "center", width: 150 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._PhoneAppointListService.phoneMasterCancle(data.phoneAppId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "phoneAppId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue:"11/11/2025", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            
        ],
        row: 25
    }
    constructor(
        public _PhoneAppointListService: PhoneAppointListService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewPhoneAppointmentComponent,
            {
                maxWidth: "75vw",
                maxHeight: '60%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}