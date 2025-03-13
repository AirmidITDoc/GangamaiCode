import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PhoneAppointListService } from './phone-appoint-list.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { NewPhoneAppointmentComponent } from './new-phone-appointment/new-phone-appointment.component';

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-phoneappointment',
    templateUrl: './phoneappointment.component.html',
    styleUrls: ['./phoneappointment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PhoneappointmentComponent implements OnInit {
    myFilterform: FormGroup;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    DoctorId = "0";
    autocompleteModedeptdoc: string = "ConDoctor";

    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsflgBillNo') actionsflgBillNo!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;


    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'regNo')!.template1 = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    gridConfig: gridModel = {
        apiUrl: "PhoneAppointment2/PhoneAppList",
        columnsList: [
            { heading: "-", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "-", key: "regNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "SeqNo", key: "seqNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "App Date", key: "phAppDate", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "App Time", key: "phAppTime", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Department", key: "departmentName", emptySign: 'NA', align: "left", width: 200 },
            { heading: "Doctor Name", key: "doctorName", emptySign: 'NA', align: "left", width: 200 },
            {
                heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate  // Assign ng-template to the column
            }
            // {
            //     heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
            //         {
            //             action: gridActions.edit, callback: (data: any) => {
            //                 this.onSave(data);
            //             }
            //         },
            //         {
            //             action: gridActions.print, callback: (data: any) => {
            //                 this.Appprint(data);
            //             }
            //         },
            //         {
            //             action: gridActions.whatsapp, callback: (data: any) => {
            //                 this.whatsappAppoitment(data);
            //             }
            //         },

            //         {
            //             action: gridActions.delete, callback: (data: any) => {
            //                 debugger
            //                 let s={
            //                     phoneAppId:data.phoneAppId
            //                 }
            //                 this._PhoneAppointListService.phoneMasterCancle(s).subscribe((response: any) => {
            //                     this.toastr.success(response.message);
            //                     this.grid.bindGridData();
            //                 });
            //             }
            //         }]
            // } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "phoneAppId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

        ]
    }
    constructor(
        public _PhoneAppointListService: PhoneAppointListService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
        public datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._PhoneAppointListService.filterForm();
    }


    changeStatus(status: any) { }
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

    OnViewReportPdf(data) { }
    Appointmentcancle(data) {
        Swal.fire({
            title: 'Do you want to cancel the Phone Appointment?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {

                let s = {
                    phoneAppId: data.phoneAppId
                }
                this._PhoneAppointListService.phoneMasterCancle(s).subscribe((response: any) => {
                    this.toastr.success(response.message);
                    this.grid.bindGridData();
                });
            }
        });
    }
    whatsappAppoitment(data) { }
}