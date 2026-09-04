import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes, gridActions } from 'app/core/models/tableActions';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { MrdService } from '../mrd.service';
import { NewCertificateComponent } from './new-certificate/new-certificate.component';
import { MedicoLegalCertificateComponent } from './medico-legal-certificate/medico-legal-certificate.component';
import { DeathCertificateComponent } from './death-certificate/death-certificate.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
    selector: 'app-certificate',
    templateUrl: './certificate.component.html',
    styleUrls: ['./certificate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CertificateComponent implements OnInit {
    myFilterform: FormGroup;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    mobileno: any = "%"
    label: any = "2"

    labelName: any;


    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('RequestColorCode') RequestColorCode!: TemplateRef<any>;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    photo: PageNames = PageNames.PATIENT_PHOTO;
    signature: PageNames = PageNames.PATIENT_SIGNATURE;


    constructor(
        public _MrdService: MrdService,
        public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._MrdService.filterForm();
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[2].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'label')!.template = this.RequestColorCode;
        this.gridConfig.columnsList.find(col => col.key === 'opIpType')!.template = this.actionsTemplate;
    }

    allcolumns = [
        {
            heading: "-", key: "opIpType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40,
            template: this.actionsTemplate
        },
        {
            heading: "-", key: "label", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 150,
            template: this.RequestColorCode
        },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Cause Of Injury", key: "causeofInjuries", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Details of Injury", key: "details_Injuries", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Age of Injury", key: "ageofInjuries", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Doctor Name ", key: "admittedDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "departmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Accident Date", key: "accident_Date", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Certificate DateTime", key: "mlcTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            // actions: [
            //     {
            //         action: gridActions.edit, callback: (data: any) => {
            //             this.OnNewDeathCertificate(data);
            //         }
            //     }
            // ],
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];

    gridConfig: gridModel = {
        apiUrl: "DeathCertificate/CertificateList",
        columnsList: this.allcolumns,
        sortField: "docId",
        sortOrder: 0,
        filters: [
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
            { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.StartsWith },
            { fieldName: "Death", fieldValue: this.label, opType: OperatorComparer.Equals },
        ],
        row: 25
    }



    OnNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 

        const dialogRef = this._matDialog.open(MedicoLegalCertificateComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    OnNewDeathCertificate(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        const dialogRef = this._matDialog.open(DeathCertificateComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    capturedImage = '';
    onPhotoCaptured(photoBase64: string) {
        if (photoBase64) {
            this.capturedImage = photoBase64;
            // Save or display
        }
    }

    OnPrint(Param) {
        if (Param.label == 'Medico') {
            this.OnMedicoPrint(Param)
        } else {
            this.OnDeathPrint(Param)
        }
    }

    OnMedicoPrint(obj) {
        // debugger
        const param = {
            "searchFields": [
                {
                    "fieldName": "DocId",
                    "fieldValue": String(obj.docId),
                    "opType": "Equals"
                },
                {
                    "fieldName": "OP_IP_Type",
                    "fieldValue": String(obj.opIpType),
                    "opType": "Equals"
                }

            ],
            "mode": "MedicolegalCertificateReport"
        }

        console.log(param);

        this._MrdService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "Medico Legal Certificate",
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });
    }

    OnDeathPrint(Param) {
        this.commonService.Onprint("CertificateId", Param.docId, "DeathCertificateReport");
    }

    OnEdit(row: any = null) {
        if (row) {
            console.log(row)
            if (row.label == 'Medico') {
                this.OnEditMedico(row)
            } else {
                this.OnEditCertificate(row)
            }
        }
    }

    OnEditMedico(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        const that = this;
        const dialogRef = this._matDialog.open(MedicoLegalCertificateComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }



    OnEditCertificate(row: any = null) {
        // console.log(row)
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        const that = this;
        const dialogRef = this._matDialog.open(DeathCertificateComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    onNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        const that = this;
        const dialogRef = this._matDialog.open(MedicoLegalCertificateComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90%',
                width: '90%',

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }



    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.label = this.myFilterform.get('labelType').value
        this.getfilterdata();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "DeathCertificate/CertificateList",
            columnsList: this.allcolumns,
            sortField: "DocId",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
                { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
                { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.StartsWith },
                { fieldName: "Death", fieldValue: this.label, opType: OperatorComparer.Equals },
            ],
            row: 25
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")

        this.onChangeFirst();
    }

    getValidationMessages() {
        return {
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                { name: "pattern", Message: "only char allowed." }
            ]
        }
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

}

export class CharityPatientdetail {
    RegNo: any;
    IPDNo: any;
    PatientName: string;
    Address: any;
    GenderName: any;
    AgeYear: any;
    DepartmentName: any;
    AdmissionDate: any;
    Ischarity: any;
    PaidAmount: any;
    TotalAmt: any;
    ConcessionAmt: any;
    NetPayableAmt: any;
    PBillNo: any;
    ConcessionReason: any;
    AnnualIncome: any;
    RationCardNo: any;
    IsIndientOrWeaker: any;

    BillNo: any;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(CharityPatientdetail) {
        {

            this.RegNo = CharityPatientdetail.RegNo || '';
            this.PatientName = CharityPatientdetail.PatientName || '';
            this.IPDNo = CharityPatientdetail.IPDNo || 0;
            this.Address = CharityPatientdetail.Address || '';
            this.GenderName = CharityPatientdetail.GenderName || '';
            this.AgeYear = CharityPatientdetail.AgeYear || '';
            this.DepartmentName = CharityPatientdetail.DepartmentName || 0;
            this.AdmissionDate = CharityPatientdetail.AdmissionDate || '';
            this.Ischarity = CharityPatientdetail.Ischarity || '';
            this.PaidAmount = CharityPatientdetail.PaidAmount || '';
            this.TotalAmt = CharityPatientdetail.TotalAmt || '';
            this.ConcessionAmt = CharityPatientdetail.ConcessionAmt || '';
            this.NetPayableAmt = CharityPatientdetail.NetPayableAmt || '';
            this.PBillNo = CharityPatientdetail.PBillNo || '';
            this.ConcessionReason = CharityPatientdetail.ConcessionReason || '';
            this.AnnualIncome = CharityPatientdetail.AnnualIncome || '';
            this.RationCardNo = CharityPatientdetail.RationCardNo || '';
            this.IsIndientOrWeaker = CharityPatientdetail.IsIndientOrWeaker || '';
            this.BillNo = CharityPatientdetail.BillNo || '';

        }
    }
}
