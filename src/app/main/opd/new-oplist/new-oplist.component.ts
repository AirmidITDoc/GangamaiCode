import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { OPListService } from './oplist.service';
import { NewOPBillingComponent } from '../OPBilling/new-opbilling/new-opbilling.component';
import { NewOPRefundofbillComponent } from '../op-search-list/new-oprefundofbill/new-oprefundofbill.component';


@Component({
  selector: 'app-new-oplist',
  templateUrl: './new-oplist.component.html',
  styleUrls: ['./new-oplist.component.scss']
})
export class NewOPListComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  hasSelectedContacts: boolean;

  
  gridConfig: gridModel = {
      apiUrl: "VisitDetail/OPBillList",
      columnsList: [
          { heading: "Code", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' ,width:200},
          { heading: "BillTime", key: "billTime", sort: true, align: 'left', emptySign: 'NA' ,width:150,type:8},
          { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA',width:80 },
          { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' ,width:150,type:6},
          { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA',width:50 },
          { heading: "Net Pay", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' ,width:50},
          
          {
              heading: "Action", key: "action", align: "right",width:200, type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data);
                      }
                  },
                  {
                    action: gridActions.print, callback: (data: any) => {
                        this.viewgetOPBillReportPdf(data);
                    }
                },
                {
                    action: gridActions.view, callback: (data: any) => {
                        this.getWhatsappshareBill(data);
                    }
                },
                 {
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
                                  this._OPListService.deactivateTheStatus(data.PbillNo).subscribe((response: any) => {
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
      sortField: "PbillNo",
      sortOrder: 0,
      filters: [
          { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
          { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
         { fieldName: "From_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
          { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
          { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
         // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }

  gridConfig1: gridModel = {
    apiUrl: "VisitDetail/OPPaymentList",
    columnsList: [
        { heading: "Code", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA',width:150 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
        { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "OpdNo", key: "opdNo", sort: true, align: "center" ,width:50},
        { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "CashPay", key: "cashPay",sort: true, align: "center" ,width:50},
        { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "CardPay", key: "cardPay", sort: true,align: "center" ,width:50},
        { heading: "AdvUsedPay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center",width:50 },
        {
            heading: "Action", key: "action", align: "right",width:200, type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                },
                {
                    action: gridActions.print, callback: (data: any) => {
                        this.viewgetOPPaymentReportPdf(data);
                    }
                },
                {
                    action: gridActions.view, callback: (data: any) => {
                        this.getWhatsappsharePaymentReceipt(data);
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
                                this._OPListService.deactivateTheStatuspayment(data.visitId).subscribe((response: any) => {
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
    sortField: "RegNo",
    sortOrder: 0,
    filters: [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "ReceiptNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}


gridConfig2: gridModel = {
    apiUrl: "VisitDetail/OPRefundList",
    columnsList: [
        { heading: "Code", key: "RefundId", sort: true, align: 'left', emptySign: 'NA' ,width:50},
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' ,width:250},
        { heading: "RefundDate", key: "RefundDate", sort: true, align: 'left', emptySign: 'NA' ,width:150,type:8},
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
            heading: "Action", key: "action", align: "right",width:200, type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                },
                {
                    action: gridActions.print, callback: (data: any) => {
                        this.viewgetOPRefundBillReportPdf(data);
                    }
                },
                {
                    action: gridActions.view, callback: (data: any) => {
                        this.getWhatsappshareRefundBill(data);
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
                                this._OPListService.deactivateTheStatus(data.RefundId).subscribe((response: any) => {
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
        { fieldName: "From_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
       // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
}

  constructor(public _OPListService: OPListService, public _matDialog: MatDialog,
      public toastr : ToastrService,) {}
  ngOnInit(): void {
  }

  onSave(row: any = null) {
  }

  viewgetOPBillReportPdf(Id){}
  getWhatsappshareBill(Id){}

  viewgetOPPaymentReportPdf(Id){}
  getWhatsappsharePaymentReceipt(Id){}

  viewgetOPRefundBillReportPdf(Id){}
  getWhatsappshareRefundBill(Id){}

  EditRefund(){
    debugger
    let that = this;
    const dialogRef = this._matDialog.open(NewOPRefundofbillComponent,
        {
            maxWidth: "95vw",
            height: '95%',
            width: '80%',
            // data: row
        });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            that.grid.bindGridData();
        }
    });
}

EditOPBill(){
    debugger
    let that = this;
    const dialogRef = this._matDialog.open(NewOPBillingComponent,
        {
            maxWidth: "95vw",
            height: '95%',
            width: '80%',
            // data: row
        });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            that.grid.bindGridData();
        }
    });
}
}
