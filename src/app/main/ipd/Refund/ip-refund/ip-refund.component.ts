import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ip-refund',
  templateUrl: './ip-refund.component.html',
  styleUrls: ['./ip-refund.component.scss']
})
export class IPRefundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}


export class BrowseIpdreturnadvanceReceipt
{
    PaymentId: Number;
    BillNo: Number;
    RegNo: number;
    RegId: number;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    LastName: string;
    TotalAmt: number;
    BalanceAmt: number;
    GenderName:string;
    Remark: string;
    PaymentDate: any;
    CashPayAmount : number;
    ChequePayAmount : number;
    CardPayAmount : number;
    AdvanceUsedAmount: number;
    AdvanceId:number;
    RefundId: number;
    IsCancelled: boolean;
    AddBy: number;
    UserName:string;
    PBillNo: string;
    ReceiptNo: string;
    TransactionType:number;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    AddedBy:string;
    HospitalName:string;
    RefundAmount:number;
    RefundNo:number;
    HospitalAddress:string;
     Age:number;
     AgeYear:number;
     IPDNo:any;
    /**
     * Constructor
     *
     * @param BrowseIpdreturnadvanceReceipt
     */
    constructor(BrowseIpdreturnadvanceReceipt) {
        {
            this.PaymentId = BrowseIpdreturnadvanceReceipt.PaymentId || '';
            this.BillNo = BrowseIpdreturnadvanceReceipt.BillNo || '';
            this.RegNo = BrowseIpdreturnadvanceReceipt.RegNo || '';
            this.RegId = BrowseIpdreturnadvanceReceipt.RegId || '';
            this.PatientName = BrowseIpdreturnadvanceReceipt.PatientName || '';
            this.FirstName = BrowseIpdreturnadvanceReceipt.FirstName || '';
            this.MiddleName = BrowseIpdreturnadvanceReceipt.MiddleName || '';
            this.LastName = BrowseIpdreturnadvanceReceipt.LastName || '';
            this.TotalAmt = BrowseIpdreturnadvanceReceipt.TotalAmt || '';
            this.BalanceAmt = BrowseIpdreturnadvanceReceipt.BalanceAmt || '';
            this.Remark = BrowseIpdreturnadvanceReceipt.Remark || '';
            this.PaymentDate = BrowseIpdreturnadvanceReceipt.PaymentDate || '';
            this.CashPayAmount = BrowseIpdreturnadvanceReceipt.CashPayAmount || '';
            this.ChequePayAmount = BrowseIpdreturnadvanceReceipt.ChequePayAmount || '';
            this.CardPayAmount = BrowseIpdreturnadvanceReceipt.CardPayAmount || '';
            this.AdvanceUsedAmount = BrowseIpdreturnadvanceReceipt.AdvanceUsedAmount || '';
            this.AdvanceId = BrowseIpdreturnadvanceReceipt.AdvanceId || '';
            this.RefundId = BrowseIpdreturnadvanceReceipt.RefundId || '';
            this.IsCancelled = BrowseIpdreturnadvanceReceipt.IsCancelled || '';
            this.AddBy = BrowseIpdreturnadvanceReceipt.AddBy || '';
            this.UserName = BrowseIpdreturnadvanceReceipt.UserName || '';
            this.ReceiptNo = BrowseIpdreturnadvanceReceipt.ReceiptNo || '';
            this.PBillNo = BrowseIpdreturnadvanceReceipt.PBillNo || '';
            this.TransactionType = BrowseIpdreturnadvanceReceipt.TransactionType || '';
            this.PayDate = BrowseIpdreturnadvanceReceipt.PayDate || '';
            this.PaidAmount = BrowseIpdreturnadvanceReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseIpdreturnadvanceReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseIpdreturnadvanceReceipt.PayTMAmount || '';
            this.HospitalName=BrowseIpdreturnadvanceReceipt.HospitalName;
            this.RefundAmount = BrowseIpdreturnadvanceReceipt.  RefundAmount|| '';
            this. RefundNo = BrowseIpdreturnadvanceReceipt. RefundNo|| ''; 
            this. GenderName = BrowseIpdreturnadvanceReceipt. GenderName || ''; 
            this. AddedBy = BrowseIpdreturnadvanceReceipt. AddedBy|| '';
            this. HospitalAddress = BrowseIpdreturnadvanceReceipt. HospitalAddress || '';
           this.AgeYear=BrowseIpdreturnadvanceReceipt.AgeYear || ''
           this.IPDNo=BrowseIpdreturnadvanceReceipt.IPDNo || '';
        }

    }
}
