import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import { RegInsert } from '../registration/registration.component';
import { CompanysettlementService } from './companysettlement.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
    selector: 'app-companysettlement',
    templateUrl: './companysettlement.component.html',
    styleUrls: ['./companysettlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CompanysettlementComponent implements OnInit {
    searchFormGroup: FormGroup 
    RegId1 = "0";
    BillNo: any;
    vpaidamt: any = 0;
    vbalanceamt: any = 0; 
    registerObj = new RegInsert({});
    RegId = 0; 
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }
    AllColumns = [
        {heading: "-", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.actionsTemplate, width: 40 },
        { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA', type: 9 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "ConsessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "NetAmount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "BalanceAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
        apiUrl: "OPBill/OPBillListSettlementList",
        columnsList: this.AllColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Contains }
        ],
        row:25
    }
    constructor(
        public _CompanysettlementService: CompanysettlementService,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public accountService:AuthenticationService,
        public _FormvalidationserviceService:FormvalidationserviceService,
        public toastr: ToastrService, public formBuilder: UntypedFormBuilder
    ) { }
    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm(); 
        this.OpSettlementForm = this.CreateOPSettlementForm();
    }
    createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
        });
    } 
    OpSettlementForm:FormGroup
    CreateOPSettlementForm(){
       return this.formBuilder.group({ 
        //Payment form
        opCreditPayment: this.formBuilder.group({
        paymentId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]], 
        billNo: [0,[this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]], 
        paymentDate: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
        paymentTime: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
        cashPayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        chequePayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        chequeNo: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        cardNo: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        opdipdType:[0], 
        neftpayAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        payTmtranNo: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'], 
       }) ,
       //bill update 
        billUpdate:this.formBuilder.group({
        billNo:  [0,[this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        balanceAmt:  [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
        }) 
       })
} 
    getSelectedObj(obj) { 
        this.RegId1 = obj.value; 
        this.registerObj = obj
        this.GetDetails(obj.value)
    }
    openPaymentpopup(contact) { 
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
        PatientHeaderObj['RegNo'] = this.registerObj?.regNo;
        PatientHeaderObj['PatientName'] = this.registerObj?.patientName 
        PatientHeaderObj['OPD_IPD_Id'] = contact.opdNo;
        PatientHeaderObj['Age'] =  this.registerObj?.ageYear
        PatientHeaderObj['DepartmentName'] = contact.departmentName;
        PatientHeaderObj['billNo'] = contact.billNo; 
        PatientHeaderObj['CompanyName'] = contact.companyName;
        PatientHeaderObj['NetPayAmount'] = contact.netPayableAmt;

        const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
                maxWidth: "80vw",
                width: '70%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "OP-SETTLEMENT"
                }
            });
        dialogRef.afterClosed().subscribe(result => { 
            if (result && result.IsSubmitFlag == true) { 
                this.OpSettlementForm.get('billUpdate.billNo').setValue(contact.billNo) 
                this.OpSettlementForm.get('opCreditPayment').setValue(result.submitDataPay.ipPaymentInsert)

                if (this.OpSettlementForm.valid) {
                    console.log(this.OpSettlementForm.value)
                    this._CompanysettlementService.InsertOPBillingsettlement(this.OpSettlementForm.value).subscribe(response => {
                        this.GetDetails(this.RegId1)
                        this.viewgetOPPayemntPdf(response, true);
                    });
                } else {
                    let invalidFields = []
                    if (this.OpSettlementForm.invalid) {
                        for (const controlName in this.OpSettlementForm.controls) {
                            const control = this.OpSettlementForm.get(controlName);

                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`OP Settlement Data: ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`OPSettlement From: ${controlName}`);
                            }
                        }
                    }
                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => {
                            this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                            );
                        });
                        return
                    }
                }
            }
        });
        this.searchFormGroup.get('RegId').setValue('')
    }
    viewgetOPPayemntPdf(data, status) {
        if (status)
            this.commonService.Onprint("PaymentId", data, "OPPaymentReceipt");
        else
            this.commonService.Onprint("PaymentId", data.paymentId, "OPPaymentReceipt");
    }
    GetDetails(data) {
        this.gridConfig = {
            apiUrl: "OPBill/OPBillListSettlementList",
            columnsList: this.AllColumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Contains }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
}