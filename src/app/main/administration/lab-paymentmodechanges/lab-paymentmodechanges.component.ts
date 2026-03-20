import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { DateUpdateComponent } from '../paymentmodechanges/date-update/date-update.component';
import { NewedipamodeComponent } from '../paymentmodechanges/newedipamode/newedipamode.component';
import { LabPaymentmodechangesService } from './lab-paymentmodechanges.service';

@Component({
    selector: 'app-lab-paymentmodechanges',
    templateUrl: './lab-paymentmodechanges.component.html',
    styleUrls: ['./lab-paymentmodechanges.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LabPaymentmodechangesComponent {
    f_name1: any = ""
    regNo1: any = "0"
    l_name1: any = ""
    PBillNo1: any = "0"
    ReceiptNo1: any = "0"
    fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    @ViewChild('actionButtonTemplateOP1') actionButtonTemplateOP1!: TemplateRef<any>;
    @ViewChild('ColorCodeOP') ColorCodeOP1!: TemplateRef<any>;
    @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;

    ngAfterViewInit() {
        this.gridConfigtPay.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateOP1;
        this.gridConfigtPay.columnsList.find(col => col.key === 'label')!.template = this.ColorCodeOP1;
    }

    constructor(
        public _PaymentmodechangesService: LabPaymentmodechangesService,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    alltPayColumns = [
        { heading: "Pay Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Receipt No", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHID No ", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Mode", key: "payMode", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bill Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Paid Amount", key: "payAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "User Name", key: "payUserName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplateOP1
        }
    ]

    alltPayFilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    gridConfigtPay: gridModel = {
        apiUrl: "PaymentMode/OPBillListForPaymentModeChangeList",
        columnsList: this.alltPayColumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.alltPayFilters
    }

    onChangetPay() {
        debugger
        this.fromDate1 = this.datePipe.transform(this._PaymentmodechangesService.tpayFormGroup.get('startdate').value, "yyyy-MM-dd")
        this.toDate1 = this.datePipe.transform(this._PaymentmodechangesService.tpayFormGroup.get('enddate').value, "yyyy-MM-dd")
        this.f_name1 = this._PaymentmodechangesService.tpayFormGroup.get('FirstName').value + "%"
        this.l_name1 = this._PaymentmodechangesService.tpayFormGroup.get('LastName').value + "%"
        this.regNo1 = this._PaymentmodechangesService.tpayFormGroup.get('RegNo').value || "0"
        this.PBillNo1 = this._PaymentmodechangesService.tpayFormGroup.get('PBillNo').value || "0"
        this.ReceiptNo1 = this._PaymentmodechangesService.tpayFormGroup.get('ReceiptNo').value || "0"
        this.getfiltertPay();
    }

    getfiltertPay() {
        debugger
        this.gridConfigtPay = {
            apiUrl: "PaymentMode/OPBillListForPaymentModeChangeList",
            columnsList: this.alltPayColumns,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.f_name1, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.l_name1, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.regNo1, opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: this.PBillNo1, opType: OperatorComparer.Equals },
            { fieldName: "ReceiptNo", fieldValue: this.ReceiptNo1, opType: OperatorComparer.Equals }
            ]
        }
        this.grid1.gridConfig = this.gridConfigtPay;
        this.grid1.bindGridData();
    }

    ClearfiltertPay(event) {

        console.log(event)
        if (event == 'FirstName')
            this._PaymentmodechangesService.tpayFormGroup.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this._PaymentmodechangesService.tpayFormGroup.get('LastName').setValue("")
        if (event == 'RegNo')
            this._PaymentmodechangesService.tpayFormGroup.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this._PaymentmodechangesService.tpayFormGroup.get('PBillNo').setValue("")
        if (event == 'ReceiptNo')
            this._PaymentmodechangesService.tpayFormGroup.get('ReceiptNo').setValue("")

        this.onChangetPay();
    }

    PaymentDate(contact, ID) {
        console.log(contact)
        const dialogRef = this._matDialog.open(DateUpdateComponent,
            {
                maxHeight: "35vh",
                maxWidth: '90vh',
                width: '100%',
                data: {
                    registerObj: contact,
                    FromName: ID
                },
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid1.bindGridData();
        });
    }

    onEdit1(row) {
        console.log(row)
        const dialogRef = this._matDialog.open(NewedipamodeComponent,
            {
                height: "85%",
                width: '80%',
                data: {
                    registerObj: row,
                    FromName: "LAB-PaymentModeChange"
                },

            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid1.bindGridData();
        });
    }
}
