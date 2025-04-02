import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ToastrService } from 'ngx-toastr';
import { BrowseIpAdvanceService } from './browse-ip-advance.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
    selector: 'app-browse-ip-advance',
    templateUrl: './browse-ip-advance.component.html',
    styleUrls: ['./browse-ip-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BrowseIPAdvanceComponent implements OnInit {

    constructor(
        public _BrowseIpAdvanceService: BrowseIpAdvanceService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
          private commonService: PrintserviceService,
      ) { }

    ngOnInit(): void { }

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplateone') actionButtonTemplateone!: TemplateRef<any>;


    ngAfterViewInit() {
        this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateone;
    }

     @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;

     f_name: any = ""
     regNo: any = "0"
     l_name: any = ""
     PBillNo: any = "0"

     af_name: any = ""
     aregNo: any = "0"
     al_name: any = ""
     afromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
     atoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

     allAdvanceFilter=[
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    allAdvanceColumns=[
        { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', type: 6}, 
        { heading: "AdvanceNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA'}, 
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 350}, 
        { heading: "IPDNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA'}, 
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 250}, 
        { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 250}, 
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 350}, 
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA'}, 
        { heading: "Ward Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA'}, 
        { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount}, 
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount}, 
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount}, 
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount}, 
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount}, 
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount}, 
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount}, 
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA'}, 
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplateone  // Assign ng-template to the column
        }
    ]

    allRefundOfAdvanceFilters=[
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    allRefundOfAdvanceColumns=[
        { heading: "UHIDNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Date", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6},
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 350 }, 
        { heading: "Advance Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }, 
        { heading: "Advance UsedAmt", key: "advanceUsedAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }, 
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }, 
        { heading: "PayDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 6}, 
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount}, 
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount}, 
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount},
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 300 }, 
        { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA'}, 
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

        gridConfig: gridModel = {
            apiUrl: "Advance/BrowseAdvanceList",
            columnsList: this.allAdvanceColumns,
            sortField: "RegID",
            sortOrder: 0,
            filters: this.allAdvanceFilter
        }
    
        gridConfig1: gridModel = {
            apiUrl: "Advance/BrowseRefundOfAdvanceList",
            columnsList:this.allRefundOfAdvanceColumns,
            sortField: "RegId",
            sortOrder: 0,
            filters: this.allRefundOfAdvanceFilters
        }

        onChangeAdvance() {
            this.fromDate = this.datePipe.transform(this._BrowseIpAdvanceService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(this._BrowseIpAdvanceService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
            this.f_name = this._BrowseIpAdvanceService.UserFormGroup.get('FirstName').value + "%"
            this.l_name = this._BrowseIpAdvanceService.UserFormGroup.get('LastName').value + "%"
            this.regNo = this._BrowseIpAdvanceService.UserFormGroup.get('RegNo').value || "0"
            this.PBillNo = this._BrowseIpAdvanceService.UserFormGroup.get('PBillNo').value || "0"
            this.getfilterAdvanceList();
        }
    
        getfilterAdvanceList() {
    
            this.gridConfig = {
                apiUrl: "Advance/BrowseAdvanceList",
                columnsList: this.allAdvanceColumns,
                sortField: "RegID",
                sortOrder: 0,
                filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals }
                ]
            }
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        }
    
        ClearfilterAdvance(event) {
            console.log(event)
            if (event == 'FirstName')
                this._BrowseIpAdvanceService.UserFormGroup.get('FirstName').setValue("")
            else
                if (event == 'LastName')
                    this._BrowseIpAdvanceService.UserFormGroup.get('LastName').setValue("")
            if (event == 'RegNo')
                this._BrowseIpAdvanceService.UserFormGroup.get('RegNo').setValue("")
            if (event == 'PBillNo')
                this._BrowseIpAdvanceService.UserFormGroup.get('PBillNo').setValue("")
    
            this.onChangeAdvance();
        }
   
        onChangeAdvanceOfRefund() {
            this.afromDate = this.datePipe.transform(this._BrowseIpAdvanceService.AdvanceOfRefund.get('fromDate').value, "yyyy-MM-dd")
            this.atoDate = this.datePipe.transform(this._BrowseIpAdvanceService.AdvanceOfRefund.get('enddate').value, "yyyy-MM-dd")
            this.af_name = this._BrowseIpAdvanceService.AdvanceOfRefund.get('FirstName').value + "%"
            this.al_name = this._BrowseIpAdvanceService.AdvanceOfRefund.get('LastName').value + "%"
            this.aregNo = this._BrowseIpAdvanceService.AdvanceOfRefund.get('RegNo').value || "0"
            this.getfilterAdvanceOfRefundList();
        }
    
        getfilterAdvanceOfRefundList() {
    
            this.gridConfig1 = {
                apiUrl: "Advance/BrowseRefundOfAdvanceList",
                columnsList: this.allRefundOfAdvanceColumns,
                sortField: "RegId",
                sortOrder: 0,
                filters: [{ fieldName: "F_Name", fieldValue: this.af_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.al_name, opType: OperatorComparer.Contains },
                { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.aregNo, opType: OperatorComparer.Equals }
                ]
            }
            // this.grid1.gridConfig = this.gridConfig1;
            // this.grid1.bindGridData();
        }
    
        ClearfilterAdvanceOfRefund(event) {
            console.log(event)
            if (event == 'FirstName')
                this._BrowseIpAdvanceService.AdvanceOfRefund.get('FirstName').setValue("")
            else
                if (event == 'LastName')
                    this._BrowseIpAdvanceService.AdvanceOfRefund.get('LastName').setValue("")
            if (event == 'RegNo')
                this._BrowseIpAdvanceService.AdvanceOfRefund.get('RegNo').setValue("")
    
            this.onChangeAdvanceOfRefund();
        }

        OnAdvanceViewReportPdf(element) {
            console.log(element)
            this.commonService.Onprint("AdvanceDetailID", element.advanceDetailID, "IpAdvanceReceipt");
         }
        

         getAdvreturnview(element) {
            console.log(element)
            this.commonService.Onprint("RefundId", element.refundId, "IpAdvanceRefundReceipt");
         }
        whatsappAppoitment(data) { }
       
}


export class IpdAdvanceBrowseModel {
    RegNo: Number;
    PatientName: string;
    date: Date;
    AdvanceNo: string;
    TransactionID: number;
    advanceAmount: number;
    UsedAmount: number;
    BalanceAmount: number;
    AddedBy: number;
    CashPayAmount: number;
    ChequePayAmount: number;
    CardPayAmount: number;
    TransactionType: number;
    UserName: string;
    refundAmount:number;
    PrevAdvAmt:number;
    AdvanceId:number;
    IPDNo:any;
    advanceDetailID:number;
    HospitalName:any;
    HospAddress:any;
    Phone:any;
    EmailId:any;
    reason:any;
    advanceId:any
    Address: any;
    PatientType: any;
    TariffName:any;
    AdmissionDate:any;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    CardNo: any;
    CardBankName:any;
    ChequeNo:any;
    PaymentDate: any;
    AdvanceUsedAmount: number;
      Remark:any;
      usedAmount:any;
      balanceAmount:any;

    /**
  * Constructor
  *
  * @param IpdAdvanceBrowseModel
  */
    constructor(IpdAdvanceBrowseModel) {
        {
            this.RegNo = IpdAdvanceBrowseModel.RegNo || '';
            this.PatientName = IpdAdvanceBrowseModel.PatientName || '';
            this.date = IpdAdvanceBrowseModel.date || '';
            this.AdvanceNo = IpdAdvanceBrowseModel.AdvanceNo || '';
            this.advanceAmount = IpdAdvanceBrowseModel.advanceAmount || '';
            this.UsedAmount = IpdAdvanceBrowseModel.UsedAmount || '';
            this.BalanceAmount = IpdAdvanceBrowseModel.BalanceAmount || '';
            this.AddedBy = IpdAdvanceBrowseModel.AddedBy || '';
            this.CashPayAmount = IpdAdvanceBrowseModel.CashPayAmount || '';
            this.ChequePayAmount = IpdAdvanceBrowseModel.ChequePayAmount || '';
            this.CardPayAmount = IpdAdvanceBrowseModel.CardPayAmount || '';
            this.UserName = IpdAdvanceBrowseModel.UserName || '';
            this.refundAmount = IpdAdvanceBrowseModel.refundAmount || '';
            this.PrevAdvAmt=IpdAdvanceBrowseModel.PrevAdvAmt || '';
            this.advanceId = IpdAdvanceBrowseModel.advanceId || 0;
            this.advanceDetailID = IpdAdvanceBrowseModel.advanceDetailID || 0;
            this.IPDNo = IpdAdvanceBrowseModel.IPDNo || 0;
            this.balanceAmount = IpdAdvanceBrowseModel.balanceAmount || 0;
            this.usedAmount = IpdAdvanceBrowseModel.usedAmount || 0;
            this.HospitalName=IpdAdvanceBrowseModel.HospitalName || '';
            this.HospAddress = IpdAdvanceBrowseModel.HospAddress || '';
            this.Phone = IpdAdvanceBrowseModel.Phone || 0;
            this.EmailId = IpdAdvanceBrowseModel.EmailId || 0;
            this.reason = IpdAdvanceBrowseModel.reason || 0;
  
            this.Address=IpdAdvanceBrowseModel.Address || '';
            this.PatientType = IpdAdvanceBrowseModel.PatientType || '';
            this.TariffName = IpdAdvanceBrowseModel.TariffName || 0;
            this.PayDate = IpdAdvanceBrowseModel.PayDate || 0;
            this.PaidAmount = IpdAdvanceBrowseModel.PaidAmount || 0;
            
            this.NEFTPayAmount=IpdAdvanceBrowseModel.NEFTPayAmount || '';
            this.PayTMAmount = IpdAdvanceBrowseModel.PayTMAmount || '';
            this.CardNo = IpdAdvanceBrowseModel.CardNo || 0;
            this.CardBankName = IpdAdvanceBrowseModel.CardBankName || 0;
            this.ChequeNo = IpdAdvanceBrowseModel.ChequeNo || 0;
            this.PaymentDate = IpdAdvanceBrowseModel.PaymentDate || '';
            this.AdvanceUsedAmount = IpdAdvanceBrowseModel.AdvanceUsedAmount || 0;
            this.AdvanceUsedAmount = IpdAdvanceBrowseModel.AdvanceUsedAmount || 0;
            this.Remark = IpdAdvanceBrowseModel.Remark || 0;
        }
    }
  
  }