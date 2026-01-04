import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { NewPrescriptionreturnComponent } from './new-prescriptionreturn/new-prescriptionreturn.component';
import { PrescriptionReturnService } from './prescription-return.service';
import Swal from 'sweetalert2';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
@Component({
    selector: 'app-prescription-return',
    templateUrl: './prescription-return.component.html',
    styleUrls: ['./prescription-return.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PrescriptionReturnComponent implements OnInit {
     IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Prescription, permissionType.Add);
         
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    regNo: any = ""
    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fname = "%"
    lname = "%"


    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        // this.gridConfig.columnsList.find(col => col.key === 'isOnFileTest')!.template = this.isOnFileTestIcon;
    }

    allColumns2 = [
        { heading: "Date", key: "presTime", sort: true, align: 'left', emptySign: 'NA', width: 170},
        { heading: "DOA", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA', width: 170},
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 300 },

        { heading: "Ward Name | Bed No", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Payer Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        {
            heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }

    ]

    allFilters2 = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.Prescription,
        apiUrl: "IPPrescription/IPPrescriptionReturnList",
        columnsList: this.allColumns2,
       
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
            { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _PrescriptionReturnService: PrescriptionReturnService, public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,public permissionService: PagePermissionService,
        public datePipe: DatePipe) { }
    ngOnInit(): void {
    }


    // GetDetails1(data){
    //     debugger
    //     this.gridConfig1 = {
    //         apiUrl: "IPPrescription/IPPrescriptionReturnList",
    //         columnsList: [
    //             { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA'},
    //             { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA'},
    //             { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA'},
    //         ],
    //         sortField: "PresReId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "PresReId", fieldValue: String(data.presReId), opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     this.isShowDetailTable = true;
    //     this.grid1.gridConfig = this.gridConfig1;
    //     this.grid1.bindGridData();
    // }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewPrescriptionreturnComponent,
            {
                maxWidth: "80vw",
                height: '90%',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }

    viewgetIpprescriptionreturnReportPdf(response) {
        console.log(response)
        this.commonService.Onprint("PresReId", response.presReId, "NurIPprescriptionReturnReport");
    }

    getfilterdata1() {
        // debugger
        this.isShowDetailTable = false;
        let fromDate2 = this._PrescriptionReturnService.mySearchForm.get("startdate").value || "";
        let toDate2 = this._PrescriptionReturnService.mySearchForm.get("enddate").value || "";
        fromDate2 = fromDate2 ? this.datePipe.transform(fromDate2, "yyyy-MM-dd") : "";
        toDate2 = toDate2 ? this.datePipe.transform(toDate2, "yyyy-MM-dd") : "";

        this.gridConfig = {
            apiUrl: "IPPrescription/IPPrescriptionReturnList",
            columnsList: this.allColumns2,
            sortField: "PresReId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: fromDate2, opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: toDate2, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
                { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    Clearfilter1(event) {
        if (event == 'RegNo')
            this._PrescriptionReturnService.mySearchForm.get('RegNo').setValue("")
        if (event == 'fName')
            this._PrescriptionReturnService.mySearchForm.get('fName').setValue("")
        if (event == 'lName')
            this._PrescriptionReturnService.mySearchForm.get('lName').setValue("")

        this.onChangeFirst1();
    }

    onChangeFirst1() {
        this.regNo = this._PrescriptionReturnService.mySearchForm.get('RegNo').value || "0"
        this.fname = this._PrescriptionReturnService.mySearchForm.get('fName').value + "%"
        this.lname = this._PrescriptionReturnService.mySearchForm.get('lName').value + "%"

        this.getfilterdata1();
    }

    // isShowDetailTable: boolean = false;
    GetDetails2(data) {
        // debugger
        this.gridConfig1 = {
            apiUrl: "IPPrescription/IPPrescReturnItemDetList",
            columnsList: [
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
            ],
            sortField: "PresReId",
            sortOrder: 0,
            filters: [
                { fieldName: "PresReId", fieldValue: String(data.presReId), opType: OperatorComparer.Equals }
            ]
        }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }


    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    Prescretruncancle(data) {
        Swal.fire({
            title: 'Do you want to cancel the Prescription Return?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                let sub={
                    presReId:data.presReId
                }
                this._PrescriptionReturnService.PrescriptionReturnCancle(sub).subscribe((response: any) => {
                    this.toastr.success(response.message);
                    this.grid.bindGridData();
                });
            }
        });
    }
}
