import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { MatTabChangeEvent } from '@angular/material/tabs';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import { OPListService } from './oplist.service';
import { ReviewcompanyBillComponent } from './reviewcompany-bill/reviewcompany-bill.component';
import { MatTableDataSource } from '@angular/material/table';


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
    CompanyId = 0
    PBillNo: any = "%"
    receiptNo: any = "%"
    CashCounterId = 0

    autocompleteModeCashcounter: string = "CashCounter";
    autocompleteModecompany: string = "Company";
    autocompleteModecompany1: string = "Company";

    pf_name: any = ""
    pregNo: any = "0"
    pl_name: any = ""
    precptNo = "0"
    pPBillNo: any = "%"
    pCompanyId = "0"
    rf_name: any = ""
    rregNo: any = "0"
    rl_name: any = ""
    rPBillNo: any = "%"
    rrecptNo = "0"
    rCompanyId: any = "0"

    Vtotal: any = "0"
    Vtotaldisc: any = "0"
    Vtotalnet: any = "0"
    Vtotbal: any = "0"

    Vcashtot: any = "0"
    Vcardtot: any = "0"
    Vchequetot: any = "0"
    Vnefttotl: any = "0"


    Vptotal: any = "0"
    Vptotaldisc: any = "0"
    Vptotalnet: any = "0"
    Vptotbal: any = "0"
    Vrtotalref: any = "0"

    Vpcashtotbal: any = "0"
    Vpcardtotbal: any = "0"
    Vponlinetot: any = "0"
    Vpnefttotl: any = "0"
    Vpcheque: any = "0"


    Vrtotal: any = "0"
    Vrtotaldisc: any = "0"
    Vrtotalnet: any = "0"
    Vrtotbal: any = "0"

    Vrcashtot: any = "0"
    Vrcardtot: any = "0"
    Vrchequetot: any = "0"
    Vrnefttotl: any = "0"

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

    dataSourceBill = new MatTableDataSource<OPbill>();
    dataSourcepayBill = new MatTableDataSource<OPbill>();
    dataSourceRef = new MatTableDataSource<OPbill>();



    allOBillfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "CompanyId", fieldValue: '0', opType: OperatorComparer.Equals },
        { fieldName: "CashCounterId", fieldValue: "0", opType: OperatorComparer.Equals }
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
        { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
        { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv Used Pay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "onlinePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PayCount", key: "payCount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["refundAmount"] > 0 ? Color.RED : "" },
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
        { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Contains },
        { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Equals }


    ];
    allOPpaymentcolumns = [
        { heading: "Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Bill Amount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CashPay", key: "cashPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CardPay", key: "cardPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "AdvUsedPay", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

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
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Bill Amount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "CashPay", key: "cashPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CardPay", key: "cardPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
        // { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center", type: gridColumnTypes.amount },

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
        private commonService: PrintserviceService,
        public _ConfigService: ConfigService,
        public _accountService: AuthenticationService,
        public _whatsppService: WhatsAppEmailService,
        private overlay: Overlay
    ) { }


    ngOnInit(): void {
        this.myFilterbillform = this._OPListService.myFilterbillbrowseform();
        this.myFilterpayform = this._OPListService.myFilterpaymentbrowseform();
        this.myFilterrefundform = this._OPListService.myFilterrefundbrowseform();


        this.menuActions.push("Bill Print-Package Info");
        this.menuActions.push("Bill Print");
        this.menuActions.push("Patient Statement Print");

        this.GetOPbilldetail()
        this.GetOPpaybilldetail()
        this.GetOPbillrefunddetail()
    }



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
        const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
        if (ThermalPrint != 1) {
            this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt");
        } else {
            // Use thermal print with preview - shows preview first, then auto-prints
            this.viewgetOPBillThermalReportPdf(element.billNo)
            // this.commonService.OnThermalPrint("BillNo", element.billNo, "OpBillReceiptT");
        }
    }
    //All Good print is ok
    currentDate = new Date();
    viewgetOPBillThermalReportPdf(BillNo) {

        debugger
        const param = {
            "searchFields": [
                {
                    "fieldName": 'BillNo',
                    "fieldValue": String(BillNo),
                    "opType": "13"
                }
            ],
            "mode": 'OPBillPrint'
        }
        this._OPListService.getReportView(param).subscribe(res => {
            console.log(res)
            this.reportPrintObjList = res as BrowseOPDBill[];
            setTimeout(() => {
                this.print3();
            }, 1000);
        });
    }
    reportPrintObj: BrowseOPDBill;
    subscriptionArr: Subscription[] = [];
    printTemplate: any;
    reportPrintObjList: BrowseOPDBill[] = [];

    @ViewChild('billTemplate2') billTemplate2: ElementRef;
    print3() {
        const popupWin = window.open('', '_blank', 'top=0,left=0,width=300');

        popupWin.document.write(`
            <html>
            <head>
                <title>Print</title>
                <style>
                @page {
                    size: 80mm auto;
                    margin: 0;
                }
                html, body {
                    margin-top: -4mm;
                    margin: 0;
                    padding: 0;
                    font-family: system-ui, sans-serif;
                    font-size: 12px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                * {
                    box-sizing: border-box;
                }
                </style>
            </head>
            <body onload="window.print(); window.close();">
                ${this.billTemplate2.nativeElement.innerHTML}
            </body>
            </html>
        `);

        popupWin.document.close();
    }

    OnCompanyBill(element) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();
        const dialogRef = this._matDialog.open(ReviewcompanyBillComponent, {
            maxWidth: "98vw",
            height: "96vh",
            width: "100%",
            data: {
                Obj: element,
                OPIPType: 0
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    OngetRecord(element, m) {

        console.log('Third action clicked for:', element);
        const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");

        if (m == "Bill Print-Package Info")
            this.commonService.Onprint("BillNo", element.billNo, "OPBillWithPackagePrint");
        else if (m == "Bill Print")
            this.commonService.Onprint("BillNo", element.billNo, "OpBillReceipt");
        else if (m == "Patient Statement Print") {
            this.OnPaitentFinalPrint(element)
        }
    }
    OnPaitentFinalPrint(element) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    { "fieldName": "OPIPId", "fieldValue": String(element.opdipdid), "opType": "13" },
                    { "fieldName": "OPIPType", "fieldValue": String(element.opD_IPD_Type), "opType": "13" }
                ],
                "mode": "PatientBillStatement"
            }
            this._OPListService.getBilllistReport(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Patient Statement" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    openPaymentpopup(contact) {
        console.log(contact)
        const PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
            PatientHeaderObj['RegNo'] = contact.regNo || 0;
        PatientHeaderObj['PatientName'] = contact.patientName || '';
        PatientHeaderObj['OPD_IPD_Id'] = contact.opD_IPD_ID || 0;
        PatientHeaderObj['Age'] = contact.patientAge || 0;
        PatientHeaderObj['DepartmentName'] = contact.departmentName || '';
        PatientHeaderObj['DoctorName'] = contact.doctorName || '';
        PatientHeaderObj['TariffName'] = contact.tariffName || '';
        PatientHeaderObj['CompanyName'] = contact.companyName || '';
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt || 0;
        PatientHeaderObj['CompanyId'] = contact.companyId || 0;
        PatientHeaderObj['billNo'] = contact.billNo || 0;
        PatientHeaderObj['TransactionLabel'] = 'OP-Settlement';
        this.vMobileNo = contact.mobileNo;
        const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
                maxWidth: "80vw",
                width: '70%',
                maxHeight: "90vw",
                height: '90%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "OP-SETTLEMENT"
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result.IsSubmitFlag == true) {
                const PaymentObj = result.submitDataPay.ipPaymentInsert

                this.vpaidamt = result.PaidAmt;
                this.vbalanceamt = result.BalAmt
                PaymentObj['BillNo'] = contact.billNo;
                const updateBillobj = {};
                updateBillobj['BillNo'] = contact.billNo;
                updateBillobj['balanceAmt'] = result.BillBalanceAmount;
                console.log(result.submitDataPay.ipPaymentInsert)

                const data = {
                    opCreditPayment: PaymentObj,
                    "billUpdate": {
                        "billNo": contact.billNo,
                        "balanceAmt": result.BillBalanceAmount
                    },
                    tPayments: result.submitDataPay.ipModePaymentInsert,

                }
                console.log(data)
                this._OPListService.InsertOPBillingsettlement(data).subscribe(response => {
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
        debugger
        this.fromDate = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterbillform.get('FirstName').value + "%"
        this.l_name = this.myFilterbillform.get('LastName').value + "%"
        this.regNo = this.myFilterbillform.get('RegNo').value || "0"
        this.PBillNo = this.myFilterbillform.get('PBillNo').value || "%"
        this.CompanyId = this.myFilterbillform.get('CompanyId').value || "0"
        this.CashCounterId = this.myFilterbillform.get('CashCounterId').value || "0"

        this.getfilterdataOpBill();
        debugger
        // setTimeout(() => {
        this.GetOPbilldetail()
        // }, 1000);

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
            { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
            { fieldName: "CompanyId", fieldValue: this.CompanyId, opType: OperatorComparer.Equals },
            { fieldName: "CashCounterId", fieldValue: this.CashCounterId, opType: OperatorComparer.Equals }
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

        this.onChangeOPBill();
    }

    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.CompanyId = value.value
        else
            this.CompanyId = 0

        this.onChangeOPBill();
    }
    ListViewCashCounter(value) {
        console.log(value)
        if (value.value !== 0)
            this.CashCounterId = value.value
        else
            this.CashCounterId = 0

        this.onChangeOPBill();
    }

    CompanyId1 = 0
    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.CompanyId1 = value.value
        else
            this.CompanyId1 = 0

        this.onChangeOPPayment();
    }


    onChangeOPPayment() {
        debugger
        this.pfromDate = this.datePipe.transform(this.myFilterpayform.get('fromDate').value, "yyyy-MM-dd")
        this.ptoDate = this.datePipe.transform(this.myFilterpayform.get('enddate').value, "yyyy-MM-dd")
        this.pf_name = this.myFilterpayform.get('FirstName').value + "%"
        this.pl_name = this.myFilterpayform.get('LastName').value + "%"
        this.pregNo = this.myFilterpayform.get('RegNo').value || "0"
        this.pPBillNo = this.myFilterpayform.get('PBillNo').value || "0"
        this.precptNo = this.myFilterpayform.get('ReceiptNo').value || "0"
        this.CompanyId1 = this.myFilterpayform.get('CompanyId').value || "0"
        this.getfilterdataOpPayment();

        // setTimeout(() => {
        this.GetOPpaybilldetail()
        // }, 1000);
    }

    getfilterdataOpPayment() {
        debugger
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
            { fieldName: "ReceiptNo", fieldValue: this.precptNo, opType: OperatorComparer.Contains },
            { fieldName: "CompanyId", fieldValue: this.CompanyId1, opType: OperatorComparer.Equals }

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

        setTimeout(() => {
            this.GetOPbillrefunddetail()
        }, 1000);
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
    private overlayRef: OverlayRef | null = null;
    private EmailOverlayRef: OverlayRef | null = null;
    private whatsappOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;
    private doctorCloseTimeout: any = null;

    openEmailDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.EmailOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
            const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.EmailOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeEmailDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }
        }, 200);
    }
    openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeWhatsappDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }
    keepPatientPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
            this.patientCloseTimeout = null;
        }
    }

    getWhatsappshareBill(el) {
        console.log(el);
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.billNo,
            smsType: "OPBill",
            patientId: el.regNo
        })
    }
    //oppatment

    //  openEmailDetailsPopover(event: MouseEvent, patientData: any) {
    //     event.stopPropagation();

    //     // Clear any existing timeout
    //     if (this.hoverTimeout) {
    //         clearTimeout(this.hoverTimeout);
    //     }

    //     // Add small delay to prevent flickering
    //     this.hoverTimeout = setTimeout(() => {
    //         // Close any existing patient popover
    //         if (this.EmailOverlayRef) {
    //             this.EmailOverlayRef.dispose();
    //             this.EmailOverlayRef = null;
    //         }

    //         const positionStrategy = this.overlay.position()
    //             .flexibleConnectedTo(event.target as HTMLElement)
    //             .withPositions([
    //                 {
    //                     originX: 'start',
    //                     originY: 'bottom',
    //                     overlayX: 'start',
    //                     overlayY: 'top',
    //                 },
    //                 {
    //                     originX: 'start',
    //                     originY: 'top',
    //                     overlayX: 'start',
    //                     overlayY: 'bottom',
    //                 },
    //                 {
    //                     originX: 'end',
    //                     originY: 'center',
    //                     overlayX: 'start',
    //                     overlayY: 'center',
    //                 },
    //                 {
    //                     originX: 'start',
    //                     originY: 'center',
    //                     overlayX: 'end',
    //                     overlayY: 'center',
    //                 }
    //             ]);

    //         this.EmailOverlayRef = this.overlay.create({
    //             positionStrategy,
    //             scrollStrategy: this.overlay.scrollStrategies.close(),
    //             hasBackdrop: false,
    //         });

    //         const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
    //         const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
    //         componentRef.instance.patientData = patientData;

    //         // Handle mouse events on the overlay element
    //         const overlayElement = this.EmailOverlayRef.overlayElement;
    //         overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
    //         overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
    //     }, 300); // 300ms delay before showing popover
    // }
    // closeEmailDetailsPopover() {
    //     // Clear timeout if popover hasn't opened yet
    //     if (this.hoverTimeout) {
    //         clearTimeout(this.hoverTimeout);
    //         this.hoverTimeout = null;
    //     }

    //     // Clear any existing close timeout
    //     if (this.patientCloseTimeout) {
    //         clearTimeout(this.patientCloseTimeout);
    //     }

    //     // Add delay before closing to allow moving mouse to popover
    //     this.patientCloseTimeout = setTimeout(() => {
    //         if (this.EmailOverlayRef) {
    //             this.EmailOverlayRef.dispose();
    //             this.EmailOverlayRef = null;
    //         }
    //     }, 200);
    // }
    openWhatsappDetailsPopoverpay(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpenPayment());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopoverpay());
        }, 300); // 300ms delay before showing popover
    }
    closeWhatsappDetailsPopoverpay() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }
    keepPatientPopoverOpenPayment() {
        // Clear close timeout when hovering over popover
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
            this.patientCloseTimeout = null;
        }
    }

    getWhatsappshareBillpayment(el) {
        console.log(el);
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.paymentId,
            smsType: "OPBill",
            patientId: el.regNo
        })
    }
    Onemail(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'OPBill'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
    OnemailPaymentReceipt(contact) {
        console.log(contact)
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'OPReceipt'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    Onmessage(data) { }


    GetOPbilldetail() {

        this.Vtotal = 0
        this.Vtotaldisc = 0
        this.Vtotalnet = 0
        this.Vtotbal = 0

        this.Vcashtot = 0
        this.Vcardtot = 0
        this.Vchequetot = 0
        this.Vnefttotl = 0

        this.f_name = this.myFilterbillform.get('FirstName').value + "%"
        this.l_name = this.myFilterbillform.get('LastName').value + "%"
        this.regNo = this.myFilterbillform.get('RegNo').value || "0"
        this.PBillNo = this.myFilterbillform.get('PBillNo').value || "%"
        this.CompanyId = this.myFilterbillform.get('CompanyId').value

        const fromDateControl = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd");

        const filters: any[] = [];
        debugger

        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }
        filters.push(
            {
                "fieldName": "F_Name",
                "fieldValue": String(this.f_name),
                "opType": "Contains"
            },
            {
                "fieldName": "L_Name",
                "fieldValue": String(this.l_name),
                "opType": "Contains"
            },

            {
                "fieldName": "From_Dt",
                "fieldValue": this.fromDate,
                "opType": "GreaterThanOrEqual"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": this.toDate,
                "opType": "LessThanOrEqual"
            },
            {
                "fieldName": "Reg_No",
                "fieldValue": String(this.regNo),
                "opType": "Equals"
            },
            {
                "fieldName": "PBillNo",
                "fieldValue": String(this.PBillNo),
                "opType": "Equals"
            },

            {
                "fieldName": "CompanyId",
                "fieldValue": String(this.CompanyId),
                "opType": "Equals"
            },
            {
                "fieldName": "CashCounterId",
                "fieldValue": "0",
                "opType": "Equals"
            },


        );
        debugger
        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "PbillNo",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };

        this._OPListService.getOPbilllist(data).subscribe((response) => {
            this.dataSourceBill.data = response.data;
            console.log(this.dataSourceBill.data)

            if (this.dataSourceBill.data.length > 0) {

                this.calculateTotals()
            }
            else {

                this.Vtotal = 0
                this.Vtotaldisc = 0
                this.Vtotalnet = 0
                this.Vtotbal = 0

                this.Vcashtot = 0
                this.Vcardtot = 0
                this.Vchequetot = 0
                this.Vnefttotl = 0
            }

        });
    }

    calculateTotals() {
        const data = this.dataSourceBill.filteredData?.length
            ? this.dataSourceBill.filteredData
            : this.dataSourceBill.data;

        let totalAmt = 0, concessionAmt = 0, netPayableAmt = 0, balanceAmt = 0;
        let cash = 0, cheque = 0, card = 0, paytm = 0;

        for (const r of data) {
            totalAmt += +r.totalAmt || 0;
            concessionAmt += +r.concessionAmt || 0;
            netPayableAmt += +r.netPayableAmt || 0;
            balanceAmt += +r.balanceAmt || 0;
            cash += +r.cashPay || 0;
            cheque += +r.cardPay || 0;
            card += +r.chequePay || 0;
            paytm += +r.onlinePay || 0;
        }


        this.Vtotal = totalAmt
        this.Vtotaldisc = concessionAmt
        this.Vtotalnet = netPayableAmt
        this.Vtotbal = balanceAmt

        this.Vcashtot = cash
        this.Vcardtot = card
        this.Vchequetot = cheque
        this.Vnefttotl = paytm
    }
    GetOPpaybilldetail() {

        this.Vptotal = 0
        this.Vptotaldisc = 0
        this.Vptotalnet = 0
        this.Vptotbal = 0

        this.Vpcashtotbal = 0
        this.Vpcardtotbal = 0
        this.Vponlinetot = 0


        this.pf_name = this.myFilterpayform.get('FirstName').value + "%"
        this.pl_name = this.myFilterpayform.get('LastName').value + "%"
        this.pregNo = this.myFilterpayform.get('RegNo').value || "0"
        this.pPBillNo = this.myFilterpayform.get('PBillNo').value || "0"
        this.precptNo = this.myFilterpayform.get('ReceiptNo').value || "0"
        this.pCompanyId = this.myFilterpayform.get('CompanyId').value || "0"

        const fromDateControl = this.datePipe.transform(this.myFilterpayform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterpayform.get('enddate').value, "yyyy-MM-dd");

        const filters: any[] = [];

        if (fromDateControl && toDateControl) {
            this.pfromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.ptoDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }
        filters.push(
            {
                "fieldName": "F_Name",
                "fieldValue": String(this.pf_name),
                "opType": "Contains"
            },
            {
                "fieldName": "L_Name",
                "fieldValue": String(this.pl_name),
                "opType": "Contains"
            },

            {
                "fieldName": "From_Dt",
                "fieldValue": this.pfromDate,
                "opType": "GreaterThanOrEqual"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": this.ptoDate,
                "opType": "LessThanOrEqual"
            },
            {
                "fieldName": "Reg_No",
                "fieldValue": String(this.pregNo),
                "opType": "Equals"
            }, {

            "fieldName": "ReceiptNo",
            "fieldValue": String(this.precptNo),
            "opType": "Equals"
        },
            {
                "fieldName": "PBillNo",
                "fieldValue": String(this.pPBillNo),
                "opType": "Equals"
            },

            {
                "fieldName": "CompanyId",
                "fieldValue": String(this.CompanyId),
                "opType": "Equals"
            }

        );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "RegNo",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };

        this._OPListService.getOPpaybilllist(data).subscribe((response) => {
            this.dataSourcepayBill.data = response.data;
            console.log(this.dataSourcepayBill.data)
            debugger
            if (this.dataSourcepayBill.data.length > 0) {

                this.calculatePaymentTotals()
            } else {
                this.Vptotal = 0
                this.Vptotaldisc = 0
                this.Vptotalnet = 0
                this.Vptotbal = 0

                this.Vpcashtotbal = 0
                this.Vpcardtotbal = 0
                this.Vponlinetot = 0
            }

        });
    }


    calculatePaymentTotals() {
        const data = this.dataSourcepayBill.filteredData?.length
            ? this.dataSourcepayBill.filteredData
            : this.dataSourcepayBill.data;

        let totalAmt = 0, concessionAmt = 0, netPayableAmt = 0, balanceAmt = 0;
        let cash = 0, cheque = 0, card = 0, paytm = 0;

        for (const r of data) {
            totalAmt += +r.billAmount || 0;
            concessionAmt += +r.discAmount || 0;
            netPayableAmt += +r.netAmount || 0;
            balanceAmt += +r.balanceAmt || 0;
            cash += +r.cashPayAmount || 0;
            cheque += +r.chequePayAmount || 0;
            card += +r.cardPayAmount || 0;
            paytm += +r.onlinePay || 0;
        }


        this.Vptotal = totalAmt
        this.Vptotaldisc = concessionAmt
        this.Vptotalnet = netPayableAmt
        this.Vptotbal = balanceAmt

        this.Vpcashtotbal = cash
        this.Vpcardtotbal = card
        this.Vpcheque = cheque
        this.Vponlinetot = paytm
    }
    GetOPbillrefunddetail() {

        this.Vrtotal = 0
        this.Vrtotaldisc = 0
        this.Vrtotalnet = 0
        this.Vrtotbal = 0
        this.Vrtotalref = 0
        this.Vrcashtot = 0
        this.Vrcardtot = 0
        this.Vrchequetot = 0

        this.rf_name = this.myFilterrefundform.get('FirstName').value + "%"
        this.rl_name = this.myFilterrefundform.get('LastName').value + "%"
        this.rregNo = this.myFilterrefundform.get('RegNo').value || "0"

        const fromDateControl = this.datePipe.transform(this.myFilterrefundform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterrefundform.get('enddate').value, "yyyy-MM-dd");

        const filters: any[] = [];


        if (fromDateControl && toDateControl) {
            this.rfromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.rtoDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }
        filters.push(
            {
                "fieldName": "F_Name",
                "fieldValue": String(this.rf_name),
                "opType": "Contains"
            },
            {
                "fieldName": "L_Name",
                "fieldValue": String(this.rl_name),
                "opType": "Contains"
            },

            {
                "fieldName": "From_Dt",
                "fieldValue": this.rfromDate,
                "opType": "GreaterThanOrEqual"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": this.rtoDate,
                "opType": "LessThanOrEqual"
            },
            {
                "fieldName": "Reg_No",
                "fieldValue": String(this.rregNo),
                "opType": "Equals"
            }

        );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "RefundId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };

        this._OPListService.getOPRefundbilllist(data).subscribe((response) => {
            this.dataSourceRef.data = response.data;
            console.log(this.dataSourceRef.data)

            if (this.dataSourceRef.data.length > 0) {

                this.calculateOprefundTotals()

            } else {

                this.Vrtotal = 0
                this.Vrtotaldisc = 0
                this.Vrtotalnet = 0
                this.Vrtotbal = 0
                this.Vrtotalref = 0
                this.Vrcashtot = 0
                this.Vrcardtot = 0
                this.Vrchequetot = 0
            }

        });
    }


    calculateOprefundTotals() {
        const data = this.dataSourceRef.filteredData?.length
            ? this.dataSourceRef.filteredData
            : this.dataSourceRef.data;

        let totalAmt = 0, concessionAmt = 0, netPayableAmt = 0, balanceAmt = 0, refAmt = 0;
        let cash = 0, cheque = 0, card = 0, paytm = 0;

        for (const r of data) {
            totalAmt += +r.totalAmt || 0;
            concessionAmt += +r.concessionAmt || 0;
            netPayableAmt += +r.netAmount || 0;
            refAmt += +r.refundAmount || 0;

            balanceAmt += +r.balanceAmt || 0;
            cash += +r.cashPayAmount || 0;
            cheque += +r.chequePayAmount || 0;
            card += +r.cardPayAmount || 0;

            paytm = this.dataSourceRef.data.reduce(
                (sum, r) => sum + (+r.nEFTPayAmount || 0) + (+r.payTmPayAmount || 0),
                0
            );
        }


        this.Vrtotal = totalAmt
        this.Vrtotaldisc = concessionAmt
        this.Vrtotalnet = netPayableAmt
        this.Vrtotbal = balanceAmt
        this.Vrtotalref = refAmt
        this.Vrcashtot = cash
        this.Vrcardtot = card
        this.Vrchequetot = cheque

        this.Vponlinetot = paytm
    }
}

export class BrowseOPDBill {
    BillNo: number;
    RegNo: any;
    PatientName: any;
    ConcessionAmount: any;
    NetPayableAmt: any;
    AddedByName: any;
    BillTime: any;
    DiscComments: any;
    PaymentMode: any;
    TokenNo: any;
    RegId: number;
    FirstName: string;
    Middlename: string;
    LastName: string;

    TotalAmt: number;
    ConcessionAmt: number;
    BillDate: any;
    IPDNo: number;
    ServiceName: string;
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
    Department: any;
    Address: any;
    MobileNo: any;
    CashCounterID: number;
    RefundAmt: any;
    HospitalHeaderLine: any;
    //NEFTPayAmount:number;
    /**
     * Constructor
     *
     * @param BrowseOPDBill
     */
    constructor(BrowseOPDBill) {
        {
            this.BillNo = BrowseOPDBill.BillNo || '';
            this.RefundAmt = BrowseOPDBill.RefundAmt || '';
            this.ConcessionAmount = BrowseOPDBill.ConcessionAmount || '';
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



export class OPbill {
    totalAmt: any
    concessionAmt: any
    netPayableAmt: any
    balanceAmt: any
    cashPay: any
    cardPay: any
    neftPay: any
    chequePay: any
    onlinePay: any
    paidAmount: any
    cashPayAmount: any
    chequePayAmount: any
    cardPayAmount: any
    nEFTPayAmount: any
    payTmPayAmount: any
    billAmount: any
    discAmount: any
    netAmount: any
    refundAmount: any
    constructor(OPbill) {
        {
            this.totalAmt = OPbill.totalAmt || 0;
            this.concessionAmt = OPbill.concessionAmt || 0;
            this.netPayableAmt = OPbill.netPayableAmt || 0;
            this.constructor = OPbill.constructor || 0

            this.cashPay = OPbill.cashPay || 0;
            this.cardPay = OPbill.cardPay || 0;
            this.neftPay = OPbill.neftPay || 0
            this.chequePay = OPbill.chequePay || 0;
            this.onlinePay = OPbill.onlinePay || 0
            this.paidAmount = OPbill.paidAmount || 0;
            this.cashPayAmount = OPbill.cashPayAmount || 0

            this.chequePayAmount = OPbill.chequePayAmount || 0;
            this.cardPayAmount = OPbill.cardPayAmount || 0;
            this.nEFTPayAmount = OPbill.nEFTPayAmount || 0
            this.payTmPayAmount = OPbill.payTmPayAmount || 0

            this.billAmount = OPbill.billAmount || 0;
            this.discAmount = OPbill.discAmount || 0
            this.netAmount = OPbill.netAmount || 0

            this.refundAmount = OPbill.refundAmount || 0
        }
    }
}