import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PhoneAppointListService } from './phone-appoint-list.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewPhoneAppointmentComponent } from './new-phone-appointment/new-phone-appointment.component';

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
    myformSearch:FormGroup;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    fromDate =this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd") 
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd") 

    DoctorId = "0";
    autocompleteModedeptdoc: string = "ConDoctor";

    gridConfig: gridModel = {
        apiUrl: "PhoneAppointment2/PhoneAppList",
        columnsList: [
            { heading: "-", key: "isCancelled", sort: true, align: 'left', type: gridColumnTypes.status, width: 20 },
            { heading: "SeqNo", key: "seqNo", sort: true, align: 'left', emptySign: 'NA', width: 30 },
            { heading: "App Date", key: "phAppDate", sort: true, align: 'left', emptySign: 'NA', width: 100},
            { heading: "App Time", key: "phAppTime", sort: true, align: 'left', emptySign: 'NA', width: 100},
            // { heading: "UHID", key: "regNo", sort: true, align: 'left', width: 100 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Department", key: "departmentName", emptySign: 'NA', align: "left", width: 150 },
            { heading: "Doctor Name", key: "doctorName",  emptySign: 'NA',align: "left", width: 150 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    // {
                    //     action: gridActions.edit, callback: (data: any) => {
                    //         this.onSave(data);
                    //     }
                    // },
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.Appprint(data);
                        }
                    },
                    {
                        action: gridActions.whatsapp, callback: (data: any) => {
                            this.whatsappAppoitment(data);
                        }
                    },
                                      
                    {
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
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue:this.toDate, opType: OperatorComparer.Equals },
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
        public datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.myformSearch=this._PhoneAppointListService.filterForm();
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
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

    selectChangedeptdoc(obj: any) {

        this.gridConfig.filters[2].fieldValue = obj.value

    }
    getValidationdoctorMessages() {
        return {
            DoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }

    Appprint(data){}
    Appointmentcancle(data){}
    whatsappAppoitment(data){}
}