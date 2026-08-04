import { Overlay } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { ConfigService } from 'app/core/services/config.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { RegistrationService } from '../../registration/registration.service';
import { AppointmentlistService } from '../appointmentlist.service';

@Component({
    selector: 'app-followup-list',
    templateUrl: './followup-list.component.html',
    styleUrls: ['./followup-list.component.scss']
})
export class FollowupListComponent {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    myformSearch: FormGroup;
    searchFormGroup: FormGroup;

    @Input() patientData: any;
    @Output() mouseEnter = new EventEmitter<void>();
    @Output() mouseLeave = new EventEmitter<void>();

    isLoading: boolean = false;
    DoctorId = "0";
    autocompleteModedeptdoc: string = "ConDoctor";
    doctorID = "0";
    f_name: any = "%"
    regNo = 0;
    l_name: any = "%"
    IsMark = "2"
    CompanyId = "0"
    autocompletedepartment: string = "Department";
    autocompleteCompany: string = "Company";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


    // displayedColumns: string[] = [
    //   'batchNo',
    //   'batchExpDate',
    //   'balanceQty',
    //   'unitMRP',
    //   'purchaseRate',
    //   'converFacto',
    //   'landedRate',
    //   'ExpDays',
    //   'prodLocation',
    //   'itemGenericName',
    //   // 'ItemCode',
    // ];
    isLoadingStr: string = '';
    // dataSource = new MatTableDataSource<VisitMaster1>();


    constructor(public _AppointmentlistService: AppointmentlistService, public _matDialog: MatDialog,
        private commonService: PrintserviceService, public _registrationService: RegistrationService,
        private advanceDataStored: AdvanceDataStored,
        private formBuilder: FormBuilder,
        public _ConfigService: ConfigService,
        public toastr: ToastrService, public datePipe: DatePipe,
        private _ActRoute: Router, private route: ActivatedRoute,
        private overlay: Overlay, public permissionService: PagePermissionService, private _configue: ConfigService,
    ) { }
    allfilters = [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "RegId", fieldValue: "0", opType: OperatorComparer.Equals },


    ];
    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    // @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    allcolumns = [
        { heading: "FollowUp Date", key: "followupDate", sort: true, align: 'left', emptySign: 'NA', width: 130, type: 6 },

        { heading: "UHID", key: "regID", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "DOA", key: "visitTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Age", key: "age", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "OPNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "Ref Doctor Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        // { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        // { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        // { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 230, type: gridColumnTypes.template },
        // { heading: "", key: "companyId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "center", width: 80, sticky: false, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
        // permissionCode: permissionCodes.Appointment,
        apiUrl: "VisitDetail/Follow_up_List",
        columnsList: this.allcolumns,
        sortField: "FollowupDate",
        sortOrder: 0,
        filters: this.allfilters
    }

    ngOnInit(): void {

        this.myformSearch = this._AppointmentlistService.filterForm();

    }



    onChangeFirst() {

        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
        this.regNo = this.myformSearch.get('RegNo').value || "0"

        this.getfilterdata();

    }
    onChangeFirst1(event) {
        debugger
        console.log(event)
        // if (event.key == 13) {
        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd")
        this.regNo = this.myformSearch.get('RegNo').value || "0"

        this.getfilterdata();
        // }
    }


    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "VisitDetail/Follow_up_List",
            columnsList: this.allcolumns,
            sortField: "FollowupDate",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },

                { fieldName: "RegId", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }

    getValidationdoctorMessages() {
        return {
            DoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    OnViewReportPdf(element) {
        Swal.fire({
            title: 'Select Report Format',
            text: "Choose how you want to view the report:",
            // icon: "warning",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            denyButtonColor: "#6c757d",
            cancelButtonColor: "#d33",
            confirmButtonText: "With Header",
            denyButtonText: "Without Header",
        }).then((flag) => {
            debugger
            if (flag.isConfirmed) {

                this.commonService.Onprint("VisitId", element.visitId, "AppointmentReceipt");
            } else
                this.commonService.Onprint("VisitId", element.visitId, "AppointmentReceiptWithoutHeader");
        });

    }
    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myformSearch.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myformSearch.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myformSearch.get('RegNo').setValue("")

        this.onChangeFirst();
    }

    onClose() {
        this._matDialog.closeAll()
    }
}
