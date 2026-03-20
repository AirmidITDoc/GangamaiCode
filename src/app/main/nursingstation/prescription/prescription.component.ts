import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { NewPrescriptionComponent } from './new-prescription/new-prescription.component';
import { PrescriptionService } from './prescription.service';
import { NewPrescriptionreturnComponent } from '../prescription-return/new-prescriptionreturn/new-prescriptionreturn.component';
import Swal from 'sweetalert2';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';



@Component({
    selector: 'app-prescription',
    templateUrl: './prescription.component.html',
    styleUrls: ['./prescription.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PrescriptionComponent implements OnInit {
     IsAdd: boolean = this.permissionService.getPermission(permissionCodes.NursingPrescription, permissionType.Add);
     

    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('grid2') grid2: AirmidTableComponent;
    @ViewChild('grid4') grid4: AirmidTableComponent;
    @ViewChild('iconisClosed') iconisClosed!: TemplateRef<any>;
    regNo: any = ""
    fname = "%"
    lname = "%"

    gridConfig1: gridModel = new gridModel();
    gridConfig4: gridModel = new gridModel();

    isShowDetailTable: boolean = false;
    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    isShowDetailTable1: boolean = false;

    constructor(public _PrescriptionService: PrescriptionService, public _matDialog: MatDialog,
        public toastr: ToastrService, private commonService: PrintserviceService,public permissionService: PagePermissionService,
        public datePipe: DatePipe,) { }

    ngOnInit(): void {
    }

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;


    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    allColumns1 = [
        
        { heading: "No.", key: "presNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Prescription Date", key: "ptime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 190 },
        { heading: "DOA", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA', width: 200 },//cant apply any date type
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "IPD NO", key: "ipdno", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 300 },

        { heading: "Ward Name | Bed No", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Payer Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        {
            heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    allFilters1 = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
          permissionCode: permissionCodes.NursingPrescription,
        apiUrl: "IPPrescription/PrescriptionPatientList",
        columnsList: this.allColumns1,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allFilters1
    }

    Clearfilter(event) {
        if (event == 'RegNo')
            this._PrescriptionService.mysearchform.get('RegNo').setValue("")
        if (event == 'fName')
            this._PrescriptionService.mysearchform.get('fName').setValue("")

        if (event == 'lName')
            this._PrescriptionService.mysearchform.get('lName').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.regNo = this._PrescriptionService.mysearchform.get('RegNo').value || '0'
        this.fname = this._PrescriptionService.mysearchform.get('fName').value + "%"
        this.lname = this._PrescriptionService.mysearchform.get('lName').value + "%"

        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.isShowDetailTable = false;
        let fromDate1 = this._PrescriptionService.mysearchform.get("startdate").value || "";
        let toDate1 = this._PrescriptionService.mysearchform.get("enddate").value || "";
        fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, "yyyy-MM-dd") : "";
        toDate1 = toDate1 ? this.datePipe.transform(toDate1, "yyyy-MM-dd") : "";
        this.gridConfig = {
            apiUrl: "IPPrescription/PrescriptionPatientList",
            columnsList: this.allColumns1,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: fromDate1, opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: toDate1, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
                { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }


    GetDetails1(data: any): void {

        console.log("detailList:", data)
        const ipMedID = data.medicalRecoredId;

        this.gridConfig1 = {
            apiUrl: "IPPrescription/PrescriptionDetailList",
            columnsList: [
                { heading: "Status", key: "isClosed", type: gridColumnTypes.status, align: "center" },
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
            ],
            sortField: "ipMedID",
            sortOrder: 0,
            filters: [
                { fieldName: "ipMedID", fieldValue: String(ipMedID), opType: OperatorComparer.Equals },
            ]
        };
        this.isShowDetailTable = true;
        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        }, 500);
    }

    

    viewgetIpprescriptionReportPdf(response) {
        console.log(response)
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "OP_IP_ID",
                        "fieldValue": String(response.medicalRecoredId),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "PatientType",
                        "fieldValue": "1",
                        "opType": "Equals"
                    }
                ],
                "mode": "NurIPprescriptionReport"
            }

            // console.log(param)
            this._PrescriptionService.getReportView(param).subscribe(res => {

                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Nursing Prescription" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    onSave(row: any = null) {
        const dialogRef = this._matDialog.open(NewPrescriptionComponent,
            {
                maxWidth: "80vw",
                height: '90%',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
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

    Presccancle(data) {
        debugger
        console.log(data)
        Swal.fire({
            title: 'Do you want to cancel the Prescription?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const sub = {
                    "ippreId": data.ippreId
                }
                this._PrescriptionService.PrescriptionCancle(sub).subscribe((response: any) => {
                    this.toastr.success(response.message);
                    this.grid.bindGridData();
                });
            }
        });
    }
}
