import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { Subscription } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../advance';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-search-list/ip-advance-payment/ip-advance-payment.component';
// import { BrowseOpdPaymentReceipt } from 'app/main/opd/browse-payment-list/browse-payment-list.component';
import { IPSettlementViewComponent } from './ipsettlement-view/ipsettlement-view.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { IPSettlementService } from './ip-settlement.service';
import { IPpaymentWithadvanceComponent } from './ippayment-withadvance/ippayment-withadvance.component';
import { AdmissionPersonlModel, RegInsert } from '../Admission/admission/admission.component';
import * as converter from 'number-to-words';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { IpPaymentwithAdvanceComponent } from '../ip-search-list/ip-paymentwith-advance/ip-paymentwith-advance.component';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { CompanysettlementService } from 'app/main/opd/companysettlement/companysettlement.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


@Component({
    selector: 'app-ip-settlement',
    templateUrl: './ip-settlement.component.html',
    styleUrls: ['./ip-settlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPSettlementComponent implements OnInit {
    searchFormGroup: FormGroup
    myFormGroup: FormGroup
    RegId1 = "0";
    BillNo: any;
    vpaidamt: any = 0;
    vbalanceamt: any = 0;
    FinalAmt = 0;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'balanceAmt')!.template = this.actionsTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    AllColumns = [
        {
            heading: "-", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.actionsTemplate, width: 50
        },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA' ,width: 200,type: 9},
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "ConsessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "NetAmount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "BalanceAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
        apiUrl: "IPBill/IPBillList",
        columnsList: this.AllColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _IPSettlementService: IPSettlementService,
        private commonService: PrintserviceService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public formBuilder: UntypedFormBuilder,) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.myFormGroup = this.createSearchForm1();
    }
    createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
        });
    }
    createSearchForm1() {
        return this.formBuilder.group({
            RegId: 0
        });
    }

    //    110193
    registerObj = new RegInsert({});  
    PatientName: any;
    AdmissionId:any=0;
    getSelectedObj(obj) {
        console.log(obj)
        this.RegId1 = obj.value; 
        setTimeout(() => {
            this._IPSettlementService.getRegistraionById(this.RegId1).subscribe((response) => {
                this.registerObj = response;
                this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
                console.log(response)
            }); 

            // this._IPSettlementService.getAdmissionById(this.RegId1).subscribe((response) => { 
            //     this.AdmissionId =  response.admissionId
            //     console.log(this.AdmissionId)
            // });
        }, 500);
        this.GetDetails(this.RegId1)
    }
    openPaymentpopup(contact) {

        console.log(contact)
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
        this.FinalAmt = contact.NetPayableAmt;

        let PatientHeaderObj = {}; 
        PatientHeaderObj['Date'] = formattedDate;
        PatientHeaderObj['PatientName'] = this.PatientName; 
        PatientHeaderObj['AdvanceAmount'] = contact.balanceAmt;
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
        PatientHeaderObj['BillNo'] = contact.billNo;
        PatientHeaderObj['OPD_IPD_Id'] = contact.opdipdid;
        PatientHeaderObj['IPDNo'] = contact.ipdNo;
        PatientHeaderObj['RegNo'] =  contact.regNo; 
        PatientHeaderObj['DoctorName'] = contact.doctorname; 
        PatientHeaderObj['CompanyName'] =contact.companyName;
        PatientHeaderObj['DepartmentName'] = contact.departmentName;
        PatientHeaderObj['Age'] = this.registerObj.age; 

        const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
            {
                maxWidth: "85vw",
                height: '700px',
                width: '100%',

                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "IP-SETTLEMENT",
                    advanceObj: PatientHeaderObj,
                }
            });


        dialogRef.afterClosed().subscribe(result => {
            let NeftNo = "0"
            // console.log(result.submitDataPay.ipPaymentInsert)

            if (result.submitDataPay.ipPaymentInsert.NEFTNo == "undefined")
                NeftNo = "0"
            else
                NeftNo = String(result.submitDataPay.ipPaymentInsert.NEFTNo)
            if (result.IsSubmitFlag) {
                let Paymentobj = {};

                Paymentobj['PaymentId'] = '0';
                Paymentobj['billNo'] = contact.billNo;
                Paymentobj['PaymentDate'] = result.submitDataPay.ipPaymentInsert.PaymentDate;
                Paymentobj['PaymentTime'] = result.submitDataPay.ipPaymentInsert.PaymentTime; //this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
                Paymentobj['CashPayAmount'] = result.submitDataPay.ipPaymentInsert.CashPayAmount ?? 0;
                Paymentobj['ChequePayAmount'] = result.submitDataPay.ipPaymentInsert.ChequePayAmount ?? 0;
                Paymentobj['ChequeNo'] = String(result.submitDataPay.ipPaymentInsert.ChequeNo) ?? "0";
                Paymentobj['BankName'] = result.submitDataPay.ipPaymentInsert.BankName ?? "";
                Paymentobj['ChequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate;
                Paymentobj['CardPayAmount'] = result.submitDataPay.ipPaymentInsert.CardPayAmount
                Paymentobj['CardNo'] = String(result.submitDataPay.ipPaymentInsert.CardNo);
                Paymentobj['CardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName
                Paymentobj['CardDate'] = result.submitDataPay.ipPaymentInsert.CardDate
                Paymentobj['AdvanceUsedAmount'] = result.submitDataPay.ipPaymentInsert.AdvanceUsedAmount
                Paymentobj['AdvanceId'] = result.submitDataPay.ipPaymentInsert.AdvanceId
                Paymentobj['RefundId'] = 0;
                Paymentobj['TransactionType'] = 0;
                Paymentobj['Remark'] = '';
                Paymentobj['AddBy'] = this.accountService.currentUserValue.userId,
                    Paymentobj['IsCancelled'] = false;
                Paymentobj['IsCancelledBy'] = '0';
                Paymentobj['IsCancelledDate'] = result.submitDataPay.ipPaymentInsert.IsCancelledDate
                Paymentobj['opdipdType'] = 1;
                Paymentobj['neftpayAmount'] = result.submitDataPay.ipPaymentInsert.NEFTPayAmount
                Paymentobj['neftno'] = NeftNo;
                Paymentobj['neftbankMaster'] = result.submitDataPay.ipPaymentInsert.NEFTBankMaster
                Paymentobj['neftdate'] = result.submitDataPay.ipPaymentInsert.NEFTDate
                Paymentobj['payTmamount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount
                Paymentobj['payTmtranNo'] = "0",//result.submitDataPay.ipPaymentInsert.PayTMTranNo || 0
                    Paymentobj['payTmdate'] = result.submitDataPay.ipPaymentInsert.PayTMDate
                Paymentobj['tdsAmount'] = result.submitDataPay.ipPaymentInsert.tdsAmount

                let BillUpdateObj = {};

                BillUpdateObj['billNo'] = contact.billNo;
                BillUpdateObj['balanceAmt'] = result.BalAmt;

                console.log("Procced with Payment Option");
                let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];

                if (result.IsSubmitFlag) {
                    console.log(result);
                    result.submitDataPay.ipPaymentInsert.TransactionType = 0;
                    UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
                    console.log(UpdateAdvanceDetailarr1);

                    let UpdateAdvanceDetailarr = [];
                    let BalanceAmt = 0;
                    let UsedAmt = 0;
                    if (result.submitDataAdvancePay.length > 0) {
                        result.submitDataAdvancePay.forEach((element) => {
                            let UpdateAdvanceDetailObj = {};
                            UpdateAdvanceDetailObj['advanceDetailID'] = element.AdvanceDetailID;
                            UpdateAdvanceDetailObj['usedAmount'] = element.UsedAmount;
                            UsedAmt += element.UsedAmount;
                            UpdateAdvanceDetailObj['balanceAmount'] = element.BalanceAmount;
                            BalanceAmt += element.BalanceAmount;
                            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
                        });
                    }
                    else {
                        let UpdateAdvanceDetailObj = {};
                        UpdateAdvanceDetailObj['advanceDetailID'] = 0,
                            UpdateAdvanceDetailObj['usedAmount'] = 0,
                            UpdateAdvanceDetailObj['balanceAmount'] = 0,
                            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
                    }


                    let UpdateAdvanceHeaderObj = {};
                    if (result.submitDataAdvancePay.length > 0) {
                        UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
                            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UsedAmt,
                            UpdateAdvanceHeaderObj['BalanceAmount'] = BalanceAmt
                    }
                    else {
                        UpdateAdvanceHeaderObj['advanceId'] = 0,
                            UpdateAdvanceHeaderObj['advanceUsedAmount'] = 0,
                            UpdateAdvanceHeaderObj['balanceAmount'] = 0
                    }

                    let submitData = {
                        "payment": Paymentobj,// result.submitDataPay.ipPaymentInsert,
                        "billupdate": BillUpdateObj,
                        "advanceDetailupdate": UpdateAdvanceDetailarr,
                        "advanceHeaderupdate": UpdateAdvanceHeaderObj
                    };
                    let data = {
                        submitDataPay: submitData
                    }
                    console.log(submitData);
                    this._IPSettlementService.InsertIPSettlementPayment(submitData).subscribe(response => {
                        this.toastr.success(response.message);
                        this.GetDetails(this.RegId1)
                        this.viewgetIPPayemntPdf(response)
                        this.reset();
                    });

                }

            }
        });
        this.searchFormGroup.get('RegId').setValue('')
    }

    viewgetIPPayemntPdf(paymentId) { 
        this.commonService.Onprint("PaymentId", paymentId, "IpPaymentReceipt");
    } 
    reset(){
        this.searchFormGroup.reset();
        this.PatientName = '';
    }
    GetDetails(RegId1) {  
        this.gridConfig = {
            apiUrl: "IPBill/IPBillList",
            columnsList: this.AllColumns,
            sortField: "RegId",
            sortOrder: 0,
            filters: [
                { fieldName: "RegId", fieldValue: String(RegId1), opType: OperatorComparer.Equals }
            ]
        } 
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    getSelectedObjIP(obj) {
 
        if ((obj.regID ?? 0) > 0) {
          console.log("Admitted patient:", obj)
       
        }
      }
 
}