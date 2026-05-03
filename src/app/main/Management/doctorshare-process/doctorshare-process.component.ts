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
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DoctorshareProcessService } from './doctorshare-process.service';
import { DoctorPaymentComponent } from './doctor-payment/doctor-payment.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ChargesList } from 'app/main/opd/appointment-list/appointment-billing/appointment-billing.component';
import { fuseAnimations } from '@fuse/animations';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
    selector: 'app-doctorshare-process',
    templateUrl: './doctorshare-process.component.html',
    styleUrls: ['./doctorshare-process.component.scss'],
    animations: fuseAnimations
})
export class DoctorshareProcessComponent {

    @ViewChild('drawer') public drawer: MatDrawer;
    // isRegIdSelected: boolean = false;
    // isDoctorIDSelected: boolean = false;
    // isgroupIdSelected: boolean = false;
    // DoctorListfilteredOptions: Observable<string[]>;
    // filteredOptionsGroup: Observable<string[]>;
    // doctorNameCmbList: any = [];
    // sIsLoading: string = '';
    // PatientListfilteredOptions: any;
    // noOptionFound: any;

    // dataSource = new MatTableDataSource<BillListForDocShrList>();

    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatPaginator) paginator: MatPaginator;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    DoctorId: any = "0"

    DocProcessfilterForm: FormGroup
    autocompleteModedoctor: string = "ConDoctor";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    constructor(
        public _DoctorShareService: DoctorshareProcessService,
        public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
        public _matDialog: MatDialog, private formBuilder: FormBuilder,
        public toastr: ToastrService, private fb: FormBuilder, private accountService: AuthenticationService,
        private commonService: PrintserviceService,
    ) { }
    DrpaymentForm: FormGroup
    ngOnInit(): void {

        this.DrpaymentForm = this.createPaymentForm();

        this.DocProcessfilterForm = this.fb.group({
            fromDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            enddate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            DoctorID: ["0", Validators.required]
        });

    }
    @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;
    @ViewChild('PatientTypeColorCode') PatientTypeColorCode!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'payStatus')!.template = this.PatientTypeColorCode;
    }

    allColumns = [
        {
            heading: "Status", key: "payStatus", align: 'left', type: gridColumnTypes.template, width: 120,
            template: this.PatientTypeColorCode
        },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Mobile", key: "mobile", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ProcessDate", key: "processDate", sort: true, align: 'left', emptySign: 'NA', width: 70, type: 6 },
        { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "TDS Amount", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', width: 100 ,type: gridColumnTypes.amount},
        { heading: "Balance Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 100 ,type: gridColumnTypes.amount},
        { heading: "PayAmount", key: "payAmount", sort: true, align: 'left', emptySign: 'NA', width: 100 ,type: gridColumnTypes.amount},
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 70, type: 6 },
        { heading: "unProcessBy", key: "unProcessStatus", sort: true, align: 'left', emptySign: 'NA', width: 250},
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
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

    createPaymentForm(): FormGroup {
        return this.formBuilder.group({
            doctorPayyModel: this.formBuilder.array([]),
        })
    }

    get ModeOfPaymentsArray(): FormArray {
        return this.DrpaymentForm.get('doctorPayyModel') as FormArray;
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

    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId],
            billNo: [item?.billNo, [this._FormvalidationserviceService.onlyNumberValidator()]],
            receiptNo: '',
            opdipdtype: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [parseFloat(item?.payAmount) ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [item?.validationDate ?? ''],
            advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tranMode: ['DRPAY', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [this.accountService.currentUserValue.userId],
            transactionLabel: ['DRPAY', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            isCancelled: false,
            isCancelledBy: '0',
            isCancelledDate: new Date('1900-01-01').toISOString(),
            createdDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        });
    }


    OnPaymentdetail(element) {
        console.log(element)
        const PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(element.processDate, 'yyyy-MM-dd') || '01/01/1900',
        PatientHeaderObj['PatientName'] = element.PatientName;
        PatientHeaderObj['BillNo'] = element.doctorPayoutId;
        PatientHeaderObj['DoctorName'] = element.doctorName;

        PatientHeaderObj['NetPayAmount'] = element.balanceAmt
        const dialogRef = this._matDialog.open(DoctorPaymentComponent,
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

                this.ModeOfPaymentsArray.clear();
                result.submitDataPay.ipModePaymentInsert.forEach(item => {

                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                });

                console.log(this.DrpaymentForm.value)
                this._DoctorShareService.DoctorSharePayment(this.DrpaymentForm.value).subscribe(response => {
                    // console.log(response)
                    //  this.onPrint(response)
                    this._matDialog.closeAll();
                    this.onChangeFirst();
                });
            }
        });
    }

    onUnprocessPayout(element) {
        console.log("Payout Id for Un-Process : ", element);
        const payload = {
            doctorPayoutId: element?.doctorPayoutId || 0,
            isCancelledBy: this.accountService?.currentUserValue.userId || 0
        };

        this._DoctorShareService.UnProcessDoctorpayout(payload).subscribe(response => {
            this.onChangeFirst();
        });
    }
    onPrint(element) {
        this.commonService.Onprint("DoctorPayoutId", element.doctorPayoutId, "rptDoctorPayoutPayServiceList");
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