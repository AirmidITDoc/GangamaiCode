import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { BillListForDocShrList } from 'app/main/administration/doctor-share/doctor-share.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DoctorshareProcessService } from './doctorshare-process.service';

@Component({
    selector: 'app-doctorshare-process',
    templateUrl: './doctorshare-process.component.html',
    styleUrls: ['./doctorshare-process.component.scss']
})
export class DoctorshareProcessComponent {

    @ViewChild('drawer') public drawer: MatDrawer;
    isRegIdSelected: boolean = false;
    isDoctorIDSelected: boolean = false;
    isgroupIdSelected: boolean = false;
    DoctorListfilteredOptions: Observable<string[]>;
    filteredOptionsGroup: Observable<string[]>;
    doctorNameCmbList: any = [];
    groupNameList: any = [];
    sIsLoading: string = '';
    PatientListfilteredOptions: any;
    noOptionFound: any;

    dataSource = new MatTableDataSource<BillListForDocShrList>();


    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    DoctorId: any = "0"

    DocProcessfilterForm: FormGroup
    autocompleteModedoctor: string = "ConDoctor";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    constructor(
        public _DoctorShareService: DoctorshareProcessService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService, private fb: FormBuilder,
    ) { }

    ngOnInit(): void {

        this.DocProcessfilterForm = this.fb.group({
            fromDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            enddate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            DoctorID: ["0", Validators.required]
        });

    }
    @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;
    // @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsPtype') actionsPtype!: TemplateRef<any>;

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        // this.gridConfig.columnsList.find(col => col.key === 'OPdIpdType')!.template = this.actionsPtype;
        // this.gridConfig.columnsList.find(col => col.key === 'isBillShrHold')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;
    }

    allColumns = [
        // { heading: "PType", key: "OPdIpdType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Pro.Start Date", key: "processStartDate", sort: true, align: 'left', emptySign: 'NA', width: 110, type: 6 },
        { heading: "Pro.End Date", key: "processEndDate", sort: true, align: 'left', emptySign: 'NA', width: 110, type: 6 },
        { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Doctor Amount", key: "doctorAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Hospital Amount", key: "hospitalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "TDS Amount", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        // { heading: "OPD_IPD_Id", key: "OPD_IPD_Id", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Charges", key: "addcharges", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate2  // Assign ng-template to the column
        }
    ]
    allFilters = [
        { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },

    ]
    gridConfig: gridModel = {
        apiUrl: "DoctorPAy/DoctorProcessedList",
        columnsList: this.allColumns,
        sortField: "DoctorId",
        sortOrder: 0,
        filters: this.allFilters
    }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.DocProcessfilterForm.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.DocProcessfilterForm.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdata();
    }

    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.DoctorId = value.value
        else
            this.DoctorId = "0"

        this.onChangeFirst();
    }


    getfilterdata() {
        debugger
        const fromD = this.DocProcessfilterForm.get("fromDate").value || "";
        const toD = this.DocProcessfilterForm.get("enddate").value || "";
        this.fromDate = fromD ? this.datePipe.transform(this.DocProcessfilterForm.get('fromDate').value, "yyyy-MM-dd") : "";
        this.toDate = toD ? this.datePipe.transform(this.DocProcessfilterForm.get('enddate').value, "yyyy-MM-dd") : "";


        this.gridConfig = {
            apiUrl: "DoctorPAy/DoctorProcessedList",
            columnsList: this.allColumns,
            sortField: "DoctorId",
            sortOrder: 0,
            filters: [
                { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },
                { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    OnPaymentdetail(element) {
        console.log(element)
        const PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(element.processDate, 'yyyy-MM-dd') || '01/01/1900',
            PatientHeaderObj['PatientName'] = element.PatientName;
        // PatientHeaderObj['RegNo'] = element.RegNo;
        PatientHeaderObj['DoctorName'] = element.doctorName;
        // PatientHeaderObj['CompanyName'] = element.CompanyName;
        // PatientHeaderObj['DepartmentName'] = element.DepartmentName;
        // PatientHeaderObj['OPD_IPD_Id'] = element.vOPIPId;
        // PatientHeaderObj['Age'] = element.AgeYear;
        PatientHeaderObj['NetPayAmount'] = element.netAmount
        const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
                maxWidth: "80vw",
                height: '750px',
                width: '80%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "Doctor_Payout",
                    advanceObj: PatientHeaderObj,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.IsSubmitFlag == true) {
                console.log(result.submitDataPay.ipPaymentInsert)
                // this.OpBillForm.get('balanceAmt').setValue(result.BillBalanceAmount ||0)
                // this.OpBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

                const d = {

                }
                this._DoctorShareService.DoctorProcPayment(d).subscribe(response => {
                    this._matDialog.closeAll();

                });
            }
        });
    }
    onPrint(element) { }

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