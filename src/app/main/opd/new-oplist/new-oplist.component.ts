import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { OPListService } from './oplist.service';
import { NewOPBillingComponent } from '../OPBilling/new-opbilling/new-opbilling.component';
import { NewOPRefundofbillComponent } from '../op-search-list/new-oprefundofbill/new-oprefundofbill.component';
import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-new-oplist',
    templateUrl: './new-oplist.component.html',
    styleUrls: ['./new-oplist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class NewOPListComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    //   fromDate=new Date().toISOString();

    fromDate = "01/01/2021"//this.datePipe.transform(new Date(), "mm/ddyyyy")
    toDate = "12/10/2024"//this.datePipe.transform(new Date(), "mm/ddyyyy")
    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

    ]
    gridConfig: gridModel = {

        apiUrl: "VisitDetail/OPBillList",
        columnsList: [
            { heading: "Code", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            //   { heading: "BillCancelled", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA' ,width:50,type:16},
            { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 80, type: 22 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "BillTime", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
            { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Net Pay", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', width: 50 },

            {
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
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
                            this._OPListService.deactivateTheStatus(data.PbillNo).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "PbillNo",
        sortOrder: 0,
        filters: this.allfilters,
        //   [
        //       { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //       { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //       { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.Equals },
        //       { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        //       { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        //       { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
        //       { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        //       { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

        //   ],
        row: 25
    }

    gridConfig1: gridModel = {
        apiUrl: "VisitDetail/OPPaymentList",
        columnsList: [
            { heading: "Code", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "OpdNo", key: "opdNo", sort: true, align: "center", width: 50 },
            { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "CashPay", key: "cashPay", sort: true, align: "center", width: 50 },
            { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "CardPay", key: "cardPay", sort: true, align: "center", width: 50 },
            { heading: "AdvUsedPay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center", width: 50 },
            {
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
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
                            this._OPListService.deactivateTheStatuspayment(data.visitId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
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
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "ReceiptNo", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

        ],
        row: 25
    }


    gridConfig2: gridModel = {
        apiUrl: "VisitDetail/OPRefundList",
        columnsList: [
            { heading: "Code", key: "RefundId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "RefundDate", key: "RefundDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 8 },
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
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
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
                            this._OPListService.deactivateTheStatus(data.RefundId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
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
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _OPListService: OPListService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe) { }
    ngOnInit(): void {
    }

    onSave(row: any = null) {
    }

    viewgetOPBillReportPdf(Id) { }
    getWhatsappshareBill(Id) { }

    viewgetOPPaymentReportPdf(Id) { }
    getWhatsappsharePaymentReceipt(Id) { }

    viewgetOPRefundBillReportPdf(Id) { }
    getWhatsappshareRefundBill(Id) { }

    EditRefund() {
        
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

    EditOPBill() {
        
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


    onChangeDate(selectDate) {
        if (selectDate) {
            
            this.fromDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            console.log(this.fromDate);
            this.gridConfig.filters[2].fieldValue = this.fromDate

            this.gridConfig.filters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            ]
        }

    }
    onChangeDate1(selectDate) {
        if (selectDate) {
            
            this.toDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            console.log(this.toDate);
            this.gridConfig.filters[3].fieldValue = this.toDate

            this.gridConfig.filters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }]
        }
    }
}
export class BrowseOPDBill {
    BillNo: Number;
  
    RegId: number;
    RegNo: number;
    PatientName: string;
    FirstName: string;
    Middlename: string;
    LastName: string;
   
    TotalAmt: number;
    ConcessionAmt: number;
    NetPayableAmt: number;
    BillDate: any;
    IPDNo: number;
    ServiceName: String;
    Price: number;
    price: number;
    Qty: number;
    ChargesTotalAmount: number;
    NetAmount: number;
    PaidAmount: number;
    HospitalName: string;
    HospitalAddress: string;
    Phone: number;
    EmailId: any;
    ChargesDoctorName: string;
    TotalBillAmount: number;
    ConsultantDocName: string;
    DepartmentName: string;
    IsCancelled: boolean;
    OPD_IPD_Type: number;
    PBillNo: string;
    BDate: Date;
    VisitDate: Date;
    BalanceAmt: number;
    AddedByName: string;
    Department: any;
    Address: any;
    MobileNo: any;
    CashCounterID:number;
    //NEFTPayAmount:number;
    /**
     * Constructor
     *
     * @param BrowseOPDBill
     */
    constructor(BrowseOPDBill) {
      {
        this.BillNo = BrowseOPDBill.BillNo || '';
        this.RegId = BrowseOPDBill.RegId || '';
        this.RegNo = BrowseOPDBill.RegNo || '';
        this.PatientName = BrowseOPDBill.PatientName || '';
        this.FirstName = BrowseOPDBill.FirstName || '';
        this.Middlename = BrowseOPDBill.MiddleName || '';
        this.LastName = BrowseOPDBill.LastName || '';
     
        this.TotalAmt = BrowseOPDBill.TotalAmt || '';
        this.ConcessionAmt = BrowseOPDBill.ConcessionAmt || '';
        this.NetPayableAmt = BrowseOPDBill.NetPayableAmt || '';
        this.BillDate = BrowseOPDBill.BillDate || '';
        this.IPDNo = BrowseOPDBill.IPDNo || '';
        this.IsCancelled = BrowseOPDBill.IsCancelled || '';
        this.OPD_IPD_Type = BrowseOPDBill.OPD_IPD_Type || '';
        this.PBillNo = BrowseOPDBill.PBillNo || '';
        this.BDate = BrowseOPDBill.BDate || '';
        this.PaidAmount = BrowseOPDBill.PaidAmount || '';
        this.BalanceAmt = BrowseOPDBill.BalanceAmt || '';
        this.ServiceName = BrowseOPDBill.ServiceName || '';
        this.Price = BrowseOPDBill.Price || '';
        this.price = BrowseOPDBill.price || '';
        this.Qty = BrowseOPDBill.Qty || '';
        this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
        this.NetAmount = BrowseOPDBill.NetAmount || '';
        this.HospitalName = BrowseOPDBill.HospitalName || '';
        this.HospitalAddress = BrowseOPDBill.HospitalAddress || '';
        this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
        this.Phone = BrowseOPDBill.Phone || '';
        this.EmailId = BrowseOPDBill.EmailId || '';
        this.ConsultantDocName = BrowseOPDBill.ConsultantDocName || '';
        this.DepartmentName = BrowseOPDBill.DepartmentName || '';
        this.TotalBillAmount = BrowseOPDBill.TotalBillAmount || '';
        this.ChargesDoctorName = BrowseOPDBill.ChargesDoctorName || '';
        this.VisitDate = BrowseOPDBill.VisitDate || '';
        this.AddedByName = BrowseOPDBill.AddedByName || '';
        this.TotalAmt = BrowseOPDBill.TotalAmt || '';
  
        this.Address = BrowseOPDBill.Address || '';
        this.Department = BrowseOPDBill.Department || '';
        this.MobileNo = BrowseOPDBill.MobileNo || '';
        this.CashCounterID=BrowseOPDBill.CashCounterID ||0
      }
    }
  
  }
  