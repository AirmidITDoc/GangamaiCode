import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { interval, Subject, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { AdvanceDataStored } from '../../advance';
import { InterimBillComponent } from '../interim-bill/interim-bill.component';
import { AdvanceDetailObj, ChargesList } from '../ip-search-list.component';
import { IPSearchListService } from '../ip-search-list.service';
import { PrebillDetailsComponent } from './prebill-details/prebill-details.component';
import { element } from 'protractor';
import { PackageDetailsComponent } from 'app/main/opd/appointment-list/appointment-billing/package-details/package-details.component';
import { IPUpdatesComponent } from './ipupdates/ipupdates.component';
import { ActivatedRoute } from '@angular/router';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';

@Component({
    selector: 'app-ip-billing',
    templateUrl: './ip-billing.component.html',
    styleUrls: ['./ip-billing.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPBillingComponent implements OnInit {
    @ViewChild('serviceTable') serviceTable!: TemplateRef<any>;
    displayedColumns = [
        'checkbox',
        'IsCheck',
        'ChargesDate',
        'ServiceCode',
        'ServiceName',
        'Price',
        'Qty',
        'TotalAmt',
        'DiscPer',
        'DiscAmt',
        'NetAmount',
        'DoctorName',
        'ClassName',
        'ChargesAddedName',
        'Exclucion',
        'buttons',
    ];
    NurReqColumns = [
        'ServiceName',
        'Price',
        // 'reqDate',
        'billingUser',
        'Action'
    ];
    PackageBillColumns = ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'Qty', 'TotalAmt', 'DoctorName', 'DiscAmt', 'NetAmount'];

    opD_IPD_Id: any = "0"
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate5') actionButtonTemplate5!: TemplateRef<any>;
    ngAfterViewInit() {
        // Assign the template to the column dynamically 
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
        this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate5;
    }
    allColumns = [
        { heading: "Date", key: "bDate", sort: true, align: 'left', emptySign: 'NA', width: 110 },
        { heading: "billNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 110 },
        { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        { heading: "Adv Used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
        {
            heading: "Action", key: "action", align: "right", width: 110, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate1  // Assign ng-template to the column
        }
    ]
    AdvanceColumns = [
        { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "UsedAmt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 160 },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "PayTM Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "onlineAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 190 },
        {
            heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    NursingReqListColumn = [
        { heading: "ServiceId", key: "serviceId", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Req Date", key: "reqDate", sort: true, align: 'left', emptySign: 'NA', type: 9 },
        { heading: "Req Time", key: "reqTime", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "User Name", key: "billingUser", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        {
            heading: "Action", key: "action", align: "right", width: 90, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate5  // Assign ng-template to the column
        }
    ]
    gridConfig1: gridModel = {
        apiUrl: "IPBill/IPPreviousBillList",
        columnsList: this.allColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [{ fieldName: "IP_Id", fieldValue: String(this.opD_IPD_Id), opType: OperatorComparer.Equals }]
    }
    gridConfig: gridModel = {
        apiUrl: "Advance/PatientWiseAdvanceList",
        columnsList: this.AdvanceColumns,
        sortField: "AdvanceDetailID",
        sortOrder: 0,
        filters: [
            { fieldName: "AdmissionID", fieldValue: String(this.opD_IPD_Id), opType: OperatorComparer.Equals }
        ]
    }
    gridConfig2: gridModel = {
        apiUrl: "IPBill/PathRadRequestList",
        columnsList: this.NursingReqListColumn,
        sortField: "ServiceId",
        sortOrder: 0,
        filters: [
            { fieldName: "OP_IP_ID", fieldValue: String(this.opD_IPD_Id), opType: OperatorComparer.Equals }
        ]
    }


    IpbillFooterform: FormGroup;
    draftSaveform: FormGroup;
    IPBillMyForm: FormGroup
    Serviceform: FormGroup;
    BillReviwe: FormGroup
    sIsLoading: string = '';
    chargeslist: any = [];
    chargeslist1: any = [];
    currentDate: Date = new Date();
    dateTimeObj: any;
    PharmacyAmont: any = 0;
    interimArray: any = [];
    screenFromString = 'Common-form';
    isLoadingStr: string = '';
    vMobileNo: any;
    isLoading: String = '';
    selectedAdvanceObj: any;
    private nextPage$ = new Subject();
    public subscription: Array<Subscription> = [];
    public isUpdating = false;
    isDoctor: boolean = false;
    Admincharge: boolean = true;
    isFilteredDateDisabled: boolean = false;
    ConcessionShow: boolean = false;
    BillDiscperFlag: boolean = false;
    isOpen: boolean = false; // Sidebar starts open  
    SelectedAdvancelist: any = [];
    doctorID: any;
    vAdvanceId: any = 0;
    TotalAdvanceAmt: any = 0;
    BillBalAmount: any = 0;
    AdvanceBalAmt: any = 0;
    ApiURL: any;
    TariffId: any;
    WardId: any;
    BedId: any;

    Is9_Digit_National_Id: boolean = false;
    autocompleteModeCashcounter: string = "CashCounter";
    autocompleteModedeptdoc: string = "ConDoctor";
    autocompleteModeService: string = "Service";
    autocompleteModeConcession: string = "Concession";
    autocompleteModeClass: string = "Class";
    classId = 0
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('drawer') public drawer: MatDrawer;

    dataSource = new MatTableDataSource<ChargesList>();
    copiedData: any[] = [];
    dataSource1 = new MatTableDataSource<ChargesList>();
    prevbilldatasource = new MatTableDataSource<Bill>();
    advancedatasource = new MatTableDataSource<any>();
    PackageDatasource = new MatTableDataSource<ChargesList>();

    constructor(
        public _printPreview: PrintPreviewService,
        public _matDialog: MatDialog,
        private advanceDataStored: AdvanceDataStored,
        public _IpSearchListService: IPSearchListService,
        public datePipe: DatePipe,
        private dialogRef: MatDialogRef<IPBillingComponent>,
        private accountService: AuthenticationService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        public toastr: ToastrService,
        public _ConfigService: ConfigService,
        private commonService: PrintserviceService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private route: ActivatedRoute,
        private hospitalconfigservice: HospitalConfigService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private formBuilder: UntypedFormBuilder) {
    }
    currency: any = ''
    ngOnInit(): void {
        this.createserviceForm();
        this.createBillForm();
        this.Serviceform.markAllAsTouched();
        this.BillReviwe = this.createbillReviwe();
        this.IPBillMyForm = this.CreateIPBillForm();
        this.draftSaveform = this.createDraftSaveForm();
        this.IpbillFooterform.markAllAsTouched();
        if (this.data) {
            this.selectedAdvanceObj = this.data.Obj;
            //console.log(this.selectedAdvanceObj)
            this.opD_IPD_Id = this.selectedAdvanceObj.admissionId || "0"
            // this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + this.selectedAdvanceObj.classId + "&ServiceName="
            this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + this.selectedAdvanceObj.classId + "&SrvcName="
            this.getdata(this.selectedAdvanceObj.admissionId)
            this.getadvancelist(this.selectedAdvanceObj.admissionId)
            this.Serviceform.get("classId").setValue(this.selectedAdvanceObj.classId)
            this.draftSaveform = this.createDraftSaveForm();
            this.IPBillMyForm = this.CreateIPBillForm();
            this.TariffId = this.selectedAdvanceObj.tariffId
            this.WardId = this.selectedAdvanceObj.wardId;
            this.BedId = this.selectedAdvanceObj.bedId;
            this.classId = this.selectedAdvanceObj.classId
        }
        this.getChargesList();
        this.getLabRequestChargelist();
        this.getRtrvpackagedetList();

        this.loadClassList(); // Load class list for inline table editing

        // this.getBillheaderList();
        // this.getPharmacyAmount();
        const rawValue = this?._ConfigService?.configParams?.Is9_Digit_NationalId || "";
        const [ids, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.Is9_Digit_National_Id = ids === "1";
        if (!this.Is9_Digit_National_Id) {
            this.AddBedCharge();
        }

        if (this.selectedAdvanceObj.isDischarged) {
            this.IpbillFooterform.get('GenerateBill').enable();
            this.IpbillFooterform.get('GenerateBill').setValue(true);
        }
        else {
            this.IpbillFooterform.get('GenerateBill').disable();
            this.IpbillFooterform.get('GenerateBill').setValue(false);
        }
        if (this.selectedAdvanceObj.companyName) {
            this.IpbillFooterform.get('CreditBill').enable();
            this.IpbillFooterform.get('CreditBill').setValue(true);
        }
        else {
            this.IpbillFooterform.get('CreditBill').setValue(false);
        }

        let id = this.route.snapshot.queryParamMap.get('Id');
        let mode = this.route.snapshot.queryParamMap.get('Mode');
        if (mode == "Bill" && Number(id) > 0) {
            setTimeout(() => {
                this.openServiceTable();
            }, 1000);
        }
        this.setupFormListener();
        //Admin per retrevied
        if (this.selectedAdvanceObj?.adminPer > 0) {
            this.isAdminDisabled = true;
            this.IpbillFooterform.get('Admincheck').setValue(true)
            this.IpbillFooterform.patchValue({ AdminPer: this.selectedAdvanceObj?.adminPer })
        } else {
            this.isAdminDisabled = false;
            this.IpbillFooterform.get('Admincheck').setValue(false)
        }
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue



    }
    private setupFormListener(): void {
        this.handleChange('price', () => this.calculateTotalCharge());
        this.handleChange('qty', () => this.calculateTotalCharge());
        this.handleChange('concessionPercentage', () => this.updateDiscountAmount());
        this.handleChange('concessionAmount', () => this.updateDiscountdiscPer());
    }
    toggleSidebar() {
        this.isOpen = !this.isOpen;
    }
    calculateTotalCharge(row: any = null): void {
        let qty = +this.Serviceform.get("qty").value;
        let price = +this.Serviceform.get("price").value;
        let total = 0
        if (qty > 0 && price > 0) {
            total = qty * price;
        }
        this.Serviceform.patchValue({
            totalAmt: total,
            netAmount: total  // Set net amount initially
        }, { emitEvent: false }); // Prevent infinite loop

        this.updateDiscountAmount();
        this.updateDiscountdiscPer();
    }
    // Trigger when discount discPer change
    updateDiscountAmount(row: any = null): void {
        if (this.isUpdating) return; // Stop recursion
        this.isUpdating = true;

        const perControl = this.Serviceform.get("concessionPercentage");
        if (!perControl.valid) {
            this.Serviceform.get("concessionAmount").setValue(0);
            this.Serviceform.get("concessionPercentage").setValue(0);
            this.isUpdating = false;
            this.toastr.warning("Enter discount % between 0-100");
            return;
        }
        let discPer = perControl.value;
        let totalAmount = this.Serviceform.get("totalAmt").value;
        let discountAmount = parseFloat((totalAmount * discPer / 100).toFixed(2));
        let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

        this.Serviceform.patchValue({
            concessionAmount: discountAmount,
            netAmount: netAmount
        }, { emitEvent: false }); // Prevent infinite loop

        this.isUpdating = false; // Reset flag
    }
    // Trigger when discount amount change
    updateDiscountdiscPer(): void {
        if (this.isUpdating) return;
        this.isUpdating = true;

        let discountAmount = this.Serviceform.get("concessionAmount").value;
        let totalAmount = this.Serviceform.get("totalAmt").value;

        if (discountAmount < 0 || discountAmount > totalAmount) {
            this.Serviceform.get("concessionAmount").setValue(0);
            this.Serviceform.get("concessionPercentage").setValue(0);
            this.isUpdating = false;
            this.toastr.error("Discount must be between 0 and the total amount.");
            return;
        }

        let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
        let netAmount = Number((totalAmount - discountAmount).toFixed(2));
        this.Serviceform.patchValue({
            concessionPercentage: percent,
            netAmount: netAmount
        }, { emitEvent: false }); // Prevent infinite loop

        this.isUpdating = false; // Reset flag
    }
    getFixedDecimal(value: number) {
        return Number(value.toFixed(2));
    }
    // Create servie form
    createserviceForm() {
        this.Serviceform = this.formBuilder.group({
            // Date: [new Date(), [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],  
            chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01',
            opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdIpdId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            price: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            qty: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionPercentage: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            doctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            docPercentage: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            hospitalAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isGenerated: [false],
            addedBy: this.accountService.currentUserValue.userId,
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDate: "1900-01-01",
            isPathology: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isRadiology: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isDoctorShareGenerated: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isInterimBillFlag: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isPackage: [0],
            isSelfOrCompanyService: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            wardId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            bedId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            chargesTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
            packageMainChargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cPrice: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cTotalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isComServ: [false],
            isPrintCompSer: [false],
            serviceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            chPrice: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chTotalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isBillableCharity: [false],
            salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            billNo: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceCode: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            isInclusionExclusion: [false],
            isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            createdBy: this.accountService.currentUserValue.userId,

            packcagecharges: this.formBuilder.array([])

        });
    }
    // Create pacakge form
    createPacakgeForm(item: any): FormGroup {
        return this.formBuilder.group({
            //chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01',
            opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdIpdId: [this.opD_IPD_Id, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item?.serviceId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            price: [item?.price, [this._FormvalidationserviceService.onlyNumberValidator()]],
            qty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionPercentage: [item?.ConcessionPercentage || 0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmount: [item?.DiscAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netAmount: [item?.NetAmount, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            doctorId: [item?.doctorId ?? 0],
            docPercentage: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            hospitalAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isGenerated: [false],
            addedBy: this.accountService.currentUserValue.userId,
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDate: "1900-01-01",
            isPathology: [item?.isPathology ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isRadiology: [item?.isRadiology ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isPackage: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrCompanyService: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageId: [item?.PackageServiceId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceCode: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            // companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            isInclusionExclusion: [false],
            packageMainChargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            wardId: [this.WardId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            bedId: [this.BedId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            chargesTime: this.datePipe.transform(new Date(), 'HH:mm:ss.SSS') || '00:00:00.000',
            createdBy: this.accountService.currentUserValue.userId,
            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            classId: [item.classId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [item.tariffId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceName: item?.serviceName,
            chargesId: 0
        });
    }
    // Getters 
    get PackageDetArray(): FormArray {
        return this.Serviceform.get('packcagecharges') as FormArray;
    }
    //Ip Bill Footer form
    createBillForm() {
        this.IpbillFooterform = this.formBuilder.group({
            AdminPer: ['', [Validators.max(100)]],
            AdminAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totaldiscPer: [0, [Validators.min(0), Validators.max(100)]],
            totalconcessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            ConcessionId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
            FinalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            CashCounterID: [this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            Remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            Admincheck: [''],
            GenerateBill: [false],
            CreditBill: [false],
            MPesa: [false],
            ChargeDate: [new Date()],
            BillType: ['1', this._FormvalidationserviceService.onlyNumberValidator()],
            EditDoctor: [''],
            TotalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            GovrnApprovAmt: [0, this._FormvalidationserviceService.onlyNumberValidator()],
            mpesaMobile: ['', [Validators.minLength(10), Validators.maxLength(10)]],
        });
    }
    //IP Draft Bill form
    createDraftSaveForm() {
        return this.formBuilder.group({
            //ipInterim bill header  
            tDrbill: this.formBuilder.group({
                drbno: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opdIpdId: [this.selectedAdvanceObj?.admissionId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                billDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
                opdipdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
                totalAdvanceAmount: [this.TotalAdvanceAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                advanceUsedAmount: [0],
                addedBy: [this.accountService.currentUserValue.userId],
                billTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSettled: false,
                isPrinted: true,
                isFree: true,
                companyId: [this.selectedAdvanceObj?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                tariffId: [this.selectedAdvanceObj?.tariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                unitId: [this.selectedAdvanceObj?.hospitalID, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                interimOrFinal: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                companyRefNo: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
                concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                taxPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                taxAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
            }),
            // IP bill details in array
            tdrBillDet: this.formBuilder.array([]),
        });
    }
    //IP Draft Det
    createDraftBillDetails(item: any): FormGroup {
        return this.formBuilder.group({
            drNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesId: [item?.chargesId, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    //IP bill save form 
    CreateIPBillForm(): FormGroup {
        return this.formBuilder.group({
            //ipInterim bill header  
            bill: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opdipdid: [this.selectedAdvanceObj?.admissionId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                regNo: [this.selectedAdvanceObj?.regNo, [this._FormvalidationserviceService.onlyNumberValidator()]],
                patientName: [this.selectedAdvanceObj?.patientName, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                ipdno: [this.selectedAdvanceObj?.ipdno, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                ageYear: [Number(this.selectedAdvanceObj?.ageYear || 0), [this._FormvalidationserviceService.onlyNumberValidator()]],
                ageMonth: [Number(this.selectedAdvanceObj?.ageMonth || 0), [this._FormvalidationserviceService.onlyNumberValidator()]],
                ageDays: [Number(this.selectedAdvanceObj?.ageDay || 0), [this._FormvalidationserviceService.onlyNumberValidator()]],
                doctorId: [this.selectedAdvanceObj?.docNameId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                doctorName: [this.selectedAdvanceObj?.doctorname || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                wardId: [this.selectedAdvanceObj?.wardId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                bedId: [this.selectedAdvanceObj?.bedId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                patientType: [this.selectedAdvanceObj?.companyId ? true : false],
                companyName: [this.selectedAdvanceObj?.companyName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                companyAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                patientAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                billDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
                opdipdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this.accountService.currentUserValue.userId],
                totalAdvanceAmount: [this.TotalAdvanceAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                billTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSettled: false,
                isPrinted: true,
                isFree: true,
                govtApprovedAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                companyId: [this.selectedAdvanceObj?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                tariffId: [this.selectedAdvanceObj?.tariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                interimOrFinal: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                companyRefNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                speTaxPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                speTaxAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                compDiscAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                discComments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
                cashCounterId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
            }),
            // IP bill details in array
            billDetail: this.formBuilder.array([]),
            // Addcharge insert
            addCharge: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            // Admission Id Insert
            addmission: this.formBuilder.group({
                admissionID: [this.selectedAdvanceObj?.admissionId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            //Payment form
            payment: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                receiptNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                cashPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequePayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                chequeDate: ['1999-01-01'],
                cardPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardDate: ['1999-01-01'],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                addBy: [this.accountService.currentUserValue.userId],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1999-01-01'],
                neftpayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftdate: ['1999-01-01'],
                payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                payTmdate: ['1999-01-01'],
                tdsAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId],
                wfAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
            }),
            // BIll insert
            bills: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            // Advance details update in array
            advancesupdate: this.formBuilder.array([]),
            // Advacne header update
            advancesHeaderupdate: this.formBuilder.group({
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            //Addcharges
            addChargessupdate: this.formBuilder.group({
                chargesID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([])
        });
    }
    //IP BIll Det
    createBillDetails(item: any): FormGroup {
        return this.formBuilder.group({
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesId: [item?.chargesId, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    // IP Adv UP
    createAdvanceUpdate(item: any): FormGroup {
        return this.formBuilder.group({
            advanceDetailID: [item?.AdvanceDetailID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            usedAmount: [item?.UsedAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            balanceAmount: [item?.BalanceAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId],
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [item?.validationDate ?? ''],
            advanceUsedAmount: [item?.advanceUsedAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advanceId: [item?.advanceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundId: [item?.refundId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tranMode: ['HOSP', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [this.accountService.currentUserValue.userId],
            transactionLabel: ['IP_FINAL_BILL', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    // Getters 
    get BillDetailsArray(): FormArray {
        return this.IPBillMyForm.get('billDetail') as FormArray;
    }
    get AdvacnedetUpdateArray(): FormArray {
        return this.IPBillMyForm.get('advancesupdate') as FormArray;
    }
    get DraftBillDetArray(): FormArray {
        return this.draftSaveform.get('tdrBillDet') as FormArray;
    }
    get ModeOfPaymentsArray(): FormArray {
        return this.IPBillMyForm.get('tPayments') as FormArray;
    }
    //service selected data
    getselectObj(obj) {
        this.Serviceform.patchValue({
            price: obj.price
        })
        if (obj.creditedtoDoctor == true) {
            this.Serviceform.get('doctorId').reset();
            this.Serviceform.get('doctorId').setValidators([Validators.required]);
            this.Serviceform.get('doctorId').enable();
            this.isDoctor = true;
        } else {
            this.Serviceform.get('doctorId').reset();
            this.Serviceform.get('doctorId').clearValidators();
            this.Serviceform.get('doctorId').updateValueAndValidity();
            this.Serviceform.get('doctorId').disable();
            this.isDoctor = false;
        }
        this.getpackagedetList(obj)
    }
    //Doctor selected 
    getdocdetail(event) {
        this.doctorID = event.value
        const discPerElement = document.querySelector(`[name='concessionPercentage']`) as HTMLElement;
        if (event.value) {
            discPerElement.focus();
        }
    }


    createbillReviwe() {
        return this.formBuilder.group({
            IsSupplimentryBill: false
        })
    }
    //Class selected 
    getSelectedClassObj(event) {
        this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + event.value + "&SrvcName="
        this.classId = event.value
    }
    AllowToaddcharges(event) {
        if (event.checked == true) {
            this.BillReviwe.get('IsSupplimentryBill').setValue(true);
        } else {
            this.BillReviwe.get('IsSupplimentryBill').setValue(false);
        }
    }
    // Service Add 

    onSaveAddCharges() {
        debugger
        const formValue = this.Serviceform.value

        if ((this.selectedAdvanceObj?.dayWiseCredit || 0) > 0) {
            if (!this.BillReviwe.get('IsSupplimentryBill').value) {
                if (this.DayLimitbal <= 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Daily Limit Exhausted',
                        text: 'You have already used the full daily limit. No more charges can be added today.',
                        confirmButtonText: 'OK'
                    });
                    return;
                }
                // 2️⃣ Entered amount is more than remaining balance
                if (Number(formValue?.price || 0) > this.DayLimitbal) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Amount Exceeds Daily Limit',
                        html: `
        <p>The entered charge exceeds the remaining daily balance.</p>
        <p><b>Remaining Balance:</b> ₹${this.DayLimitbal}</p>
        <p>Please enter an amount within the available limit.</p>`,
                        confirmButtonText: 'OK'
                    });
                    return;
                }
            }
        }
        const formattedDate = this.datePipe.transform(this.Serviceform.get('chargesDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        this.Serviceform.get('chargesDate').setValue(formattedDate);
        this.Serviceform.get('chargesTime').setValue(formattedDate + ' ' + formattedTime);

        let doctorid = 0;
        if (this.isDoctor) {
            if ((formValue.doctorId == '' || formValue.doctorId == null || formValue.doctorId == '0')) {
                this.toastr.warning('Please select Doctor', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            if (formValue.doctorId)
                doctorid = this.Serviceform.get("doctorId")?.value ?? 0;
        }
        debugger
        this.Serviceform.get("opdIpdId").setValue(this.opD_IPD_Id)
        this.Serviceform.get("wardId").setValue(this.WardId)
        this.Serviceform.get("bedId").setValue(this.BedId)
        this.Serviceform.get("isPathology").setValue(formValue.serviceName?.isPathology ?? 0)
        this.Serviceform.get("isRadiology").setValue(formValue.serviceName?.isRadiology ?? 0)
        this.Serviceform.get("isPackage").setValue(formValue.serviceName?.isPackage ?? 0)
        this.Serviceform.get("serviceId").setValue(formValue.serviceName?.serviceId)
        this.Serviceform.get("serviceName").setValue(formValue.serviceName?.serviceName)
        this.Serviceform.get("serviceCode").setValue(formValue.serviceName?.companyCode ?? '')
        this.Serviceform.get("isInclusionExclusion").setValue(formValue.serviceName?.isInclusionOrExclusion ?? false)
        this.Serviceform.get("doctorId")?.enable();
        this.Serviceform.get("doctorId").setValue(doctorid ?? 0)
        this.Serviceform.get("tariffId").setValue(this.TariffId)
        // this.Serviceform.get("serviceName").setValue(formValue.serviceName?.serviceName)
        // this.Serviceform.get("chargesId").setValue(0)

        console.log(this.Serviceform.get('doctorId'));
        console.log(this.Serviceform.get('doctorId')?.enabled);
        // this.Serviceform.get("chargesDate").setValue(this.datePipe.transform(this.Serviceform.get('chargesDate').value, "yyyy-MM-dd 00:00:00.000") );

        console.log('valida service form', this.Serviceform.value)
        if (this.Serviceform.valid) {
            if (formValue.serviceName?.isPackage == 1) {
                this.PackageDetArray.clear();
                this.PackageDatasource.data.forEach(item => {
                    this.PackageDetArray.push(this.createPacakgeForm(item));
                });
            }
            debugger
            console.log('valida service form', this.Serviceform.value)
            this._IpSearchListService.InsertIPAddCharges(this.Serviceform.value).subscribe(response => {
                this.getChargesList();
            });
        } else {
            let invalidFields = [];
            if (this.Serviceform.invalid) {
                for (const controlName in this.Serviceform.controls) {
                    if (this.Serviceform.controls[controlName].invalid) {
                        invalidFields.push(`${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }
        this.interimArray = [];
        this.isDoctor = false;
        this.BillReviwe.reset({ IsSupplimentryBill: false });
        this.onClearServiceAddList();
        this.PackageDetArray.clear();
        const serviceIdElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
        if (serviceIdElement) {
            serviceIdElement.focus();
        }
        this.Serviceform.markAllAsTouched();
        this.IpbillFooterform.markAllAsTouched();
    }
    onClearServiceAddList() {
        // this.Serviceform.get('serviceId').setValue("a");
        this.Serviceform.get('serviceName').reset('');
        this.Serviceform.get('price').reset();
        this.Serviceform.get('qty').reset('1');
        this.Serviceform.get('totalAmt').reset();
        this.Serviceform.get('doctorId').reset();
        this.Serviceform.get('concessionPercentage').reset();
        this.Serviceform.get('concessionAmount').reset();
        this.Serviceform.get('netAmount').reset();
    }
    deletecharges(contact) {
        debugger
        if (contact.isPathTestCompleted == "True") {
            this.toastr.warning('Selected Service Test is Already Completed you cannot delete !', 'warning', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        if (contact.isRadTestCompleted == "True") {
            this.toastr.warning('Selected Service Test is Already Completed you cannot delete !', 'warning', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        Swal.fire({
            title: 'Do you want to cancel the Service ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!"

        }).then((flag) => {
            if (flag.isConfirmed) {
                let Chargescancle = {};
                Chargescancle['chargesId'] = contact.chargesId;
                Chargescancle['isCancelledBy'] = this.accountService.currentUserValue.userId;

                let submitData = {
                    "deleteCharges": Chargescancle
                };
                console.log(submitData);
                this._IpSearchListService.AddchargesDelete(submitData).subscribe(response => {
                    if (contact.isPackage == '1' && contact.serviceId) {
                        this.PacakgeList = this.PacakgeList.filter(item => item.PackageServiceId != contact.serviceId)
                        this.PackageDatasource.data = this.PacakgeList;
                    }
                    this.toastr.success(response.message);
                    this.getChargesList();
                    this.CalculateAdminCharge();
                    this.CalFinalDiscper();
                });
            }
        });

    }
    getdata(opD_IPD_Id) {
        this.gridConfig1 = {
            apiUrl: "IPBill/IPPreviousBillList",
            columnsList: this.allColumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "IP_Id", fieldValue: String(opD_IPD_Id), opType: OperatorComparer.Equals }
            ]
        },
            this.gridConfig = {
                apiUrl: "Advance/PatientWiseAdvanceList",
                columnsList: this.AdvanceColumns,
                sortField: "AdvanceDetailID",
                sortOrder: 0,
                filters: [
                    { fieldName: "AdmissionID", fieldValue: String(opD_IPD_Id), opType: OperatorComparer.Equals }
                ]
            },
            this.gridConfig2 = {
                apiUrl: "IPBill/PathRadRequestList",
                columnsList: this.NursingReqListColumn,
                sortField: "ServiceId",
                sortOrder: 0,
                filters: [
                    { fieldName: "OP_IP_ID", fieldValue: String(30247), opType: OperatorComparer.Equals }
                ]
            }
    }
    //Advance list
    getadvancelist(AdmissionId) {
        if (AdmissionId > 0) {
            var vdata = {
                "first": 0,
                "rows": 10,
                "sortField": "AdmissionID",
                "sortOrder": 0,
                "filters": [
                    {
                        "fieldName": "AdmissionID",
                        "fieldValue": String(AdmissionId),
                        "opType": "Equals"
                    }
                ],
                "Columns": [],
                "exportType": "JSON"
            }
            setTimeout(() => {
                this._IpSearchListService.AdvanceHeaderlist(vdata).subscribe((response) => {
                    this.SelectedAdvancelist = response.data;
                    if (this.SelectedAdvancelist.length > 0)
                        this.vAdvanceId = this.SelectedAdvancelist[0].advanceId
                    this.SelectedAdvancelist.forEach(element => {
                        this.TotalAdvanceAmt += element.advanceAmount
                        this.checkAdvBalAmt += element.balanceAmount
                    })
                    this.getbillbalamt();
                });
            }, 500);
        }
    }
    checkAdvBalAmt: any = 0;
    DayLimitbal: any = 0;
    getbillbalamt() {
        this.AdvanceBalAmt = this.checkAdvBalAmt
        if (this.AdvanceBalAmt > 0) {
            let netAmt = this.IpbillFooterform.get('FinalAmount').value || 0
            if (netAmt > this.AdvanceBalAmt) {
                this.AdvanceBalAmt = this.checkAdvBalAmt
                this.BillBalAmount = netAmt - this.checkAdvBalAmt
            } else {
                let balamt = this.AdvanceBalAmt - netAmt
                this.AdvanceBalAmt = balamt
                this.BillBalAmount = 0;
            }
        }
        if ((this.selectedAdvanceObj?.dayWiseCredit || 0) > 0) {
            this.DayLimitbal = this.selectedAdvanceObj.dayWiseCredit;
            let todayNetAmt = 0;
            if (this.dataSource?.data?.length) {
                debugger
                const today = new Date();
                const todayDate =
                    String(today.getDate()).padStart(2, '0') + '/' +
                    String(today.getMonth() + 1).padStart(2, '0') + '/' +
                    today.getFullYear();

                todayNetAmt = Math.round(
                    this.dataSource.data
                        .filter(item => item?.chargesDate === todayDate)
                        .reduce((total, item) => total + (Number(item?.netAmount) || 0), 0)
                );

                // Remaining balance (never go below 0)
                // this.DayLimitbal = Math.max(this.selectedAdvanceObj?.dayWiseCredit - todayNetAmt, 0);
                this.DayLimitbal = (this.selectedAdvanceObj?.dayWiseCredit - todayNetAmt);

                console.log('Today Net Amount:', todayNetAmt);
                console.log('Remaining Balance:', this.DayLimitbal);
            }
        }
    }
    //Charge list 
    chargeDate = '01/01/1900'
    getChargesList() {
        this.chargeslist = [];
        this.dataSource.data = [];
        var vdata = {
            "first": 0,
            "rows": 200,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OPD_IPD_Id", "fieldValue": String(this.opD_IPD_Id), "opType": "Equals" },
                { "fieldName": "ChargeDate", "fieldValue": String(this.chargeDate), "opType": "Equals" }],
            "Columns": [],
            "exportType": "JSON"
        }
        this._IpSearchListService.getchargesList(vdata).subscribe(response => {
            this.chargeslist = response.data
            this.dataSource.data = this.chargeslist;
            this.copiedData = structuredClone(this.chargeslist);
            this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
            this.getNetAmtSum()
            this.getbillbalamt();
        },
            (error) => {
                this.isLoading = 'list-loaded';
            });

    }
    //Table Total netAmt
    TotalShowAmt: any = 0;
    DiscShowAmt: any = 0;
    FinalNetAmt: any = 0;
    ExclusionAmt: any = 0;
    InclusionAmt: any = 0;
    getNetAmtSum() {
        this.FinalNetAmt = this.chargeslist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
        this.TotalShowAmt = this.chargeslist.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0);
        this.DiscShowAmt = this.chargeslist.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0);

        this.IpbillFooterform.patchValue({
            FinalAmount: this.FinalNetAmt,
            totalconcessionAmt: this.DiscShowAmt,
            TotalAmt: this.TotalShowAmt
        }, { emitEvent: false }); // Prevent infinite loop

        if (this.DiscShowAmt > 0) {
            this.ConcessionShow = true
            this.BillDiscperFlag = false;
        } else {
            this.ConcessionShow = false
            this.BillDiscperFlag = true;
            this.CalFinalDiscper()
        }
        this.CalculateAdminCharge()

        const Exclusionlist = this.chargeslist.filter(i => i.isInclusionExclusion === true)
        const Inclusionlist = this.chargeslist.filter(i => i.isInclusionExclusion !== true)
        this.ExclusionAmt = Exclusionlist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
        this.InclusionAmt = Inclusionlist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
    }
    //Admin Charge Check Box On 
    isAdminDisabled: boolean = false;
    AdminStatus(event) {
        if (event.checked == true) {
            this.isAdminDisabled = true;
        } else {
            this.isAdminDisabled = false;
            this.IpbillFooterform.get('AdminPer').reset();
            this.IpbillFooterform.get('AdminAmt').reset();
            this.CalculateAdminCharge();
        }
    }
    //Admin calculation
    AdminShowAmt: any;
    CalculateAdminCharge() {
        let finalNetAmt = 0
        let finalDiscAmt = 0
        let discPer = this.IpbillFooterform.get('totaldiscPer').value || 0;
       
        let AdminPer = this.IpbillFooterform.get('AdminPer').value || 0;
        if (AdminPer > 10) {
            Swal.fire({
                title: 'Do you want to Give Disc More Than 10% Generate Request ',
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Generate!"
            }).then((result) => {
                if (result.isConfirmed) {
                    this.GeneraeRequest();
                } else
                    return;
            })
        } else {
            const perControl = this.IpbillFooterform.get("AdminPer");
            let adminPer = perControl.value;
            let totalAmount = this.TotalShowAmt;
            let adminAmt = parseFloat((totalAmount * adminPer / 100).toFixed(2));
            let finalTotalAmt = parseFloat((totalAmount + adminAmt).toFixed(2));

            if (!perControl.valid || perControl.value == 0) {
                if (discPer > 0) {
                    this.ConcessionShow = true
                    finalDiscAmt = parseFloat((totalAmount * discPer / 100).toFixed(2));
                    finalNetAmt = parseFloat((totalAmount - finalDiscAmt).toFixed(2));
                } else {
                    finalDiscAmt = this.DiscShowAmt
                    finalNetAmt = this.FinalNetAmt
                }
                this.IpbillFooterform.patchValue({
                    AdminPer: '',
                    AdminAmt: 0,
                    totalconcessionAmt: finalDiscAmt,
                    FinalAmount: Math.round(finalNetAmt),
                }, { emitEvent: false });
                // this.toastr.error("Enter Admin % between 0-100");  
                return;
            }
            if (this.DiscShowAmt > 0) {
                this.ConcessionShow = true
                finalDiscAmt = this.DiscShowAmt
                finalNetAmt = parseFloat((finalTotalAmt - this.DiscShowAmt).toFixed(2));
            } else {
                if (discPer > 0) {
                    this.ConcessionShow = true
                    finalDiscAmt = parseFloat((finalTotalAmt * discPer / 100).toFixed(2));
                    finalNetAmt = parseFloat((finalTotalAmt - finalDiscAmt).toFixed(2));
                } else {
                    finalNetAmt = finalTotalAmt
                }
            }
            this.IpbillFooterform.patchValue({
                totalconcessionAmt: finalDiscAmt,
                AdminAmt: adminAmt || 0,
                FinalAmount: Math.round(finalNetAmt),
            }, { emitEvent: false }); // Prevent infinite loop
            this.BillBalAmount();
        }
    }

    GeneraeRequest() { }
    // Total Bill Disc Per cal 
    CalFinalDiscper() {
        let netAmount = this.FinalNetAmt;
        const perControl = this.IpbillFooterform.get("totaldiscPer");
        let discper = perControl.value;
        let totalAmount = this.TotalShowAmt;
        let AdminAmt = this.IpbillFooterform.get('AdminAmt').value || 0;
        let discountAmt = 0;
        let finalNetAmt
        let FinalTotalAmt

        if (!perControl.valid || perControl.value == 0 || perControl.value == '') {
            if (AdminAmt > 0) {
                finalNetAmt = ((parseFloat(totalAmount) + parseFloat(AdminAmt))).toFixed(2);
            } else {
                finalNetAmt = this.FinalNetAmt
            }
            // if(this.DiscShowAmt > 0)
            //   discountAmt = this.DiscShowAmt
            // else
            //   discountAmt = '' 
            this.ConcessionShow = false
            this.IpbillFooterform.patchValue({
                totaldiscPer: '',
                totalconcessionAmt: '',
                FinalAmount: Math.round(finalNetAmt),
            }, { emitEvent: false });
            //this.toastr.error("Enter Discount % between 0-100");  
            return;
        }
        if (AdminAmt > 0) {
            FinalTotalAmt = ((parseFloat(totalAmount) + parseFloat(AdminAmt))).toFixed(2);
            discountAmt = parseFloat((FinalTotalAmt * discper / 100).toFixed(2));
            finalNetAmt = parseFloat((FinalTotalAmt - discountAmt).toFixed(2));
            this.ConcessionShow = true
        }
        else {
            discountAmt = parseFloat((totalAmount * discper / 100).toFixed(2));
            finalNetAmt = parseFloat((totalAmount - discountAmt).toFixed(2));
            this.ConcessionShow = true
        }
        this.IpbillFooterform.patchValue({
            totalconcessionAmt: discountAmt,
            FinalAmount: Math.round(finalNetAmt),
        }, { emitEvent: false }); // Prevent infinite loop 

        this.BillBalAmount();
    }
    //Total Bill DiscAMt cal
    vTotalAmount: any;
    getDiscAmtCal() {
        const perControl = this.IpbillFooterform.get("totalconcessionAmt");
        let netAmount = this.FinalNetAmt;
        let totalAmount = this.TotalShowAmt;
        let discAmt = perControl.value;
        let AdminAmt = this.IpbillFooterform.get('AdminAmt').value || 0;
        let discper = ''
        let finalNetAmt
        let FinalTotalAmt

        if (perControl.value == 0 || perControl.value == '' || perControl.value > totalAmount) {
            if (AdminAmt > 0) {
                finalNetAmt = ((parseFloat(totalAmount) + parseFloat(AdminAmt))).toFixed(2);
            } else {
                finalNetAmt = this.FinalNetAmt
            }
            this.ConcessionShow = false
            this.IpbillFooterform.patchValue({
                totaldiscPer: '',
                totalconcessionAmt: '',
                FinalAmount: Math.round(finalNetAmt),
            }, { emitEvent: false });

            this.toastr.error("Enter Discount amt between 0-100");
            return;
        }
        if (AdminAmt > 0) {
            this.ConcessionShow = true
            FinalTotalAmt = (parseFloat(totalAmount + AdminAmt)).toFixed(2);
            discper = ((discAmt / FinalTotalAmt) * 100).toFixed(2);
            finalNetAmt = parseFloat((FinalTotalAmt - discAmt).toFixed(2));
        }
        else {
            this.ConcessionShow = true
            discper = ((discAmt / totalAmount) * 100).toFixed(2);
            finalNetAmt = parseFloat((totalAmount - discAmt).toFixed(2));
        }

        this.IpbillFooterform.patchValue({
            totaldiscPer: discper,
            totalconcessionAmt: discAmt,
            FinalAmount: Math.round(finalNetAmt),
        }, { emitEvent: false }); // Prevent infinite loop 
        this.BillBalAmount();
    }
    //Save PopUp MSG
    onSave() {
        let invalidFields = [];
        if (this.IpbillFooterform.invalid) {
            for (const controlName in this.IpbillFooterform.controls) {
                if (this.IpbillFooterform.controls[controlName].invalid) {
                    invalidFields.push(`${controlName}`);
                }
            }
        }
        if (invalidFields.length > 0) {
            invalidFields.forEach(field => {
                this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                );
            });
        }
        const formValue = this.IpbillFooterform.value
        if (formValue.totalconcessionAmt > 0 || formValue.totaldiscPer > 0) {
            if (formValue.ConcessionId == '' || formValue.ConcessionId == null || formValue.ConcessionId == '0') {
                this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (this.dataSource.data.length > 0) {
            if (this.IpbillFooterform.get('GenerateBill').value) {
                Swal.fire({
                    title: 'Do you want to generate the Final Bill ',
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Generate!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.SaveBill1();
                    }
                })
            }
            else {
                Swal.fire({
                    title: 'Do you want to save the Draft Bill ',
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Save!"
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.onSaveDraft();
                    }
                })
            }
        } else {
            Swal.fire("Please check list is blank ")
        }
    }
    //Save with normal
    SaveBill1() {
        this.IPBillMyForm.get('bill.totalAmt')?.setValue(this.IpbillFooterform.get('TotalAmt')?.value || 0)
        this.IPBillMyForm.get('bill.concessionAmt')?.setValue(this.IpbillFooterform.get('totalconcessionAmt')?.value || 0)
        this.IPBillMyForm.get('bill.netPayableAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value)
        this.IPBillMyForm.get('bill.billDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.IPBillMyForm.get('bill.billTime').setValue(this.dateTimeObj.time)
        this.IPBillMyForm.get('bill.concessionReasonId')?.setValue(this.IpbillFooterform.get('ConcessionId')?.value || 0)
        this.IPBillMyForm.get('bill.discComments')?.setValue(this.IpbillFooterform.get('Remark')?.value || '')
        this.IPBillMyForm.get('bill.cashCounterId')?.setValue(this.IpbillFooterform.get('CashCounterID')?.value || 0)
        this.IPBillMyForm.get('bill.totalAdvanceAmount')?.setValue(this.TotalAdvanceAmt)
        this.IPBillMyForm.get('bill.speTaxPer')?.setValue(this.IpbillFooterform.get('AdminPer').value || 0)
        this.IPBillMyForm.get('bill.speTaxAmt')?.setValue(this.IpbillFooterform.get('AdminAmt').value || 0)
        this.IPBillMyForm.get('bill.govtApprovedAmt')?.setValue(this.IpbillFooterform.get('GovrnApprovAmt')?.value || 0)


        if (this.IPBillMyForm.valid && this.dataSource.data.length > 0) {
            if (this.IpbillFooterform.get('CreditBill').value || this.selectedAdvanceObj.companyId) {
                this.IPBillMyForm.get('bill.paidAmt')?.setValue(0)
                this.IPBillMyForm.get('bill.balanceAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value || 0)
                this.IPBillMyForm.get('bills.balanceAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value || 0)
                this.IPBillMyForm.get('payment.paymentDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
                this.IPBillMyForm.get('payment.paymentTime').setValue(this.dateTimeObj.time)

                this.BillDetailsArray.clear();
                this.dataSource.data.forEach(item => {
                    this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
                });

                console.log(this.IPBillMyForm.value);
                this._IpSearchListService.InsertIPBillingCredit(this.IPBillMyForm.value).subscribe(response => {
                    this.viewgetBillReportPdf(response);
                    this._matDialog.closeAll();
                });
            }
            else if (this.IpbillFooterform.get('MPesa')?.value) {
                this.openWaitingScreen();
            }
            else {
                let PatientHeaderObj = {};
                PatientHeaderObj['Date'] = this.dateTimeObj.date;
                PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.patientName || '';
                PatientHeaderObj['AdvanceAmount'] = this.IpbillFooterform.get('FinalAmount')?.value;
                PatientHeaderObj['NetPayAmount'] = this.IpbillFooterform.get('FinalAmount')?.value;
                PatientHeaderObj['BillNo'] = 0;
                PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.admissionId || 0;
                PatientHeaderObj['IPDNo'] = this.selectedAdvanceObj.ipdno || '';
                PatientHeaderObj['RegNo'] = this.selectedAdvanceObj.regNo || 0;
                PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.doctorname || '';
                PatientHeaderObj['CompanyName'] = this.selectedAdvanceObj.companyName || '';
                PatientHeaderObj['DepartmentName'] = this.selectedAdvanceObj.departmentName || '';
                PatientHeaderObj['Age'] = this.selectedAdvanceObj.ageYear || '';
                PatientHeaderObj['TransactionLabel'] = 'IP_FINAL_BILL',
                    PatientHeaderObj['CashCounterId'] = this.IpbillFooterform.get('ConcessionId')?.value || 0
                //==============-======--==============Payment====================== 
                this.advanceDataStored.storage = new AdvanceDetailObj(PatientHeaderObj);
                const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
                    {
                        maxWidth: "80vw",
                        height: '750px',
                        width: '80%',
                        data: {
                            vPatientHeaderObj: PatientHeaderObj,
                            FromName: "IP-Bill",
                            advanceObj: PatientHeaderObj
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    console.log(result);
                    if (result && result.IsSubmitFlag) {
                        let UpdateAdvanceDetailarr1 = [];
                        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
                        this.IPBillMyForm.get('bill.paidAmt')?.setValue(result?.PaidAmt ?? 0)
                        this.IPBillMyForm.get('bill.balanceAmt')?.setValue(result?.BalAmt ?? 0)
                        this.IPBillMyForm.get('bills.balanceAmt')?.setValue(result?.BalAmt ?? 0)
                        if (UpdateAdvanceDetailarr1.length > 0) {
                            let AdvanceBalAmt = 0;
                            let AdvanceUsedAmt = 0;
                            UpdateAdvanceDetailarr1.forEach(element => {
                                this.IPBillMyForm.get('advancesHeaderupdate.advanceId')?.setValue(element.AdvanceId)
                                debugger
                                AdvanceUsedAmt = AdvanceUsedAmt + element.UsedAmount
                                AdvanceBalAmt = AdvanceBalAmt + element.BalanceAmount
                                this.IPBillMyForm.get('advancesHeaderupdate.advanceUsedAmount')?.setValue(AdvanceUsedAmt)
                                this.IPBillMyForm.get('advancesHeaderupdate.balanceAmount')?.setValue(AdvanceBalAmt)

                            })

                        }
                        this.BillDetailsArray.clear();
                        this.dataSource.data.forEach(item => {
                            this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
                        });

                        this.AdvacnedetUpdateArray.clear();
                        UpdateAdvanceDetailarr1.forEach(item => {
                            this.AdvacnedetUpdateArray.push(this.createAdvanceUpdate(item));
                        });
                        this.IPBillMyForm.get('payment')?.setValue(result.submitDataPay.ipPaymentInsert)
                        this.ModeOfPaymentsArray.clear();
                        result.submitDataPay.ipModePaymentInsert.forEach(item => {
                            this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                        });

                        //this.IPBillMyForm.get('payment').setValue()
                        console.log("form values", this.IPBillMyForm.value)

                        this._IpSearchListService.InsertIPBilling(this.IPBillMyForm.value).subscribe(response => {
                            this._matDialog.closeAll();
                            this.viewgetBillReportPdf(response);
                            // this.getWhatsappshareIPFinalBill(response, this.vMobileNo)
                        });
                    }
                });
            }
        } else {
            let invalidFields = [];
            if (this.IPBillMyForm.invalid) {
                for (const controlName in this.IPBillMyForm.controls) {
                    const control = this.IPBillMyForm.get(controlName);
                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`IP Bill detail Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`IP Bill Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }
    }

    ///----------------------------------------Mpesa save code 
    isWaiting = false;
    mpesaResponse: any;
    statusMessage: any;
    pollingSub?: Subscription;
    mPesa_ReceiptNo: any = '0';
    public dsMpesaTransactionlist = new MatTableDataSource<ChargesList>();
    openWaitingScreen() {
        debugger
        this._IpSearchListService.postpayment(this.IpbillFooterform.controls["FinalAmount"]?.value, this.IpbillFooterform.get('mpesaMobile')?.value,
            this.selectedAdvanceObj?.admissionId || 0).subscribe(response => {
                this.mpesaResponse = response;
                console.log(this.mpesaResponse)
                // Build message AFTER response arrives
                this.statusMessage = '' + response.responseDescription + '\n' +
                    'CheckoutRequestId  : ' + response.checkoutRequestID + '\n' +
                    'MerchantRequestId  : ' + response.merchantRequestID;
                this.isWaiting = true;
                this.startPolling();
            });
    }

    manualRefresh() {
        this.checkStatus();
    }
    startPolling() {
        this.pollingSub = interval(10000)
            .pipe(switchMap(() => this._IpSearchListService.checkStatus(this.mpesaResponse)))
            .subscribe((status: any) => this.handleStatus(status));
    }
    stopPolling() {
        if (this.pollingSub) {
            this.pollingSub.unsubscribe();
            this.pollingSub = null;
        }
    }
    checkStatus() {
        if (this.mpesaResponse) {
            this._IpSearchListService.checkStatus(this.mpesaResponse)
                .subscribe((status: any) => this.handleStatus(status));
        }
    }
    handleStatus(status: any) {
        console.log(status)
        debugger
        const isSuccess = status?.resultCode == 0 || status?.resultCode == "0" || status?.resultCode == "000000";
        const receipt = status?.mpesaReceiptNumber;
        if (isSuccess && receipt) {
            this.statusMessage =
                'Payment successful.' + this.mpesaResponse.responseDescription + '\n' +
                'CheckoutRequestId  : ' + this.mpesaResponse.checkoutRequestID + '\n' +
                'MerchantRequestId  : ' + this.mpesaResponse.merchantRequestID + '\n' +
                'Receipt No=' + receipt;
            this.mPesa_ReceiptNo = receipt;
            this.stopPolling();
            this.isWaiting = false;
            this.SavemPesaBill();
        }
        else {
            if (status?.resultDesc) {
                this.statusMessage = status?.resultDesc;
                this.stopPolling();
                this.isWaiting = false;
            }
        }

    }
    // Mpesa Save  
    SavemPesaBill() {
        debugger
        const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
        const mPesaMerchant_CheckoutRequest_Id = this.mpesaResponse.checkoutRequestID + "|" + this.mpesaResponse.merchantRequestID;

        this.IPBillMyForm.get('bill.paidAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value)
        this.IPBillMyForm.get('payment.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.IPBillMyForm.get('payment.paymentTime')?.setValue(this.dateTimeObj.time)
        this.IPBillMyForm.get('payment.payTmamount').setValue(Number(this.IpbillFooterform.get('FinalAmount')?.value));
        this.IPBillMyForm.get('payment.payTmdate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
        this.IPBillMyForm.get('payment.payTmtranNo').setValue(this.mPesa_ReceiptNo || 0);
        this.IPBillMyForm.get('payment.remark').setValue(mPesaMerchant_CheckoutRequest_Id || 0);
        this.IPBillMyForm.get('payment.companyId')?.setValue(this.selectedAdvanceObj?.companyId || 0)

        this.BillDetailsArray.clear();
        this.dataSource.data.forEach(item => {
            this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
        });

        let ModePaymentObj = [];
        ModePaymentObj.push({
            paymentDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
            paymentTime: this.dateTimeObj.time,
            payAmount: this.IpbillFooterform.get('FinalAmount')?.value || 0,
            tranNo: this.mPesa_ReceiptNo || 0,
            bankName: "",
            validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
            advanceUsedAmount: 0,
            comments: "",
            payMode: "MPESA",
            onlineTranNo: this.mPesa_ReceiptNo || 0,
            onlineTranResponse: mPesaMerchant_CheckoutRequest_Id || 0,
            companyId: this.selectedAdvanceObj?.CompanyId ?? 0,
            advanceId: 0,
            refundId: 0,
            cashCounterId: this.IpbillFooterform.get('CashCounterID')?.value || 0,
            transactionType: 0,
            isSelfOrcompany: this.selectedAdvanceObj?.CompanyId ? 1 : 0,
        });
        this.ModeOfPaymentsArray.clear();
        ModePaymentObj.forEach(item => {
            this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
        });
        console.log("form values", this.IPBillMyForm.value)
        this._IpSearchListService.InsertIPBilling(this.IPBillMyForm.value).subscribe(response => {
            this._matDialog.closeAll();
            this.viewgetBillReportPdf(response);
            // this.getWhatsappshareIPFinalBill(response, this.vMobileNo)
        });
    }
    @ViewChild('MpesatranscationlistTable') MpesatranscationlistTable!: TemplateRef<any>;
    getMpesaTransactionlist(): void {
        if (!this.dataSource.data.length) {
            this.toastr.warning('Charges are not available in list, Please add Charges', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const formValue = this.IpbillFooterform.value
        if (formValue.totalconcessionAmt > 0 || formValue.totaldiscPer > 0) {
            if (formValue.ConcessionId == '' || formValue.ConcessionId == null || formValue.ConcessionId == '0') {
                this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (!formValue?.mpesaMobile) {
            this.toastr.warning('Enter Mobile number', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this._matDialog.open(this.MpesatranscationlistTable, {
            width: '65vw',
            maxHeight: '60vh'
        })
        //424929  this.vOPIPId
        let Data = {
            "first": 0,
            "rows": 100,
            "sortField": "Id",
            "sortOrder": 0,
            "filters": [{ "fieldName": "Opdipdid", "fieldValue": String(424929), "opType": "Equals" },
            { "fieldName": "PhoneNumber", "fieldValue": String(formValue?.mpesaMobile || 0), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._IpSearchListService.getmPesaTranscationlist(Data).subscribe((response) => {
            this.dsMpesaTransactionlist.data = response.data;
            console.log(this.dsMpesaTransactionlist.data)
        });
    }
    //Save with credit
    onSaveDraft() {
        this.draftSaveform.get('tDrbill.totalAmt')?.setValue(this.IpbillFooterform.get('TotalAmt')?.value)
        this.draftSaveform.get('tDrbill.concessionAmt')?.setValue(this.IpbillFooterform.get('totalconcessionAmt')?.value)
        this.draftSaveform.get('tDrbill.netPayableAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value)
        this.draftSaveform.get('tDrbill.balanceAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value)
        this.draftSaveform.get('tDrbill.billDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.draftSaveform.get('tDrbill.billTime').setValue(this.dateTimeObj.time)
        this.draftSaveform.get('tDrbill.concessionReasonId')?.setValue(this.IpbillFooterform.get('ConcessionId')?.value ?? 0)
        this.draftSaveform.get('tDrbill.totalAdvanceAmount')?.setValue(this.TotalAdvanceAmt)
        this.draftSaveform.get('tDrbill.taxPer')?.setValue(this.IpbillFooterform.get('AdminPer')?.value || 0)
        this.draftSaveform.get('tDrbill.taxAmount')?.setValue(this.IpbillFooterform.get('AdminAmt')?.value ?? 0)
        this.DraftBillDetArray.clear();
        this.dataSource.data.forEach(item => {
            this.DraftBillDetArray.push(this.createDraftBillDetails(item));
        });

        if (this.dataSource.data.length > 0 && this.draftSaveform.valid) {
            console.log("Draft form values", this.draftSaveform.value)
            this._IpSearchListService.InsertIPDraftBilling(this.draftSaveform.value).subscribe(response => {
                debugger
                const [IpDraftPrint_A4, IpDraftPrintValue] = this._ConfigService.configParams.IPDraftPrintA4toA5.split(":");
                const [Is9_Digit_NationalId, value] = this._ConfigService.configParams.Is9_Digit_NationalId.split(":");

                if (Is9_Digit_NationalId == 1) {
                    //kenya draft bill print
                    this.viewgetDraftBillDateewiseReportPdf(response.drbno);
                } else {
                    if (this.IpbillFooterform.get("BillType").value == 1) {
                        debugger
                        if (IpDraftPrint_A4 != 1) {
                            this.viewgetDraftBillReportPdf(response.drbno);
                        } else {
                            this.viewgetDraftBillclasswiseA5PageReportPdf(response.drbno);
                        }
                    }
                    else {
                        if (IpDraftPrint_A4 != 1) {
                            this.viewgetDraftBillservicewiseReportPdf(response.drbno);
                        } else {
                            this.viewgetDraftBillservicewiseA5PageReportPdf(response.drbno);
                        }
                    }
                }
                this._matDialog.closeAll();
            });
        }
    }
    onClose() {
        this.dialogRef.close({ result: "cancel" });
        this.advanceDataStored.storage = [];
    }
    //Interim bill
    //select cehckbox
    tableElementChecked(event, element) {
        if (event.checked) {
            this.interimArray.push(element);
        } else if (this.interimArray.length > 0) {
            let index = this.interimArray.indexOf(element);
            if (index !== -1) {
                this.interimArray.splice(index, 1);
            }
        }
    }
    //Intrim bill popup 
    getInterimData() {
        if (this.interimArray.length > 0) {
            console.log('this.interimArray==', this.interimArray);
            const dialogRef = this._matDialog.open(InterimBillComponent,
                {
                    maxWidth: "85vw",
                    width: '100%',
                    height: "75%",
                    data: {
                        PatientHeaderObj: this.selectedAdvanceObj,
                        Obj: this.interimArray
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                this.getChargesList();
            });
        } else {
            Swal.fire('Warring !', 'Please select check box ', 'warning');
        }
        this.getChargesList();
        this.interimArray = [];
    }
    PacakgeList: any = [];
    ////Pacakge Section
    getRtrvpackagedetList() {
        var vdata = {
            "first": 0,
            "rows": 10,
            "sortField": "ChargesId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "OPD_IPD_Id", "fieldValue": String(this.opD_IPD_Id), "opType": "Equals" }],
            "columns": [{ "data": "string", "name": "string" }],
            "exportType": "JSON"
        }
        this._IpSearchListService.getRtevIPPackageDetList(vdata).subscribe((response) => {
            debugger
            this.PackageDatasource.data = response.data as ChargesList[];
            console.log(this.PackageDatasource.data)
            this.PackageDatasource.data.forEach(element => {
                const fitleredList = this.PacakgeList.filter(item => item.serviceId != element.packageServiceId)
                this.PacakgeList = fitleredList
            })
            this.PackageDatasource.data.forEach(element => {
                this.PacakgeList.push(
                    {
                        serviceId: element.packageServiceId,
                        serviceName: element.serviceName,
                        price: element.price || 0,
                        Qty: element.Qty || 1,
                        TotalAmt: element.totalAmt || 0,
                        ConcessionPercentage: element.concessionPercentage || 0,
                        DiscAmt: element.concessionAmount || 0,
                        NetAmount: element.netAmount || 0,
                        isPathology: element.isPathology,
                        isRadiology: element.isRadiology,
                        packageId: element.packageId,
                        PackageServiceId: element.serviceId,
                        pacakgeServiceName: element.pacakgeServiceName,
                        doctorName: element.doctorName,
                        doctorId: element.doctorId,
                        uniId: element.unitId || this.accountService.currentUserValue.user.unitId,
                        classId: element.classId || this.classId,
                        tariffId: element.tariffId || this.TariffId,
                    })
            })
            this.PackageDatasource.data = this.PacakgeList
        });
    }
    //Pacakge list  with serviceId     
    getpackagedetList(obj) {
        var vdata = {
            "first": 0,
            "rows": 10,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "ServiceId", "fieldValue": String(obj.serviceId), "opType": "Equals" }],
            "columns": [{ "data": "string", "name": "string" }],
            "exportType": "JSON"
        }
        this._IpSearchListService.getpackagedetServiceWiseList(vdata).subscribe((response) => {
            this.PackageDatasource.data = response.data as ChargesList[];
            this.PackageDatasource.data.forEach(element => {
                this.PacakgeList.push(
                    {
                        serviceId: element.packageServiceId,
                        serviceName: element.serviceName,
                        price: element.price || 0,
                        Qty: 1,
                        TotalAmt: (element.price * 1) || 0,
                        ConcessionPercentage: 0,
                        DiscAmt: 0,
                        NetAmount: (element.price * 1) || 0,
                        isPathology: element.isPathology,
                        isRadiology: element.isRadiology,
                        packageId: element.packageId,
                        PackageServiceId: element.serviceId,
                        pacakgeServiceName: element.pacakgeServiceName,
                        doctorName: element.doctorName,
                        doctorId: element.doctorId,
                        uniId: this.accountService.currentUserValue.user.unitId,
                        classId: this.classId,
                        tariffId: this.TariffId
                    })
            })
            this.PackageDatasource.data = this.PacakgeList
        });
    }
    //Pacakge page Open
    getpackageDet(contact) {
        const dialogRef = this._matDialog.open(PackageDetailsComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '70%',
                data: {
                    Obj: contact,
                    PatientDet: this.selectedAdvanceObj,
                    FormName: 'IPD Package'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getRtrvpackagedetList();
            this.getChargesList()
        });
    }
    getLabRequestChargelist() {
        this.chargeslist1 = [];
        this.dataSource1.data = [];
        var m =
        // OP_IP_ID: this.selectedAdvanceObj.AdmissionID,
        {
            "first": 0,
            "rows": 10,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OP_IP_ID", "fieldValue": String(this.opD_IPD_Id), "opType": "Equals" }],
            "Columns": [],
            "exportType": "JSON"
        }
        this._IpSearchListService.getchargesList1(m).subscribe(response => {
            this.chargeslist1 = response.data
            this.dataSource1.data = this.chargeslist1;
            this.isLoading = 'list-loaded';
        },
            (error) => {
                this.isLoading = 'list-loaded';
            });
    }
    billheaderlist: any;
    //Admin Charge retreiving 
    getBillheaderList() {
        this.isLoadingStr = 'loading';
        let Query = "select Isnull(AdminPer,0) as AdminPer from Admission where AdmissionId=" + this.selectedAdvanceObj.AdmissionID

        this._IpSearchListService.getBillheaderList(Query).subscribe(data => {
            this.billheaderlist = data[0].AdminPer;

            if (this.billheaderlist > 0) {
                this.isAdminDisabled = true;
                this.IpbillFooterform.get('Admincheck').setValue(true)
                // this.vAdminPer = this.billheaderlist 
            } else {
                this.isAdminDisabled = false;
                this.IpbillFooterform.get('Admincheck').setValue(false)
            }
        });
    }
    //nursing Service List added
    AddList(m) {
        var m_data = {
            "opdIpdId": m.opipid,
            "classID": this.selectedAdvanceObj.classId || 0,
            "serviceId": m.serviceId,
            "traiffId": this.selectedAdvanceObj.tariffId,
            "reqDetId": m.reqDetId,
            "userId": this.accountService.currentUserValue.userId,
            "chargesDate": this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
            "doctorId": 0,
        }
        this._IpSearchListService.InsertIPAddChargesNew(m_data).subscribe(data => {
            if (data) {
                this.getLabRequestChargelist();
                this.getChargesList();
            }
        });
        this.onClearServiceAddList()
        this.isLoading = '';
    }
    public setFocus(nextElementId): void {
        document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
    }
    openServiceTable(): void {
        debugger
        this._matDialog.open(this.serviceTable, {
            width: '50%',
            height: '60%',
        })
    }
    oncloseservice() {
        this.dialogRef.close(this.serviceTable);
    }
    //onwhatsappbill() {
    getWhatsappshareIPFinalBill(el, vmono) {

        if (vmono != '' && vmono != "0") {
            var m_data = {
                "insertWhatsappsmsInfo": {
                    "mobileNumber": vmono || 0,
                    "smsString": '',
                    "isSent": 0,
                    "smsType": 'IPBill',
                    "smsFlag": 0,
                    "smsDate": this.currentDate,
                    "tranNo": el,
                    "PatientType": 2,//el.PatientType,
                    "templateId": 0,
                    "smSurl": "info@gmail.com",
                    "filePath": '',
                    "smsOutGoingID": 0
                }
            }
            this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
                if (response) {
                    this.toastr.success('IP Final Bill Sent on WhatsApp Successfully.', 'Save !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                } else {
                    this.toastr.error('API Error!', 'Error WhatsApp!', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
    }
    // exec rptIPDInterimBill 193667 9507 
    viewgetInterimBillReportPdf(element) {
        debugger
        const [InterimA5_Print, InterimA5_Value] = this._ConfigService.configParams.InterimBillA5Print.split(":");
        if (InterimA5_Print != 1) {
            this.commonService.Onprint("BillNo", element?.billNo, "IPDInterimBill");
        } else {
            this.commonService.Onprint("BillNo", element?.billNo, "IPDInterimBillA5");
        }
    }

    //For draft print   
    viewgetDraftBillReportPdf(Id) {
        this.commonService.Onprint("AdmissionID", Id, "IpDraftBillClassWise");
    }
    //For draft print  
    viewgetDraftBillservicewiseReportPdf(Id) {
        this.commonService.Onprint("AdmissionID", Id, "IpDraftBillGroupWise");
    }
    //For draft print  A5
    viewgetDraftBillclasswiseA5PageReportPdf(Id) {
        this.commonService.Onprint("AdmissionID", Id, "IpDraftBillClassWiseA5");
    }

    //For draft print   A5
    viewgetDraftBillservicewiseA5PageReportPdf(Id) {
        this.commonService.Onprint("AdmissionID", Id, "IpDraftBillGroupWiseA5");
    }
    //draft print charge date wise
    viewgetDraftBillDateewiseReportPdf(Id) {
        this.commonService.Onprint("AdmissionID", Id, "IpDraftBillDateWise");
    }

    viewgetBillReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillChargesDateWise");
    }

    viewgetAdvanceReceiptReportPdf(data) {
        this.commonService.Onprint("AdvanceDetailID", data.advanceDetailID, "IpAdvanceReceipt");
    }
    showAllFilter(event) {
        if (event.checked == true)
            this.isFilteredDateDisabled = true;
        if (event.checked == false) {
            this.chargeDate = '01/01/1900'
            this.getChargesList();
            this.isFilteredDateDisabled = false;
        }
    }
    getDatewiseChargesList(param) {
        this.chargeslist = [];
        this.dataSource.data = [];
        this.chargeDate = this.datePipe.transform(param, "MM/dd/yyyy")
        // this.chargeDate = this.datePipe.transform(this.IpbillFooterform.get('ChargeDate').value, "MM/dd/yyyy")
        this.getChargesList()
    }
    OnDateChange() {

        // Get values as strings in dd/MM/yyyy format
        const serviceDateStr = this.datePipe.transform(this.Serviceform.get('chargesDate').value, "dd/MM/yyyy");
        const admissionDateStr = this.datePipe.transform(this.selectedAdvanceObj.admissionDate, "dd/MM/yyyy");

        // Check that both dates are available
        if (serviceDateStr && admissionDateStr) {
            // Convert to Date objects
            const [sDay, sMonth, sYear] = serviceDateStr.split('/').map(Number);
            const [aDay, aMonth, aYear] = admissionDateStr.split('/').map(Number);

            const serviceDate = new Date(sYear, sMonth - 1, sDay);      // Month is 0-based
            const admissionDate = new Date(aYear, aMonth - 1, aDay);

            // // Check if service date is earlier than admission date
            // if (serviceDate < admissionDate) {
            //     Swal.fire('The Charge Date should not be less than the Admission Date.');
            //     this.Serviceform.get('chargesDate').setValue(new Date())
            // }
            // Check if service date is earlier than admission date
            if (serviceDate < admissionDate) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid Charge Date',
                    text: 'The charge date cannot be earlier than the admission date.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    this.Serviceform.get('chargesDate')?.setValue(new Date());
                });
            }
        }


    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getPreBilldet(contact) {
        const dialogRef = this._matDialog.open(PrebillDetailsComponent,
            {
                maxWidth: "100%",
                height: '60%',
                width: '74%',
                data: {
                    Obj: contact
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }

    OnSaveEditedValue(element) {
        if (element.qty == 0) {
            element.qty = 1;
            this.toastr.warning('Qty is connot be Zero By default Qty is 1', 'error!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        let DoctorId = 0
        if (this.IpbillFooterform.get('EditDoctor').value) {
            DoctorId = this.IpbillFooterform.get('EditDoctor').value
        } else {
            DoctorId = element.doctorId
        }
        let addCharge = {
            "chargesId": element.chargesId,
            "price": element.price,
            "qty": element.qty || 1,
            "totalAmt": element.totalAmt || 0,
            "concessionPercentage": element.concessionPercentage || 0,
            "concessionAmount": element.concessionAmount || 0,
            "netAmount": element.netAmount || 0,
            "doctorId": DoctorId || 0,
            "isInclusionExclusion": element.isInclusionExclusion || false,
            "ModifiedBy": this.accountService.currentUserValue.userId
        }
        this._IpSearchListService.UpdateChargesDetails(addCharge, element.chargesId).subscribe(response => {
            if (response) {
                this.getChargesList()
            }
        });
    }
    EditDoctor: boolean = false;
    DocenableEditing(row: ChargesList) {
        if (row.CreditedtoDoctor == 1) {
            this.toastr.warning('Doctor option unavailable for the selected service!', 'warning', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        row.EditDoctor = true;
        row.doctorName = '';
    }
    DoctorisableEditing(row: ChargesList) {
        row.EditDoctor = false;
        this.IpbillFooterform.get('EditDoctor').setValue('')
        this.getChargesList()
    }
    SelectedDocName: any = [];
    DropDownValue(Obj) {
        console.log(Obj)
    }
    //Table calculation
    gettablecalculation(element) {
        // Checking if old value is same as new value (skip for new rows)
        if (!element.isNewRow) {
            const oldElement = this.copiedData.find(i => i.chargesId === element.chargesId);
            if (oldElement) {
                element.isUpdated = oldElement.price != element.price || oldElement.qty != element.qty || oldElement.isInclusionExclusion != element.isInclusionExclusion;
            }
        }

        if (element.price > 0 && element.qty > 0) {
            element.totalAmt = element.qty * element.price || 0;
            element.TotalAmt = element.totalAmt; // Sync uppercase property

            // Use concessionPercentage or ConcessionPercentage
            const discountPercent = element.concessionPercentage || element.ConcessionPercentage || 0;
            element.DiscAmt = (discountPercent * element.totalAmt) / 100 || 0;
            element.concessionAmount = element.DiscAmt; // Sync lowercase property

            element.netAmount = element.totalAmt - element.DiscAmt;
            element.NetAmount = element.netAmount; // Sync uppercase property
        }
        else if (element.price == 0 || element.price == '' || element.qty == '' || element.qty == 0) {
            element.totalAmt = 0;
            element.TotalAmt = 0;
            element.DiscAmt = 0;
            element.concessionAmount = 0;
            element.netAmount = 0;
            element.NetAmount = 0;
        }
        this.getNetAmtSum()
        this.getbillbalamt();
    }
    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    keyPressCharater(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    onScroll() {
        //Note: This is called multiple times after the scroll has reached the 80% threshold position.
        this.nextPage$.next(true);
    }
    handleChange(key: string, callback: () => void, form: FormGroup = this.Serviceform) {
        this.subscription.push(form.get(key).valueChanges.subscribe(value => {
            callback();
        }));
    }
    //Pharamcy Amount 
    getPharmacyAmount() {
        let Query = "select isnull(Sum(BalanceAmount),0) as PhBillCredit from T_SalesHeader where OP_IP_Type=1 and OP_IP_ID=" + this.selectedAdvanceObj.AdmissionID
        this._IpSearchListService.getPharmacyAmt(Query).subscribe((data) => {

            this.PharmacyAmont = data[0].PhBillCredit;
        })
    }
    getValidationMessages() {
        return {
            ChargeClass: [
                { name: "required", Message: "Class Name is required" },
            ],
            ServiceName: [
                { name: "required", Message: "Service Name is required" },
            ],
            cashCounterId: [
                { name: "required", Message: "First Name is required" },

                { name: "pattern", Message: "only Number allowed." }
            ],
            price: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            qty: [
                { name: "required", Message: "Qty required!", },
                { name: "pattern", Message: "only Number allowed.", },
                { name: "min", Message: "Enter valid qty.", }
            ],
            totalAmount: [
                {
                    name: "pattern", Message: "only Number allowed."
                }
            ],
            DoctorId: [
                { name: "pattern", Message: "only Char allowed." }
            ],
            discPer: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            discAmount: [{ name: "pattern", Message: "only Number allowed." }],
            netAmount: [{ name: "pattern", Message: "only Number allowed." }],
            concessionId: [{}],
            DoctorID: [{}]
        }
    }

    ChangeTariffname() {
        const dialogRef = this._matDialog.open(IPUpdatesComponent,
            {
                maxWidth: "40vw",
                width: '100%',
                height: "40%",
                data: {
                    PatientHeaderObj: this.selectedAdvanceObj,
                    FormName: 'Update Tariff Name'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.getChargesList();
        });
    }
    ChangeClassname() {
        const dialogRef = this._matDialog.open(IPUpdatesComponent,
            {
                maxWidth: "40vw",
                width: '100%',
                height: "40%",
                data: {
                    PatientHeaderObj: this.selectedAdvanceObj,
                    FormName: 'Update Class Name'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.getChargesList();
        });
    }
    AddBedCharge() {
        Swal.fire({
            title: 'Do you want to calculate the Bed Charges',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes,it !"
        }).then((flag) => {
            if (flag.isConfirmed) {
                var submitData = {
                    "opdIpdId": this.opD_IPD_Id
                }
                console.log(submitData)
                this._IpSearchListService.AddBedCharges(submitData).subscribe(response => {
                    this.getChargesList();
                    this.CalculateAdminCharge();
                    this.CalFinalDiscper();
                })
            }
        })
    }

    ExclusionChecked(event, element) {
        // if (event.checked) {
        //     this.interimArray.push(element);
        // } else if (this.interimArray.length > 0) {
        //     let index = this.interimArray.indexOf(element);
        //     if (index !== -1) {
        //         this.interimArray.splice(index, 1);
        //     }
        // }
    }

    // New methods for inline table editing
    classList: any[] = [];

    // Compare function for mat-select to handle string/number comparison
    compareClassValues(val1: any, val2: any): boolean {
        // Convert both to string for comparison to handle type mismatches
        return String(val1) === String(val2);
    }

    addNewTableRow() {
        // Create a new empty row matching ChargesList structure
        const newRow: any = {
            chargesId: 0,
            ChargesId: 0,
            chargesDate: this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
            ChargesDate: new Date(),
            serviceId: '',
            ServiceId: 0,
            serviceName: '',
            ServiceName: '',
            serviceCode: '',
            price: 0,
            Price: 0,
            qty: 1,
            Qty: 1,
            totalAmt: 0,
            TotalAmt: 0,
            concessionPercentage: 0,
            ConcessionPercentage: 0,
            concessionAmount: 0,
            DiscAmt: 0,
            netAmount: 0,
            NetAmount: 0,
            classId: this.selectedAdvanceObj?.classId || '',
            ClassId: this.selectedAdvanceObj?.classId || 0,
            className: this.selectedAdvanceObj?.className || '',
            ClassName: this.selectedAdvanceObj?.className || '',
            doctorId: this.selectedAdvanceObj?.doctorId || 0,
            DoctorId: this.selectedAdvanceObj?.doctorId || 0,
            doctorName: this.selectedAdvanceObj?.doctorname || '',
            ChargeDoctorName: this.selectedAdvanceObj?.doctorname || '',
            ChargesAddedName: '',
            isNewRow: true,
            isEditMode: false,
            isUpdated: false,
            isInclusionExclusion: false,
            isPathology: 0,
            IsPathology: false,
            isRadiology: 0,
            IsRadiology: false,
            isPackage: 0,
            creditedtoDoctor: false,
            CreditedtoDoctor: false,
            EditDoctor: null
        };

        // Add to beginning of array
        const data = this.dataSource.data;
        data.unshift(newRow);
        this.dataSource.data = data;
    }

    loadClassList() {
        // Load class list from service using GetBindDropDown API
        this._IpSearchListService.getMaster("Class", 0).subscribe((response: any) => {
            this.classList = response || [];
            console.log('Class List Loaded:', this.classList);
        });
    }

    onTableDateChange(contact: any) {
        contact.chargesDate = this.datePipe.transform(contact.chargesDate, 'dd/MM/yyyy');
    }

    onTableClassSelect(contact: any) {
        // Find class name from classList using API property names (value/text)
        // Use string comparison to handle type mismatches
        const selectedClass = this.classList.find((c: any) => String(c.value) === String(contact.classId));
        if (selectedClass) {
            contact.className = selectedClass.text;
            contact.ClassId = contact.classId;
            contact.ClassName = selectedClass.text;
            console.log('Class selected:', selectedClass.text, 'ID:', contact.classId);
        } else {
            console.warn('Class not found for classId:', contact.classId, 'Available classes:', this.classList);
        }
    }

    onServiceSelect(contact: any) {
        // This would typically trigger a service lookup
        // For now, we'll just keep the manually entered name
        // You may want to add autocomplete functionality here
    }

    saveNewTableRow(contact: any) {
        // Validate required fields
        if (!contact.serviceName || contact.serviceName.trim() === '') {
            this.toastr.warning('Please enter Service Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (!contact.price || contact.price <= 0) {
            this.toastr.warning('Please enter valid Price', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (!contact.qty || contact.qty <= 0) {
            this.toastr.warning('Please enter valid Quantity', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        // Prepare data for saving
        const formattedDate = this.datePipe.transform(contact.chargesDate, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");

        const saveData = {
            chargesId: 0,
            chargesDate: formattedDate,
            chargesTime: formattedDate + ' ' + formattedTime,
            opdIpdType: 1,
            opdIpdId: this.opD_IPD_Id,
            unitId: this.accountService.currentUserValue.user.unitId,
            wardId: this.WardId,
            bedId: this.BedId,
            serviceId: contact.serviceId || 0,
            serviceName: contact.serviceName,
            serviceCode: contact.serviceCode || '',
            price: contact.price,
            qty: contact.qty,
            totalAmt: contact.totalAmt,
            concessionPercentage: contact.concessionPercentage || 0,
            concessionAmount: contact.concessionAmount || 0,
            netAmount: contact.netAmount,
            classId: contact.classId,
            doctorId: contact.doctorId || 0,
            tariffId: this.TariffId,
            isPathology: contact.isPathology || 0,
            isRadiology: contact.isRadiology || 0,
            isPackage: contact.isPackage || 0,
            isInclusionExclusion: contact.isInclusionExclusion || false,
            docPercentage: 0,
            docAmt: 0,
            hospitalAmt: 0,
            isGenerated: false,
            addedBy: this.accountService.currentUserValue.userId,
            isCancelled: false,
            isCancelledBy: 0,
            isCancelledDate: "1900-01-01",
            isDoctorShareGenerated: 0,
            isInterimBillFlag: 0,
            isSelfOrCompanyService: 0,
            packageId: 0,
            packageMainChargeId: 0,
            refundAmount: 0,
            cPrice: 0,
            cQty: 0,
            cTotalAmount: 0,
            isComServ: false,
            isPrintCompSer: false,
            chPrice: 0,
            chQty: 0,
            chTotalAmount: 0,
            isBillableCharity: false,
            salesId: 0,
            billNo: 1,
            companyServiceName: '',
            isHospMrk: 0,
            createdBy: this.accountService.currentUserValue.userId,
            packcagecharges: []
        };

        // Save to database
        this._IpSearchListService.InsertIPAddCharges(saveData).subscribe(response => {
            this.toastr.success('Charge added successfully');
            this.getChargesList();
        }, error => {
            this.toastr.error('Error adding charge');
        });
    }

    cancelNewTableRow(contact: any) {
        // Remove the new row from the table
        const data = this.dataSource.data.filter(item => item !== contact);
        this.dataSource.data = data;
    }

    enableTableRowEdit(contact: any) {
        // Store original data BEFORE enabling edit mode
        contact.originalData = JSON.parse(JSON.stringify(contact)); // Deep copy

        // Ensure classId is set from ClassId - handle undefined/null vs 0
        if ((contact.classId === undefined || contact.classId === null) && contact.ClassId !== undefined) {
            contact.classId = contact.ClassId;
        }

        // Ensure all lowercase properties are populated from uppercase
        if ((contact.price === undefined || contact.price === null) && contact.Price !== undefined) {
            contact.price = contact.Price;
        }
        if ((contact.qty === undefined || contact.qty === null) && contact.Qty !== undefined) {
            contact.qty = contact.Qty;
        }
        if ((contact.totalAmt === undefined || contact.totalAmt === null) && contact.TotalAmt !== undefined) {
            contact.totalAmt = contact.TotalAmt;
        }
        if ((contact.concessionPercentage === undefined || contact.concessionPercentage === null) && contact.ConcessionPercentage !== undefined) {
            contact.concessionPercentage = contact.ConcessionPercentage;
        }
        if ((contact.concessionAmount === undefined || contact.concessionAmount === null) && contact.DiscAmt !== undefined) {
            contact.concessionAmount = contact.DiscAmt;
        }
        if ((contact.netAmount === undefined || contact.netAmount === null) && contact.NetAmount !== undefined) {
            contact.netAmount = contact.NetAmount;
        }
        if ((contact.serviceName === undefined || contact.serviceName === null || contact.serviceName === '') && contact.ServiceName) {
            contact.serviceName = contact.ServiceName;
        }
        if ((contact.className === undefined || contact.className === null || contact.className === '') && contact.ClassName) {
            contact.className = contact.ClassName;
        }

        // Convert date if needed for datepicker
        if (contact.chargesDate && typeof contact.chargesDate === 'string') {
            // Parse the date string if it's in DD/MM/YYYY format
            const dateParts = contact.chargesDate.split('/');
            if (dateParts.length === 3) {
                // Create date object for datepicker
                contact.chargesDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            }
        } else if (contact.ChargesDate && !contact.chargesDate) {
            // If ChargesDate exists but chargesDate doesn't
            contact.chargesDate = contact.ChargesDate;
        }

        // Enable edit mode
        contact.isEditMode = true;

        console.log('Edit mode enabled. classId:', contact.classId, 'ClassId:', contact.ClassId);
        console.log('classList:', this.classList);
        console.log('Full contact:', contact);
    }

    saveEditedTableRow(contact: any) {
        // Sync all properties (lowercase to uppercase)
        if (contact.price) contact.Price = contact.price;
        if (contact.qty) contact.Qty = contact.qty;
        if (contact.totalAmt) contact.TotalAmt = contact.totalAmt;
        if (contact.concessionPercentage) contact.ConcessionPercentage = contact.concessionPercentage;
        if (contact.concessionAmount) contact.DiscAmt = contact.concessionAmount;
        if (contact.netAmount) contact.NetAmount = contact.netAmount;
        if (contact.classId) contact.ClassId = contact.classId;
        if (contact.className) contact.ClassName = contact.className;
        if (contact.serviceName) contact.ServiceName = contact.serviceName;

        // Mark as updated and exit edit mode
        contact.isEditMode = false;
        contact.isUpdated = true;

        // Remove original data
        delete contact.originalData;

        console.log('Saving edited row:', contact);

        // Call existing save method
        this.OnSaveEditedValue(contact);
    }

    cancelEditTableRow(contact: any) {
        // Restore original data and exit edit mode
        if (contact.originalData) {
            // Get the index of the current contact in the datasource
            const index = this.dataSource.data.findIndex(item => item === contact);
            if (index !== -1) {
                // Replace the entire object with the original data
                this.dataSource.data[index] = contact.originalData;
                // Refresh the datasource
                this.dataSource.data = [...this.dataSource.data];
            }
        } else {
            // If no original data, just exit edit mode
            contact.isEditMode = false;
        }

        console.log('Edit cancelled');
    }
}

export class Bill {
    AdmissionID: any;
    BillNo: number;
    OPD_IPD_ID: number;
    TotalAmt: any;
    ConcessionAmt: any;
    NetPayableAmt: any;
    PaidAmt: any;
    BalanceAmt: any;
    BillDate: any;
    OPD_IPD_Type: any;
    AddedBy: any;
    TotalAdvanceAmount: any;
    BillTime: any;
    ConcessionReasonId: any;
    IsSettled: boolean;
    IsPrinted: boolean;
    IsFree: boolean;
    CompanyId: any;
    TariffId: any;
    UnitId: any;
    InterimOrFinal: any;
    CompanyRefNo: any;
    ConcessionAuthorizationName: any;
    TaxPer: any;
    TaxAmount: any;
    DiscComments: String;
    vCashCounterID: any;
    Bdate: any;
    PBillNo: any;
    CashPayAmount: any;
    ChequePayAmount: any;
    CardPayAmount: any;
    AdvanceUsedAmount: any;
    PatientName: any;
    BillDateTime: any;

    billTime: any;
    pbillNo: any;
    regNo: any;
    patientName: any;
    totalAmt: any;
    concessionAmt: any;
    netPayableAmt: any;
    balanceAmt: any;


    constructor(InsertBillUpdateBillNoObj) {
        this.AdmissionID = InsertBillUpdateBillNoObj.AdmissionID || 0;
        this.BillNo = InsertBillUpdateBillNoObj.BillNo || 0;
        this.OPD_IPD_ID = InsertBillUpdateBillNoObj.OPD_IPD_ID || 0;
        this.TotalAmt = InsertBillUpdateBillNoObj.TotalAmt || 0;
        this.ConcessionAmt = InsertBillUpdateBillNoObj.ConcessionAmt || 0;
        this.NetPayableAmt = InsertBillUpdateBillNoObj.NetPayableAmt || 0;
        this.PaidAmt = InsertBillUpdateBillNoObj.PaidAmt || '0';
        this.BalanceAmt = InsertBillUpdateBillNoObj.BalanceAmt || '0';
        this.BillDate = InsertBillUpdateBillNoObj.BillDate || '';
        this.OPD_IPD_Type = InsertBillUpdateBillNoObj.OPD_IPD_Type || '0';
        this.AddedBy = InsertBillUpdateBillNoObj.AddedBy || '0';
        this.TotalAdvanceAmount = InsertBillUpdateBillNoObj.TotalAdvanceAmount || '0';
        this.BillTime = InsertBillUpdateBillNoObj.BillTime || '';
        this.ConcessionReasonId = InsertBillUpdateBillNoObj.ConcessionReasonId || '0';
        this.IsSettled = InsertBillUpdateBillNoObj.IsSettled || 0;
        this.IsPrinted = InsertBillUpdateBillNoObj.IsPrinted || 0;
        this.IsFree = InsertBillUpdateBillNoObj.IsFree || 0;
        this.CompanyId = InsertBillUpdateBillNoObj.CompanyId || '0';
        this.TariffId = InsertBillUpdateBillNoObj.TariffId || '0';
        this.UnitId = InsertBillUpdateBillNoObj.UnitId || '0';
        this.InterimOrFinal = InsertBillUpdateBillNoObj.InterimOrFinal || '0';
        this.CompanyRefNo = InsertBillUpdateBillNoObj.CompanyRefNo || '0';
        this.ConcessionAuthorizationName = InsertBillUpdateBillNoObj.ConcessionAuthorizationName || '0';
        this.TaxPer = InsertBillUpdateBillNoObj.TaxPer || '0';
        this.TaxAmount = InsertBillUpdateBillNoObj.TaxAmount || '0';
        this.DiscComments = InsertBillUpdateBillNoObj.DiscComments || '';
        this.vCashCounterID = InsertBillUpdateBillNoObj.CashCounterID || '';
        this.Bdate = InsertBillUpdateBillNoObj.Bdate || '';

        this.PBillNo = InsertBillUpdateBillNoObj.PBillNo || '0';
        this.CashPayAmount = InsertBillUpdateBillNoObj.CashPayAmount || '0';
        this.ChequePayAmount = InsertBillUpdateBillNoObj.ChequePayAmount || '';
        this.CardPayAmount = InsertBillUpdateBillNoObj.CardPayAmount || '';
        this.AdvanceUsedAmount = InsertBillUpdateBillNoObj.AdvanceUsedAmount || '';
        this.PatientName = InsertBillUpdateBillNoObj.PatientName || ''


        this.billTime = InsertBillUpdateBillNoObj.billTime || '';
        this.pbillNo = InsertBillUpdateBillNoObj.pbillNo || '0';
        this.regNo = InsertBillUpdateBillNoObj.regNo || '';
        this.patientName = InsertBillUpdateBillNoObj.patientName || '';
        this.totalAmt = InsertBillUpdateBillNoObj.totalAmt || '';
        this.concessionAmt = InsertBillUpdateBillNoObj.concessionAmt || ''
        this.netPayableAmt = InsertBillUpdateBillNoObj.netPayableAmt || '';
        this.balanceAmt = InsertBillUpdateBillNoObj.balanceAmt || ''

        this.BillDateTime = InsertBillUpdateBillNoObj.BillDateTime || ''
    }

}
export class DraftBill {

    OPD_IPD_ID: number;
    TotalAmt: any;
    ConcessionAmt: any;
    NetPayableAmt: any;
    PaidAmt: any;
    BalanceAmt: any;
    BillDate: any;
    OPD_IPD_Type: any;
    AddedBy: any;
    TotalAdvanceAmount: any;
    BillTime: any;
    ConcessionReasonId: any;
    IsSettled: boolean;
    IsPrinted: boolean;
    IsFree: boolean;
    CompanyId: any;
    TariffId: any;
    UnitId: any;
    InterimOrFinal: any;
    CompanyRefNo: any;
    ConcessionAuthorizationName: any;
    TaxPer: any;
    TaxAmount: any;
    drbNo: any;

    constructor(DraftBill) {

        this.OPD_IPD_ID = DraftBill.OPD_IPD_ID || 0;
        this.TotalAmt = DraftBill.TotalAmt || 0;
        this.ConcessionAmt = DraftBill.ConcessionAmt || 0;
        this.NetPayableAmt = DraftBill.NetPayableAmt || 0;
        this.PaidAmt = DraftBill.PaidAmt || '0';
        this.BalanceAmt = DraftBill.BalanceAmt || '0';
        this.BillDate = DraftBill.BillDate || '';
        this.OPD_IPD_Type = DraftBill.OPD_IPD_Type || '0';
        this.AddedBy = DraftBill.AddedBy || '0';
        this.TotalAdvanceAmount = DraftBill.TotalAdvanceAmount || '0';
        this.BillTime = DraftBill.BillTime || '';
        this.ConcessionReasonId = DraftBill.ConcessionReasonId || '0';
        this.IsSettled = DraftBill.IsSettled || 0;
        this.IsPrinted = DraftBill.IsPrinted || 0;
        this.IsFree = DraftBill.IsFree || 0;
        this.CompanyId = DraftBill.CompanyId || '0';
        this.TariffId = DraftBill.TariffId || '0';
        this.UnitId = DraftBill.UnitId || '0';
        this.InterimOrFinal = DraftBill.InterimOrFinal || '0';
        this.CompanyRefNo = DraftBill.CompanyRefNo || '0';
        this.ConcessionAuthorizationName = DraftBill.ConcessionAuthorizationName || '0';
        this.TaxPer = DraftBill.TaxPer || '0';
        this.TaxAmount = DraftBill.TaxAmount || '0';
        this.drbNo = DraftBill.drbNo || 0;

    }

}