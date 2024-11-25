import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrescriptionReturnService } from './prescription-return.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { NewPrescriptionreturnComponent } from './new-prescriptionreturn/new-prescriptionreturn.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-prescription-return',
  templateUrl: './prescription-return.component.html',
  styleUrls: ['./prescription-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrescriptionReturnComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  hasSelectedContacts: boolean;

  
  gridConfig: gridModel = {
      apiUrl: "Nursing/PrescriptionReturnList",
      columnsList: [
          { heading: "Code", key: "presReId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' ,width:550},
          { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' ,width:250},
          { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA',width:150 },
          // { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          // { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          // { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          // { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA',width:50 },
          // { heading: "Net Pay", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          
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
                                  this._PrescriptionReturnService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
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
       
          { fieldName: "PresReId", fieldValue: "8", opType: OperatorComparer.Equals },
         { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
         // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }
  gridConfig1: gridModel = {
    apiUrl: "Nursing/PrescriptionReturnList",
    columnsList: [
        { heading: "Code", key: "presReId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' ,width:450},
        { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA',width:150 },
        // { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        // { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        // { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        // { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA',width:50 },
        // { heading: "Net Pay", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        
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
                                this._PrescriptionReturnService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
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
     
        { fieldName: "PresReId", fieldValue: "8", opType: OperatorComparer.Equals },
       { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}

  constructor(public _PrescriptionReturnService: PrescriptionReturnService, public _matDialog: MatDialog,
      public toastr : ToastrService,) {}
  ngOnInit(): void {
  }

  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewPrescriptionreturnComponent,
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
