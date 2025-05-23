import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CompanysettlementService } from './companysettlement.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { RegInsert } from '../registration/registration.component';
import { NewSettlementComponent } from './new-settlement/new-settlement.component';
import Swal from 'sweetalert2';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import { OpPaymentNewComponent } from '../op-search-list/op-payment-new/op-payment-new.component';

@Component({
    selector: 'app-companysettlement',
    templateUrl: './companysettlement.component.html',
    styleUrls: ['./companysettlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CompanysettlementComponent implements OnInit {
    searchFormGroup: FormGroup
    myFormGroup: FormGroup
    RegId1 = "0";
    BillNo: any;
    vpaidamt: any = 0;
    vbalanceamt: any = 0;
    Age = 0;
    // @ViewChild('grid1') grid1: AirmidTableComponent;

    constructor(public _CompanysettlementService: CompanysettlementService,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService, public formBuilder: UntypedFormBuilder,) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('balTemplate') balTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'balanceAmt')!.template = this.balTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    gridConfig: gridModel = {
        apiUrl: "OPBill/OPBillListSettlementList",
        columnsList: [
            {
                heading: "-", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
                template: this.actionsTemplate, width: 20
            },
            { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
            { heading: "ConsessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
            { heading: "NetAmount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
            { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
            { heading: "BalanceAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', template: this.balTemplate, type: gridColumnTypes.amount },
            {
                heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate  // Assign ng-template to the column
            }

        ],
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Contains }
        ]
    }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.myFormGroup = this.createSearchForm1();
    }
    openPaymentpopup(contact) {
        console.log(contact)
        let PatientName = contact.firstName + " " + contact.lastName
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
        PatientHeaderObj['RegNo'] = contact.regNo;
        PatientHeaderObj['PatientName'] = this.PatientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.opdipdid;
        PatientHeaderObj['Age'] = this.Age;
        PatientHeaderObj['DepartmentName'] = contact.DepartmentName;
        PatientHeaderObj['DoctorName'] = contact.departmentName;
        PatientHeaderObj['TariffName'] = contact.tariffName;
        PatientHeaderObj['CompanyName'] = contact.companyName;
        PatientHeaderObj['NetPayAmount'] = contact.netPayableAmt;


        const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
                maxWidth: "80vw",
                width: '70%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "OP-Bill"
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result)
            if (result.IsSubmitFlag == true) {
                let PaymentObj = result.submitDataPay.ipPaymentInsert
                console.log(PaymentObj)
                this.vpaidamt = result.PaidAmt;
                this.vbalanceamt = result.BalAmt
                PaymentObj['BillNo'] = contact.billNo;
                let updateBillobj = {};
                updateBillobj['BillNo'] = contact.billNo;
                updateBillobj['balanceAmt'] = result.submitDataPay.ipPaymentInsert.BalanceAmt;

                let data = {
                    opCreditPayment: PaymentObj,//result.submitDataPay.ipPaymentInsert,
                    "billUpdate": {
                        "billNo": contact.billNo,
                        "balanceAmt": result.submitDataPay.ipPaymentInsert.BalanceAmt
                    },
                }
                console.log(data)
                this._CompanysettlementService.InsertOPBillingsettlement(data).subscribe(response => {
                    this.toastr.success(response.message);
                    this.GetDetails(this.RegId1)
                    this.viewgetOPPayemntPdf(response, true);

                });

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

    // GetRegInfo(data){
    //         this._CompanysettlementService.getRegistraionById(data).subscribe((response) => {
    //             this.registerObj = response;
    //             console.log(response)
    //             this.PatientName = response.firstName + " " + response.middleName + " " + response.lastName
    //             this.Age = response.age
    //         });
    // }

    registerObj = new RegInsert({});
    RegId = 0;
    PatientName: any;

    getSelectedObj(obj) {
        console.log(obj)
        this.RegId1 = obj.value;  
        this.PatientName = obj.patientName;  
        this.registerObj = obj
        this.GetDetails(obj.value)
    }
    GetDetails(data) {
        console.log(data);
        this.gridConfig = {
            apiUrl: "OPBill/OPBillListSettlementList",
            columnsList: [
                 {
                    heading: "-", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
                    template: this.actionsTemplate, width: 10
                },
                { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
                { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Bill Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
                { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
                { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
                { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
                { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', template: this.balTemplate, type: gridColumnTypes.amount },
                { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
                {
                    heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
                    template: this.actionButtonTemplate  // Assign ng-template to the column
                }

            ],
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