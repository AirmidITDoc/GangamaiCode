import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { MatTabChangeEvent } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import { OPListService } from './oplist.service';


@Component({
    selector: 'app-new-oplist',
    templateUrl: './new-oplist.component.html',
    styleUrls: ['./new-oplist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class NewOPListComponent implements OnInit {
    myFilterbillform: FormGroup;
    myFilterpayform: FormGroup;
    myFilterrefundform: FormGroup;
    menuActions: Array<string> = [];
   
    @ViewChild('opBillGrid', { static: false }) grid: AirmidTableComponent;
@ViewChild('opPaymentGrid', { static: false }) grid1: AirmidTableComponent;
@ViewChild('opRefundGrid', { static: false }) grid2: AirmidTableComponent;

    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vMobileNo: any;
    vbalanceamt: any;
    vpaidamt: any;
    vOPIPId = 0;
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    DoctorId = 0
    PBillNo: any = "%"

    pf_name: any = ""
    pregNo: any = "0"
    pl_name: any = ""
    precptNo = "0"
    pPBillNo: any = "%"

    rf_name: any = ""
    rregNo: any = "0"
    rl_name: any = ""
    rPBillNo: any = "%"
    rfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    rtoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    pfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ptoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    @ViewChild('actionsTemplate3') actionsTemplate3!: TemplateRef<any>;
    @ViewChild('actionsTemplate4') actionsTemplate4!: TemplateRef<any>;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;

    allOBillfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals }

    ];
    allOPbillcolumns = [
        { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
        { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "refundAmount1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "balanceAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Total Amount", key: "totalAmt", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount }, // It is just example of apply color based on condition
        { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount },
        { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount},
        { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount , columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
        { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "Adv Used Pay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "PayCount", key: "payCount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount , columnClass: (element) => element["refundAmount"] > 0 ? Color.RED : ""},
        { heading: "Cash Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Age", key: "patientAge", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }  // Assign ng-template to the column

    ];


    allOPpaymentfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Contains },
        { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Contains }

    ];
    allOPpaymentcolumns = [
        { heading: "Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Bill Amount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount },
        { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "CashPay", key: "cashPayAmount", sort: true, align: "center" , type: gridColumnTypes.amount},
        { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "CardPay", key: "cardPayAmount", sort: true, align: "center" , type: gridColumnTypes.amount},
        { heading: "AdvUsedPay", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center" , type: gridColumnTypes.amount},
        { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "CompanyName", key: "companyName", sort: true, align: "center", width: 200 },
        { heading: "UserName", key: "userName", sort: true, align: "center", width: 200 },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate1
        },

    ];

    allOPRefundFilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.rfromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.rtoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    allOPRefundColumns = [
        { heading: "RefundDate", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "RefundNo", key: "refundNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', type: 8 },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "Bill Amount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "RefDoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "PatientType", key: "patientType", sort: true, align: "center" },
        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "CompanyName", key: "companyName", sort: true, align: "center", width: 200 },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate2
        },
    ]

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'refundAmount1')!.template = this.actionsTemplate3;
        this.gridConfig.columnsList.find(col => col.key === 'balanceAmt1')!.template = this.actionsTemplate4;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

        this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
        this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;

    }


    gridConfig: gridModel = {

        apiUrl: "OPBill/BrowseOPDBillPagiList",
        columnsList: this.allOPbillcolumns,
        sortField: "PbillNo",
        sortOrder: 0,
        filters: this.allOBillfilters
    }

    gridConfig1: gridModel = {
        apiUrl: "OPBill/BrowseOPPaymentList",
        columnsList: this.allOPpaymentcolumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allOPpaymentfilters
    }


    gridConfig2: gridModel = {
        apiUrl: "OPBill/BrowseOPRefundList",
        columnsList: this.allOPRefundColumns,
        sortField: "RefundId",
        sortOrder: 0,
        filters: this.allOPRefundFilters
    }

    constructor(public _OPListService: OPListService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe,
        private commonService: PrintserviceService) { }


    ngOnInit(): void {
        this.myFilterbillform = this._OPListService.myFilterbillbrowseform();
        this.myFilterpayform = this._OPListService.myFilterpaymentbrowseform();
        this.myFilterrefundform = this._OPListService.myFilterrefundbrowseform();

        this.menuActions.push("Bill Print");
        this.menuActions.push("Bill Print-Package Info");
    }


    viewgetOPBillReportPdf(element) {
        this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt");
    }


    getWhatsappshareBill(Id) { }

    viewgetOPPayemntPdf(data, status) {
        if (status == true)
            this.commonService.Onprint("PaymentId", data, "OPPaymentReceipt");
        else
            this.commonService.Onprint("PaymentId", data.paymentId, "OPPaymentReceipt");
    }
    getWhatsappsharePaymentReceipt(Id, Mobile) { }


    viewgetOPRefundBillReportPdf(data) {

        this.commonService.Onprint("RefundId", data.refundId, "OPRefundReceipt");
    }
    getWhatsappshareRefundBill(Id) { }

    OnPrint(element) {
        this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt");
    }


    OngetRecord(element, m) {
      console.log('Third action clicked for:', element);
        if (m == "Bill Print")
            this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt");
        else if (m == "Bill Print-Package Info")
            this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt");
    }


    openPaymentpopup(contact) {
        console.log(contact)

        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
            PatientHeaderObj['RegNo'] = contact.regNo;
        PatientHeaderObj['PatientName'] = contact.patientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.opD_IPD_ID;
        PatientHeaderObj['Age'] = contact.patientAge;
        PatientHeaderObj['DepartmentName'] = contact.DepartmentName;
        PatientHeaderObj['DoctorName'] = contact.departmentName;
        PatientHeaderObj['TariffName'] = contact.tariffName;
        PatientHeaderObj['CompanyName'] = contact.companyName;
        PatientHeaderObj['NetPayAmount'] = contact.netPayableAmt;
        this.vMobileNo = contact.mobileNo;
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
            if (result.IsSubmitFlag == true) {
                let PaymentObj = result.submitDataPay.ipPaymentInsert
                this.vpaidamt = result.PaidAmt;
                this.vbalanceamt = result.BalAmt
                PaymentObj['BillNo'] = contact.billNo;
                let updateBillobj = {};
                updateBillobj['BillNo'] = contact.billNo;
                updateBillobj['balanceAmt'] = result.submitDataPay.ipPaymentInsert.BalanceAmt;

                let data = {
                    opCreditPayment: PaymentObj,
                    "billUpdate": {
                        "billNo": contact.billNo,
                        "balanceAmt": result.submitDataPay.ipPaymentInsert.BalanceAmt
                    },
                }

                this._OPListService.InsertOPBillingsettlement(data).subscribe(response => {
                    this.toastr.success(response.message);
                    this.grid.gridConfig = this.gridConfig;
                    this.grid.bindGridData();
                    this.viewgetOPPayemntPdf(response, true);

                }, (error) => {
                    this.toastr.error(error.message);
                });

            }
        });

    }

    onTabChange(event: MatTabChangeEvent) {
        console.log('Selected Tab Index:', event.index);
        console.log('Selected Tab Label:', event.tab.textLabel);

        // Add custom logic here
        if (event.index === 1) {
            this.grid.gridConfig = this.gridConfig
            console.log('Tab 1 is selected');
            this.grid.bindGridData();
    
        }
        if (event.index === 2) {
            this.grid.gridConfig = this.gridConfig1
            console.log('Tab 2 is selected');
            this.grid.bindGridData();
         
        }
        if (event.index === 3) {
            this.grid.gridConfig = this.gridConfig2
            console.log('Tab 3 is selected');
            this.grid.bindGridData();
         
        }
    }

    onChangeOPBill() {
        this.fromDate = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterbillform.get('FirstName').value + "%"
        this.l_name = this.myFilterbillform.get('LastName').value + "%"
        this.regNo = this.myFilterbillform.get('RegNo').value || "0"
        this.PBillNo = this.myFilterbillform.get('PBillNo').value || "%"
        this.getfilterdataOpBill();
    }

    getfilterdataOpBill() {

        this.gridConfig = {
            apiUrl: "OPBill/BrowseOPDBillPagiList",
            columnsList: this.allOPbillcolumns,
            sortField: "PbillNo",
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

    ClearfilterOPbill(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterbillform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterbillform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterbillform.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this.myFilterbillform.get('PBillNo').setValue("")
        if (event == 'PBillNo')
            this.myFilterbillform.get('PBillNo').setValue("")

        this.onChangeOPBill();
    }

    onChangeOPPayment() {
        this.pfromDate = this.datePipe.transform(this.myFilterpayform.get('fromDate').value, "yyyy-MM-dd")
        this.ptoDate = this.datePipe.transform(this.myFilterpayform.get('enddate').value, "yyyy-MM-dd")
        this.pf_name = this.myFilterpayform.get('FirstName').value + "%"
        this.pl_name = this.myFilterpayform.get('LastName').value + "%"
        this.pregNo = this.myFilterpayform.get('RegNo').value || "0"
        this.pPBillNo = this.myFilterpayform.get('PBillNo').value || "0"
        this.precptNo = this.myFilterpayform.get('ReceiptNo').value || "0"
        this.getfilterdataOpPayment();
    }

    getfilterdataOpPayment() {
        this.gridConfig1 = {
            apiUrl: "OPBill/BrowseOPPaymentList",
            columnsList: this.allOPpaymentcolumns,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.pf_name, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.pl_name, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.pregNo, opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: this.pPBillNo, opType: OperatorComparer.Equals },
            { fieldName: "ReceiptNo", fieldValue: this.precptNo, opType: OperatorComparer.Contains }
            ]
        }
      
        this.grid1.gridConfig = { ...this.gridConfig1 }; // Use a new object reference
        this.grid1.bindGridData(); // Only refresh the OPPayment grid


    }

    ClearfilterOPpayment(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterpayform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterpayform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterpayform.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this.myFilterpayform.get('PBillNo').setValue("")
        if (event == 'ReceiptNo')
            this.myFilterpayform.get('ReceiptNo').setValue("")

        this.onChangeOPPayment();
    }


    onChangeOPRefund() {
        this.rfromDate = this.datePipe.transform(this.myFilterrefundform.get('fromDate').value, "yyyy-MM-dd")
        this.rtoDate = this.datePipe.transform(this.myFilterrefundform.get('enddate').value, "yyyy-MM-dd")
        this.rf_name = this.myFilterrefundform.get('FirstName').value + "%"
        this.rl_name = this.myFilterrefundform.get('LastName').value + "%"
        this.rregNo = this.myFilterrefundform.get('RegNo').value || "0"
        this.getfilterdataOPRefund();
    }

    getfilterdataOPRefund() {
        this.gridConfig2 = {
            apiUrl: "OPBill/BrowseOPRefundList",
            columnsList: this.allOPRefundColumns,
            sortField: "RefundId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.rf_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.rl_name, opType: OperatorComparer.Contains },
                { fieldName: "From_Dt", fieldValue: this.rfromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.rtoDate, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.rregNo, opType: OperatorComparer.Equals }
            ]
        }
       this.grid2.gridConfig = { ...this.gridConfig2 }; // Use a new object reference
        this.grid2.bindGridData(); // Only refresh the OPRefund grid        

    }

    ClearfilterOPRefund(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterrefundform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterrefundform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterrefundform.get('RegNo').setValue("")

        this.onChangeOPRefund();
    }

    Onemail(data) { }
    Onmessage(data) { }
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
    CashCounterID: number;
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
            this.CashCounterID = BrowseOPDBill.CashCounterID || 0
        }
    }

}
