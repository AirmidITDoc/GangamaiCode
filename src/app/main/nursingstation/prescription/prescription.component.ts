import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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



@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  hasSelectedContacts: boolean;

  
  gridConfig: gridModel = {
      apiUrl: "Nursing/PrescriptionWardList",
      columnsList: [
          { heading: "Code", key: "presReId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' ,width:450},
          { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' ,width:100},
          { heading: "PrscTime", key: "presTime", sort: true, align: 'left', emptySign: 'NA',width:150 },
          { heading: "OP_IP_Id", key: "oP_IP_Id", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "AdmissionDate", key: "admissionDate", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "StoreName", key: "storeName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "oP_IP_Type", key: "oP_IP_Type", sort: true, align: 'left', emptySign: 'NA',width:50 },
        {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data);
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          this.confirmDialogRef = this._matDialog.open(
                              FuseConfirmDialogComponent,
                              {
                                  disableClose: false,
                              }
                          );
                          this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                          this.confirmDialogRef.afterClosed().subscribe((result) => {
                              if (result) {
                                  let that = this;
                                  this._PrescriptionService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                                      this.toastr.success(response.message);
                                      that.grid.bindGridData();
                                  });
                              }
                              this.confirmDialogRef = null;
                          });
                      }
                  }]
          } //Action 1-view, 2-Edit,3-delete
      ],
      sortField: "PresReId",
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
        { heading: "Code", key: "ipMedID", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' ,width:450},
        { heading: "MedicalRecoredId", key: "medicalRecoredId", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        { heading: "OP_IP_ID", key: "oP_IP_ID", sort: true, align: 'left', emptySign: 'NA',width:150 },
       
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this.confirmDialogRef = this._matDialog.open(
                            FuseConfirmDialogComponent,
                            {
                                disableClose: false,
                            }
                        );
                        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                        this.confirmDialogRef.afterClosed().subscribe((result) => {
                            if (result) {
                                let that = this;
                                this._PrescriptionService.deactivateTheStatus(data.ipMedID).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    that.grid.bindGridData();
                                });
                            }
                            this.confirmDialogRef = null;
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "ipMedID",
    sortOrder: 0,
    filters: [
      //   { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
        { fieldName: "ipMedID", fieldValue: "113582", opType: OperatorComparer.Equals },
      //   { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}
  constructor(public _PrescriptionService: PrescriptionService, public _matDialog: MatDialog,
      public toastr : ToastrService,) {}
  ngOnInit(): void {
  }

  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewPrescriptionComponent,
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

}
