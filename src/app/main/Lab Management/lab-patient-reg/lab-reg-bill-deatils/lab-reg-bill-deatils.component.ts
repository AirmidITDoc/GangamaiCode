import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { EmailorSMSHistoryComponent } from '../../emailor-smshistory/emailor-smshistory.component';
import { ReportDispatchComponent } from '../../report-dispatch/report-dispatch.component';

@Component({
    selector: 'app-lab-reg-bill-deatils',
    templateUrl: './lab-reg-bill-deatils.component.html',
    styleUrls: ['./lab-reg-bill-deatils.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LabRegBillDeatilsComponent {
    BillNo = "0"
    doctorName = ""
    labId="0"

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('iconisPathology') iconisPathology!: TemplateRef<any>;
    @ViewChild('iconisRadiology') iconisRadiology!: TemplateRef<any>;
    @ViewChild('icons') icons!: TemplateRef<any>;
    @ViewChild('ColorCode') ColorCode!: TemplateRef<any>;
    @ViewChild('billgrid', { static: false }) billgrid: AirmidTableComponent;
    @ViewChild('DiscGrid', { static: false }) Discgrid: AirmidTableComponent;
    @ViewChild('PayGrid', { static: false }) Paygrid: AirmidTableComponent;
    @ViewChild('CreditGrid', { static: false }) Creditgrid: AirmidTableComponent;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'icon')!.template = this.icons;
        // this.gridConfig.columnsList.find(col => col.key === 'isPathology')!.template = this.iconisPathology;
        // this.gridConfig.columnsList.find(col => col.key === 'isRadiology')!.template = this.iconisRadiology;
        this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.ColorCode;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    ngOnInit(): void {
        if (this.data) {
            this.BillNo = this.data.billNo;
            this.doctorName = this.data.doctorName;
            this.labId=this.data.labPatientId
            this.getfilterdata();
            this.getDiscountfilterdata();
            this.getCreditfilterdata();
            this.getPayoutfilterdata();
        }
    }

    constructor(public _labPatientRegService: LabPatientRegService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
        private _fuseSidebarService: FuseSidebarService,
        public _whatsppService: WhatsAppEmailService,) { }

    allcolumns = [
        {
            heading: "-", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.ColorCode
        },
        { heading: "--", key: "icon", align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 80, template: this.icons },
        // { heading: "--", key: "isPathology",align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:30 },
        // { heading: "--", key: "isRadiology", align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:30 },
        { heading: "Bill Date", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Charges Date", key: "chargesTime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];

    gridConfig: gridModel = {
        apiUrl: "LabPatientRegistration/LabBillDetailList",
        columnsList: this.allcolumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
        ]
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "LabPatientRegistration/LabBillDetailList",
            columnsList: this.allcolumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
            ]
        }
        // debugger
        setTimeout(() => {
            this.billgrid.gridConfig = this.gridConfig;
            this.billgrid.bindGridData();
        }, 100);
    }

    allDisccolumns = [
        { heading: "Discount Date", key: "billTime", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Discount Type", key: "type", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "DisPer", key: "concessionPercentage", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "DisAmt", key: "concessionAmount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Remarks", key: "discComments", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tran MadeBy", key: "username", sort: true, align: 'left', emptySign: 'NA' }
    ];
    gridConfig1: gridModel = {
        apiUrl: "LabPatientRegistration/LabDiscountDetailList",
        columnsList: this.allDisccolumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
        ]
    }
    getDiscountfilterdata() {
        this.gridConfig1 = {
            apiUrl: "LabPatientRegistration/LabDiscountDetailList",
            columnsList: this.allDisccolumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
            ]
        }
        // debugger
        setTimeout(() => {
            this.Discgrid.gridConfig = this.gridConfig1;
            this.Discgrid.bindGridData();
        }, 100);
    }
    allPaycolumns = [
        { heading: "Payment Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA'},
        { heading: "Method", key: "method", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tran. Type", key: "payMode", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Amount", key: "payAmount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Remarks", key: "comments", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tran MadeBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' }
    ];
    gridConfig2: gridModel = {
        apiUrl: "LabPatientRegistration/LabPaymentDetailList",
        columnsList: this.allPaycolumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
        ]
    }
    getPayoutfilterdata() {
        this.gridConfig2 = {
            apiUrl: "LabPatientRegistration/LabPaymentDetailList",
            columnsList: this.allPaycolumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
            ]
        }
        // debugger
        setTimeout(() => {
            this.Paygrid.gridConfig = this.gridConfig2;
            this.Paygrid.bindGridData();
        }, 100);
    }

    allCreditcolumns = [
        { heading: "Credit Date", key: "billTime", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Method", key: "method", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tran. Type", key: "type", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Remarks", key: "remark", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Tran MadeBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    ];
    gridConfig3: gridModel = {
        apiUrl: "LabPatientRegistration/LabCreditDetailList",
        columnsList: this.allCreditcolumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
        ]
    }
    getCreditfilterdata() {
        this.gridConfig3 = {
            apiUrl: "LabPatientRegistration/LabCreditDetailList",
            columnsList: this.allCreditcolumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
            ]
        }
        // debugger
        setTimeout(() => {
            this.Creditgrid.gridConfig = this.gridConfig3;
            this.Creditgrid.bindGridData();
        }, 100);
    }

    viewgetPathologyTestReportPdf(data) {
        const param = {
            searchFields: [
                {
                    fieldName: "OP_IP_Type",
                    fieldValue: "4",
                    opType: "Equals"
                }
            ],
            mode: "PathologyReportWithOutHeader"
        };

        console.log(param);

        this._labPatientRegService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "Pathology Test Report Viewer"
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });

    }

    onClose() {
        this._matDialog.closeAll()
    }

    onPrint(){        
      this.commonService.Onprint("OPD_IPD_ID", this.labId, "LabSlipReport");
    }

    getWhatsappshareReport(el) {
        console.log(el);
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.pathTestID,
            smsType: "PathResultEntry",
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
                    emailType: 'PathResultEntry'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.billgrid.bindGridData();
        });
    }

    viewgetReportdispatch(element) {
        console.log(element)
        const dialogRef = this._matDialog.open(ReportDispatchComponent,
            {
                maxWidth: "90vw",
                maxHeight: '95%',
                width: '100%',
                data: element

            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst2()
        });

    }

    viewgetSms(element) {
        console.log(element)
        const dialogRef = this._matDialog.open(EmailorSMSHistoryComponent,
            {
                maxWidth: "90vw",
                maxHeight: '115%',

                width: '100%',
                data: element

            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst2()
        });
    }

}
