import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RequestforlabtestService } from './requestforlabtest.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { NewRequestforlabComponent } from './new-requestforlab/new-requestforlab.component';
import { Subscription } from 'rxjs';
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
  selector: 'app-requestforlabtest',
  templateUrl: './requestforlabtest.component.html',
  styleUrls: ['./requestforlabtest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RequestforlabtestComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  hasSelectedContacts: boolean;

  
  gridConfig: gridModel = {
      apiUrl: "Nursing/LabRequestList",
      columnsList: [
          { heading: "Code", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          { heading: "Item Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' ,width:250},
          // { heading: "BillTime", key: "billTime", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          // { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA',width:50 },
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
                                  this._RequestforlabtestService.deactivateTheStatus(data.RequestId).subscribe((response: any) => {
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
      sortField: "RequestId",
      sortOrder: 0,
      filters: [
          { fieldName: "FromDate", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
          { fieldName: "ToDate", fieldValue: "11/01/2024", opType: OperatorComparer.Equals },
          { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
         // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }
  gridConfig1: gridModel = {
    apiUrl: "Nursing/LabRequestDetailsList",
    columnsList: [
        { heading: "Code", key: "requestId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        // { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' ,width:250},
        // { heading: "BillTime", key: "billTime", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        // { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA',width:50 },
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
                                this._RequestforlabtestService.deactivateTheStatus(data.RequestId).subscribe((response: any) => {
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
    sortField: "RequestId",
    sortOrder: 0,
    filters: [
        { fieldName: "RequestId", fieldValue: "RequestId", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}

  constructor(public _RequestforlabtestService: RequestforlabtestService, public _matDialog: MatDialog,
      public toastr : ToastrService,) {}
  ngOnInit(): void {
  }

  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewRequestforlabComponent,
        {
            maxWidth: "95vw",
            height: '95%',
            width: '80%',
            data: row
        });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            that.grid.bindGridData();
        }
    });
  }

}
