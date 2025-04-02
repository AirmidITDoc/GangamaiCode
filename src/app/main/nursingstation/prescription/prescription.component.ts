import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PrescriptionService } from './prescription.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { NewPrescriptionComponent } from './new-prescription/new-prescription.component';
import { Subscription } from 'rxjs';
import { Validators } from '@angular/forms';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { SampleRequestComponent } from 'app/main/pathology/sample-request/sample-request.component';
import { SampleCollectionComponent } from 'app/main/pathology/sample-collection/sample-collection.component';
import { ResultEntryComponent } from 'app/main/pathology/result-entry/result-entry.component';
import { RadiologyOrderListComponent } from 'app/main/radiology/radiology-order-list/radiology-order-list.component';
import Swal from 'sweetalert2';
import { CertificateComponent } from 'app/main/Mrd/certificate/certificate.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { NewPrescriptionreturnComponent } from '../prescription-return/new-prescriptionreturn/new-prescriptionreturn.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


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
     @ViewChild('iconisClosed') iconisClosed!: TemplateRef<any>;
    
        ngAfterViewInit() {
            // this.gridConfig1.columnsList.find(col => col.key === 'isClosed')!.template = this.iconisClosed;
        }

    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    gridConfig: gridModel = {
        apiUrl: "IPPrescription/PrescriptionPatientList",
        columnsList: [
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:200 },
            { heading: "Visite_Date", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DateTime", key: "date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "StoreName", key: "storeName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,
                actions: [
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetIpprescriptionReportPdf(data);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }
    gridConfig1: gridModel = new gridModel();

    isShowDetailTable: boolean = false;
    GetDetails1(data:any):void {
        debugger
        console.log("detailList:",data)
        let ipMedID=data.ipMedID;

        this.gridConfig1 = {
            apiUrl: "IPPrescription/PrescriptionDetailList",
            columnsList: [
                { heading: "Status", key: "isClosed", sort: true, align: 'left',type: gridColumnTypes.template, 
                    template:this.iconisClosed, width: 50 },
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
        },500);
    }

    gridConfig3: gridModel = {
        apiUrl: "IPPrescription/IPPrescriptionReturnList",
        columnsList: [            
            { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Adm Date", key: "vst_Adm_Date", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "IPMedID", key: "ipMedId", sort: true, align: 'left', emptySign: 'NA'},   
            {
                heading: "Action", key: "action",width: 50,align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetIpprescriptionreturnReportPdf(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._PrescriptionService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid2.bindGridData();
                            });
                        }
                    }]
            },//Action 1-view, 2-Edit,3-delete
            
        ],
        sortField: "PresReId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }
    
    gridConfig4: gridModel = new gridModel();
    isShowDetailTable1: boolean = false;

    GetDetails2(data){
        console.log("GetDetails2:",data)
        let PresReId=data.presReId;

        this.gridConfig4 = {
            apiUrl: "IPPrescription/IPPrescReturnItemDetList",
            columnsList: [
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA'},
            ],
            sortField: "PresReId",
            sortOrder: 0,
            filters: [    
                { fieldName: "PresReId", fieldValue: String(PresReId), opType: OperatorComparer.Equals }
            ]
        }
        this.isShowDetailTable1 = true;
        this.grid4.gridConfig = this.gridConfig4;
        this.grid4.bindGridData();
    }

    constructor(public _PrescriptionService: PrescriptionService, public _matDialog: MatDialog,
        public toastr: ToastrService, private commonService: PrintserviceService,
        public datePipe: DatePipe,) { }

    ngOnInit(): void {
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

          console.log(param)
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
       console.log(response)
        setTimeout(() => {
          let param = {
            
              "searchFields": [
                {
                  "fieldName": "PresReId",
                  "fieldValue": String(response.presReId), //"10012"
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
        let that = this;
        const dialogRef = this._matDialog.open(NewPrescriptionComponent,
            {
                maxHeight: '85vh',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
                this.grid.bindGridData();
                // if (result) {
            //     that.grid.bindGridData();
            // }
        });
    }

    onPrescriptionReturn(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewPrescriptionreturnComponent,
            {
                // maxWidth: "75vw",
                maxHeight: '75vh',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            // if (result) {
                this.grid2.bindGridData();
            // }
        });
    }

}
