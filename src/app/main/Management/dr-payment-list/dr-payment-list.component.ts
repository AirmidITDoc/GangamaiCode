import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ChargesList } from 'app/main/opd/appointment-list/appointment-billing/appointment-billing.component';
import { DrpaymentlistService } from './drpaymentlist.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-dr-payment-list',
    templateUrl: './dr-payment-list.component.html',
    styleUrls: ['./dr-payment-list.component.scss'],
        animations: fuseAnimations
})
export class DrPaymentListComponent {
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
        public _DrpaymentlistService: DrpaymentlistService,
        public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
        public _matDialog: MatDialog, private formBuilder: FormBuilder,
        public toastr: ToastrService, private fb: FormBuilder, private accountService: AuthenticationService,
    ) { }
    DrpaymentForm: FormGroup
    ngOnInit(): void {

        this.DocProcessfilterForm = this.fb.group({
            fromDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            enddate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            // DoctorID: ["0", Validators.required]
        });

    }
    @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;
    // @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsPtype') actionsPtype!: TemplateRef<any>;

    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'oPDIPDType')!.template = this.actionsTemplate1;

        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;
    }

    allColumns = [
        // { heading: "OPDIPDType", key: "oPDIPDType", sort: true, align: 'left', emptySign: 'NA', width: 100},
        { heading: "Patient", key: "oPDIPDType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
        { heading: "Bill No", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
      
        { heading: "Receipt No", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type:6},
        { heading: "Pay Amount", key: "payAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 150 },
        { heading: "Tran No", key: "tranNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Bank Name", key: "bankName", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        { heading: "Pay Mode", key: "payMode", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Online TranNo", key: "onlineTranNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Trans. Label", key: "transactionLabel", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate2  // Assign ng-template to the column
        }
    ]
    allFilters = [
        // { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },

    ]
    gridConfig: gridModel = {
        apiUrl: "DoctorPAy/DoctorPaymentList",
        columnsList: this.allColumns,
        sortField: "PaymentId",
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
        this.fromDate = this.datePipe.transform(this.DocProcessfilterForm.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.DocProcessfilterForm.get('enddate').value, "yyyy-MM-dd")


        this.gridConfig = {
            apiUrl: "DoctorPAy/DoctorPaymentList",
            columnsList: this.allColumns,
            sortField: "PaymentId",
            sortOrder: 0,
            filters: [
                // { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.StartsWith },
                { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
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