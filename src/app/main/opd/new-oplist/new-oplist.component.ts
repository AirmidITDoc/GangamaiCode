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
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormGroup } from '@angular/forms';


@Component({
    selector: 'app-new-oplist',
    templateUrl: './new-oplist.component.html',
    styleUrls: ['./new-oplist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class NewOPListComponent implements OnInit {
    myFilterbillform:FormGroup;
    myFilterpayform:FormGroup;
    myFilterrefundform:FormGroup;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    fromDate =this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd") 
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd") 

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
            { heading: "Patient", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width:20,type:22 },
            { heading: "BillCancelled", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA' ,width:20,type:16},
             { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
            { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "Total Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', width:100 },
            { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', width:100 },
            { heading: "Adv Used Pay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "PayCount", key: "payCount", sort: true, align: 'left', emptySign: 'NA', width: 70 },
            { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', width: 110 },
            { heading: "Cash Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Age", key: "patientAge", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250},
            { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            {
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
                   
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetOPBillReportPdf(data);
                        }
                    },
                    {
                        action: gridActions.view, callback: (data: any) => {
                            this.getWhatsappshareBill(data);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "PbillNo",
        sortOrder: 0,
        filters: this.allfilters,
               row: 250
    }

    gridConfig1: gridModel = {
        apiUrl: "VisitDetail/OPPaymentList",
        columnsList: [
            { heading: "Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', width: 150,type:6 },
            { heading: "Code", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "Bill Amount", key: "neftpayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CashPay", key: "cashPayAmount", sort: true, align: "center", width: 150 },
            { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CardPay", key: "cardPayAmount", sort: true, align: "center", width: 150 },
            { heading: "AdvUsedPay", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center", width: 150 },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CompantName", key: "companyName", sort: true, align: "center", width: 250 },
          
            {
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
                   
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetOPPaymentReportPdf(data);
                        }
                    },
                    {
                        action: gridActions.whatsapp, callback: (data: any) => {
                            this.getWhatsappsharePaymentReceipt(data);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Contains },
            { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

        ],
        row: 25
    }


    gridConfig2: gridModel = {
        apiUrl: "VisitDetail/OPRefundList",
        columnsList: [
            { heading: "RefundDate", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "RefundNo", key: "refundNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 8 },
            { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RefDoctorName", key: "refdoctorName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientType", key: "patientType", sort: true, align: "center" },
            { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CompanyName", key: "companyName",sort: true, align: "center" },
            // { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "CardPay", key: "cardPay", sort: true,align: "center" },
            // { heading: "AdvUsedPay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center" },
            {
                heading: "Action", key: "action", align: "right", width: 200, type: gridColumnTypes.action, actions: [
                   
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.viewgetOPRefundBillReportPdf(data);
                        }
                    },
                    {
                        action: gridActions.view, callback: (data: any) => {
                            this.getWhatsappshareRefundBill(data);
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
             this.myFilterbillform=this._OPListService.myFilterbillbrowseform();
        this.myFilterpayform=this._OPListService.myFilterpaymentbrowseform();
         this.myFilterrefundform=this._OPListService.myFilterrefundbrowseform();
    }

    onSave(row: any = null) {
    }


    onChangeStartDate(value) {
        this.gridConfig.filters[2].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
   
    viewgetOPBillReportPdf(data) {
        setTimeout(() => {
debugger
            let param = {
                
                    "searchFields": [
                      {
                        "fieldName": "BillNo",
                        "fieldValue": data.billNo,
                        "opType": "13"
                      }
                    ],
                    "mode": "OpBillReceipt"
                  }
            

            debugger
            console.log(param)
            this._OPListService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Op Bill  Viewer"

                        }

                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);
    }
    getWhatsappshareBill(Id) { }

    viewgetOPPaymentReportPdf(obj) { 
        setTimeout(() => {

            let param = {
                
                    "searchFields": [
                      {
                        "fieldName": "PaymentId",
                        "fieldValue": obj.paymentId,
                        "opType": "13"
                      }
                    ],
                    "mode": "OPPaymentReceipt"
                  }
            

            debugger
            console.log(param)
            this._OPListService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Op Bill  Viewer"

                        }

                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);
    }
    getWhatsappsharePaymentReceipt(Id) { }

    viewgetOPRefundBillReportPdf(obj) {
        setTimeout(() => {

            let param = {
                
                    "searchFields": [
                      {
                        "fieldName": "RefundId",
                        "fieldValue": obj.refundId,
                        "opType": "13"
                      }
                    ],
                    "mode": "OPRefundReceipt"
                  }
            

            debugger
            console.log(param)
            this._OPListService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Op Refund Receipt  Viewer"

                        }

                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);
     }
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
            
            // this.toDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            // console.log(this.toDate);
            // this.gridConfig.filters[3].fieldValue = this.toDate

            this.gridConfig.filters = [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
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


    getBilllistview(){
        let param={
      
            "searchFields": [
                  {
                    "fieldName": "FromDate",
                    "fieldValue": "10-01-2024",
                    "opType": "13"
                  },
              {
                    "fieldName": "ToDate",
                    "fieldValue": "12-12-2024",
                    "opType": "13"
                  }
                ],
                "mode": "OPDailyCollectionReport"
              }
        console.log(param)
         setTimeout(() => {
        
                    this._OPListService.getBilllistReport(param
                    ).subscribe(res => {
                        const dialogRef = this._matDialog.open(PdfviewerComponent,
                            {
                                maxWidth: "85vw",
                                height: '750px',
                                width: '100%',
                                data: {
                                    base64: res["base64"] as string,
                                    title: "OP Bill  Viewer"
                                }
                            });
                        dialogRef.afterClosed().subscribe(result => {
        
                        });
                    });
        
                }, 100);
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
  