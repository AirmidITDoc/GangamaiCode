import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service'; 
// import { BrowseOpdPaymentReceipt } from 'app/main/opd/browse-payment-list/browse-payment-list.component';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../Admission/admission/admission.component';
import { IPSettlementService } from './ip-settlement.service';
import { IpPaymentInsert } from '../ip-search-list/ip-advance/ip-advance.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


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
        registerObj = new RegInsert({});  
    PatientName: any;
    AdmissionId:any=0;

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
        public _FormvalidationserviceService:FormvalidationserviceService,
        public formBuilder: UntypedFormBuilder,) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm(); 
        this.IPBillMyForm = this.CreateIPBillForm();
    }
    createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
        });
    } 
    IPBillMyForm:FormGroup;
  //IP bill save form 
  CreateIPBillForm(): FormGroup {
    return this.formBuilder.group({ 
      //Payment form
      payment: this.formBuilder.group({ 
        paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        cashPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequePayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        opdipdType:[3,[this._FormvalidationserviceService.onlyNumberValidator()]],
        neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
        tdsAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      // BIll update
      billupdate: this.formBuilder.group({
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }), 
      // Advance details update in array
      advanceDetailupdate: this.formBuilder.array([]),
      // Advacne header update
      advanceHeaderupdate: this.formBuilder.group({
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }), 
    });
  } 
  createAdvanceUpdate(item: any): FormGroup {
    return this.formBuilder.group({
      advanceDetailID: [item?.AdvanceDetailID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      usedAmount: [item?.UsedAmount ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      balanceAmount: [item?.BalanceAmount ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }  
  // Getters  
    get AdvacnedetUpdateArray(): FormArray {
    return this.IPBillMyForm.get('advanceDetailupdate') as FormArray;
  }    
    //    110193 
    getSelectedObj(obj) { 
        this.RegId1 = obj.value; 
        setTimeout(() => {
            this._IPSettlementService.getRegistraionById(this.RegId1).subscribe((response) => {
                this.registerObj = response;
                this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
               
            });  
        }, 500);
        this.GetDetails(this.RegId1)
    }


    openPaymentpopup(contact) { 
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = formattedDate;
        PatientHeaderObj['PatientName'] = this.PatientName;
        PatientHeaderObj['AdvanceAmount'] = contact.balanceAmt;
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
        PatientHeaderObj['BillNo'] = contact.billNo;
        PatientHeaderObj['OPD_IPD_Id'] = contact.opdipdid;
        PatientHeaderObj['IPDNo'] = contact.ipdNo;
        PatientHeaderObj['RegNo'] = contact.regNo;
        PatientHeaderObj['DoctorName'] = contact.doctorname;
        PatientHeaderObj['CompanyName'] = contact.companyName;
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
            if (result && result.IsSubmitFlag) {
                let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
                UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;

                this.IPBillMyForm.get('billupdate.billNo').setValue(contact.billNo)
                this.IPBillMyForm.get('billupdate.balanceAmt').setValue(result.BalAmt) 

                this.AdvacnedetUpdateArray.clear();
                UpdateAdvanceDetailarr1.forEach(item => {
                    this.AdvacnedetUpdateArray.push(this.createAdvanceUpdate(item));
                }); 
                    let AdvanceBalAmt = 0;
                    let AdvanceUsedAmt = 0;  
                if (UpdateAdvanceDetailarr1.length > 0) {
                    UpdateAdvanceDetailarr1.forEach(element => {
                        AdvanceUsedAmt = AdvanceUsedAmt + element.UsedAmount
                        AdvanceBalAmt = AdvanceBalAmt + element.BalanceAmount
                        this.IPBillMyForm.get('advanceHeaderupdate.advanceId')?.setValue(element.AdvanceId)
                        this.IPBillMyForm.get('advanceHeaderupdate.advanceUsedAmount')?.setValue(AdvanceUsedAmt)
                        this.IPBillMyForm.get('advanceHeaderupdate.balanceAmount')?.setValue(AdvanceBalAmt)
                    })
                } 
               
                this.IPBillMyForm.get('payment').setValue(result.submitDataPay.ipPaymentInsert)
                console.log(this.IPBillMyForm.value);
                this._IPSettlementService.InsertIPSettlementPayment(this.IPBillMyForm.value).subscribe(response => {
                    this.GetDetails(this.RegId1)
                    this.viewgetIPPayemntPdf(response)
                    this.reset();
                });
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