import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { interval, Subscription, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OpPaymentComponent } from '../../op-search-list/op-payment/op-payment.component';
import { RegInsert } from '../../registration/registration.component';
import { AppointmentBillService } from './appointment-bill.service';
import { PacakgeList } from 'app/main/setup/billing/service-master/editpackage/editpackage.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { element } from 'protractor';
import { UserDetail } from 'app/main/administration/create-user/newcreate-user/newcreate-user.component';

@Component({
    selector: 'app-appointment-billing',
    templateUrl: './appointment-billing.component.html',
    styleUrls: ['./appointment-billing.component.scss'],
    animations: fuseAnimations
})
export class AppointmentBillingComponent implements OnInit, OnDestroy {
    public displayedChargeColumns: string[] =
        ['Status', 'ServiceCode', 'ServiceName', 'Price', 'Qty', 'TotalAmount', 'DiscountPer', 'DiscountAmount', 'NetAmount', 'DoctorName', 'ClassName', 'ChargesAddedName', 'Exclucion', 'Action'];
    public displayedColumnspackage: string[] =
        ['IsCheck', 'ServiceNamePackage', 'ServiceName', 'Price', 'Qty', 'TotalAmt', 'DoctorName', 'DiscAmt', 'NetAmount'];
    public displayedPrescriptionColumns =
        ['groupName', 'serviceName', 'classRate', 'userName'];
    public mPesaColumns = ['PayStatus', 'transactionDate', 'phoneNumber', 'mpesaReceiptNumber', 'amount', 'ResponseDate', 'Description', 'Action'];
    public displayedColumnsDraft: string[] =
        ['Status','DraftDate','NetAmount', 'Action'];

    countdown: number = 180; // 3 minutes
    countdownColorClass = 'green';
    //new
    doctorName: any
    IsPathology: any;
    IsRadiology: any;
    vIsPackage: any;
    dateTimeObj: any
    RegNo: any;
    Doctorname: any;
    CompanyName: any;
    DepartmentName: any;
    vPrice = '0';
    vQty: any;
    ApiURL: any = '';
    SrvcName1: any = ""
    serviceId: any;
    patientDetail: any = new RegInsert({});
    vOPIPId = 0;
    vTariffId = 0;
    vhospitalId = 0;
    vClassId: any = 0;
    currentDate = new Date();
    PatientName: any;
    className = "OPD";
    screenFromString = 'Common-form';
    AgeYear: any;
    ConcessionId = 0;
    ConcessionReason = "";
    chkIsEditable: boolean = true;
    Regstatus: boolean = true;
    Consessionres: boolean = false;
    savebtn: boolean = true;
    autocompleteModeCashcounter: string = "CashCounter";
    autocompleteModetariff: string = "Tariff";
    autocompleteModedeptdoc: string = "ConDoctor";
    autocompleteModeService: string = "Service";
    autocompleteModeConcession: string = "Concession";
    autocompleteModeGroup: string = "GroupName";

    public dataSource = new MatTableDataSource<any>();
    public subscription: Array<Subscription> = [];
    public searchForm!: FormGroup;
    public chargeForm!: FormGroup;
    public OpBillForm!: FormGroup;
    public OPFooterForm: FormGroup;
    public isModal = false;
    public isServiceSelected = false;
    public isDiscountApplied = false;
    public isDoctor = false;
    public isUpdating = false;
    Is9_Digit_National_Id: boolean = false
    serviceSelct = false
    @ViewChild('regIdfocus') regIdfocus: ElementRef;
    currency: any = '';

    @ViewChild('serviceTable') serviceTable!: TemplateRef<any>;
    @ViewChild('MpesatranscationlistTable') MpesatranscationlistTable!: TemplateRef<any>;
    public dsChargeList = new MatTableDataSource<ChargesList>();
    public dsPackageList = new MatTableDataSource<ChargesList>();
    public dsOpDraftlist = new MatTableDataSource<ChargesList>();
    public dsServiceList = new MatTableDataSource<ChargesList>();
    public dsMpesaTransactionlist = new MatTableDataSource<ChargesList>();
    public chargeList: ChargesList[] = [];
    public packageList: ChargesList[] = [];
    public serviceList: ChargesList[] = [];

    constructor(private _matDialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public datePipe: DatePipe,
        private advanceDataStored: AdvanceDataStored,
        private commonService: PrintserviceService,
        public _AppointmentlistService: AppointmentBillService,
        private accountService: AuthenticationService,
        public toastr: ToastrService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private formBuilder: FormBuilder,
        private toastrService: ToastrService,
        private hospitalconfigservice: HospitalConfigService,
        public _ConfigService: ConfigService,
        private cdr: ChangeDetectorRef,
        @Optional() public dialogRef: MatDialogRef<AppointmentBillingComponent>
    ) { };

    ngOnInit() {
        this.isModal = !!this.dialogRef;
        this.searchForm = this.createSearchForm();
        this.chargeForm = this.createChargeForm();
        this.OpBillForm = this.createTotalChargeForm();
        this.OPFooterForm = this.CreateOPFooter();
        this.OPFooterForm.markAllAsTouched();
        this.OpDraftSaveForm = this.createDraftSaveform()

        if (this.data) {
            // console.log(this.data)
            this.patientDetail = this.advanceDataStored.storage;
            console.log(this.patientDetail)
            //this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.patientDetail.tariffId + "&ClassId=" + this.patientDetail.classId + "&ServiceName="
            this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.patientDetail.tariffId + "&ClassId=" + this.patientDetail.classId + "&SrvcName="

            console.log("Data", this.patientDetail)
            this.PatientName = this.patientDetail.patientName
            this.patientDetail.doctorName = this.patientDetail.doctorname
            this.DepartmentName = this.patientDetail.departmentName
            this.AgeYear = this.patientDetail.ageYear
            this.Doctorname = this.patientDetail.doctorname
            this.vOPIPId = this.patientDetail.visitId;
            this.vTariffId = this.patientDetail.tariffId;
            this.vhospitalId = this.patientDetail.hospitalId;
            this.vClassId = this.patientDetail.classId
            this.RegNo=this.patientDetail.regNo
            this.savebtn = false
            this.searchForm.get('TariffId').setValue(this.patientDetail.tariffId)
            this.checkCompanypatient(this.patientDetail?.companyId ?? 0)
            this.patientDetail.mobileNo
            this.OPFooterForm.patchValue({ mpesaMobile: this.patientDetail?.mobileNo || 0 })
        }
        this.dsChargeList = new MatTableDataSource(this.chargeList);
        this.dsPackageList = new MatTableDataSource(this.packageList);
        this.dsServiceList = new MatTableDataSource(this.serviceList);

        this.setupFormListener();
        this.startCountdown();
        this.getdraftlist();
        this.getAccessDetail()
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue


        //this code for Mediforte 9 digit national id
        const rawValue = this?._ConfigService?.configParams?.Is9_Digit_NationalId || "";
        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.Is9_Digit_National_Id = id === "1";
    }
    private setupFormListener(): void {
        this.handleChange('price', () => this.calculateTotalCharge());
        this.handleChange('qty', () => this.calculateTotalCharge());
        this.handleChange('discountPer', () => this.updateDiscountAmount());
        this.handleChange('discountAmount', () => this.updateDiscountPercentage());
        this.handleChange('totalDiscountPer', () => this.updateTotalDiscountAmt(), this.OPFooterForm);
        this.handleChange('concessionAmt', () => this.updateTotalDiscountPer(), this.OPFooterForm);
    }
    openServiceTable(): void {
        this._matDialog.open(this.serviceTable, {
            width: '40%',
            height: '60%',
        })
        let Data = {
            "first": 0,
            "rows": 999,
            "sortField": "RequestTranId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "VisitId", "fieldValue": String(this.vOPIPId), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._AppointmentlistService.getOPDEmrId(Data).subscribe((response) => {
            this.dsServiceList.data = response.data;
            console.log(this.dsServiceList.data)
        });
    }
    getMpesaTransactionlist(): void {
        if (!this.dsChargeList.data.length) {
            this.toastrService.warning('Charges are not available in list, Please add Charges', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.OPFooterForm.get('concessionAmt').value > 0 && this.Consessionres) {
            if (!this.OPFooterForm.get('concessionReasonId').value) {
                this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        if (!this.OPFooterForm.get('mpesaMobile')?.value) {
            this.toastrService.warning('Enter Mobile number', 'Warning !', {
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
            "rows": 999,
            "sortField": "Id",
            "sortOrder": 0,
            "filters": [{ "fieldName": "Opdipdid", "fieldValue": String(this.vOPIPId), "opType": "Equals" },
            { "fieldName": "PhoneNumber", "fieldValue": String(this.OPFooterForm.get('mpesaMobile')?.value || 0), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._AppointmentlistService.getmPesaTranscationlist(Data).subscribe((response) => {
            this.dsMpesaTransactionlist.data = response.data;
            console.log(this.dsMpesaTransactionlist.data)
        });
    }

    startCountdown() {
        const interval = setInterval(() => {
            this.countdown--;
            // Update color dynamically
            if (this.countdown > 120) {
                this.countdownColorClass = 'green';
            } else if (this.countdown > 60) {
                this.countdownColorClass = 'orange';
            } else {
                this.countdownColorClass = 'red';
            }
            if (this.countdown <= 0) {
                clearInterval(interval);
                this.isWaiting = false;
                 this.stopPolling();             // Stop polling
                this.statusMessage = '❌ Payment not completed. User did not approve.';
            }

        }, 1000);
    }
    getService(contact) {
        console.log(contact)
        debugger
        const isItemAlreadyAdded = this.dsChargeList.data.some((element) => element.ServiceId === contact.serviceId);
        if (isItemAlreadyAdded) {
            Swal.fire({
                title: 'Message',
                text: "Selected Service already available in the list",
                icon: "warning"
            });

            this.chargeForm.get("qty").setValue(1);
            const serviceNameElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
            if (serviceNameElement) {
                serviceNameElement.focus();
            }
            return;
        } else {
            const newRow = {
                ServiceId: contact.serviceId,
                ServiceName: contact.serviceName,
                Price: contact.classRate || 1,
                Qty: 1,
                TotalAmt: contact.classRate * 1,// totalAmount,
                DiscPer: 0,
                DiscAmt: 0,
                NetAmount: contact.classRate * 1,
                DoctorName: '-',
                ClassName: contact.className || '-',
                DoctorId: 0,
                ChargesAddedName: this.accountService.currentUserValue.userName,
                IsPathology: contact.isPathology,
                IsRadiology: contact.isRadiology,
                IsPackage: contact.isPackage,
            };


            console.log(newRow)
            const newCharge = new ChargesList(newRow);
            newCharge.DiscAmt = newCharge.DiscAmt || 0;
            newCharge.DiscPer = newCharge.DiscPer || 0;
            this.chargeList.push(newCharge);
            this.dsChargeList.data = this.chargeList;
            this.calculateTotalAmount();
            // this.dialogRef.close(contact)
        }
    }
    calculateTotalCharge(row: any = null): void {
        let qty = +this.chargeForm.get("qty").value;
        let price = +this.chargeForm.get("price").value;
        let total = 0
        if (qty > 0 && price > 0) {
            total = qty * price;
        }
        this.chargeForm.patchValue({
            totalAmount: total,
            netAmount: total  // Set net amount initially
        }, { emitEvent: false }); // Prevent infinite loop

        this.updateDiscountAmount();
        this.updateDiscountPercentage();
    }
    // Trigger when discount percentage change
    updateDiscountAmount(row: any = null): void {
        if (this.isUpdating) return; // Stop recursion
        this.isUpdating = true;

        const perControl = this.chargeForm.get("discountPer");
        if (!perControl.valid) {
            this.chargeForm.get("discountAmount").setValue(0);
            this.chargeForm.get("discountPer").setValue(0);
            this.isUpdating = false;
            this.toastrService.error("Enter discount % between 0-100");
            return;
        }
        let percentage = perControl.value;
        let totalAmount = this.chargeForm.get("totalAmount").value;

        // let discountAmount = this.getFixedDecimal(totalAmount * percentage / 100);
        // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);
        let discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
        let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

        this.chargeForm.patchValue({
            discountAmount: discountAmount,
            netAmount: netAmount
        }, { emitEvent: false }); // Prevent infinite loop

        this.isUpdating = false; // Reset flag
    }
    // Trigger when discount amount change
    updateDiscountPercentage(): void {
        if (this.isUpdating) return;
        this.isUpdating = true;

        let discountAmount = this.chargeForm.get("discountAmount").value;
        let totalAmount = this.chargeForm.get("totalAmount").value;

        if (discountAmount < 0 || discountAmount > totalAmount) {
            this.chargeForm.get("discountAmount").setValue(0);
            this.chargeForm.get("discountPer").setValue(0);
            this.isUpdating = false;
            this.toastrService.error("Discount must be between 0 and the total amount.");
            return;
        }
        // let percent = this.getFixedDecimal(totalAmount ? (discountAmount / totalAmount) * 100 : 0);
        // let netAmount = this.getFixedDecimal(totalAmount - discountAmount);

        let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
        let netAmount = Number((totalAmount - discountAmount).toFixed(2));
        this.chargeForm.patchValue({
            discountPer: percent,
            netAmount: netAmount
        }, { emitEvent: false }); // Prevent infinite loop

        this.isUpdating = false; // Reset flag
    }
    handleChange(key: string, callback: () => void, form: FormGroup = this.chargeForm) {
        this.subscription.push(form.get(key).valueChanges.subscribe(value => {
            callback();
        }));
    }
    getFixedDecimal(value: number) {
        return Number(value.toFixed(2));
    }
    getUserAccesDetList:any=[];
      getAccessDetail() {
        // debugger
        var SelectQuery = {
          "first": 0,
          "rows": 999,
          "sortField": "AccessValueId",
          "sortOrder": 0,
          "filters": [
            {
              "fieldName": "LoginId",
              "fieldValue": String(this.accountService.currentUserValue.userId), //"30091",
              "opType": "Equals"
            }
          ],
          "exportType": "JSON",
          "columns": []
        }
        this._AppointmentlistService.getAccessDetailList(SelectQuery).subscribe(response => {
          this.getUserAccesDetList = response.data as UserDetail[];
          console.log("get Access data:", this.getUserAccesDetList) 
        });
      }
    
    // Form creation Pending section
    createSearchForm() {
        return this.formBuilder.group({
            regId: [''],
            CashCounterID: [this.hospitalconfigservice.HospitalconfigParams?.OPD_Billing_CounterId],
            TariffId: [this.patientDetail.tariffId]
        });
    }
    createChargeForm() {
        return this.formBuilder.group({
            serviceName: ['', Validators.required],
            price: [0, [Validators.required, Validators.min(0)]],
            qty: [1, [Validators.required, Validators.min(1)]],
            totalAmount: [0,],
            discountPer: [0, [Validators.min(0), Validators.max(100)]],
            discountAmount: [0, [Validators.required, Validators.min(0)]],
            netAmount: [0, [Validators.min(0)]],
            DoctorID: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            GroupId: [0]
        });
    }
    //Footer Form
    CreateOPFooter() {
        return this.formBuilder.group({
            totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totalDiscountPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionReasonId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
            netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            paymentType: ['CreditPay'],
            GovrnApprovAmt: [0],
            mpesaMobile: ['' ],
            UpiNo: [0]
        })
    }
    createTotalChargeForm(): FormGroup {
        return this.formBuilder.group({
            //bill header  
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdid: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            regNo: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            patientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            ipdno: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            ageYear: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ageMonth: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ageDays: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            patientType: [false],
            companyName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            companyAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            patientAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            billDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd'), [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
            opdipdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            addedBy: [this.accountService.currentUserValue.userId],
            totalAdvanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            billTime: [this.datePipe.transform(new Date(), 'shortTime'), [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSettled: true,
            isPrinted: true,
            isFree: true,
            govtApprovedAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.vTariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            interimOrFinal: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            companyRefNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            speTaxPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            speTaxAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            compDiscAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discComments: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
            cashCounterId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
            createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            addCharges: this.formBuilder.array([]),

            // ✅ Fixed: should be FormArray
            billDetails: this.formBuilder.array([]),

            // ✅ Fixed: should be FormArray
            packcagecharges: this.formBuilder.array([]),

            //Payment form
            payments: this.formBuilder.group({
                paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                receiptNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                paymentDate: [''],
                paymentTime: [''],
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
                tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId],
                wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            //New Payments
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([]),

            tdrBill:this.formBuilder.group({
                drbno:[0],
                isCancelled:[0]
            })
        });
    }
    CreateAddchargeform(item: any): FormGroup {
        return this.formBuilder.group({
            chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item?.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            price: [item?.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            qty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionPercentage: [item?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmount: [item?.DiscAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            doctorId: [item?.DoctorId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorName: [item?.DoctorName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            docPercentage: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            hospitalAmt: [item?.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            isComServ: [false],
            isPrintCompSer: [false],
            isGenerated: [true],
            addedBy: [this.accountService.currentUserValue.userId],
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDate: ['1999-01-01'],
            isPathology: [item?.IsPathology ? true : false],
            isRadiology: [item?.IsRadiology ? true : false],
            isPackage: [Number(item?.IsPackage ?? 0) === 1],
            wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceCode: [item?.serviceCode || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            serviceName: [item?.ServiceName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            isInclusionExclusion: [item?.isInclusionExclusion || false,],
            isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageMainChargeID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrCompanyService: [false],
            packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
            classId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.vTariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    createBillDetails(item: any): FormGroup {
        return this.formBuilder.group({
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesId: [item?.ServiceId, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    Createpacakgechargeform(item: any): FormGroup {
debugger
console.log(item)
        return this.formBuilder.group({
            chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item?.serviceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            price: [item?.price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            qty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionPercentage: [item?.DiscPer ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmount: [item?.DiscAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            doctorId: [item?.doctorId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorName: [item?.doctorName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            docPercentage: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            hospitalAmt: [item?.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isComServ: [false],
            isPrintCompSer: [false],
            salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isGenerated: [false],
            addedBy: [this.accountService.currentUserValue.userId],
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDate: ['1999-01-01'],
            isPathology: [item?.isPathology ? true : false],
            isRadiology: [item?.isRadiology ? true : false],
            isPackage: [true],
            wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceCode: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            serviceName: [item?.serviceName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            isInclusionExclusion: [false],
            isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageMainChargeID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrCompanyService: [false],
            packageId: [item?.PackageServiceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
            classId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.vTariffId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }
    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId],
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
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
            tranMode: ['HOSP', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [this.accountService.currentUserValue.userId],
            transactionLabel: ['OP_BILL', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    // Getters
    get ChargeddetailsArray(): FormArray {
        return this.OpBillForm.get('addCharges') as FormArray;
    }
    get BillDetailsArray(): FormArray {
        return this.OpBillForm.get('billDetails') as FormArray;
    }
    get packcagechargesArray(): FormArray {
        return this.OpBillForm.get('packcagecharges') as FormArray;
    }
    get ModeOfPaymentsArray(): FormArray {
        return this.OpBillForm.get('tPayments') as FormArray;
    }

    getdocdetail(event) {
        this.doctorName = event.text
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
    onAddCharges(): void {
        debugger
        const isItemAlreadyAdded = this.dsChargeList.data.some((element) => element.ServiceId === this.chargeForm.get('serviceName')?.value.serviceId);
        if (isItemAlreadyAdded) {
            Swal.fire({
                title: 'Message',
                text: "Selected Service already available in the list",
                icon: "warning"
            });
            return;
        }
        const serviceNameValue = this.chargeForm.get('serviceName')?.value;
        if (serviceNameValue?.serviceId == 0 || this.serviceSelct == false || serviceNameValue?.serviceId == '' || serviceNameValue?.serviceId == null || serviceNameValue?.serviceId == undefined) {
            this.toastrService.warning('Please select a valid service name.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.chargeForm.get('DoctorID').value == "0") {
            this.toastrService.warning('Please select a valid doctor name.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.chargeForm.valid) {
            const formValue = this.chargeForm.value;
            if (this.chargeForm.value.discountPer > 0)
                this.Consessionres = true
            // Calculate total amount, discount amount, and net amount
            const totalAmount = formValue.price * formValue.qty;
            const discountAmount = (totalAmount * formValue.discountPer) / 100;
            const netAmount = totalAmount - discountAmount;
            if (totalAmount > 0) {
                const newRow = {
                    ServiceId: formValue.serviceName.serviceId,
                    ServiceName: formValue.serviceName.serviceName,
                    Price: formValue.price,
                    Qty: formValue.qty,
                    TotalAmt: totalAmount,
                    DiscPer: formValue.discountPer || 0,
                    DiscAmt: discountAmount || 0,
                    NetAmount: netAmount,
                    DoctorName: this.doctorName || '-',
                    ClassName: this.className || '-',
                    DoctorId: formValue.DoctorID,
                    ChargesAddedName: this.accountService.currentUserValue.userName,
                    IsPathology: this.IsPathology,
                    IsRadiology: this.IsRadiology,
                    IsPackage: this.vIsPackage,
                    serviceCode: formValue.serviceName.companyCode,
                    isInclusionExclusion: formValue.serviceName.isInclusionOrExclusion
                };
                if (!this.isDiscountApplied && discountAmount > 0) {
                    this.isDiscountApplied = true;
                    this.Consessionres = true
                }
                const newCharge = new ChargesList(newRow);
                newCharge.DiscAmt = newCharge.DiscAmt || 0;
                newCharge.DiscPer = newCharge.DiscPer || 0;
                this.chargeList.push(newCharge);
                this.dsChargeList.data = this.chargeList;
                this.calculateTotalAmount();
                this.serviceSelct = false
                this.resetForm();
                this.chargeForm.get("qty").setValue(1);
                const serviceNameElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
                if (serviceNameElement) {
                    serviceNameElement.focus();
                }
            } else {
                Swal.fire({
                    title: 'Message',
                    text: "Please Enter Service Detail.. !",
                    icon: "warning"
                });
            }
        }
    }
    resetForm(): void {
        this.chargeForm.reset({
            serviceName: '',
            price: 0,
            qty: 0,
            totalAmount: 0,
            discountPer: 0,
            discountAmount: 0,
            netAmount: 0,
            DoctorID: 0,
            DoctorName: ''
        });
        this.doctorName = '';
    }
    deleteCharge(index: number, element) {
        this.chargeList.splice(index, 1);
        this.dsChargeList.data = this.chargeList;
        this.calculateTotalAmount();
        if (!this.chargeList.length) {
            this.isDiscountApplied = false;
        }
        Swal.fire({
            title: 'ChargeList Row Deleted Successfully',
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Ok!"
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                if (element.IsPackage == '1' && element.ServiceId) {
                    this.PacakgeList = this.PacakgeList.filter(item => item.PackageServiceId != element.ServiceId)
                    this.dsPackageList.data = this.PacakgeList;
                }
            }
        });
    }
    getRtevPackageDetList(obj) {
        debugger
        var vdata =
        {
            "first": 0,
            "rows": 999,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "ServiceId", "fieldValue": String(obj.serviceId), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        //console.log(vdata)
        this._AppointmentlistService.getRtevPackageDetList(vdata).subscribe(data => {
            this.dsPackageList.data = data.data as ChargesList[];
            this.dsPackageList.data.forEach(element => {
                console.log(element)
                
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
                        doctorId: element.doctorId
                    })
            })
            this.dsPackageList.data = this.PacakgeList
        });
    }
    EditedPackageService: any = [];
    OriginalPackageService: any = [];
    TotalPrice: any = 0;
    ExclusionAmt: any = 0;
    InclusionAmt: any = 0;
    PacakgeList: any = [];
    getPacakgeDetail(contact) {
        const dialogRef = this._matDialog.open(PackageDetailsComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '70%',
                data: {
                    Obj: contact,
                    PatientDet: this.patientDetail
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            if (result) {
                this.dsPackageList.data = result
                console.log(this.dsPackageList.data)
                this.dsPackageList.data.forEach(element => {
                    this.PacakgeList = [];
                    if (element.BillwiseTotalAmt > 0) {
                        this.TotalPrice = element.BillwiseTotalAmt;
                        console.log(this.TotalPrice)
                    } else {
                        this.TotalPrice = parseInt(this.TotalPrice) + parseInt(element.Price);
                        console.log(this.TotalPrice)
                    }
                    this.OriginalPackageService = this.dsChargeList.data.filter(item => item.ServiceId !== element.PackageServiceId)
                    this.EditedPackageService = this.dsChargeList.data.filter(item => item.ServiceId === element.PackageServiceId)
                    console.log(this.OriginalPackageService)
                    console.log(this.EditedPackageService)
                });
                let price = 0;
                let TotalAmt = 0;
                let NetAmount = 0;
                this.dsPackageList.data.forEach(element => {
                    if (element.BillwiseTotalAmt > 0) {
                        price = 0;
                        TotalAmt = 0;
                        NetAmount = 0;
                    } else {
                        price = element.Price
                        TotalAmt = element.TotalAmt
                        NetAmount = element.NetAmount
                    }
                    this.PacakgeList.push(
                        {
                            serviceId: element.ServiceId,
                            serviceName: element.ServiceName,
                            price: price || 0,
                            Qty: element.Qty || 1,
                            TotalAmt: TotalAmt || 0,
                            ConcessionPercentage: element.ConcessionPercentage || 0,
                            DiscAmt: element.DiscAmt || 0,
                            NetAmount: NetAmount || 0,
                            isPathology: element.IsPathology || 0,
                            isRadiology: element.IsRadiology || 0,
                            packageId: element.PackageId || 0,
                            PackageServiceId: element.PackageServiceId || 0,
                            pacakgeServiceName: element.PacakgeServiceName || '',
                            doctorName: element.DoctorName || '',
                            doctorId: element.DoctorId || 0
                        });
                    this.dsPackageList.data = this.PacakgeList;
                });
                if (this.EditedPackageService.length) {
                    this.EditedPackageService.forEach(element => {
                        this.OriginalPackageService.push(
                            {
                                ChargesId: 0,// this.serviceId,
                                ServiceId: element.ServiceId,
                                ServiceName: element.ServiceName,
                                Price: this.TotalPrice || 0,
                                Qty: element.Qty || 0,
                                TotalAmt: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                                DiscPer: element.DiscPer || 0,
                                DiscAmt: element.DiscAmt || 0,
                                NetAmount: (parseFloat(element.Qty) * parseFloat(this.TotalPrice)) || 0,
                                ClassId: 1,
                                DoctorId: element.DoctornewId,
                                DoctorName: element.DoctorName,
                                ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                                IsPathology: element.IsPathology,
                                IsRadiology: element.IsRadiology,
                                IsPackage: element.IsPackage,
                                ClassName: element.ClassName,
                                ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
                            });
                        this.dsChargeList.data = this.OriginalPackageService;
                        this.chargeList = this.dsChargeList.data
                    });
                }
                this.TotalPrice = 0;
            }
            this.calculateTotalAmount();
        })
    }
    getAmount(key: string): number {
        const control = this.OPFooterForm.get(key);
        return control ? control.value : 0;
    }
    // Calculation of total amount.
    calculateTotalAmount(): void {
        let totalSum = this.chargeList.reduce((sum, charge) => sum + (+charge.TotalAmt), 0);
        let totalDiscount = this.chargeList.reduce((sum, charge) => sum + (+charge.DiscAmt), 0);
        let totalNet = totalSum - totalDiscount;

        this.OPFooterForm.patchValue({
            totalAmt: totalSum,
            concessionAmt: Math.round(totalDiscount),
            netPayableAmt: Math.round(totalNet)
        }, { emitEvent: false });

        const Exclusionlist = this.chargeList.filter(i => i.isInclusionExclusion === true)
        const Inclusionlist = this.chargeList.filter(i => i.isInclusionExclusion !== true)
        this.ExclusionAmt = Exclusionlist.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
        this.InclusionAmt = Inclusionlist.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);

        if (!this.isDiscountApplied && totalDiscount > 0) {
            this.isDiscountApplied = true;
            this.Consessionres = true
        }

    }
    onPriceOrQtyChange(row: ChargesList = null): void {
        if (!row) return;

        row.Price = Math.abs(row.Price);
        row.Qty = Math.abs(row.Qty);

        const totalAmount = row.Price * row.Qty;

        // If discount percentage exists, recalculate discount amount
        if (row.DiscPer) {
            row.DiscAmt = parseFloat(((totalAmount * row.DiscPer) / 100).toFixed(2));
        }
        row.TotalAmt = totalAmount;
        row.NetAmount = totalAmount - row.DiscAmt;

        this.calculateTotalAmount();
    }
    onDiscountPerChange(row: ChargesList): void {
        if (!row) return;
        let discountPer = +row.DiscPer || 0;
        const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

        if (discountPer < 0 || discountPer > 100) {
            discountPer = 0; // Reset if out of range
            row.DiscPer = 0;
            this.toastrService.error("Enter discount % between 0-100");
        }

        this.Consessionres = true
        if (discountPer == 0) {
            this.Consessionres = false
            this.OPFooterForm.get("concessionReasonId").setValue(0)
        }

        row.DiscAmt = parseFloat(((totalAmount * discountPer) / 100).toFixed(2));
        row.TotalAmt = totalAmount;
        row.NetAmount = totalAmount - row.DiscAmt;

        this.calculateTotalAmount();
    }
    onDiscountAmtChange(row: ChargesList): void {
        if (!row) return;
        let discountAmt = +row.DiscAmt || 0;
        const totalAmount = (+row.Price || 0) * (+row.Qty || 0);

        if (discountAmt < 0 || discountAmt > totalAmount) {
            row.DiscAmt = 0;
            discountAmt = 0;
            this.toastrService.error("Discount must be between 0 and the total amount.");
        }

        this.Consessionres = true
        if (discountAmt == 0) {
            this.Consessionres = false
            this.OPFooterForm.get("concessionReasonId").setValue(0)
        }
        row.DiscPer = totalAmount ? parseFloat(((discountAmt / totalAmount) * 100).toFixed(2)) : 0;
        row.TotalAmt = totalAmount;
        row.NetAmount = totalAmount - discountAmt;

        this.calculateTotalAmount();
    }
    updateTotalDiscountAmt(): void {
        if (this.isUpdating) return; // Stop recursion
        this.isUpdating = true;
        const totalDiscountPer = +this.OPFooterForm.get("totalDiscountPer").value;
        if (totalDiscountPer == 0)
            this.OPFooterForm.get("concessionReasonId").setValue(0)
        if (totalDiscountPer < 0 || totalDiscountPer > 100) {
            this.OPFooterForm.get("totalDiscountPer").setValue(0);
            this.OPFooterForm.get("concessionAmt").setValue(0);

            this.isUpdating = false;
            this.Consessionres = false;

            this.toastrService.error("Discount must be between 0 to 100.");
            return;
        }
        this.Consessionres = totalDiscountPer !== 0;
        if (!this.isDiscountApplied) {
            const totalAmount = +this.OPFooterForm.get("totalAmt").value;
            const discountAmount = (totalAmount * totalDiscountPer) / 100;
            const netAmount = totalAmount - discountAmount;
            this.OPFooterForm.patchValue({
                concessionAmt: Math.round(discountAmount),
                netPayableAmt: Math.round(netAmount)
            }, { emitEvent: false });
        }
        this.isUpdating = false;
    }
    updateTotalDiscountPer(): void {
        if (this.isUpdating) return; // Stop recursion
        this.isUpdating = true;

        const totalDiscountAmount = +this.OPFooterForm.get("concessionAmt").value;
        const totalChargeAmount = +(this.OPFooterForm.get("totalAmt").value);

        if (totalDiscountAmount == 0)
            this.OPFooterForm.get("concessionReasonId").setValue(0)

        if (totalDiscountAmount < 0 || totalDiscountAmount > totalChargeAmount) {
            this.OPFooterForm.get("totalDiscountPer").setValue(0);
            this.OPFooterForm.get("concessionAmt").setValue(0);
            this.isUpdating = false;
            this.Consessionres = false;
            this.toastrService.error("Discount must be between 0 and the total amount.");
            return;
        }
        this.Consessionres = totalDiscountAmount !== 0;
        if (!this.isDiscountApplied) {
            // const disountPer = Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00");

            const disountPer = Math.ceil(Number(totalChargeAmount ? ((totalDiscountAmount / totalChargeAmount) * 100).toFixed(2) : "0.00"));
            const netAmount = totalChargeAmount - totalDiscountAmount;
            this.OPFooterForm.patchValue({
                totalDiscountPer: disountPer,
                netPayableAmt: netAmount.toFixed(2)
            }, { emitEvent: false });
        }
        this.isUpdating = false;
    }
    getSelectedserviceObj(obj) {
        // const isItemAlreadyAdded = this.dsChargeList.data.some((element) => element.ServiceId === obj.serviceId);
        // if (isItemAlreadyAdded) {
        //   Swal.fire({
        //     title: 'Message',
        //     text: "Selected Service already available in the list",
        //     icon: "warning"
        //   });
        //   this.resetForm();
        //   this.chargeForm.get("qty").setValue(1);
        //   const serviceNameElement = document.querySelector(`[name='serviceName']`) as HTMLElement;
        //   if (serviceNameElement) {
        //     serviceNameElement.focus();
        //   }
        //   return;  // Exit the function early
        // } else {
        console.log(obj)
        this.SrvcName1 = obj.serviceName;
        this.serviceId = obj.serviceId;
        this.vQty = 1;
        this.IsPathology = obj.isPathology;
        this.IsRadiology = obj.isRadiology;
        this.vIsPackage = obj.isPackage;
        this.chargeForm.patchValue({
            price: obj.price
        })
        if (obj?.creditedtoDoctor == true) {
            this.isDoctor = true;
            this.chargeForm.get('DoctorID').reset();
            this.chargeForm.get('DoctorID').setValidators([Validators.required]);
            this.chargeForm.get('DoctorID').enable();
        } else {
            this.isDoctor = false;
            this.chargeForm.get('DoctorID').reset();
            this.chargeForm.get('DoctorID').clearValidators();
            this.chargeForm.get('DoctorID').updateValueAndValidity();
            this.chargeForm.get('DoctorID').disable();
        }
        if (obj?.isEditable == true) {
            this.chkIsEditable = false;
        } else {
            this.chkIsEditable = true;
        }
        this.serviceSelct = true
        // }
        this.getRtevPackageDetList(obj)
    }
    getSelectedObj(obj) {
        console.log(obj)
        this.patientDetail = obj
        this.patientDetail.doctorId = obj.consultantDocId
        this.patientDetail.doctorname = obj.doctorName
        this.PatientName = obj.formattedText
        this.DepartmentName = this.patientDetail.departmentName
        this.AgeYear = this.patientDetail.ageYear
        this.Doctorname = this.patientDetail.doctorName
        this.RegNo =Number(this.patientDetail.regNo.split('|')[0].trim());
        this.vOPIPId = this.patientDetail.visitId
        this.vTariffId = this.patientDetail.tariffId;
        this.vhospitalId = this.patientDetail.hospitalId;
        this.searchForm.get('TariffId').setValue(this.patientDetail.tariffId)
        this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + this.patientDetail.tariffId + "&ClassId=" + this.patientDetail.classId + "&SrvcName="
        this.OPFooterForm.patchValue({ mpesaMobile: this.patientDetail?.mobileNo || 0 })
        if (this.vOPIPId > 0)
            this.savebtn = false
        this.Regstatus = false
        this.checkCompanypatient(this.patientDetail?.companyId ?? 0)
    }
    getSelectedTariffObj(event) {
        this.ApiURL = "VisitDetail/search-GetServiceListwithTraiff?TariffId=" + event.value + "&ClassId=" + this.patientDetail.classId + "&SrvcName="
    }
    BillSave() {
        if (this.OPFooterForm.get('paymentType').value == 'OnlinePay') {
            const upi = this.OPFooterForm.get('UpiNo')?.value;
            if (!upi || upi.length < 4) {
                this.toastr.warning('Enter UPI No (min 4 & max 12 characters)', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to save this OPD bill?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.OnSave(); // Call your save function
            }
        });
    }
    mpesaResponse_1: any = [];
    OnSave() {

        if (this.OPFooterForm.get('concessionAmt').value > 0 && this.Consessionres) {
            if (!this.OPFooterForm.get('concessionReasonId').value) {
                this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        const formattedDate = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        this.OpBillForm.get('billDate').setValue(formattedDate);
        this.OpBillForm.get('billTime').setValue(formattedDate + ' ' + formattedTime);
        this.OpBillForm.get('opdipdid')?.setValue(this.patientDetail?.visitId)
        this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
        this.OpBillForm.get('regNo')?.setValue(this.RegNo)
        this.OpBillForm.get('patientName')?.setValue(this.PatientName)
        this.OpBillForm.get('ipdno')?.setValue(this.patientDetail?.opdNo)
        this.OpBillForm.get('ageYear')?.setValue(Number(this.patientDetail?.ageYear) || 0)
        this.OpBillForm.get('ageMonth')?.setValue(Number(this.patientDetail?.ageMonth) || 0)
        this.OpBillForm.get('ageDays')?.setValue(Number(this.patientDetail?.ageDays) || 0)
        this.OpBillForm.get('doctorId')?.setValue(this.patientDetail?.doctorId || 0)
        this.OpBillForm.get('doctorName')?.setValue(this.patientDetail?.doctorname || '')
        this.OpBillForm.get('patientType')?.setValue(this.patientDetail?.companyId ? true : false)
        this.OpBillForm.get('companyName')?.setValue(this.patientDetail?.companyName || '')
        this.OpBillForm.get('companyAmt')?.setValue(this.ExclusionAmt)
        this.OpBillForm.get('patientAmt')?.setValue(this.InclusionAmt)
        this.OpBillForm.get('totalAmt')?.setValue(this.OPFooterForm.get('totalAmt')?.value || 0)
        this.OpBillForm.get('concessionAmt')?.setValue(this.OPFooterForm.get('concessionAmt')?.value || 0)
        this.OpBillForm.get('netPayableAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value || 0)
        this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
        this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)
        this.OpBillForm.get('cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)
        this.OpBillForm.get('govtApprovedAmt')?.setValue(this.OPFooterForm.get('GovrnApprovAmt').value || 0)
        if((this.DraftdetObj?.drbno || 0)>0){
        this.OpBillForm.get('tdrBill.drbno')?.setValue(this.DraftdetObj?.drbno || 0)
        this.OpBillForm.get('tdrBill.isCancelled')?.setValue(1) 
        }
        this.ChargeddetailsArray.clear();
        this.BillDetailsArray.clear();
        if (!this.OpBillForm.invalid) {
            this.ChargeddetailsArray.clear();
            this.BillDetailsArray.clear();
            this.dsChargeList.data.forEach(item => {
                this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
                this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));

                if (item.IsPackage == 1) {
                    this.packcagechargesArray.clear();
                    this.dsPackageList.data.forEach(item => {
                        this.packcagechargesArray.push(this.Createpacakgechargeform(item as ChargesList));
                    });
                }
            });

            console.log("form values", this.OpBillForm.value)
            const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");

            if (this.OPFooterForm.get('paymentType').value == 'PayOption') {
                let PatientHeaderObj = {};
                PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
                    PatientHeaderObj['PatientName'] = this.PatientName;
                PatientHeaderObj['RegNo'] = this.RegNo || 0;
                PatientHeaderObj['DoctorName'] = this.Doctorname || '';
                PatientHeaderObj['CompanyName'] = this.patientDetail?.companyName || '';
                PatientHeaderObj['DepartmentName'] = this.DepartmentName || '';
                PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
                PatientHeaderObj['CompanyId'] = this.patientDetail?.companyId || 0;
                PatientHeaderObj['CashCounterId'] = this.searchForm.get('CashCounterID')?.value || 0;
                PatientHeaderObj['Age'] = this.AgeYear || 0;
                PatientHeaderObj['TransactionLabel'] = 'OP_BILL';
                PatientHeaderObj['NetPayAmount'] = Math.round(this.OPFooterForm.get('netPayableAmt').value);
                const dialogRef = this._matDialog.open(OpPaymentComponent,
                    {
                        maxWidth: "80vw",
                        height: '750px',
                        width: '80%',
                        data: {
                            vPatientHeaderObj: PatientHeaderObj,
                            FromName: "OP-Bill",
                            advanceObj: PatientHeaderObj,
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    if (result && result.IsSubmitFlag == true) {
                        console.log(this.OpBillForm.value)
                        console.log(result.submitDataPay.ipPaymentInsert)
                        console.log(result.BillBalanceAmount)
                        this.OpBillForm.get('balanceAmt').setValue(result.BillBalanceAmount || 0)
                        this.OpBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

                        this.ModeOfPaymentsArray.clear();
                        result.submitDataPay.ipModePaymentInsert.forEach(item => {
                            this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                        });

                        console.log(this.OpBillForm.value)
                        this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value).subscribe(response => {
                            this.resetform();
                            this._matDialog.closeAll();
                            this.savebtn = true
                            if (ThermalPrint != 1) {
                                this.viewgetOPBillReportPdf(response)
                            } else {
                                if (this.data?.FormName != 'Appointment-OPBill') {
                                    this.viewgetOPBillThermalReportPdf(response)
                                } else {
                                    this.dialogRef.close(response)
                                }
                            }
                        });
                    }
                });
            }
            else if (this.OPFooterForm.get('paymentType').value == 'CashPay') {//Cash pay  
                let ModePaymentObj = [];
                ModePaymentObj.push({
                    paymentDate: formattedDate,
                    paymentTime: formattedTime,
                    payAmount: this.OPFooterForm.get('netPayableAmt')?.value ?? 0,
                    tranNo: "",
                    bankName: "",
                    validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                    comments: "",
                    payMode: "CASH",
                    onlineTranNo: "0",
                    onlineTranResponse: "0",
                    companyId: this.patientDetail?.CompanyId ?? 0,
                    cashCounterId: this.searchForm.get('CashCounterID')?.value || 0,
                    transactionType: 0,
                    isSelfOrcompany: this.patientDetail?.CompanyId ? 1 : 0,
                });
                this.OpBillForm.get('balanceAmt').setValue(0)
                this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
                this.OpBillForm.get('payments.cashPayAmount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
                this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
                this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)
                this.OpBillForm.get('payments.companyId')?.setValue(this.patientDetail?.companyId || 0)

                this.ModeOfPaymentsArray.clear();
                ModePaymentObj.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                });

                console.log(this.OpBillForm.value)
                this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value).subscribe(response => {

                    console.log(response)
                    this.mpesaResponse = response.data;
                    // this.startPolling();
                    this._matDialog.closeAll();
                    this.savebtn = true
                    this.resetform();
                    if (ThermalPrint != 1) {
                        this.viewgetOPBillReportPdf(response)
                    } else {
                        if (this.data?.FormName != 'Appointment-OPBill') {
                            this.viewgetOPBillThermalReportPdf(response)
                        } else {
                            this.dialogRef.close(response)
                        }
                    }
                });
            }
            else if (this.OPFooterForm.get('paymentType').value == 'OnlinePay') {
                let ModePaymentObj = [];
                ModePaymentObj.push({
                    paymentDate: formattedDate,
                    paymentTime: formattedTime,
                    payAmount: this.OPFooterForm.get('netPayableAmt')?.value ?? 0,
                    tranNo: this.OPFooterForm.get('UpiNo')?.value || 0,
                    bankName: "",
                    validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                    comments: "",
                    payMode: "UPI",
                    onlineTranNo: "0",
                    onlineTranResponse: "0",
                    companyId: this.patientDetail?.CompanyId ?? 0,
                    cashCounterId: this.searchForm.get('CashCounterID')?.value || 0,
                    transactionType: 0,
                    isSelfOrcompany: this.patientDetail?.CompanyId ? 1 : 0,
                });
                debugger
                this.OpBillForm.get('balanceAmt').setValue(0)
                this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
                this.OpBillForm.get('payments.payTmamount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
                this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
                this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)
                this.OpBillForm.get('payments.payTmtranNo')?.setValue(this.OPFooterForm.get('UpiNo')?.value || 0)
                this.OpBillForm.get('payments.payTmdate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
                this.OpBillForm.get('payments.companyId')?.setValue(this.patientDetail?.companyId || 0)

                this.ModeOfPaymentsArray.clear();
                ModePaymentObj.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                });

                console.log(this.OpBillForm.value)
                this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value).subscribe(response => {

                    console.log(response)
                    this.mpesaResponse = response.data;
                    // this.startPolling();
                    this._matDialog.closeAll();
                    this.savebtn = true
                    this.resetform();
                    if (ThermalPrint != 1) {
                        this.viewgetOPBillReportPdf(response)
                    } else {
                        if (this.data?.FormName != 'Appointment-OPBill') {
                            this.viewgetOPBillThermalReportPdf(response)
                        } else {
                            this.dialogRef.close(response)
                        }
                    }
                });
            }
            else if (this.OPFooterForm.get('paymentType').value == 'CreditPay') {//Credit pay 
                this.OpBillForm.get('paidAmt').setValue(0)
                this.OpBillForm.get('balanceAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
                this.OpBillForm.removeControl('payments')
                console.log(this.OpBillForm.value)
                this._AppointmentlistService.InsertOPBillingCredit(this.OpBillForm.value).subscribe(response => {
                    this._matDialog.closeAll();
                    this.savebtn = true
                    this.resetform();
                    if (ThermalPrint != 1) {
                        this.viewgetOPBillReportPdf(response)
                    } else {
                        if (this.data?.FormName != 'Appointment-OPBill') {
                            this.viewgetOPBillThermalReportPdf(response)
                        } else {
                            this.dialogRef.close(response)
                        }
                    }
                });
            }
            else if (this.OPFooterForm.get('paymentType')?.value === 'Mpesa') {

                this.openWaitingScreen();
                // this.startPolling();  
                // if(this.mPesa_ReceiptNo && this.mpesaResponse){
                //     console.log(this.mPesa_ReceiptNo)
                //      console.log(this.mpesaResponse)
                // const mPesaMerchant_CheckoutRequest_Id  = this.mpesaResponse?.checkoutRequestID +"|"+ this.mpesaResponse?.merchantRequestID
                // this.OpBillForm.get('balanceAmt').setValue(0)
                // this.OpBillForm.get('paidAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
                // this.OpBillForm.get('payments.payTmamount')?.setValue(Number(this.OPFooterForm.get('netPayableAmt')?.value))
                // this.OpBillForm.get('payments.payTmdate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
                // this.OpBillForm.get('payments.payTmtranNo')?.setValue(this.mPesa_ReceiptNo)
                // this.OpBillForm.get('payments.remark')?.setValue(mPesaMerchant_CheckoutRequest_Id) 

                // console.log(this.OpBillForm.value)
                // this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value).subscribe(response => {
                //     
                //     console.log(response)
                //     if (ThermalPrint != 1) {
                //         this.viewgetOPBillReportPdf(response)
                //     } else {
                //         this.viewgetOPBillThermalReportPdf(response)
                //     } 
                //     this._matDialog.closeAll();
                //     this.savebtn = true
                //     this.resetform();
                // }); 
                // }
            }
        }
        else {
            let invalidFields = [];
            if (this.OpBillForm.invalid) {
                for (const controlName in this.OpBillForm.controls) {
                    const control = this.OpBillForm.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`OpBill From: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
                return
            }
        }
    }
    resetform() {
        this.chargeList = [];
        this.dsChargeList.data = []
        this.patientDetail = [];
        this.patientDetail.tariffId = 1;
        this.patientDetail.ClassId = 1;
        this.searchForm.get('regId').setValue('')
        this.OPFooterForm.reset({
            totalAmt: 0,
            totalDiscountPer: 0,
            concessionAmt: 0,
            netPayableAmt: 0,
            concessionReasonId: 0,
        });
        this.OPFooterForm.get('paymentType').setValue('CreditPay')
        this.PatientName = ''
    }
    viewgetCreditOPBillReportPdf(element) {
        this.commonService.Onprint("BillNo", element, "OpBillReceipt");
    }
    viewgetOPBillReportPdf(element) {
        this.commonService.Onprint("BillNo", element, "OpBillReceipt");
    }
    viewgetOPBillThermalReportPdf1(element) {
        this.commonService.Onprint("BillNo", element, "OpBillReceipt");
    }
    viewgetOPBillDraftReportPdf(element) {
        this.commonService.Onprint("BillNo", element, "OpDraftBillReceipt");
    } 
    reportPrintObj: ChargesList;
    subscriptionArr: Subscription[] = [];
    printTemplate: any;
    reportPrintObjList: ChargesList[] = [];
    viewgetOPBillThermalReportPdf(BillNo) {
        debugger
        let param = {
            "searchFields": [
                {
                    "fieldName": 'BillNo',
                    "fieldValue": String(BillNo),
                    "opType": "13"
                }
            ],
            "mode": 'OPBillPrint'
        }
        this._AppointmentlistService.getReportView(param).subscribe(res => {
            console.log(res)
            this.reportPrintObjList = res as ChargesList[];
            setTimeout(() => {
                this.print3();
            }, 1000);
        });
    }

    @ViewChild('billTemplate2') billTemplate2: ElementRef;
    print3() {

        let popupWin, printContents;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

        popupWin.document.write(` <html>
    <head><style type="text/css">`);
        popupWin.document.write(`
      </style>
      <style type="text/css" media="print">
    @page { size: portrait; }
  </style>
          <title></title>
      </head>
    `);
        // console.log(this.billTemplate2.nativeElement.innerHTML)
        debugger
        popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billTemplate2.nativeElement.innerHTML}</body>
    <script>
      var css = '@page { size: portrait; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
  
      if (style.styleSheet){
          style.styleSheet.cssText = css;
      } else {
          style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    </script>
    </html>`);
        // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
        // </html>`);

        popupWin.document.close();
    }
    selectChangeConcession(event) {
        this.ConcessionId = event.value
        this.ConcessionReason = event.text
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    ngOnDestroy(): void {
        if (this.subscription.length > 0) {
            this.subscription.forEach(s => s.unsubscribe());
        }
        this.stopPolling();
    }
    getValidationMessages() {
        return {
            CashCounterID: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            price: [
                { name: "pattern", Message: "only Number allowed." },
                { name: "min", Message: "Enter valid price." }
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
            totalNetAmount: [
                {
                    name: "pattern", Message: "only Number allowed."
                }
            ],
            DoctorID: [
                { name: "pattern", Message: "only Char allowed." }
            ],
            discountPer: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            discountAmount: [{ name: "pattern", Message: "only Number allowed." }],
            netAmount: [{ name: "pattern", Message: "only Number allowed." }],
            tariffId: [
                { name: "pattern", Message: "only Char allowed." }
            ],
            UpiNo: [
                { name: "required", Message: "UPI required!", },
                { name: "pattern", Message: "only Number allowed.", },
                { name: "min", Message: "Enter valid UPI No.", }
            ],
        }
    }
    checkCompanypatient(companyId) {
        if (companyId > 0) {
            this.OPFooterForm.get('paymentType').setValue('CreditPay');
        } else {
            this.OPFooterForm.get('paymentType').setValue('CreditPay');
        }
    }
    isWaiting = false;
    mpesaResponse: any;
    statusMessage: any;
    pollingSub?: Subscription;
    mPesa_ReceiptNo: any = '0';
    openWaitingScreen() {
        debugger
         this.countdown = 180;  // reset timer
         this.statusMessage = 'Waiting for customer approval...';
        const mobileWithCode = '+254' + this.OPFooterForm.get('mpesaMobile')?.value || '0';  
        this._AppointmentlistService.postpayment(this.OpBillForm.controls["netPayableAmt"]?.value, this.OPFooterForm.get('mpesaMobile')?.value,
            this.OpBillForm.get('opdipdid')?.value).subscribe(response => {
                this.mpesaResponse = response;
                console.log(this.mpesaResponse)
                // Build message AFTER response arrives
                this.statusMessage = '' + response.responseDescription + '\n' +
                    'CheckoutRequestId  : ' + response.checkoutRequestID + '\n' +
                    'MerchantRequestId  : ' + response.merchantRequestID;
                this.isWaiting = true; 
                this.startCountdown();
                this.startPolling();
            }); 
    } 
    manualRefresh() {
        this.checkStatus();
    }

    startPolling() {
        debugger
        this.pollingSub = interval(10000)
            .pipe(switchMap(() => this._AppointmentlistService.checkStatus(this.mpesaResponse)))
            .subscribe((status: any) => this.handleStatus(status));
    }

    stopPolling() {
        if (this.pollingSub) {
            this.pollingSub.unsubscribe();
            this.pollingSub = null;
        }
        // this._matDialog.closeAll();
        //this.savebtn = true
        // this.resetform();
    }

    checkStatus() {
        if (this.mpesaResponse) {
            this._AppointmentlistService.checkStatus(this.mpesaResponse)
                .subscribe((status: any) => this.handleStatus(status));
        }
    }
    handleStatus(status: any) {
        debugger
        console.log(status)

        // if (status?.resultCode == 0 && (status?.mpesaReceiptNumber ?? '') != '') {
        //     // here you can get json response.
        //     this.statusMessage = 'Payment successful.' + this.mpesaResponse.responseDescription + '\n' +
        //         'CheckoutRequestId  : ' + this.mpesaResponse.checkoutRequestID + '\n' +
        //         'MerchantRequestId  : ' + this.mpesaResponse.merchantRequestID + '\n' +
        //         'Receipt No=' + status.mpesaReceiptNumber;
        //     this.mPesa_ReceiptNo  = status.mpesaReceiptNumber
        //     this.stopPolling();
        //     this.isWaiting = false
        //     // setTimeout(() => this.isWaiting = false, 1500);
        //      this.SavemPesaBill();
        // }
        // else {
        //     if (status?.resultDesc) {
        //         this.statusMessage = status?.resultDesc;
        //         this.stopPolling();
        //         this.isWaiting = false
        //         // setTimeout(() => this.isWaiting = false, 1500);
        //     }
        // }
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
        // else {
        //     if (status?.resultDesc) {
        //         this.statusMessage = status?.resultDesc;
        //         this.stopPolling();
        //         this.isWaiting = false;
        //     }
        // }

    }
    // Mpesa Save  
    SavemPesaBill() {

        const formattedDate = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
        const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
        const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
        const mPesaMerchant_CheckoutRequest_Id = this.mpesaResponse.checkoutRequestID + "|" + this.mpesaResponse.merchantRequestID;

        this.OpBillForm.get('balanceAmt').setValue(0);
        this.OpBillForm.get('paidAmt').setValue(this.OPFooterForm.get('netPayableAmt').value);
        this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)
        this.OpBillForm.get('payments.payTmamount').setValue(Number(this.OPFooterForm.get('netPayableAmt').value));
        this.OpBillForm.get('payments.payTmdate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
        this.OpBillForm.get('payments.payTmtranNo').setValue(this.mPesa_ReceiptNo || 0);
        this.OpBillForm.get('payments.remark').setValue(mPesaMerchant_CheckoutRequest_Id || 0);
        this.OpBillForm.get('payments.companyId')?.setValue(this.patientDetail?.companyId || 0)

        let ModePaymentObj = [];
        ModePaymentObj.push({
            paymentDate: formattedDate,
            paymentTime: formattedTime,
            payAmount: this.OPFooterForm.get('netPayableAmt')?.value || 0,
            tranNo: this.mPesa_ReceiptNo || 0,
            bankName: "",
            validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
            comments: "",
            payMode: "MPESA",
            onlineTranNo: this.mPesa_ReceiptNo || 0,
            onlineTranResponse: mPesaMerchant_CheckoutRequest_Id || 0,
            companyId: this.patientDetail?.CompanyId ?? 0,
            cashCounterId: this.searchForm.get('CashCounterID')?.value || 0,
            transactionType: 0,
            isSelfOrcompany: this.patientDetail?.CompanyId ? 1 : 0,
        });

        this.ModeOfPaymentsArray.clear();
        ModePaymentObj.forEach(item => {
            this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
        });

        this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value)
            .subscribe(response => {
                this.savebtn = true;
                this.resetform();
                this._matDialog.closeAll();
                if (ThermalPrint != 1) {
                    this.viewgetOPBillReportPdf(response)
                } else {
                    if (this.data?.FormName != 'Appointment-OPBill') {
                        this.viewgetOPBillThermalReportPdf(response)
                    } else {
                        this.dialogRef.close(response)
                    }
                }
            });
    }
    // mpesa Save through history
    OnmPesaSave(row) {
        const mpesaAmt = row?.amount || 0;
        const netAmt = this.OPFooterForm.get('netPayableAmt')?.value || 0;

        if (mpesaAmt !== netAmt) {
            Swal.fire({
                icon: 'warning',
                title: 'Payment Amount Mismatch',
                html: `
    <b>M-Pesa Amount:</b> <span style="color:#d33;">${mpesaAmt}</span><br>
    <b>Net Payable Amount:</b> <span style="color:#d33;">${netAmt}</span><br><br>
    Please check and retry.
  `,
                confirmButtonText: 'OK'
            });
            return;

        }

        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to save this OPD bill?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const formattedDate = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
                const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
                this.OpBillForm.get('billDate').setValue(formattedDate);
                this.OpBillForm.get('billTime').setValue(formattedDate + ' ' + formattedTime);
                this.OpBillForm.get('opdipdid')?.setValue(this.vOPIPId)
                this.OpBillForm.get('tariffId')?.setValue(this.vTariffId)
                this.OpBillForm.get('regNo')?.setValue(this.RegNo)
                this.OpBillForm.get('patientName')?.setValue(this.PatientName)
                this.OpBillForm.get('ipdno')?.setValue(this.patientDetail?.opdNo)
                this.OpBillForm.get('ageYear')?.setValue(Number(this.patientDetail?.ageYear) || 0)
                this.OpBillForm.get('ageMonth')?.setValue(Number(this.patientDetail?.ageMonth) || 0)
                this.OpBillForm.get('ageDays')?.setValue(Number(this.patientDetail?.ageDays) || 0)
                this.OpBillForm.get('doctorId')?.setValue(this.patientDetail?.doctorId || 0)
                this.OpBillForm.get('doctorName')?.setValue(this.patientDetail?.doctorname || '')
                this.OpBillForm.get('patientType')?.setValue(this.patientDetail?.companyId ? true : false)
                this.OpBillForm.get('companyName')?.setValue(this.patientDetail?.companyName || '')
                this.OpBillForm.get('companyAmt')?.setValue(this.ExclusionAmt)
                this.OpBillForm.get('patientAmt')?.setValue(this.InclusionAmt)
                this.OpBillForm.get('totalAmt')?.setValue(this.OPFooterForm.get('totalAmt')?.value)
                this.OpBillForm.get('concessionAmt')?.setValue(this.OPFooterForm.get('concessionAmt')?.value)
                this.OpBillForm.get('netPayableAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value)
                this.OpBillForm.get('concessionReasonId')?.setValue(this.ConcessionId)
                this.OpBillForm.get('discComments')?.setValue(this.ConcessionReason)
                this.OpBillForm.get('cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value)

                if (!this.OpBillForm.invalid) {
                    this.ChargeddetailsArray.clear();
                    this.BillDetailsArray.clear();
                    this.dsChargeList.data.forEach(item => {
                        this.ChargeddetailsArray.push(this.CreateAddchargeform(item as ChargesList));
                        this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));

                        if (item.IsPackage == 1) {
                            this.packcagechargesArray.clear();
                            this.dsPackageList.data.forEach(item => {
                                this.packcagechargesArray.push(this.Createpacakgechargeform(item as ChargesList));
                            });
                        }
                    });
                    if (this.OPFooterForm.get('paymentType')?.value === 'Mpesa') {
                        this.mPesa_ReceiptNo = row?.mpesaReceiptNumber || 0
                        const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
                        const mPesaMerchant_CheckoutRequest_Id = row?.checkoutRequestId + "|" + row?.merchantRequestId;

                        this.OpBillForm.get('balanceAmt').setValue(0);
                        this.OpBillForm.get('paidAmt').setValue(this.OPFooterForm.get('netPayableAmt').value);
                        this.OpBillForm.get('payments.paymentDate')?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
                        this.OpBillForm.get('payments.paymentTime')?.setValue(this.dateTimeObj.time)
                        this.OpBillForm.get('payments.payTmamount').setValue(Number(this.OPFooterForm.get('netPayableAmt').value));
                        this.OpBillForm.get('payments.payTmdate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
                        this.OpBillForm.get('payments.payTmtranNo').setValue(this.mPesa_ReceiptNo);
                        this.OpBillForm.get('payments.remark').setValue(mPesaMerchant_CheckoutRequest_Id);
                        this.OpBillForm.get('payments.companyId')?.setValue(this.patientDetail?.companyId || 0)

                        let ModePaymentObj = [];
                        ModePaymentObj.push({
                            paymentDate: formattedDate,
                            paymentTime: formattedTime,
                            payAmount: this.OPFooterForm.get('netPayableAmt')?.value || 0,
                            tranNo: this.mPesa_ReceiptNo || 0,
                            bankName: "",
                            validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                            comments: "",
                            payMode: "MPESA",
                            onlineTranNo: this.mPesa_ReceiptNo || 0,
                            onlineTranResponse: mPesaMerchant_CheckoutRequest_Id || 0,
                            companyId: this.patientDetail?.CompanyId ?? 0,
                            cashCounterId: this.searchForm.get('CashCounterID')?.value || 0,
                            transactionType: 0,
                            isSelfOrcompany: this.patientDetail?.CompanyId ? 1 : 0,
                        });

                        this.ModeOfPaymentsArray.clear();
                        ModePaymentObj.forEach(item => {
                            this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                        });

                        this._AppointmentlistService.InsertOPBilling(this.OpBillForm.value)
                            .subscribe(response => {
                                this.savebtn = true;
                                this.resetform();
                                this._matDialog.closeAll();
                                if (ThermalPrint != 1) {
                                    this.viewgetOPBillReportPdf(response)
                                } else {
                                    if (this.data?.FormName != 'Appointment-OPBill') {
                                        this.viewgetOPBillThermalReportPdf(response)
                                    } else {
                                        this.dialogRef.close(response)
                                    }
                                }
                            });
                    }
                }
                else {
                    let invalidFields = [];
                    if (this.OpBillForm.invalid) {
                        for (const controlName in this.OpBillForm.controls) {
                            const control = this.OpBillForm.get(controlName);
                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`OP Bill Data : ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`OpBill From: ${controlName}`);
                            }
                        }
                    }
                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => {
                            this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                            );
                        });
                        return
                    }
                }
            }
        });
    }

    OpDraftSaveForm: FormGroup

    createDraftSaveform(): FormGroup {
        return this.formBuilder.group({
            //draft save form
            drBill: this.formBuilder.group({
                drbno: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                totalAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                netPayableAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                billDate: [''],
                opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
                isCancelled: [0],
                pbillNo: ['', [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                totalAdvanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                addedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                cashCounterId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                billTime: [''],
                concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSettled: [true],
                isPrinted: [true],
                isFree: [true],
                companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                tariffId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                interimOrFinal: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                companyRefNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                concessionAuthorizationName: [0],
                taxPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                taxAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            // ✅ Fixed: should be FormArray
            tDrbillDet: this.formBuilder.array([]),
            // ✅ Fixed: should be FormArray
            tDraddCharge: this.formBuilder.array([]),
        });
    }
    CreateDraftDet(item:any) {
        return this.formBuilder.group({
            drno: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
           // drbillDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        })
    }
    CreateDraftAddchargeform(item: any): FormGroup {
        return this.formBuilder.group({
            chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            chargesTime: this.datePipe.transform(new Date(), 'shortTime'),
            opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdIpdId: [this.vOPIPId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item?.ServiceId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            price: [item?.Price, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            qty: [item?.Qty, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            classId: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffId: [this.vTariffId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmt: [item?.TotalAmt, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionPercentage: [item?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmount: [item?.DiscAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netAmount: [item?.NetAmount, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            doctorId: [item?.DoctorId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doctorName: [item?.DoctorName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            docPercentage: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            docAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            hospitalAmt: [item?.NetAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            // isPathology: [item?.isPathology],
            // isRadiology: [item?.isRadiology], 
            isPathology: [item?.IsPathology ? 1 : 0],
            isRadiology: [item?.IsRadiology ? 1 : 0],
            isDoctorShareGenerated: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isInterimBillFlag: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isPackage: [Number(item?.IsPackage || 0)],
            packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            packageMainChargeID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrCompanyService: [item?.isSelfOrCompanyService || 0],
            cPrice: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cTotalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isComServ: [false],
            isPrintCompSer: [false],
            chPrice: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chTotalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isBillableCharity: [false],
            salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isGenerated: [true],
            isApprovedByCamp: [false],
            wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceCode: [item?.serviceCode || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            serviceName: [item?.ServiceName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            companyServiceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            isInclusionExclusion: [item?.isInclusionExclusion || false,],
            isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDate: ['1999-01-01'],
            addedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            createdBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    } 
    get draftchargesArray(): FormArray {
        return this.OpDraftSaveForm.get('tDraddCharge') as FormArray;
    }
    get draftdetlist(): FormArray {
        return this.OpDraftSaveForm.get('tDrbillDet') as FormArray;
    }

    DraftbillSave() {
        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to save Draft OPD bill?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const formattedDate = this.datePipe.transform(this.OpBillForm.get('billDate').value, "yyyy-MM-dd");
                const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
                this.OpDraftSaveForm.get('drBill.billDate').setValue(formattedDate);
                this.OpDraftSaveForm.get('drBill.billTime').setValue(formattedDate + ' ' + formattedTime);
                this.OpDraftSaveForm.get('drBill.opdIpdId').setValue(this.vOPIPId)
                this.OpDraftSaveForm.get('drBill.totalAmt')?.setValue(this.OPFooterForm.get('totalAmt')?.value || 0)
                this.OpDraftSaveForm.get('drBill.concessionAmt')?.setValue(this.OPFooterForm.get('concessionAmt')?.value || 0)
                this.OpDraftSaveForm.get('drBill.netPayableAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value || 0)
                this.OpDraftSaveForm.get('drBill.balanceAmt')?.setValue(this.OPFooterForm.get('netPayableAmt')?.value || 0)
                this.OpDraftSaveForm.get('drBill.cashCounterId')?.setValue(this.searchForm.get('CashCounterID')?.value || 0)
                this.OpDraftSaveForm.get('drBill.concessionReasonId')?.setValue(this.ConcessionId)
                this.OpDraftSaveForm.get('drBill.companyId')?.setValue(this.patientDetail?.companyId || 0)
                this.OpDraftSaveForm.get('drBill.tariffId')?.setValue(this.vTariffId)

                if (!this.OpDraftSaveForm.invalid) {
                    if (!(this.DraftdetObj?.drbno || 0)) {
                        this.draftdetlist.clear();
                        this.draftchargesArray.clear();
                        this.dsChargeList.data.forEach(item => {
                            this.draftdetlist.push(this.CreateDraftDet(item as ChargesList));
                            this.draftchargesArray.push(this.CreateDraftAddchargeform(item as ChargesList));
                        });
                        this._AppointmentlistService.InsertOPDraftBilling(this.OpDraftSaveForm.value)
                            .subscribe(response => {
                                console.log(response)
                                this.savebtn = true;
                                this.resetform();
                                this._matDialog.closeAll();
                                this.viewgetOPBillDraftReportPdf(response)
                            });
                    } else {
                        this.OpDraftSaveForm.get('drBill.drbno')?.setValue(this.DraftdetObj?.drbno || 0)
                        this.draftdetlist.clear();
                        this.draftchargesArray.clear();
                        this.dsChargeList.data.forEach(item => {
                            this.draftdetlist.push(this.CreateDraftDet(item as ChargesList));
                            this.draftchargesArray.push(this.CreateDraftAddchargeform(item as ChargesList));
                        });
                        this._AppointmentlistService.InsertEditOPDraftBilling(this.OpDraftSaveForm.value)
                            .subscribe(response => {
                                console.log(response)
                                this.savebtn = true;
                                this.resetform();
                                this._matDialog.closeAll();
                                this.viewgetOPBillDraftReportPdf(response)
                            });
                    } 
                }
                else {
                    let invalidFields = [];
                    if (this.OpDraftSaveForm.invalid) {
                        for (const controlName in this.OpDraftSaveForm.controls) {
                            const control = this.OpDraftSaveForm.get(controlName);
                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`OP Bill Draft Data : ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`OpBill Draft From: ${controlName}`);
                            }
                        }
                    }
                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => {
                            this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                            );
                        });
                        return
                    }
                }
            }
        });
    }
    getdraftlist() {
        var param = {
            "first": 0,
            "rows": 999,
            "sortField": "DRBNo",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "OPD_IPD_ID", "fieldValue": String(this.vOPIPId), "opType": "Equals" },
                { "fieldName": "OPD_IPD_Type", "fieldValue": String(0), "opType": "Equals" },
            ],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._AppointmentlistService.getdraftlist(param).subscribe(response => {
            console.log(response)
            this.dsOpDraftlist.data = response.data as ChargesList[];

        })
    }
    DraftbillCancel(drbno) {
        debugger
        var vdata = {
            "drbno": drbno || 0,
            "isCancelled": true,
            "isCancelledBy": this.accountService.currentUserValue.userId || 0,
            "isCancelledDate": this.datePipe.transform(new Date(), "yyyy-MM-dd") || '1999-01-01'
        }
        this._AppointmentlistService.getDeleteDratfBill(vdata).subscribe((data) => {
            if (data) {
                this.getdraftlist();
            }
        });
    }
    draftChargelist: any = [];
    DraftdetObj:any;
    getdraftchargelist(contact) {
        this.DraftdetObj = contact
        var param = {
            "first": 0,
            "rows": 999,
            "sortField": "ChargesId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "DRBNo", "fieldValue": String(contact?.drbno), "opType": "Equals" },
                { "fieldName": "OPD_IPD_ID", "fieldValue": String(this.vOPIPId), "opType": "Equals" },
                { "fieldName": "OPD_IPD_Type", "fieldValue": String(0), "opType": "Equals" } 
            ],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._AppointmentlistService.getdraftchargeslist(param).subscribe(response => {
            console.log(response)
            this.draftChargelist = response.data as any;
            if(this.draftChargelist.length){
             this.onAddDraftCharges();
            }
        })
    } 

    onAddDraftCharges(): void {
        debugger 
        if (this.dsChargeList.data.length) {
            const hasDuplicate = this.dsChargeList.data.some(element =>
                this.draftChargelist.some(
                    item => item.serviceId === element.ServiceId
                )
            );

            if (hasDuplicate) {
                Swal.fire({
                    title: 'Message',
                    text: 'Selected Service already available in the list',
                    icon: 'warning'
                });
                return; // ✅ stops execution correctly
            }
        } 
        if (this.draftChargelist.length) {
            this.draftChargelist.forEach(element=>{
                 const newRow = {
                    ServiceId: element.serviceId,
                    ServiceName:element.serviceName,
                    Price: element.price,
                    Qty: element.qty,
                    TotalAmt: element.totalAmt,
                    DiscPer: element.concessionPercentage || 0,
                    DiscAmt: element.concessionAmount || 0,
                    NetAmount: element.netAmount,
                    DoctorName: element.doctorName || '-',
                    ClassName: element.classname || '-',
                    DoctorId: element.doctorId,
                    ChargesAddedName: this.accountService.currentUserValue.userName,
                    IsPathology: element.isPathology,
                    IsRadiology: element.isRadiology,
                    IsPackage: element.isPackage,
                    serviceCode: element.companyCode,
                    isInclusionExclusion: element.isInclusionExclusion 
                }; 
                const newCharge = new ChargesList(newRow); 
                this.chargeList.push(newCharge);
                this.dsChargeList.data = this.chargeList;
                this.calculateTotalAmount();
                this.serviceSelct = false
            }) 
        }
    }
    //   "drbno": 40245,
    // "totalAmt": 200,
    // "concessionAmt": 200,
    // "netPayableAmt": 100,
    // "paidAmt": 400,
    // "balanceAmt": 300,
    // "billDate": "2026-01-19T00:00:00",
    // "isCancelled": 1,
    // "pbillNo": "123",
    // "totalAdvanceAmount": 12,
    // "advanceUsedAmount": 13,
    // "addedBy": 0,
    // "cashCounterId": 0,
    // "billTime": "2026-01-19T11:00:00",
    // "concessionReasonId": 0,
    // "isSettled": true,
    // "isPrinted": true,
    // "isFree": true,
    // "companyId": 0,
    // "tariffId": 11,
    // "unitId": 12,
    // "interimOrFinal": 0,
    // "companyRefNo": "234",
    // "concessionAuthorizationName": 0,
    // "taxPer": 1,
    // "taxAmount": 100

    //  "chargesId": 3,
    //     "chargesDate": "2026-01-19T00:00:00",
    //     "chargesTime": "2026-01-19T23:00:00",
    //     "unitId": 1,
    //     "serviceId": 1,
    //     "classId": 1,
    //     "tariffId": 1,
    //     "price": 1,
    //     "qty": 20,
    //     "totalAmt": 0,
    //     "concessionPercentage": 0,
    //     "concessionAmount": 0,
    //     "netAmount": 0,
    //     "doctorId": 0,
    //     "doctorName": "ss",
    //     "docPercentage": 0,
    //     "docAmt": 0,
    //     "hospitalAmt": 0,
    //     "refundAmount": 0,
    //     "isPathology": 0,
    //     "isRadiology": 0,
    //     "isDoctorShareGenerated": 0,
    //     "isInterimBillFlag": 0,
    //     "isPackage": 0,
    //     "packageId": 0,
    //     "packageMainChargeId": 0,
    //     "isSelfOrCompanyService": 0,
    //     "isComServ": true,
    //     "isPrintCompSer": true,
    //     "salesId": 0,
    // "isGenerated": true,
    // "isApprovedByCamp": true,
    // "wardId": 0,
    // "bedId": 0,
    // "serviceCode": "string",
    // "serviceName": "string",
    // "companyServiceName": "string",
    // "isInclusionExclusion": true,
    // "isHospMrk": 0,
    // "billNo": 40265,
    // "isCancelled": true,
    // "isCancelledBy": 0,
    // "isCancelledDate": "2026-01-19T00:00:00",
    // "addedBy": 0,
    // "createdBy": 0 
}

export class ChargesList {
    ChargesId: number;
    ConcessionAmt: any;
    ServiceId: number;
    serviceId: number;
    ServiceName: String;
    Price: any;
    Qty: any;
    isInclusionExclusion: any;
    serviceCode: any;
    TotalAmt: number;
    DiscPer: number;
    DiscAmt: number;
    NetAmount: number;
    DoctorId: number;
    ChargeDoctorName: String;
    ChargesDate: Date;
    IsPathology: any;
    IsRadiology: any;
    ClassId: number;
    ClassName: string;
    ChargesAddedName: string;
    PackageId: any;
    PackageServiceId: any;
    IsPackage: any;
    PacakgeServiceName: any;
    BillwiseTotalAmt: any;
    DoctorName: any;
    OpdIpdId: any;
    serviceName: any;

    RegNo: any;
    PatientName: any;
    BillNo: any;
    TotalBillAmount: any;
    ConcessionAmount: any;
    NetPayableAmt: any;
    ConsultantDocName: any;
    AddedByName: any;
    BillTime: any;
    DiscComments: any;
    PaymentMode: any;
    TokenNo: any;
    RefundAmt: any;
    PaidAmount: any;
    doctorName: any;
    doctorId: any;
    isPathology: any;
    isRadiology: any;
    pacakgeServiceName: any;
    packageServiceId: any;
    price: any;
    packageId: any;
    ConcessionPercentage: any = 0;
    userName: any;
    BalanceAmt: any;
    constructor(ChargesList) {
        this.ChargesId = ChargesList.ChargesId || '';
        this.ServiceId = ChargesList.ServiceId || '';
        this.serviceId = ChargesList.serviceId || '';
        this.ServiceName = ChargesList.ServiceName || '';
        this.Price = ChargesList.Price || '';
        this.Qty = ChargesList.Qty || '';
        this.TotalAmt = ChargesList.TotalAmt || '';
        this.DiscPer = ChargesList.DiscPer || '';
        this.DiscAmt = ChargesList.DiscAmt || '';
        this.NetAmount = ChargesList.NetAmount || '';
        this.DoctorId = ChargesList.DoctorId || 0;
        this.DoctorName = ChargesList.DoctorName || '';
        this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
        this.ChargesDate = ChargesList.ChargesDate || '';
        this.IsPathology = ChargesList.IsPathology || '';
        this.IsRadiology = ChargesList.IsRadiology || '';
        this.ClassId = ChargesList.ClassId || 0;
        this.ClassName = ChargesList.ClassName || '';
        this.ChargesAddedName = ChargesList.ChargesAddedName || '';
        this.PackageId = ChargesList.PackageId || 0;
        this.PackageServiceId = ChargesList.PackageServiceId || 0;
        this.IsPackage = ChargesList.IsPackage || 0;
        this.ConcessionAmt = ChargesList.ConcessionAmt || 0;
        this.PacakgeServiceName = ChargesList.PacakgeServiceName || '';
        this.OpdIpdId = ChargesList.OpdIpdId || '';
        this.serviceName = ChargesList.serviceName || ''
        this.ConcessionPercentage = ChargesList.ConcessionPercentage || 0;
        this.pacakgeServiceName = ChargesList.pacakgeServiceName || '';
        this.packageServiceId = ChargesList.packageServiceId || 0;
        this.price = ChargesList.price || 0;
        this.packageId = ChargesList.packageId || '';
        this.doctorName = ChargesList.doctorName || 0;
        this.BalanceAmt = ChargesList.BalanceAmt || 0;
        this.doctorId = ChargesList.doctorId || 0;
        this.serviceCode = ChargesList.serviceCode || 0;
        this.isInclusionExclusion = ChargesList.isInclusionExclusion || '';
        this.isPathology = ChargesList.isPathology || 0;
        this.isRadiology = ChargesList.isRadiology || 0;
        this.userName = ChargesList.userName || '';

        this.RegNo = ChargesList.RegNo || 0;
        this.BillNo = ChargesList.BillNo || 0;
        this.PatientName = ChargesList.PatientName || '';
        this.TotalBillAmount = ChargesList.TotalBillAmount || 0;
        this.ConcessionAmount = ChargesList.ConcessionAmount || 0;
        this.NetPayableAmt = ChargesList.NetPayableAmt || 0;
        this.ConsultantDocName = ChargesList.ConsultantDocName || '';
        this.AddedByName = ChargesList.AddedByName || '';
        this.DiscComments = ChargesList.DiscComments || '';
        this.PaymentMode = ChargesList.PaymentMode || 0;
        this.TokenNo = ChargesList.TokenNo || 0;
        this.RefundAmt = ChargesList.RefundAmt || 0;

    }
}
export class PaymentInsert {
    PaymentId: number;
    BillNo: number;
    ReceiptNo: String;
    PaymentDate: any;
    PaymentTime: any;
    CashPayAmount: number;
    ChequePayAmount: number;
    ChequeNo: String;
    BankName: String;
    ChequeDate: any;
    CardPayAmount: number;
    CardNo: String;
    CardBankName: String;
    CardDate: any;
    AdvanceUsedAmount: number;
    AdvanceId: number;
    RefundId: number;
    TransactionType: number;
    Remark: String;
    AddBy: number;
    IsCancelled: Boolean;
    IsCancelledBy: number;
    IsCancelledDate: any;
    CashCounterId: number;
    IsSelfORCompany: number;
    CompanyId: number;
    NEFTPayAmount: any;
    NEFTNo: String;
    NEFTBankMaster: String;
    NEFTDate: any;
    PayTMAmount: number;
    PayTMTranNo: String;
    PayTMDate: any;

    /**
    * Constructor
    *
    * @param PaymentInsertObj
    */
    constructor(PaymentInsertObj) {
        {
            this.PaymentId = PaymentInsertObj.PaymentId || 0;
            this.BillNo = PaymentInsertObj.BillNo || 0;
            this.ReceiptNo = PaymentInsertObj.ReceiptNo || 0;
            this.PaymentDate = PaymentInsertObj.PaymentDate || '';
            this.PaymentTime = PaymentInsertObj.PaymentTime || '';
            this.CashPayAmount = PaymentInsertObj.CashPayAmount || 0;
            this.ChequePayAmount = PaymentInsertObj.ChequePayAmount || 0;
            this.ChequeNo = PaymentInsertObj.ChequeNo || '';
            this.BankName = PaymentInsertObj.BankName || '';
            this.ChequeDate = PaymentInsertObj.ChequeDate || '';
            this.CardPayAmount = PaymentInsertObj.CardPayAmount || 0;
            this.CardNo = PaymentInsertObj.CardNo || 0;
            this.CardBankName = PaymentInsertObj.CardBankName || '';
            this.CardDate = PaymentInsertObj.CardDate || '';
            this.AdvanceUsedAmount = PaymentInsertObj.AdvanceUsedAmount || 0;
            this.AdvanceId = PaymentInsertObj.AdvanceId || 0;
            this.RefundId = PaymentInsertObj.RefundId || 0;
            this.TransactionType = PaymentInsertObj.TransactionType || 0;
            this.Remark = PaymentInsertObj.Remark || '';
            this.AddBy = PaymentInsertObj.AddBy || 0;
            this.IsCancelled = PaymentInsertObj.IsCancelled || false;
            this.IsCancelledBy = PaymentInsertObj.IsCancelledBy || 0;
            this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
            this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
            this.CashCounterId = PaymentInsertObj.CashCounterId || 0;
            this.IsSelfORCompany = PaymentInsertObj.IsSelfORCompany || 0;
            this.CompanyId = PaymentInsertObj.CompanyId || 0;
            this.NEFTPayAmount = PaymentInsertObj.NEFTPayAmount || 0;
            this.NEFTNo = PaymentInsertObj.NEFTNo || '';
            this.NEFTBankMaster = PaymentInsertObj.NEFTBankMaster || '';
            this.NEFTDate = PaymentInsertObj.NEFTDate || '';
            this.PayTMAmount = PaymentInsertObj.PayTMAmount || 0;
            this.PayTMTranNo = PaymentInsertObj.PayTMTranNo || '';
            this.PayTMDate = PaymentInsertObj.PayTMDate || '';
        }

    }
}
