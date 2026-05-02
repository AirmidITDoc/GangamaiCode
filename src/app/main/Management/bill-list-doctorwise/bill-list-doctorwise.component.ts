import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { DoctorShareListComponent } from 'app/main/setup/doctor/doctor-payoutpercentage/doctor-share-list/doctor-share-list.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BillDoctorwiseService } from './bill-doctorwise.service';
import { DoctorAddonpayComponent } from './doctor-addonpay/doctor-addonpay.component';
import { DoctorpaySummarydetailComponent } from './doctorpay-summarydetail/doctorpay-summarydetail.component';
import { PatientBilldetailComponent } from './patient-billdetail/patient-billdetail.component';
import { ProcessDoctorshareComponent } from './process-doctorshare/process-doctorshare.component';

@Component({
    selector: 'app-bill-list-doctorwise',
    templateUrl: './bill-list-doctorwise.component.html',
    styleUrls: ['./bill-list-doctorwise.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class BillListDoctorwiseComponent {

    DocSummaryfilterForm: FormGroup;
    DocSummarydetailfilterForm: FormGroup;
    autocompleteModedoctor: string = "ConDoctor";
    autocompleteModedoctor1: string = "ConDoctor";
    autocompletedepartment: string = "Department";


    opipType: any = "1"
    DoctorId = "0";
    DoctorId1 = "0";
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    dataSource = new MatTableDataSource<BillListForDocShrList>();
    dsAdditionalPay = new MatTableDataSource<BillListForDocShrList>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;
    @ViewChild('ipBrowse', { static: false }) grid: AirmidTableComponent;
    @ViewChild('summary', { static: false }) grid1: AirmidTableComponent;
    @ViewChild('summarydetail', { static: false }) grid2: AirmidTableComponent;
    @ViewChild('actionsshare') actionsshare!: TemplateRef<any>;

    constructor(
        public _DoctorShareService: BillDoctorwiseService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {

        this.DocSummaryfilterForm = this.fb.group({
            fromDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            enddate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            DoctorID: ["0", Validators.required]
        });

        this.DocSummarydetailfilterForm = this.fb.group({
            fromDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            enddate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            DoctorID: ["0", Validators.required]
        });

        this.getAllDoctorBillList()
    }

    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        // Assign the template to the column dynamically
        // this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate1;
        // this.gridConfig.columnsList.find(col => col.key === 'opdipdtype')!.template = this.actionsTemplate;
        this.gridConfig2.columnsList.find(col => col.key === 'isDoctorShareGenerated')!.template = this.actionsshare;
        this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
        this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;
    }

    ///Summary pay
    allColumns1 = [

        { heading: "DoctorName", key: "addChargeDrName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
        { heading: "Hospital Amount", key: "hospitalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 200 },
        { heading: "Doctor Amount", key: "docAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 250 },

        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate1  // Assign ng-template to the column
        }
    ]
    allFilters1 = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },


    ]
    gridConfig1: gridModel = {
        apiUrl: "DoctorPAy/DoctorPaySummaryList",
        columnsList: this.allColumns1,
        sortField: "DoctorId",
        sortOrder: 0,
        filters: this.allFilters1,
        row: 25
    }

    onChangeFirst1() {
        debugger
        this.fromDate = this.datePipe.transform(this.DocSummaryfilterForm.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.DocSummaryfilterForm.get('enddate').value, "yyyy-MM-dd")

        if (this.fromDate && this.toDate) {
            this.getfilterdata1();
            this.getAllDoctorBillList()
        }
    }

    getfilterdata1() {
        
        this.gridConfig1 = {
            apiUrl: "DoctorPAy/DoctorPaySummaryList",
            columnsList: this.allColumns1,
            sortField: "DoctorId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
                { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals }
            ]
        }
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();

    }
    //
    Clearfilter(event) {
        console.log(event)
        if (event == 'PbillNo')
            this._DoctorShareService.UserFormGroup.get('PbillNo').setValue("")
        // this.onChangeFirst();
    }

    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.DoctorId = value.value
        else
            this.DoctorId = "0"

        this.onChangeFirst1();
    }


    ///Summary detail pay
    allColumns2 = [
        { heading: "Status", key: "isDoctorShareGenerated", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "Doctor Name", key: "addChargeDrName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Doctor Amount", key: "docAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 120 },
        { heading: "Hospital Amount", key: "hospitalAmt", sort: true, align: 'left', type: gridColumnTypes.amount, emptySign: 'NA', width: 120 },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 120 },
        { heading: "Type", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 120 },

        {
            heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate2  // Assign ng-template to the column
        }
    ]
    allFilters2 = [
        { fieldName: "DoctorId", fieldValue: this.DoctorId1, opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "ToDate", fieldValue: this.toDate1, opType: OperatorComparer.GreaterThanOrEqual }



    ]
    gridConfig2: gridModel = {
        apiUrl: "DoctorPAy/DoctorsharSummarydetail",
        columnsList: this.allColumns2,
        sortField: "DoctorId",
        sortOrder: 0,
        filters: this.allFilters2
    }

    ListView2(value) {
        console.log(value)
        if (value.value !== 0)
            this.DoctorId1 = value.value
        else
            this.DoctorId1 = "0"

        this.onChangeFirst2();
    }
    onChangeFirst2() {
        this.fromDate1 = this.datePipe.transform(this.DocSummarydetailfilterForm.get('fromDate').value, "yyyy-MM-dd")
        this.toDate1 = this.datePipe.transform(this.DocSummarydetailfilterForm.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdata2();
    }

    getfilterdata2() {

        debugger
        this.gridConfig2 = {
            apiUrl: "DoctorPAy/DoctorsharSummarydetail",
            columnsList: this.allColumns2,
            sortField: "DoctorId",
            sortOrder: 0,
            filters: [
                { fieldName: "DoctorId", fieldValue: this.DoctorId1, opType: OperatorComparer.Equals },
                { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.toDate1, opType: OperatorComparer.StartsWith }

            ]
        }
        this.grid2.gridConfig = this.gridConfig2;
        this.grid2.bindGridData();
    }

    getValidationMessages() {
        return {
            registrationNo: [],
            ipNo: [],
            opNo: [],
            patientType: [],

        };
    }

    isDatePckrDisabled: boolean = false;
    Additiondocpay() {
        const dialogRef = this._matDialog.open(DoctorAddonpayComponent,
            {
                maxWidth: "85vw",
                height: "50%",
                width: "100%"
            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst()
        });
    }

    EditAdditiondocpay(element) {
        const dialogRef = this._matDialog.open(DoctorAddonpayComponent,
            {
                maxWidth: "85vw",
                height: "50%",
                width: "100%",
                data: element
            });
        dialogRef.afterClosed().subscribe(result => {
            // this.onChangeFirst()
        });
    }

    processDocShare() {
        const dialogRef = this._matDialog.open(ProcessDoctorshareComponent,
            {
                maxWidth: "45vw",
                maxHeight: '35%',
                width: '35%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            if(result)
                 this.onChangeFirst1()
        });
       
    }

    DefineDoctorShare() {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();

        const dialogRef = this._matDialog.open(DoctorShareListComponent, {
            width: "950px",
            maxWidth: "95vw",
            height: "auto",
            autoFocus: false,
            disableClose: false

        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }

    onHold(row: any = null) {
        Swal.fire({
            title: 'Do you want to Hold Bill ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Hold!"

        }).then((result) => {
            if (result.isConfirmed) {
            }
        });
    }


    billdetail(element) {
        console.log(element)
        debugger

        const dialogRef = this._matDialog.open(PatientBilldetailComponent,
            {
                maxWidth: '90vw',
                height: '700px',
                width: '100%',
                data: {
                    obj: element,
                    doctorId: this.DoctorId1
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.onChangeFirst2()
        });

    }

    Doctorbilldetail(element) {
        const dialogRef = this._matDialog.open(DoctorpaySummarydetailComponent,
            {
                maxWidth: "90vw",
                height: '700px',
                width: '100%',
                data: {
                    obj: element,
                    fromDate: this.fromDate,
                    toDate: this.toDate,

                }
            });
        dialogRef.afterClosed().subscribe(result => {
           this.getfilterdata1()
        });

    }

    Billdetaildatasource = new MatTableDataSource<BillListForDocShrList>();

    getAllDoctorBillList() {
        this.fromDate = this.datePipe.transform(this.DocSummaryfilterForm.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.DocSummaryfilterForm.get('enddate').value, "yyyy-MM-dd")

        const vdata = {
            "first": 0,
            "rows": 999,
            "sortField": "DoctorId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "FromDate",
                    "fieldValue": this.fromDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": this.toDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "DoctorId",
                    "fieldValue": this.DoctorId,
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        console.log(vdata)
        debugger
        this._DoctorShareService.getAllDoctorBilldetailList(vdata).subscribe(data => {
            this.Billdetaildatasource.data = data.data as BillListForDocShrList[]
            console.log(this.Billdetaildatasource.data)
            if (this.Billdetaildatasource.data.length > 0)
                this.getsumdetail()
        })
    }


    TotAmt = 0
    TotconAmt = 0
    TotNetamt = 0
    TotDocAmt = 0
    TothospitalAmt = 0
    count = 0
    // netAmount
    // hospitalAmt
    // docAmt
    getsumdetail() {
        debugger
        this.count = this.Billdetaildatasource.data.length
        this.TotNetamt = this.Billdetaildatasource.data.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);

        this.TotDocAmt = this.Billdetaildatasource.data.reduce((sum, { docAmt }) => sum += +(docAmt || 0), 0);
        this.TothospitalAmt = this.Billdetaildatasource.data.reduce((sum, { hospitalAmt }) => sum += +(hospitalAmt || 0), 0);

    }


    onClear() {
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
    keyPressCharater(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    getValidationdoctorMessages() {
        return {
            searchDoctorId: [
                // { name: "required", Message: "Doctor Name is required" }
            ],
            searchDoctorId1: [
                // { name: "required", Message: "Doctor Name is required" }
            ]
        };
    }

}


export class BillListForDocShrList {

    PatientName: string;
    TotalAmt: number;
    ConAmt: number;
    NetAmt: number;
    PBillNo: number;
    // BillNo: number;
    AdmittedDoctorName: string;
    PatientType: number;
    CompanyName: string;
    IsBillShrHold: boolean;
    GroupName: any;
    docAmt: any
    netAmount: any
    hospitalAmt: any

    constructor(BillListForDocShrList) {

        this.PatientName = BillListForDocShrList.PatientName;
        this.TotalAmt = BillListForDocShrList.TotalAmt || 0;
        this.ConAmt = BillListForDocShrList.ConAmt || '0';
        this.NetAmt = BillListForDocShrList.NetAmt || 0;
        this.PBillNo = BillListForDocShrList.PBillNo || 0;
        //this.BillNo= BillListForDocShrList.BillNo|| 0;
        this.AdmittedDoctorName = BillListForDocShrList.AdmittedDoctorName;
        this.PatientType = BillListForDocShrList.PatientType || 0;
        this.CompanyName = BillListForDocShrList.CompanyName;
        this.IsBillShrHold = BillListForDocShrList.IsBillShrHold || 0;
        this.GroupName = BillListForDocShrList.GroupName || '';
        this.docAmt = BillListForDocShrList.docAmt || 0;
        this.netAmount = BillListForDocShrList.netAmount || 0;
        this.hospitalAmt = BillListForDocShrList.hospitalAmt || 0;

    }
}

