import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BrowseIPAdvanceService } from './browse-ipadvance.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ViewIPAdvanceComponent } from './view-ipadvance/view-ipadvance.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../advance';
import * as converter from 'number-to-words';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service'; 
import { Xliff } from '@angular/compiler';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { BrowseIpdreturnadvanceReceipt } from '../ip-refundof-advance/ip-refundof-advance.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
@Component({
  selector: 'app-browse-ipadvance',
  templateUrl: './browse-ipadvance.component.html',
  styleUrls: ['./browse-ipadvance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseIPAdvanceComponent implements OnInit {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  hasSelectedContacts: boolean;

  
  gridConfig: gridModel = {
      apiUrl: "Admission/AdvanceList",
      columnsList: [   
          { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "RefDocName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "MobeileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA' }, 
          { heading: "AdvanceNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "AdvanceAmt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "CashPayAmt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "ChequePayAmt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "CardPayAmt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "PayTMAmt", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "BalAmt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "RefundAmt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
          
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
                                  this._BrowseIPAdvanceService.deactivateTheStatus(data.PbillNo).subscribe((response: any) => {
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
      sortField: "RegID",
      sortOrder: 0,
      filters: [
          { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
          { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
          { fieldName: "From_Dt", fieldValue: "01/01/2020", opType: OperatorComparer.Equals },
          { fieldName: "To_Dt", fieldValue: "11/11/2024", opType: OperatorComparer.Equals },
          { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
         // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }

  gridConfig1: gridModel = {
    apiUrl: "Admission/RefundOfAdvanceList",
    columnsList: [
        { heading: "Code", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "OpdNo", key: "opdNo", sort: true, align: "center" },
        // { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "CashPay", key: "cashPay",sort: true, align: "center" },
        // { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "CardPay", key: "cardPay", sort: true,align: "center" },
        // { heading: "AdvUsedPay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center" },
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
                                this._BrowseIPAdvanceService.deactivateTheStatusAdvRefund(data.RefundId).subscribe((response: any) => {
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
    sortField: "RefundId",
    sortOrder: 0,
    filters: [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: "01/01/2020", opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}  
  constructor(public _BrowseIPAdvanceService: BrowseIPAdvanceService, public _matDialog: MatDialog,
      public toastr : ToastrService,) {}
  ngOnInit(): void {
  }

  onSave(row: any = null) {
  }
}
