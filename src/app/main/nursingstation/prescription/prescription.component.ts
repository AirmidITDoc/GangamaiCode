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



@Component({
    selector: 'app-prescription',
    templateUrl: './prescription.component.html',
    styleUrls: ['./prescription.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PrescriptionComponent implements OnInit {
    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('grid2') grid2: AirmidTableComponent;
    @ViewChild('grid4') grid4: AirmidTableComponent;
    // @ViewChild('iconisClosed') iconisClosed!: TemplateRef<any>;
    regNo: any = ""
    gridConfig1: gridModel = new gridModel();
    gridConfig4: gridModel = new gridModel();
    
    isShowDetailTable: boolean = false;
    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
   
    isShowDetailTable1: boolean = false;
    
     constructor(public _PrescriptionService: PrescriptionService, public _matDialog: MatDialog,
        public toastr: ToastrService, private commonService: PrintserviceService,
        public datePipe: DatePipe,) { }

    ngOnInit(): void {
    }


    ngAfterViewInit() {
        // this.gridConfig1.columnsList.find(col => col.key === 'isClosed')!.template = this.iconisClosed;
        //    this.gridConfig.columnsList.find(col => col.key === 'oP_IP_Type')!.template = this.patientTypetemp;
    }
//   @ViewChild('patientTypetemp') patientTypetemp!: TemplateRef<any>;
   
    allColumns1 = [

        { heading: "Prescription Date", key: "ptime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
        { heading: "Admission Date", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA', width: 170 },
      
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },

        { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        { heading: "Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        { heading: "Ward Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        // { heading: "Bed Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,
            actions: [
                {
                    action: gridActions.print, callback: (data: any) => {
                        this.viewgetIpprescriptionReportPdf(data);
                    }
                }]
        }
    ]

    allFilters1 = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        apiUrl: "IPPrescription/PrescriptionPatientList",
        columnsList: this.allColumns1,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allFilters1
    }

    Clearfilter(event) {
        if (event == 'RegNo')
            this._PrescriptionService.mysearchform.get('RegNo').setValue("")
        this.onChangeFirst();
    }

    onChangeFirst() {
        this.regNo = this._PrescriptionService.mysearchform.get('RegNo').value
        this.getfilterdata();
    }

    getfilterdata() {
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
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

 
    GetDetails1(data: any): void {
        
        console.log("detailList:", data)
        let ipMedID = data.ipMedID;

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

    allColumns2 = [
        //  { heading: "", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "Prescription Date", key: "presTime", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        { heading: "Admission Date", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        // { heading: "OPIPType", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 170 },

        {
            heading: "Action", key: "action", width: 50, align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.print, callback: (data: any) => {
                        this.viewgetIpprescriptionreturnReportPdf(data);
                    }
                }
                // , {
                //     action: gridActions.delete, callback: (data: any) => {
                //         this._PrescriptionService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                //             // this.toastr.success(response.message);
                //             this.grid2.bindGridData();
                //         });
                //     }
                // }
            ]
        },

    ]

    allFilters2 = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals }
    ]
    gridConfig3: gridModel = {
        apiUrl: "IPPrescription/IPPrescriptionReturnList",
        columnsList: this.allColumns2,
        sortField: "PresReId",
        sortOrder: 0,
        filters: this.allFilters2
    }

    Clearfilter1(event) {
        if (event == 'RegNo')
            this._PrescriptionService.mysearchform.get('RegNo').setValue("")
        this.onChangeFirst1();
    }

    onChangeFirst1() {
        this.regNo = this._PrescriptionService.mysearchform.get('RegNo').value
        this.getfilterdata1();
    }

    getfilterdata1() {
        debugger
          this.isShowDetailTable1 = false;
        let fromDate2 = this._PrescriptionService.mysearchform.get("startdate").value || "";
        let toDate2 = this._PrescriptionService.mysearchform.get("enddate").value || "";
        fromDate2 = fromDate2 ? this.datePipe.transform(fromDate2, "yyyy-MM-dd") : "";
        toDate2 = toDate2 ? this.datePipe.transform(toDate2, "yyyy-MM-dd") : "";
        this.gridConfig3 = {
            apiUrl: "IPPrescription/IPPrescriptionReturnList",
            columnsList: this.allColumns2,
            sortField: "PresReId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: fromDate2, opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: toDate2, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals }
            ]
        }
        this.grid2.gridConfig = this.gridConfig3;
        this.grid2.bindGridData();
    }

 

    GetDetails2(data) {
        // let PresReId = data.presReId;

        this.gridConfig4 = {
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
        this.isShowDetailTable1 = true;
        this.grid4.gridConfig = this.gridConfig4;
        this.grid4.bindGridData();
    }

   
    viewgetIpprescriptionReportPdf(response) {
        console.log(response)
        setTimeout(() => {
            let param = {
                "searchFields": [
                    {
                        "fieldName": "OP_IP_ID",
                        "fieldValue": String(response.ipMedID),
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

    viewgetIpprescriptionreturnReportPdf(response) {
     setTimeout(() => {
            let param = {
                "searchFields": [
                    {
                        "fieldName": "PresReId",
                        "fieldValue": String(response.presReId),
                        "opType": "Equals"
                    }
                ],
                "mode": "NurIPprescriptionReturnReport"
            }
        this._PrescriptionService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Nursing Prescription Return" + " " + "Viewer"
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

    onPrescriptionReturn(row: any = null) {
        const dialogRef = this._matDialog.open(NewPrescriptionreturnComponent,
            {
                 maxWidth: "80vw",
                height: '90%',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid2.bindGridData();
            });
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
}
