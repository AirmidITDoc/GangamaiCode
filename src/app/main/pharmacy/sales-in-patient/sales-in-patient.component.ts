import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { UserDetail } from 'app/main/administration/create-user/nuser/nuser.component';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { parseInt } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { BrowsSalesBillService } from '../brows-sales-bill/brows-sales-bill.service';
import { PrescriptionComponent } from '../sales-hopsital-new/prescription/prescription.component';
import { BalAvaListStore, DraftSale, Printsal, SalesBatchItemModel, SalesItemModel } from '../sales-hopsital-new/types';
import { SalesHospitalKenyaService } from '../sales-hospital-kenya/sales-hospital-kenya.service';
import { SalesbatchpopupComponent } from '../sales-hospital-kenya/salesbatchpopup/salesbatchpopup.component';
import { SubstitutesComponent } from '../sales/substitutes/substitutes.component';
import { SalesInPatientService } from './sales-in-patient.service';

@Component({
    selector: 'app-sales-in-patient',
    templateUrl: './sales-in-patient.component.html',
    styleUrls: ['./sales-in-patient.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SalesInPatientComponent implements OnInit {
    // Display Columns
    DraftSaleDisplayedCol: string[] = ['Action', 'UHID', 'PatientName', 'NetAmt', 'MobileNo', 'UserName', 'DraftClose'];
    selectedSaleDisplayedCol = ['ItemName', 'BatchNo', 'BatchExpDate', 'Qty', 'UnitMRP', 'GSTPer', 'GSTAmount', 'TotalMRP', 'DiscPer', 'DiscAmt', 'NetAmt', 'buttons'];
    DraftAvbStkListDisplayedCol = ['StoreName', 'BalQty'];
    // View Children
    @ViewChild('qtyInputRef') qtyInputRef: ElementRef;
    @ViewChild('discAmount') discAmount: ElementRef;
    @ViewChild('ConseId') ConseId: ElementRef;
    @ViewChild('drawer') public drawer: MatDrawer;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('billTemplate2') billTemplate2: ElementRef;
    @ViewChild('discamt') discamt: ElementRef;
    @ViewChild('doctorname') doctorname: ElementRef;
    @ViewChild('mobileno') mobileno: ElementRef;
    @ViewChild('disper') disper: ElementRef;
    @ViewChild('discamount') discamount: ElementRef;
    @ViewChild('patientname') patientname: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('itemid') itemid: ElementRef;
    @ViewChild('addbutton') addbutton: ElementRef;

    // Form Groups
    ItemSubform: FormGroup;

    // Data Sources  
    saleSelectedDatasource = new MatTableDataSource<IndentList>();
    tempDatasource = new MatTableDataSource<IndentList>();
    chargeslist = new MatTableDataSource<IndentList>();
    dsDraftList = new MatTableDataSource<DraftSale>();
    dsBalAvaListStore = new MatTableDataSource<BalAvaListStore>();
    dsItemNameList1 = new MatTableDataSource<IndentList>();



    // Patient Related 
    Focusstatus: boolean = true
    NetPayBillAmt:any=0;
    type: any;
    PatientName: any;
    MobileNo: any;
    DoctorName: any;
    RegId: any = '';
    IPMedID: any;
    OPDNo: any;
    RegNo: any;
    IPDNo: any;
    Itemchargeslist: any = [];
    Tempchargeslist: any = [];
    StoreName: any;
    NetAmt: any = 0;
    TotalMRP: any = 0;
    ItemObj: IndentList;
    v_marginamt: any = 0;
    TotalCreditAmt: any = 0;
    DayLimit: any = 0;
    DayBalance: any = 0;
    TotalAdvanceAmt: any = 0;
    TotalBalanceAmt: any = 0;
    PatientHeaderObj: any;
    StockId: any;
    Draftchk: boolean = true;
    saveflag: boolean = true
    ConShow: boolean = false;
    Creditflag: boolean = false;
    Addflag: boolean = false;
    vBarcodeflag: boolean = false;
    Itemflag: boolean = false;
    barcodeflag: boolean = false;
    add: boolean = false;
    sIsLoading: string = '';
    currentDate = new Date();
    DraftID: any = 0;
    vBarcode: any;
    chargeslistBarcode: any = [];
    dateTimeObj: any;
    LandedRateandedTotal: any = 0;
    PurchaseRate: any;
    PurTotAmt: any = 0;
    GSTAmount: any;
    CGSTAmt: any;
    SGSTAmt: any;
    IGSTAmt: any;
    VatPer: any;
    CgstPer: any;
    SgstPer: any;
    IgstPer: any;
    QtyBalchk: any = 0;
    DraftQty: any = 0;
    RQty: any = 0;
    OP_IP_Id: any = 0;
    OP_IPType: any = 2;
    screenFromString = 'Pharmacy-form';
    vextAddress: any = '';
    ConcessionReasonList: any = [];

    // Print Related   
    reportPrintObj: Printsal;
    subscriptionArr: Subscription[] = [];
    printTemplate: any;
    reportPrintObjList: Printsal[] = [];
    SalesIDObjList: Printsal[] = [];
    Filepath: any;
    reportItemPrintObj: Printsal;
    reportPrintObjItemList: Printsal[] = [];
    repeatItemList: IndentList[] = [];
    HospitalId: any = 0;
    wardId: any = 0;
    bedId: any = 0;
    PatientTypeId: any = 0;
    // Pharmacy Options
    Patientdetails: any;
    vSelectedOption: any = '1';
    currency: any = '';
    PharmaSalesForm: FormGroup;
    PharmaSalesDraftForm: FormGroup
    selectedItem: SalesBatchItemModel;
    selectedTableRowItem: IndentList;
    autocompletestore: string = 'Store';
    autocompleteModeConcession: string = "Concession";
    autocompleteModeCreditReason: string = "CreditReason";


    constructor(
        public _BrowsSalesBillService: BrowsSalesBillService,
        public _salesService: SalesHospitalKenyaService,
        public _salesInPatientService: SalesInPatientService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        public _RequestforlabtestService: RequestforlabtestService,
        public toastr: ToastrService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public _ConfigService: ConfigService,
        public commonService: PrintserviceService
    ) { }

    ngOnInit(): void {
        this.getSalesFooterform();
        this.getStoredet();
        this.getDraftorderList();
        this.getAccessDetail();

        this.PharmaSalesForm = this.CreatePharmasalesform();
        this.PharmaSalesDraftForm = this.CreatePharmasalesDraftform();
        this.ItemSubform.markAllAsTouched();
        this._salesService.ItemSearchGroup.markAllAsTouched();
        this.ItemAddForm = this.createItemAddTable()
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue
    }
    ngOnDestroy() {
        this.ItemFormreset();
        this.Formreset();
    }
    //sales footer form
    getSalesFooterform() {
        this.ItemSubform = this.formBuilder.group({
            FinalDiscPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            CashPay: ['Credit'],
            referanceNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            PaidbyPatient: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            PaidbacktoPatient: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            roundoffAmt: [0],
            opIpType: ['1', [this._FormvalidationserviceService.onlyNumberValidator()]],
            totalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            vatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            netAmount: [0],
            paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            externalPatientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            doctorName: [''],
            regId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            extMobileNo: ['', [Validators.required, Validators.min(0), Validators.max(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), this._FormvalidationserviceService.onlyNumberValidator()]],
            extAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            ExternalPatID: [''],
            IsPurchaseWsie: [false],
            CredirReasonId: [0],
            CredirReasonName: [0],
            IsSupplimentryBill: false
        });
    }
    //sales save form
    CreatePharmasalesform() {
        return this.formBuilder.group({
            //Sales header
            sales: this.formBuilder.group({
                salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                date: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
                time: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                opIpId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                opIpType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
                totalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                vatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                discAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                netAmount: [0],
                paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                concessionAuthorizationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSellted: [true],
                isPrint: [true],
                isFree: [true],
                unitId: [this._loggedService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                externalPatientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                isPrescription: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this._loggedService.currentUserValue.userId],
                creditReason: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                creditReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                discperH: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isPurBill: [false],
                isBillCheck: [true],
                salesHeadName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                salesTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                regId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                extMobileNo: ['', [Validators.minLength(10), Validators.maxLength(10), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                roundOff: [0],
                extAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                tSalesInpatientDetails: this.formBuilder.array([]),

            }),
            prescription: this.formBuilder.group({
                opIpId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isClosed: [true]
            }),
            //Sales draft
            salesDraft: this.formBuilder.group({
                dsalesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isClosed: [true]
            }),
            //Sales current stock
            tCurrentStock: this.formBuilder.array([]),
        })
    }
    CreateSalesDetailsform(item: IndentList) {
        return this.formBuilder.group({
            salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            batchNo: [item?.BatchNo, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            batchExpDate: [this.datePipe.transform(item.BatchExpDate, 'yyyy-MM-dd'), [this._FormvalidationserviceService.validDateValidator()]],
            unitMrp: [item?.UnitMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            qty: [item?.Qty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            totalAmount: [item?.TotalMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            vatPer: [item?.VatPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            vatAmount: [item?.VatAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discPer: [item?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discAmount: [item?.DiscAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            grossAmount: [item?.NetAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            landedPrice: [item?.LandedRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totalLandedAmount: [item?.LandedRateandedTotal, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            returnQty: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            purRateWf: [item?.PurchaseRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            purTotAmt: [item?.PurTotAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            cgstper: [item?.CgstPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            cgstamt: [item?.CGSTAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            sgstper: [item?.SgstPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            sgstamt: [item?.SGSTAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            igstper: [item?.IgstPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            igstamt: [item?.IGSTAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            isPurRate: [true],
            stkId: [item?.StockId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            mrp: [item?.MRPRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            mrpTotal: [item?.MRPRateTotal, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        })
    }
    CreateCurrentStockForm(item: any) {
        return this.formBuilder.group({
            itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            issueQty: [item?.Qty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            iStkId: [item?.StockId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
        })

    }
    // Getters 
    get SalesDetailsAarry(): FormArray {
        return this.PharmaSalesForm.get('sales.tSalesInpatientDetails') as FormArray;
    }
    get CurrentStockArray(): FormArray {
        return this.PharmaSalesForm.get('tCurrentStock') as FormArray;
    }
    // Getters 
    get SalesDraftDetailsAarry(): FormArray {
        return this.PharmaSalesDraftForm.get('salesDraftDet') as FormArray;
    }
    //sales draft save form
    CreatePharmasalesDraftform() {
        return this.formBuilder.group({
            //Sales Draft header
            salesDraft: this.formBuilder.group({
                dsalesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                date: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
                time: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                opIpId: [2, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                opIpType: [2, [this._FormvalidationserviceService.onlyNumberValidator]],
                totalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                vatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                discAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                netAmount: [0],
                paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                concessionAuthorizationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSellted: [true],
                isPrint: [true],
                unitId: [this._loggedService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this._loggedService.currentUserValue.userId],
                externalPatientName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                doctorName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                storeId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                creditReason: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                creditReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isClosed: [false],
                isPrescription: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                wardId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                bedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                extMobileNo: ['', [Validators.minLength(10), Validators.maxLength(10), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                extAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            }),
            //Sales draft details
            salesDraftDet: this.formBuilder.array([]),
        })
    }
    CreateDraftDetails(item: any) {
        return this.formBuilder.group({
            dsalesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            batchNo: [item?.BatchNo, [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            batchExpDate: [this.datePipe.transform(item.BatchExpDate, 'yyyy-MM-dd'), [this._FormvalidationserviceService.validDateValidator()]],
            unitMrp: [item?.UnitMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            qty: [item?.Qty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            totalAmount: [item?.TotalMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            vatPer: [item?.VatPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            vatAmount: [item?.VatAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discPer: [item?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discAmount: [item?.DiscAmt || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            grossAmount: [item?.NetAmt, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            landedPrice: [item?.LandedRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totalLandedAmount: [item?.LandedRateandedTotal, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            purRateWf: [item?.PurchaseRate ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            purTotAmt: [item?.PurTotAmt ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
        })
    }

    getSelectedObjRegIP(obj) {
        console.log(obj);
        let IsDischarged = 0;
        IsDischarged = obj.isDischarged;
        if (IsDischarged == 1) {
            Swal.fire('Selected Patient is already discharged');
            this.RegId = '';
        } else {
            this.Patientdetails = obj;
            this.PatientName = obj.firstName + ' ' + obj.lastName;
            this.RegId = obj.regID;
            this.OP_IP_Id = obj.admissionID;
            this.IPDNo = obj.ipdNo;
            this.DoctorName = obj.doctorName;
            this.HospitalId = obj.hospitalID;
            this.wardId = obj.wardId;
            this.bedId = obj.bedId;
            this.RegNo = obj?.regNo;
            this.PatientTypeId = obj?.patientTypeID
        }
        this.getBillSummary(obj?.admissionID);
        this.ItemFormreset();
        this.saleSelectedDatasource.data = [];
        this.Itemchargeslist = [];
        this.saveflag = false;
        this.getDraftorderList();
    }
    onItemChange(event: SalesItemModel): void {
        this._salesService.ItemSearchGroup.patchValue({
            BatchNo: '',
            Qty: [1],
            MRP: '',
            TotalMrp: '',
            DiscAmt: ' ',
            NetAmt: '',
            DiscPer: '',
            MarginAmt: '0',
        })
        this.getBatch(event.itemId, event.storeId);
        this.m_getBalAvaListStore(event.itemId)
    }
    // NOTE: If `isEditable` true then it means this popup will open for table row data 
    getBatch(itemId: number, storeId: number, isEditable = false) {
        const dialogRef = this._matDialog.open(SalesbatchpopupComponent, {
            maxWidth: '950px',
            minWidth: '900px',
            width: '900px',
            height: '380px',
            disableClose: true,
            data: {
                ItemId: itemId,
                StoreId: storeId,
                PatientTypeId: this.PatientTypeId
            },
        });
        dialogRef.afterClosed().subscribe((result1) => {
            const isEscaped = result1.vEscflag;
            if (isEscaped && !isEditable) {
                this._salesService.ItemSearchGroup.get('ItemId').setValue('');
                return;
            }
            const result = result1.selectedData as SalesBatchItemModel;
            const isAlreadyExists = this.Itemchargeslist.find((i) => i.StockId === result.stockId && i.ItemId === result.itemId);
            if (isAlreadyExists) {
                this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                if (!isEditable) {
                    const ItemIdElement = document.querySelector(`[name='ItemId']`) as HTMLElement;
                    if (ItemIdElement) {
                        ItemIdElement.focus();
                    }
                    this.ItemFormreset();
                }
                return;
            }
            // const QtyElement = this.getElementByName(isEditable ? 'tableQty' : 'Qty') as HTMLInputElement;
            const QtyElement = this.getElementByName(isEditable ? 'tableQty' : 'Qty') as HTMLElement;
            if (QtyElement) {
                QtyElement.focus();
            }
            this.selectedItem = result;
            let MRP = 0;
            let IsPurRate = 0;
            if (this.ItemSubform.get('IsPurchaseWsie').value == true) {
                MRP = +result?.landedRate;
                IsPurRate = 1;
            } else {
                MRP = result.unitMRP;
                IsPurRate = 1;
            }
            if (isEditable) {
                // If it is table row then update new values
                const updatedItem = {
                    ItemName: result.itemName,
                    BatchNo: result.batchNo,
                    BatchExpDate: this.datePipe.transform(result.batchExpDate, 'MM-dd-yyyy'),
                    GSTPer: result.cgstPer + result.sgstPer + result.igstPer,
                    UnitMRP: result.unitMRP,
                    CgstPer: result.cgstPer,
                    SgstPer: result.sgstPer,
                    IgstPer: result.igstPer,
                    StockId: result.stockId,
                    LandedRate: result.landedRate,
                    PurchaseRate: result.purchaseRate,
                } as IndentList;

                Object.assign(this.selectedTableRowItem, updatedItem);
                this.calculateCellNetAmount(this.selectedTableRowItem);
                this.getCellCalculation(this.selectedTableRowItem);
                this.selectedTableRowItem = null;
                return;
            }
            console.log(this.selectedItem)
            this.ItemAddForm = this.createItemAddTable()
            this._salesService.ItemSearchGroup.patchValue({
                BatchNo: result.batchNo,
                BatchExpDate: this.datePipe.transform(result.batchExpDate, 'yyyy-MM-dd'),
                BalanceQty: result.balanceQty,
                Qty: '',
                DiscAmt: 0,
                GSTPer: result.vatPercentage,
                MRP: MRP,
                MRPRate: result.unitMRP,
                IsPurRate: IsPurRate
            })
        });
    }
    calculateTotalAmt() {
        const formvalues = this._salesService.ItemSearchGroup.value;
        const qty = +formvalues.Qty;
        if (qty > formvalues.BalanceQty) {
            Swal.fire({
                icon: "warning",
                title: "Enter Qty less than Balance Qty",
                showConfirmButton: false,
                timer: 2000
            });
            this.ItemFormreset();
            return
        }
        let TotalMRP = '0';
        let LandedRateandedTotal = '0';
        let MRPRateTotal = '0';
        let marginamt = '0';
        let PurTotAmt = '0';
        let GSTAmount = '0';
        let CGSTAmt = '0';
        let SGSTAmt = '0';
        let IGSTAmt = '0';
        if (qty && formvalues?.MRP) {
            TotalMRP = (qty * formvalues?.MRP).toFixed(2);
            LandedRateandedTotal = (qty * this.selectedItem?.landedRate).toFixed(2);
            MRPRateTotal = (qty * formvalues?.MRPRate).toFixed(2);
            marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
            PurTotAmt = (qty * this.selectedItem?.purchaseRate).toFixed(2);
            GSTAmount = (((parseFloat(TotalMRP) * formvalues?.GSTPer) / 100)).toFixed(2);
            CGSTAmt = (((parseFloat(TotalMRP) * this.selectedItem?.cgstPer) / 100)).toFixed(2);
            SGSTAmt = (((parseFloat(TotalMRP) * this.selectedItem?.sgstPer) / 100)).toFixed(2);
            IGSTAmt = (((parseFloat(TotalMRP) * this.selectedItem?.igstPer) / 100)).toFixed(2);
        } else if (!qty || qty == 0) {
            TotalMRP = '0';
            LandedRateandedTotal = '0';
            marginamt = '0';
            PurTotAmt = '0';
            GSTAmount = '0';
            CGSTAmt = '0';
            SGSTAmt = '0';
            IGSTAmt = '0';
        }
        this._salesService.ItemSearchGroup.patchValue({
            TotalMrp: TotalMRP,
            NetAmt: TotalMRP,
            MarginAmt: marginamt,
            GSTAmount: GSTAmount,
            LandedRateandedTotal: LandedRateandedTotal,
            CGSTAmt: CGSTAmt,
            SGSTAmt: SGSTAmt,
            IGSTAmt: IGSTAmt,
            PurTotAmt: PurTotAmt,
            MRPRateTotal: MRPRateTotal
        })
    }
    checkQtyBeforeNext(event: KeyboardEvent) {
        const qtyControl = this._salesService.ItemSearchGroup.get('Qty');

        if (!qtyControl?.value || qtyControl.value <= 0) {
            event.preventDefault(); // stop Enter/Tab action
            const qtyInput = (event.target as HTMLElement);
            qtyInput.focus(); // keep focus on same field
            // Optionally show a message
            // this._toastr.warning('Please enter quantity before continuing.');
        }
    }

    public discperCal(): void {
        const formValue = this._salesService.ItemSearchGroup.value;
        const discPer = Number(formValue.DiscPer);
        if ((formValue?.MarginAmt ?? 0) <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Discount not allowed!',
                text: `Margin amount is zero. Please review the pricing before applying a discount.`,
                timer: 3000, // auto close after 3 seconds
                timerProgressBar: true,
                showConfirmButton: false,
            });
            this._salesService.ItemSearchGroup.patchValue({ DiscAmt: 0, DiscPer: '', NetAmt: formValue.TotalMrp });
            return
        }
        if (discPer < 0 && discPer > 100 || formValue.DiscPer == '') {
            this.toastr.warning('Discount % should less than 100% & greater than 0', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this._salesService.ItemSearchGroup.patchValue({
                DiscAmt: 0,
                DiscPer: '',
                NetAmt: formValue.TotalMrp
            });
            this.ConShow = false;
            return;
        }
        if (formValue.TotalMrp && discPer > 0) {
            // Calculate discount amount from percentage
            const DiscAmt = ((formValue.TotalMrp * discPer) / 100).toFixed(2);
            if (Number(DiscAmt) > Number(formValue?.MarginAmt ?? 0)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Discount exceeds margin!',
                    text: `Entered discount amount exceeds the margin. Maximum allowed is ₹${formValue?.MarginAmt}`,
                    timer: 3000, // auto close after 3 seconds
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                this._salesService.ItemSearchGroup.patchValue({ DiscAmt: 0, DiscPer: '', NetAmt: formValue.TotalMrp });
                return
            }
            this._salesService.ItemSearchGroup.patchValue({
                DiscAmt: DiscAmt,
            });
            this.ConShow = true;
            this.calculateNetAmount();
        }
    }
    private calculateNetAmount(): void {
        const formValue = this._salesService.ItemSearchGroup.value;
        if (formValue.TotalMrp) {
            const NetAmt = (formValue.TotalMrp - (formValue.DiscAmt || 0)).toFixed(2);
            this._salesService.ItemSearchGroup.patchValue({
                NetAmt: NetAmt,
            });
        }
    }
    public CaldiscAmount(): void {
        const formValue = this._salesService.ItemSearchGroup.value;
        const discAmt = Number(formValue.DiscAmt);

        if ((formValue?.MarginAmt ?? 0) <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Discount not allowed!',
                text: `Margin amount is zero. Please review the pricing before applying a discount.`,
                timer: 3000, // auto close after 3 seconds
                timerProgressBar: true,
                showConfirmButton: false,
            });
            this._salesService.ItemSearchGroup.patchValue({ DiscAmt: '', DiscPer: 0, NetAmt: formValue.TotalMrp });
            return
        }
        if (discAmt > (formValue?.MarginAmt ?? 0)) {
            Swal.fire({
                icon: 'warning',
                title: 'Discount exceeds margin!',
                text: `Entered discount amount exceeds the margin. Maximum allowed is ₹${formValue?.MarginAmt}`,
                timer: 3000, // auto close after 3 seconds
                timerProgressBar: true,
                showConfirmButton: false,
            });
            this._salesService.ItemSearchGroup.patchValue({ DiscAmt: '', DiscPer: 0, NetAmt: formValue.TotalMrp });
            return
        }
        if (discAmt < 0 || discAmt > Number(formValue.TotalMrp) || formValue.DiscAmt == '') {
            this.toastr.warning('Discount amount should less then Total MRP', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this._salesService.ItemSearchGroup.patchValue({ DiscAmt: '', DiscPer: 0, NetAmt: formValue.TotalMrp });
            return;
        }
        if (formValue.TotalMrp && discAmt) {
            // Calculate discount percentage from amount
            const DiscPer = ((formValue.DiscAmt / formValue.TotalMrp) * 100).toFixed(2);
            this._salesService.ItemSearchGroup.patchValue({
                DiscPer: DiscPer,
            });
            this.calculateNetAmount();
        }
    }
    //Add Item list
    ItemAddForm: FormGroup;
    createItemAddTable() {
        return this.formBuilder.group({
            ItemId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            ItemName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            BatchNo: [this.selectedItem?.batchNo, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            BatchExpDate: [this.datePipe.transform(this.selectedItem?.batchExpDate, 'yyyy-MM-dd'), [this._FormvalidationserviceService.validDateValidator()]],
            Qty: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            UnitMRP: [this.selectedItem?.unitMRP, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            GSTPer: [(this.selectedItem?.cgstPer + this.selectedItem?.sgstPer), [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            GSTAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            TotalMRP: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DiscPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            DiscAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            NetAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            RoundNetAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            StockId: [this.selectedItem?.stockId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            VatPer: [this.selectedItem?.vatPercentage, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            VatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            LandedRate: [this.selectedItem?.landedRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            LandedRateandedTotal: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            CgstPer: [this.selectedItem?.cgstPer, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            CGSTAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            SgstPer: [this.selectedItem?.sgstPer, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            SGSTAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            IgstPer: [this.selectedItem?.igstPer, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            IGSTAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            PurchaseRate: [this.selectedItem?.purchaseRate, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            PurTotAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            MarginAmt: [0],
            BalanceQty: [this.selectedItem?.balanceQty, [this._FormvalidationserviceService.onlyNumberValidator()]],
            SalesDraftId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            StoreId: [this.selectedItem?.storeId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            MRP: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            MRPRate: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            MRPRateTotal: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        })
    }

    handleEnterKey(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const ItemIdElement = event.target as HTMLInputElement;

            if (!ItemIdElement.value || ItemIdElement.value.trim() === '') {
                event.preventDefault(); // stop next focus
                ItemIdElement.focus();
                return;
            }

            const nextElement = document.querySelector(`[name='Qty']`) as HTMLElement;
            nextElement?.focus();
        }
    }

    OnAddItem() {
        if (this.saleSelectedDatasource.data.length > 0) {
            this.saleSelectedDatasource.data.forEach((element) => {
                if (element.StockId == this.StockId) {
                    this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    this.ItemFormreset();
                    return;
                }
            });
        }
        if (this._salesService.ItemSearchGroup.invalid) {
            const invalidFields = [];
            if (this._salesService.ItemSearchGroup.invalid) {
                for (const controlName in this._salesService.ItemSearchGroup.controls) {
                    if (this._salesService.ItemSearchGroup.controls[controlName].invalid) {
                        invalidFields.push(`${controlName}`);
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
        const formValue = this._salesService.ItemSearchGroup.value;
        this.ItemAddForm.patchValue({
            ItemId: formValue.ItemId.itemId,
            ItemName: formValue.ItemId.itemName,
            Qty: formValue.Qty,
            UnitMRP: formValue.MRP,
            GSTAmount: formValue.GSTAmount || 0,
            TotalMRP: formValue.TotalMrp,
            DiscPer: formValue.DiscPer || '',
            DiscAmt: formValue.DiscAmt || 0,
            NetAmt: formValue.NetAmt,
            GSTPer: formValue.GSTPer || 0,
            VatPer: formValue.GSTPer || 0,
            RoundNetAmt: Math.round(formValue.NetAmt),
            VatAmount: formValue.GSTAmount || 0,
            LandedRateandedTotal: formValue.LandedRateandedTotal,
            CGSTAmt: formValue.CGSTAmt || 0,
            SGSTAmt: formValue.SGSTAmt || 0,
            IGSTAmt: formValue.IGSTAmt || 0,
            PurTotAmt: formValue.PurTotAmt,
            MarginAmt: formValue.MarginAmt,
            MRP: formValue.MRP,
            MRPRate: formValue.MRPRate,
            MRPRateTotal: formValue.MRPRateTotal,
            IsPurRate: formValue.IsPurRate
        })
        console.log(this.ItemAddForm.value)
        if (!this.vBarcodeflag) {
            if (this.ItemAddForm.valid) {
                this.Itemchargeslist.push(this.ItemAddForm.value)
                this.saleSelectedDatasource.data = this.Itemchargeslist;
            } else {
                const invalidFields = [];
                if (this.ItemAddForm.invalid) {
                    for (const controlName in this.ItemAddForm.controls) {
                        if (this.ItemAddForm.controls[controlName].invalid) {
                            invalidFields.push(`${controlName}`);
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
            this.add = false;
            this.ItemFormreset();
            this.getUpdateNetAmtSum(this.saleSelectedDatasource.data)
            this._salesService.ItemSearchGroup.markAllAsTouched()
            const ItemIdElement = document.querySelector(`[name='ItemId']`) as HTMLElement;
            if (ItemIdElement) {
                ItemIdElement.focus();
            }
        }
        this.saveflag = false;
    }
    ItemFormreset() {
        this._salesService.ItemSearchGroup.patchValue({
            ItemId: [''],
            ItemName: '',
            BatchNo: '',
            BatchExpDate: '01/01/1900',
            BalanceQty: '',
            Qty: [1],
            GSTPer: '',
            MRP: '',
            TotalMrp: '',
            DiscAmt: ' ',
            NetAmt: '',
            DiscPer: '',
            MarginAmt: '0',
            GSTAmount: '0',
            LandedRateandedTotal: '0',
            CGSTAmt: '0',
            SGSTAmt: '0',
            IGSTAmt: '0',
            PurTotAmt: '0',
        })
        this._salesService.ItemSearchGroup.get('ItemId').reset('');
        this.dsBalAvaListStore.data = [];

    }
    Formreset() {
        this.ItemSubform.reset();
        this.RegId = '';
        this.PatientName = '';
        this.DoctorName = '';
        this.ItemSubform.get('opIpType').setValue('1');
        this.Draftchk = true;
        this.ConShow = false;
        this.ItemSubform.get('CashPay').setValue('Credit');
        this.ItemSubform.get('concessionReasonId').clearValidators();
        this.ItemSubform.get('concessionReasonId').updateValueAndValidity();
        this.ItemSubform.get('concessionReasonId').disable();
        this.ItemSubform.get('roundoffAmt').setValue(0);
        this.saleSelectedDatasource.data = [];
        this.Itemchargeslist = [];
        this.getDraftorderList();
        this.TotalAdvanceAmt = 0;
        this.TotalBalanceAmt = 0;
        this.TotalCreditAmt = 0;
        this.PatientTypeId = 0;
        this.DayLimit = 0;
        this.DayBalance = 0;
        this.saveflag = true
        this.NoStockItemlist = [];
        this.DraftID = 0;
    }
    deleteTableRow(event, element) {
        const index = this.Itemchargeslist.indexOf(element);
        if (index >= 0) {
            this.Itemchargeslist.splice(index, 1);
            this.saleSelectedDatasource.data = [];
            this.saleSelectedDatasource.data = this.Itemchargeslist;
        }
        Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');
        this.getUpdateNetAmtSum(this.saleSelectedDatasource.data)
    }
    isdiscAmount: boolean = false;
    getUpdateNetAmtSum(data) {
        debugger
        const itemData = data
        const FinalNetAmt = itemData.reduce((sum, { NetAmt }) => (sum += +(NetAmt || 0)), 0).toFixed(2);
        const FinalTotalAmt = itemData.reduce((sum, { TotalMRP }) => (sum += +(TotalMRP || 0)), 0).toFixed(2);
        const FinalDiscAmt = itemData.reduce((sum, { DiscAmt }) => (sum += +(DiscAmt || 0)), 0).toFixed(2);
        const FinalGSTAmt = itemData.reduce((sum, { GSTAmount }) => (sum += +(GSTAmount || 0)), 0).toFixed(2);
        const roundoffAmt = (Math.round(FinalNetAmt) - FinalNetAmt).toFixed(2);
        this.NetPayBillAmt = Math.round(FinalNetAmt)
        this.ItemSubform.patchValue({
            roundoffAmt: roundoffAmt,
            totalAmount: FinalTotalAmt,
            vatAmount: FinalGSTAmt,
            netAmount: FinalNetAmt 
        })
        if (Number(FinalDiscAmt > 0)) {
            this.ItemSubform.patchValue({ discAmount: FinalDiscAmt })
            this.ConShow = true;
            this.ItemSubform.get('FinalDiscPer').disable();
            this.isdiscAmount = true;
            this.ItemSubform.get('concessionReasonId').reset();
            this.ItemSubform.get('concessionReasonId').setValidators([Validators.required]);
            this.ItemSubform.get('concessionReasonId').enable();
        } else {
            const finalDiscPerControl = this.ItemSubform.value.FinalDiscPer
            if (!(this.saleSelectedDatasource.data.every((i) => i.DiscAmt > 0 && i.DiscPer > 0))) {
                this.ItemSubform.get('FinalDiscPer').enable();
                this.ItemSubform.get('FinalDiscPer').setValue(finalDiscPerControl);
                this.isdiscAmount = false;
            }
            if (this.ItemSubform.get('IsPurchaseWsie')?.value == true) {
                this.ItemSubform.get('FinalDiscPer').disable();
                this.ItemSubform.get('discAmount').disable();
            }
            // this.ItemSubform.patchValue({discAmount: ''}) 
            this.ConShow = false;
            this.ItemSubform.get('concessionReasonId').reset();
            this.ItemSubform.get('concessionReasonId').clearValidators();
            this.ItemSubform.get('concessionReasonId').disable();
            if (finalDiscPerControl > 0) {
                this.getFinalDiscperAmt();
            } else {
                this.ItemSubform.patchValue({ discAmount: '' })
            }
        }
    }
    getStoredet() {
        this._salesService.getstoreDetails(this.autocompletestore).subscribe((data) => {
            const storename = data;
            this.StoreName = storename[1].text;
        });
    }
    getFinalDiscperAmt() {
        const formValues = this.ItemSubform.getRawValue();

        if (this.UserDicPerLimit > 0) {
            const Disc = formValues.FinalDiscPer || 0;
            if (+Disc > +this.UserDicPerLimit) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Discount Limit Exceeded',
                    text: `Maximum allowed discount is ${this.UserDicPerLimit}%`,
                    confirmButtonColor: '#d33'
                });
                this.ItemSubform.get("FinalDiscPer").setValue(this.UserDicPerLimit);
            }
        }
        const Disc = formValues.FinalDiscPer || 0;
        let NetAmount = formValues.netAmount;
        let FinalDiscAmt = '';
        if (Disc > 0 && Disc <= 100) {
            this.ConShow = true;
            FinalDiscAmt = ((formValues?.totalAmount * Disc) / 100).toFixed(2);
            NetAmount = (formValues.totalAmount - parseFloat(FinalDiscAmt)).toFixed(2);
              this.NetPayBillAmt = Math.round(NetAmount)
            this.ItemSubform.patchValue({
                discAmount: FinalDiscAmt,
                netAmount: NetAmount,
                roundoffAmt: (Math.round(NetAmount) - NetAmount).toFixed(2)
            })
            this.ItemSubform.get('concessionReasonId').reset();
            this.ItemSubform.get('concessionReasonId').setValidators([Validators.required]);
            this.ItemSubform.get('concessionReasonId').enable();
            this.ItemSubform.updateValueAndValidity();
        } else {
            if (Disc > 100) {
                this.toastr.warning('Discount % should less than 100% & greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
            }
               this.NetPayBillAmt = Math.round(formValues?.totalAmount)
            this.ItemSubform.patchValue({
                FinalDiscPer: 0,
                discAmount: 0,
                netAmount: formValues?.totalAmount,
                roundoffAmt: (Math.round(formValues?.totalAmount) - formValues?.totalAmount).toFixed(2)
            });
            this.ConShow = false;
            this.ItemSubform.get('concessionReasonId').reset();
            this.ItemSubform.get('concessionReasonId').clearValidators();
            this.ItemSubform.get('concessionReasonId').updateValueAndValidity();
            this.ItemSubform.get('concessionReasonId').disable();
        }
    }
    getFinalDiscAmount() {
        const formValues = this.ItemSubform.getRawValue();
        let Discper = ''
        let totDiscAmt = formValues?.discAmount || 0;
        let NetAmount = formValues?.totalAmount;
        if (totDiscAmt > 0 && totDiscAmt < parseInt(NetAmount)) {
            Discper = ((totDiscAmt / NetAmount) * 100).toFixed(2);
            NetAmount = (formValues?.totalAmount - totDiscAmt).toFixed(2);
            this.ConShow = true;
            this.ItemSubform.get('concessionReasonId').reset();
            this.ItemSubform.get('concessionReasonId').setValidators([Validators.required]);
            this.ItemSubform.get('concessionReasonId').enable();
        } else {
            if (totDiscAmt > NetAmount) {
                this.toastr.warning('Discount Amt should less than NetAmt & greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
            }
            Discper = '';
            totDiscAmt = '';
            NetAmount = formValues?.totalAmount;
            this.ConShow = false;
            this.ItemSubform.get('concessionReasonId').reset();
            this.ItemSubform.get('concessionReasonId').clearValidators();
            this.ItemSubform.get('concessionReasonId').updateValueAndValidity();
            //this.ConseId.nativeElement.focus();
        }
         this.NetPayBillAmt = Math.round(NetAmount)
        this.ItemSubform.patchValue({
            FinalDiscPer: Discper,
            discAmount: totDiscAmt,
            netAmount: NetAmount,
            roundoffAmt: (Math.round(NetAmount) - NetAmount).toFixed(2)
        })

    }
    AllowToaddcharges(event) {
        if (event.checked == true) {
            this.ItemSubform.get('IsSupplimentryBill').setValue(true);
        } else {
            this.ItemSubform.get('IsSupplimentryBill').setValue(false);
        }
    }

    onSave(event) {
        debugger
        const formValue = this.ItemSubform.value

        if ((this.DayLimit || 0) > 0) {
            if (!this.ItemSubform.get('IsSupplimentryBill')?.value) {
                if (this.DayBalance <= 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Daily Limit Exhausted',
                        text: 'The daily limit for medicine sales has been fully utilized. No further medicines can be billed today.',
                        confirmButtonText: 'OK'
                    });
                    return;
                }
                // 2️⃣ Entered amount is more than remaining balance
                if (Number(formValue?.netAmount || 0) > this.DayBalance) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Amount Exceeds Daily Limit',
                        html: `
        <p>The entered medicine amount exceeds the remaining daily balance.</p>
        <p><b>Remaining Balance:</b> ₹${this.DayBalance}</p>
        <p>Please enter an amount within the available limit.</p>`,
                        confirmButtonText: 'OK'
                    });
                    return;
                }
            }
        }

        if ((this.RegNo || 0) == 0) {
            this.toastr.warning('Please select Patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to save this Sales bill?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                this.BillSave(event); // Call your save function 
                this.ItemSubform.reset({ IsSupplimentryBill: false });
            }
        });
    }
    BillSave(event) {
        debugger
        this.saveflag = true;
        const formattedTime = this.datePipe.transform(new Date(), 'hh:mm');
        const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime
        const formValue = this.ItemSubform.value
        if (!this.isValidForm()) {
            Swal.fire('Please enter valid table data.');
            return;
        }

        if (Number(formValue.discAmount) > 0) {
            if (!formValue.concessionReasonId) {
                this.toastr.warning('Please select Concession Reason ', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        const opIpType = formValue?.opIpType || 0
        this.PharmaSalesForm.get('sales.date').setValue(formattedDate)
        this.PharmaSalesForm.get('sales.time').setValue(FormattedDateTime)
        this.PharmaSalesForm.get('sales.opIpType').setValue(formValue?.opIpType)
        this.PharmaSalesForm.get('sales.totalAmount').setValue(formValue?.totalAmount || 0)
        this.PharmaSalesForm.get('sales.vatAmount').setValue(formValue?.vatAmount || 0)
        this.PharmaSalesForm.get('sales.discAmount').setValue(formValue?.discAmount || 0)
        this.PharmaSalesForm.get('sales.netAmount').setValue(formValue?.netAmount || 0);
        this.PharmaSalesForm.get('sales.roundOff').setValue(formValue?.roundoffAmt || 0);
        this.PharmaSalesForm.get('sales.regId').setValue(this.RegId)
        this.PharmaSalesForm.get('sales.concessionReasonId').setValue(formValue?.concessionReasonId || 0)
        this.PharmaSalesForm.get('sales.opIpId').setValue(this.OP_IP_Id)
        this.PharmaSalesForm.get('sales.wardId').setValue(this.wardId)
        this.PharmaSalesForm.get('sales.bedId').setValue(this.bedId)
        this.PharmaSalesForm.get('sales.isPurBill').setValue(formValue?.IsPurchaseWsie || false)
        this.PharmaSalesForm.get('sales.isPrescription').setValue(this.IPMedID || 0)
        this.PharmaSalesForm.get('prescription.opIpId').setValue(this.IPMedID || 0)
        this.PharmaSalesForm.get('salesDraft.dsalesId').setValue(this.DraftID || 0)
        this.PharmaSalesForm.get('sales.externalPatientName').setValue(this.PatientName || '')
        this.PharmaSalesForm.get('sales.doctorName').setValue(this.DoctorName || '')

        if (this.PharmaSalesForm.valid) {
            this.SalesDetailsAarry.clear();
            this.CurrentStockArray.clear()
            this.saleSelectedDatasource.data.forEach((element) => {
                this.CurrentStockArray.push(this.CreateCurrentStockForm(element))
                const formObj = this.CreateSalesDetailsform(element);
                formObj.patchValue({ isPurRate: formValue?.IsPurchaseWsie || false });
                this.SalesDetailsAarry.push(formObj);
            });

            if (this.ItemSubform.get('CashPay').value == 'Credit') {
                //        if (!formValue.CredirReasonId) {
                //      this.toastr.warning('Please select Credit Reason ', 'Warning !', {
                //          toastClass: 'tostr-tost custom-toast-warning',
                //      });
                //      return;
                //  }  
                this.PharmaSalesForm.get('sales.creditReason').setValue('')
                this.PharmaSalesForm.get('sales.creditReasonId').setValue(0)
                this.PharmaSalesForm.get('sales.paidAmount').setValue(0)
                this.PharmaSalesForm.get('sales.balanceAmount').setValue((formValue.netAmount))
                console.log(this.PharmaSalesForm.value)
                this._salesInPatientService.InsertSalesInPatientCreditSales(this.PharmaSalesForm.value).subscribe((response) => {
                    if (response > 0) {
                        this.OnSalesprint(response, opIpType)
                        this.onClose()

                    }
                });
            }
        } else {
            const invalidFields = [];
            if (this.PharmaSalesForm.invalid) {
                for (const controlName in this.PharmaSalesForm.controls) {
                    const control = this.PharmaSalesForm.get(controlName);
                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Sales Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`Sales From: ${controlName}`);
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
        this.getDraftorderList();
        this.PharmaSalesForm.get('sales.balanceAmount')?.reset(0);
    }
    onClose() {
        this.PharmaSalesForm = this.CreatePharmasalesform()
        this.PharmaSalesDraftForm = this.CreatePharmasalesDraftform()
        this.Itemchargeslist = [];
        this.ItemFormreset();
        this.ItemSubform.reset();
        this.Formreset();
        this.PatientName = '';
        this.DoctorName = '';
        this.MobileNo = '';
        this.RegNo = 0;
        this.saleSelectedDatasource.data = [];
        this.ItemSubform.get('FinalDiscPer').enable();
        this.ItemSubform.get('discAmount').enable();
        this._salesService.ItemSearchGroup.get('DiscPer').enable();
        this._salesService.ItemSearchGroup.get('DiscAmt').enable();
        this.NetPayBillAmt = 0;
    }
    // Table calculation
    updateCellDiscount(item: IndentList): void {
        const discPer = +item?.DiscPer;
        const totalMrp = +item?.TotalMRP;

        if (discPer < 0 || discPer > 100) {
            this.toastr.error('Enter discount between 0 - 100', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            item.DiscPer = 0;
            item.DiscAmt = 0;
            this.calculateCellNetAmount(item);
            return;
        }
        item.DiscAmt = ((totalMrp * discPer) / 100).toFixed(2);
        this.calculateCellNetAmount(item);
    }
    getCellCalculation(item: IndentList) {
        let qty = +item?.Qty;
        if (!qty) {
            qty = 0;
        } else if (qty > item.BalanceQty) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Quantity',
                text: 'Please enter a quantity less than the balance quantity = ' + item.BalanceQty,
                confirmButtonText: 'OK',
            });
            qty = 0;
        }
        const gstPer = +item.GSTPer;
        let MRP;
        let IsPurRate
        if (this.ItemSubform.get('IsPurchaseWsie')?.value == true) {
            MRP = +item?.LandedRate;
            IsPurRate = 1
        } else {
            MRP = +item?.UnitMRP;
            IsPurRate = 0;
        }
        const unitMrp = MRP
        const totalMrp = qty * unitMrp;
        const gstAmount = (totalMrp * gstPer) / 100;
        const landedRateandedTotal = qty * item.LandedRate;
        const mrpRateTotal = qty * item.MRPRate;
        const marginAmt = totalMrp - landedRateandedTotal;

        const updatedItem = {
            GSTAmount: gstAmount.toFixed(2),
            //UnitMRP: unitMrp.toFixed(2),
            TotalMRP: totalMrp.toFixed(2),
            MarginAmt: marginAmt.toFixed(2),
            MRPRateTotal: mrpRateTotal.toFixed(2),
            Qty: qty,
            IsPurRate: IsPurRate
        } as IndentList;

        Object.assign(item, updatedItem);
        this.updateCellDiscount(item);
        this.calculateCellNetAmount(item);
    }
    calculateCellNetAmount(item: IndentList): void {
        const formValue = this.ItemSubform.value;
        const discAmt = +item?.DiscAmt;
        const totalMrp = +item.TotalMRP;
        // let  DiscPer = '0'

        const netAmount = (totalMrp - discAmt).toFixed(2);
        item.NetAmt = netAmount;
        // let DiscPer = ((formValue.discAmount * 100) / totalMrp).toFixed(2);  
        // this.ItemSubform.patchValue({
        //   FinalDiscPer: DiscPer,
        // })
        this.getUpdateNetAmtSum(this.saleSelectedDatasource.data);
    }
    m_getBalAvaListStore(Param) {
        this.dsDraftList.data = [];
        const m = {
            "first": 0,
            "rows": 999,
            "sortField": "ItemId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "ItemId", "fieldValue": String(Param), "opType": "Contains" }
            ],
            "exportType": "JSON",
            "columns": [
                {
                    "data": "string",
                    "name": "string"
                }
            ]
        };
        this._salesService.getBalAvaListStore(m).subscribe((response) => {
            this.dsBalAvaListStore.data = response.data as BalAvaListStore[];
        });
    }

    ///////////////// //Darft part ---------------------------------------------------------------------------------------////////////////////////////
    getDraftorderList() {
        this.dsDraftList.data = [];
        const m = {
            "first": 0,
            "rows": 999,
            "sortField": "DSalesId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "FromDate", "fieldValue": String(this.datePipe.transform(new Date(), 'yyyy-MM-dd')), "opType": "Equals" },
                { "fieldName": "ToDate", "fieldValue": String(this.datePipe.transform(new Date(), 'yyyy-MM-dd')), "opType": "Equals" },
                { "fieldName": "OPIPID", "fieldValue": String(this.OP_IP_Id || 0), "opType": "Equals" }
            ],
            "exportType": "JSON",
            "columns": [
                {
                    "data": "string",
                    "name": "string"
                }
            ]
        }
        this._salesService.getDraftList(m).subscribe((response) => {
            this.dsDraftList.data = response.data as DraftSale[];
            console.log(this.dsDraftList.data)
        });
    }
    AddItem(row) {
        console.log(row);
        this.repeatItemList = row.value;
        this.Itemchargeslist = [];
        this.repeatItemList.forEach((element) => {
            const Qty = parseInt(element.Qty.toString());
            const UnitMrp = element.UnitMRP.split('|')[0];
            // let GSTAmount = (((element.UnitMRP * this.GSTPer) / 100) * Qty).toFixed(2);
            // let CGSTAmt = (((element.UnitMRP * this.CgstPer) / 100) * Qty).toFixed(2);
            // let SGSTAmt = (((element.UnitMRP * this.SgstPer) / 100) * Qty).toFixed(2);
            // let IGSTAmt = (((element.UnitMRP * this.IgstPer) / 100) * Qty).toFixed(2);

            // this.NetAmt = (UnitMrp * element.Qty).toFixed(2);
            // this.Itemchargeslist.push({
            //   ItemId: element.ItemId,
            //   ItemName: element.ItemShortName,
            //   BatchNo: element.BatchNo,
            //   BatchExpDate: this.datePipe.transform(element.BatchExpDate, 'dd/MM/YYYY'),
            //   Qty: element.Qty,
            //   UnitMRP: UnitMrp || element.UnitMRP,
            //   TotalMRP: element.TotalAmount,
            //   GSTPer: element.VatPer || 0,
            //   GSTAmount: element.VatAmount || 0,
            //   DiscPer: element.DiscPer,
            //   DiscAmt: element.DiscAmount,
            //   NetAmt: this.NetAmt,
            //   RoundNetAmt: Math.round(this.NetAmt),
            //   StockId: this.StockId,
            //   VatPer: this.VatPer,
            //   VatAmount: this.GSTAmount,
            //   LandedRate: this.LandedRate,
            //   LandedRateandedTotal: this.LandedRateandedTotal,
            //   CgstPer: this.CgstPer,
            //   CGSTAmt: this.CGSTAmt,
            //   SgstPer: this.SgstPer,
            //   SGSTAmt: this.SGSTAmt,
            //   IgstPer: this.IgstPer,
            //   IGSTAmt: this.IGSTAmt,
            //   PurchaseRate: this.PurchaseRate,
            //   PurTotAmt: this.PurTotAmt,
            //   MarginAmt: this.v_marginamt,
            //   BalanceQty: this.BalQty,
            //   SalesDraftId: 1,
            // });
        });
        this.sIsLoading = '';
        this.saleSelectedDatasource.data = this.Itemchargeslist;
    }
    DraftbillCancel(Obj) {
        const vdata = {
            "dsalesId": Obj?.dsalesId
        }
        this._salesService.getDeleteDratf(vdata).subscribe((data) => {
            if (data) {
                this.getDraftorderList();
            }
        });
    }
    onSaveDraftBill() {
        const formattedTime = this.dateTimeObj.time;
        const formattedDate = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime
        const formValue = this.ItemSubform.value
        if (!this.isValidForm()) {
            Swal.fire('Please enter valid table data.');
            return;
        }

        if ((this.RegNo || 0) == 0) {
            this.toastr.warning('Please select Patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        debugger
        this.PharmaSalesDraftForm.get('salesDraft.date').setValue(formattedDate)
        this.PharmaSalesDraftForm.get('salesDraft.time').setValue(FormattedDateTime)
        this.PharmaSalesDraftForm.get('salesDraft.opIpType').setValue(formValue?.opIpType)
        this.PharmaSalesDraftForm.get('salesDraft.opIpId').setValue(this.OP_IP_Id)
        this.PharmaSalesDraftForm.get('salesDraft.totalAmount').setValue(Number((formValue?.totalAmount)))
        this.PharmaSalesDraftForm.get('salesDraft.vatAmount').setValue(Number((formValue?.vatAmount)))
        this.PharmaSalesDraftForm.get('salesDraft.discAmount').setValue(Number((formValue?.discAmount)))
        this.PharmaSalesDraftForm.get('salesDraft.netAmount').setValue(Number((formValue?.netAmount)))
        this.PharmaSalesDraftForm.get('salesDraft.concessionReasonId').setValue(formValue?.concessionReasonId ?? 0)
        this.PharmaSalesDraftForm.get('salesDraft.paidAmount').setValue(Number((formValue?.netAmount)))
        this.PharmaSalesDraftForm.get('salesDraft.externalPatientName').setValue(this.PatientName)
        this.PharmaSalesDraftForm.get('salesDraft.doctorName').setValue(this.doctorname || '')

        this.SalesDraftDetailsAarry.clear();
        if (this.PharmaSalesDraftForm.valid) {
            this.SalesDraftDetailsAarry.clear();
            this.saleSelectedDatasource.data.forEach((element) => {
                this.SalesDraftDetailsAarry.push(this.CreateDraftDetails(element))
            });
            console.log(this.PharmaSalesDraftForm.value)
            this._salesService.InsertSalesDraftBill(this.PharmaSalesDraftForm.value).subscribe((response) => {
                this.onClose()
                this.getDraftorderList();
                this.viewgetsalesDraftReportPdf(response);
            });
        }
        else {
            const invalidFields = [];
            if (this.PharmaSalesDraftForm.invalid) {
                for (const controlName in this.PharmaSalesDraftForm.controls) {
                    const control = this.PharmaSalesDraftForm.get(controlName);
                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Sales Draft Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`Sales Draft From: ${controlName}`);
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
    viewgetsalesDraftReportPdf(element) {
        this.commonService.Onprint("DSalesId", element, "OpDraftPharmacyReceipt");
    }
    onAddDraftList(contact) {
        debugger
        console.log(contact)
        this.DraftID = contact.dsalesId;
        this.saleSelectedDatasource.data = [];
        this.Itemchargeslist = [];

        if (contact.opipType == 1) {
            this.Draftchk = true;
            this.vSelectedOption = '1';
            this.IPDNo = contact.oP_IP_No;
            this.DoctorName = contact.admDoctorName;
            this.PatientName = contact.patientName;
            this.RegId = contact.regID;
            this.RegNo = contact?.regNo;
            this.OP_IP_Id = contact?.opipid
        } else {
            this.toastr.warning('Select Only IP Patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
            return
        }
        const vdata = {
            "first": 0,
            "rows": 999,
            "sortField": "ItemId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "DSalesId", "fieldValue": String(contact?.dsalesId), "opType": "Contains" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._salesService.getDraftItemDetailsList(vdata).subscribe((response) => {
            this.tempDatasource.data = response.data as any;
            // if (this.tempDatasource.data.length >= 1) {
            //     this.tempDatasource.data.forEach((element) => {
            //         const draftQty = element.qtyPerDay; // use local variable
            //         this.onAddDraftListTosale(element, draftQty); // safe per call
            //     });
            // }


             if (this.tempDatasource.data.length >= 1) {
                setTimeout(async () => {
                    for (const element of this.tempDatasource.data) {
                        ;
                        console.log(element); 
                        const draftQty = element.qtyPerDay;
                        await this.onAddDraftListTosale(element, draftQty);
                    }
                }, 10);
            }
        });
    }
    NoStockItemlist:any=[];
getItemNames(): string {
  if (!this.NoStockItemlist || this.NoStockItemlist.length === 0) {
    return '';
  }
  const unique = [...new Set(this.NoStockItemlist.map(item => item.ItemName))];
  return unique.join(', ');
}

     async onAddDraftListTosale(contact, DraftQty): Promise<void> {
        console.log(contact)
        this.QtyBalchk = 0;

        const m_data = {
            "first": 0,
            "rows": 999,
            "sortField": "ItemId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "ItemId", "fieldValue": String(contact.itemId), "opType": "Contains" },
                { "fieldName": "StoreId", "fieldValue": String(this._loggedService.currentUserValue.user.storeId), "opType": "Contains" },
                { "fieldName": "PatientTypeId", "fieldValue": String(this.PatientTypeId), "opType": "Contains" }
            ],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        };
           //  this._salesService.getKenyaSalesBatchList(m_data).subscribe((response) => {
     
               try {
                 const response: any = await firstValueFrom(
                     this._salesService.getKenyaSalesBatchList(m_data)
                 );
               debugger  
            const tempChargesList = response?.data || [];
            let qtyBalChk = 0;
                   if (tempChargesList.length == 0) {
                       await Swal.fire({
                           icon: 'warning',
                           title: 'Stock Unavailable',
                           html: `The item <strong>${contact.itemName}</strong> is currently out of stock.`,
                           showConfirmButton: true,
                           confirmButtonText: 'OK'
                       });
                       this.NoStockItemlist.push({
                           ItemId: contact?.itemId || 0,
                           ItemName: contact?.itemName || ''
                       });

                       // Swal.fire(contact.itemId + ' : ' + 'Item Stock is Not Avilable:');
                   } else if (tempChargesList.length > 0) {
                tempChargesList.forEach((element) => {
                    if (contact.itemId != element.itemId) {
                        qtyBalChk = 0;
                    }
                    if (qtyBalChk != 1) {
                        if (DraftQty <= element.balanceQty) {
                            qtyBalChk = 1;
                            this.getFinalCalculation(element, DraftQty);
                        } else {
                            Swal.fire('Balance Qty is :', element.balanceQty);
                            qtyBalChk = 0;
                            Swal.fire('Balance Qty is Less than Selected Item Qty for Item :' + element.itemId + 'Balance Qty:', element.balanceQty);
                        }
                    }
                });
            }
            this.QtyBalchk = qtyBalChk
        } catch (error) {
            console.error("Error:", error);
        }
    }
    vExpDate: any;
    getFinalCalculation(contact, DraftQty) {
        debugger
        if (DraftQty && contact.unitMrp) {//unitMRP
            this.saleSelectedDatasource.data = [];
            let LandedRateandedTotal = '0', TotalMRP = '0', PurTotAmt = '0',
                v_marginamt = '0', GSTAmount = '0', CGSTAmt = '0', SGSTAmt = '0', IGSTAmt = '0', NetAmt = '0', MRPRateTotal = '0';

            TotalMRP = (parseInt(DraftQty) * contact.unitMrp).toFixed(2);
            LandedRateandedTotal = (parseInt(DraftQty) * contact.landedRate).toFixed(2);
            PurTotAmt = (parseInt(DraftQty) * contact.purchaseRate).toFixed(2);
            v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
            GSTAmount = (((contact.unitMrp * contact.vatPercentage) / 100) * parseInt(DraftQty)).toFixed(2);
            CGSTAmt = (((contact.unitMrp * contact.cgstper) / 100) * parseInt(DraftQty)).toFixed(2);
            SGSTAmt = (((contact.unitMrp * contact.sgstper) / 100) * parseInt(DraftQty)).toFixed(2);
            IGSTAmt = (((contact.unitMrp * contact.igstper) / 100) * parseInt(DraftQty)).toFixed(2);
            MRPRateTotal = (parseInt(DraftQty) * contact.unitMrp).toFixed(2);
            NetAmt = (parseFloat(TotalMRP) - 0).toFixed(2);

            // if (contact.DiscPer > 0) {
            // this.DiscAmt = ((TotalMRP * contact.DiscPer) / 100).toFixed(2);
            // NetAmt = (tTotalMRP - this.DiscAmt).toFixed(2);
            // }  
            if (contact?.batchExpDate) {
                const day = +contact?.batchExpDate.substring(0, 2);
                const month = +contact?.batchExpDate.substring(3, 5);
                const year = +contact?.batchExpDate.substring(6, 10);
                this.vExpDate = `${year}-${this.pad(month)}-${day}`;
            }

            if (this.saleSelectedDatasource.data.length > 0) {
                if (this.saleSelectedDatasource.data.find(i => i.ItemId == contact?.itemId)) {
                    this.toastr.success(`Selected item already added in list`, 'success',);
                }
                return
            }
            this.Itemchargeslist.push(
                {
                    ItemId: contact?.itemId,
                    ItemName: contact?.itemName,
                    BatchNo: contact?.batchNo,
                    BatchExpDate: this.vExpDate,
                    Qty: DraftQty,
                    UnitMRP: contact?.unitMrp,
                    GSTPer: contact?.vatPercentage || 0,
                    GSTAmount: GSTAmount || 0,
                    TotalMRP: TotalMRP,
                    DiscPer: 0,
                    DiscAmt: 0,
                    NetAmt: NetAmt || 0,
                    RoundNetAmt: Math.round(parseInt(NetAmt)),
                    StockId: contact?.stockId,
                    VatPer: contact?.vatPercentage,
                    VatAmount: GSTAmount,
                    LandedRate: contact?.landedRate,
                    LandedRateandedTotal: LandedRateandedTotal,
                    CgstPer: contact?.cgstper,
                    CGSTAmt: CGSTAmt,
                    SgstPer: contact?.sgstper,
                    SGSTAmt: SGSTAmt,
                    IgstPer: contact?.igstper,
                    IGSTAmt: IGSTAmt,
                    PurchaseRate: contact?.purchaseRate,
                    PurTotAmt: PurTotAmt,
                    MarginAmt: v_marginamt,
                    BalanceQty: contact?.balanceQty,
                    SalesDraftId: 0,
                    StoreId: contact?.storeId,
                    MRP: contact?.unitMrp,
                    MRPRate: contact?.unitMrp,
                    MRPRateTotal: MRPRateTotal
                }
            )
            this.saleSelectedDatasource.data = this.Itemchargeslist;
            console.log(this.Itemchargeslist)
            this.getUpdateNetAmtSum(this.saleSelectedDatasource.data)
            this.ItemFormreset();
        }
    }
    private pad(num: number): string {
        return num.toString().padStart(2, '0');
    }
    allowOnlyDigits(event: KeyboardEvent) {
        const charCode = event.which ? event.which : event.keyCode;

        // Allow only digits (0-9)
        if (charCode < 48 || charCode > 57) {
            event.preventDefault();
            return false;
        }

        // Prevent entering more than 10 digits
        const input = event.target as HTMLInputElement;
        if (input.value.length >= 10) {
            event.preventDefault();
            return false;
        }

        return true;
    }

   async getPRESCRIPTION() {
        const dialogRef = this._matDialog.open(PrescriptionComponent, {
            maxWidth: '100%',
            height: '100%',
            width: '95%',
        });
        dialogRef.afterClosed().subscribe(async (result) => {
            console.log('The dialog was closed - Insert Action', result);
            if (result[0]?.IPMedID == 0) {
                this.toastr.warning('Please check selected patient Type is OP Patient', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

            this.PatientName = result[0]?.PatientName;
            this.RegId = result[0]?.RegId;
            this.RegNo = result[0]?.RegNo;
            this.OP_IP_Id = result[0]?.AdmissionID;
            this.DoctorName = result[0]?.DoctorName;
            this.ItemSubform.get('regId').setValue(result[0]?.RegId);
            const companyId = result[0]?.companyId || 0;
            if (!companyId) {
                this.PatientTypeId = 1
            } else {
                this.PatientTypeId = 0
            }


            if (result[0]?.IPMedID > 0) {
                this.IPDNo = result[0]?.IPDNo;
                this.IPMedID = result[0]?.IPMedID;
                this.vSelectedOption = '1';
            }
            this.saveflag = false;
            this.getBillSummary(result[0]?.AdmissionID || 0)
            this.dsItemNameList1.data = result;
           ///  this.dsItemNameList1.data.forEach((contact) => {
                for (const contact of this.dsItemNameList1.data) {
                const m_data = {
                    "first": 0,
                    "rows": 999,
                    "sortField": "ItemId",
                    "sortOrder": 0,
                    "filters": [
                        { "fieldName": "ItemId", "fieldValue": String(contact.ItemId), "opType": "Contains" },
                        { "fieldName": "StoreId", "fieldValue": String(this._loggedService.currentUserValue.user.storeId), "opType": "Contains" },
                        { "fieldName": "PatientTypeId", "fieldValue": String(this.PatientTypeId), "opType": "Contains" }
                    ],
                    "exportType": "JSON",
                    "columns": [{ "data": "string", "name": "string" }]
                };
                //   var reqData = {
                //   ItemId: contact.ItemId,
                //   StoreId: this._loggedService.currentUserValue.user.storeId,
                //   PatientTypeId:this.PatientTypeId
                // };
               // this._salesService.getKenyaSalesBatchList(m_data).subscribe((response) => { 
                    try {
                        const response: any = await firstValueFrom(
                            this._salesService.getKenyaSalesBatchList(m_data)
                        );
                    debugger
                    console.log(response.data)
                    this.Tempchargeslist = response.data as any;
                    console.log(this.Tempchargeslist)
                    if (response) {
                        if (this.Tempchargeslist.length == 0) {
                            await Swal.fire({
                                icon: 'warning',
                                title: 'Stock Unavailable',
                                html: `The item <strong>${contact.ItemName}</strong> is currently out of stock.`,
                                showConfirmButton: true,
                                confirmButtonText: 'OK'
                            });
                            this.NoStockItemlist.push({
                                ItemId: contact?.ItemId || 0,
                                ItemName: contact?.ItemName || ''
                            })
                        } else if (this.Tempchargeslist.length > 0) {
                            debugger
                            let remaing_qty = contact.QtyPerDay;
                            let bal_qnt = 0;
                            this.Tempchargeslist.forEach((element) => {
                                const PreQty = remaing_qty;
                                if (PreQty > 0) {
                                    if (contact.ItemId != element.itemId) {
                                        this.QtyBalchk = 0;
                                    }
                                    if (PreQty <= element.balanceQty) {
                                        this.QtyBalchk = 1;
                                        this.getFinalCalculation(element, PreQty);
                                        bal_qnt += element.balanceQty - PreQty;
                                    } else if (PreQty > element.balanceQty) {
                                        this.QtyBalchk = 1;
                                        this.getFinalCalculation(element, element.balanceQty);
                                    }
                                    remaing_qty = PreQty - element.balanceQty;
                                } else {
                                    bal_qnt += element.balanceQty;
                                }
                            });
                            //Swal.fire('Balance Qty is :', String(bal_qnt));
                        }
                    }
                 }
                    catch (error) {
                        console.error("Error:", error);
                    }
            };
        });

    }
    getBillSummary(admissionID) {
        //Total Credit Amount
        const vdata = {
            "first": 0,
            "rows": 999,
            "sortField": "OP_IP_ID",
            "sortOrder": 0,
            "filters": [{ "fieldName": "OP_IP_ID", "fieldValue": String(admissionID), "opType": "Contains" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        };
        this._salesService.getBillSummaryQuery(vdata).subscribe((response) => {
            console.log(response.data);
            this.TotalCreditAmt = response?.data[0]?.creditAmount || 0;
            this.DayLimit = response?.data[0]?.compnayCreditAmount || 0;
            //this.DayBalance = Math.max(response?.data[0]?.dayWiseBalCredit || 0, 0);  
            this.DayBalance = (response?.data[0]?.dayWiseBalCredit || 0);
            //              {
            //     "compnayCreditAmount": 551,
            //     "chargesAmount": 1500,
            //     "dayWiseBalCredit": -949
            // }
        });
        //Total advance and advance bal Amount
        const m_data = {
            "first": 0,
            "rows": 999,
            "sortField": "AdmissionID",
            "sortOrder": 0,
            "filters": [{ "fieldName": "AdmissionID", "fieldValue": String(admissionID), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": []
        }
        this._salesService.getAdvanceList(m_data).subscribe(Visit => {
            let advancedetails = [];
            advancedetails = Visit.data;
            advancedetails.forEach(element => {
                this.TotalAdvanceAmt += element?.advanceAmount || 0
                this.TotalBalanceAmt += element?.balanceAmount || 0
            });
            console.log(advancedetails)
        });
    }

    salesIdWiseObj: any;
    dummySalesIdNameArr = [];
    SalesIdWiseObj: any = {};
    getTopSalesDetailsList(MobileNo) {
        const vdata = {
            ExtMobileNo: MobileNo,
        };
        this.sIsLoading = 'get-sales-data';
        this._salesService.getTopSalesDetails(vdata).subscribe((data: any) => {
            if (data && data.length > 0) {
                this.reportPrintObjItemList = data as Printsal[];
                this.repeatItemList = data;
                this.reportItemPrintObj = data[0] as Printsal;
                this.PatientName = data[0].ExternalPatientName;
                this.DoctorName = data[0].DoctorName;
                this.salesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
                    if (!acc[item.SalesId]) {
                        acc[item.SalesId] = [];
                    }
                    acc[item.SalesId].push(item);
                    return acc;
                }, {});
                this.sIsLoading = '';
                this.patientname.nativeElement.focus();
            } else {
                this.sIsLoading = '';
            }
        });
        this.getTopSalesDetailsprint();
    }
    getTopSalesDetailsprint() {
        let strrowslist = '';
        const onlySalesId = [];
        this.reportPrintObjItemList.forEach((ele) => onlySalesId.push(ele.SalesId));

        const SalesidNamesArr = [...new Set(onlySalesId)];
        SalesidNamesArr.forEach((ele) => this.dummySalesIdNameArr.push({ SalesId: ele, isHidden: false }));

        this.SalesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
            if (!acc[item.SalesId]) {
                acc[item.SalesId] = [];
            }
            acc[item.SalesId].push(item);
            return acc;
        }, {});

        for (let i = 1; i <= this.reportPrintObjItemList.length; i++) {
            const objreportPrint = this.reportPrintObjItemList[i - 1];

            const strabc =
                this.getSalesIdName(objreportPrint.SalesId) +
                `
   <div style="display:flex;margin:8px 0">
   <div style="display:flex;width:80px;margin-left:20px;">
       <div>` +
                objreportPrint.ItemShortName +
                `</div>
   </div>
   </div>`;
            strrowslist += strabc;
        }
    }
    getSalesIdName(SalesId: string) {
        let groupDiv;
        for (let i = 0; i < this.dummySalesIdNameArr.length; i++) {
            if (this.dummySalesIdNameArr[i].SalesId == SalesId && !this.dummySalesIdNameArr[i].isHidden) {
                const groupHeader =
                    `<div style="display:flex;width:960px;margin-left:20px;justify-content:space-between;">
           <div> <h3>` +
                    SalesId +
                    `</h3></div>
            </div>`;
                this.dummySalesIdNameArr[i].isHidden = true;
                groupDiv = groupHeader;
                break;
            } else {
                groupDiv = ``;
            }
        }
        return groupDiv;
    }
    PatientInformRest() {
        this.PatientName = '';
        this.IPDNo = '';
        this.DoctorName = '';
        this.OPDNo = '';
    }
    CalPaidbackAmt() {
        const formvalue = this.ItemSubform.value
        const PaidbacktoPatient = (parseFloat(formvalue?.roundoffAmt || 0) - parseFloat(formvalue?.PaidbyPatient || 0)).toFixed(2);
        this.ItemSubform.patchValue({
            PaidbacktoPatient: PaidbacktoPatient
        })
    }
    chkbarcode(event) {
        if (event.checked == true) {
            this.barcodeflag = true;
        } else {
            this.barcodeflag = false;
        }
    }
    barcodeItemfetch() {
        const d = {
            StockId: this._salesService.ItemSearchGroup.get('Barcode').value || 0,
            StoreId: this._loggedService.currentUserValue.storeId || 0,
        };
        this._salesService.getCurrentStockItem(d).subscribe((data) => {
            this.tempDatasource.data = data as any;
            if (this.tempDatasource.data.length >= 1) {
                this.tempDatasource.data.forEach((element) => {
                    this.DraftQty = 0;
                    this.onAddBarcodeItemList(element, element.IssueQty);
                });
            } else if (this.tempDatasource.data.length == 0) {
                this.toastr.error('Item Not Found !', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        });
        this.vBarcode = '';
        this.Addflag = false;
    }
    onAddBarcodeItemList(contact, DraftQty) {
        console.log(contact);
        //
        this.vBarcodeflag = true;
        let i = 0;

        if (this.saleSelectedDatasource.data.length > 0) {
            this.chargeslistBarcode = this.saleSelectedDatasource.data;

            this.saleSelectedDatasource.data.forEach((element) => {
                if (element.ItemId == contact.ItemId) {
                    this.Itemflag = true;
                    this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    //

                    if (contact.IssueQty != null) {
                        this.DraftQty = element.Qty + contact.IssueQty;
                        if (this.DraftQty > contact.BalanceQty) {
                            Swal.fire('Enter Qty less than Balance :', contact.BalanceQty);
                            element.Qty = this.DraftQty - contact.IssueQty;
                            this.ItemFormreset();
                        }
                    } else {
                        this.DraftQty = element.Qty + 1;
                        if (this.DraftQty > contact.BalanceQty) {
                            Swal.fire('Enter Qty less than Balance :', contact.BalanceQty);
                            element.Qty = this.DraftQty - 1;
                            this.ItemFormreset();
                        }
                    }

                    const TotalMRP = (parseInt(this.DraftQty) * contact.UnitMRP).toFixed(2);
                    const Vatamount = ((parseFloat(TotalMRP) * contact.VatPercentage) / 100).toFixed(2);
                    const vFinalNetAmount = (parseFloat(Vatamount) + parseFloat(TotalMRP)).toFixed(2);
                    const LandedRateandedTotal = (parseInt(this.DraftQty) * contact.LandedRate).toFixed(2);
                    const v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
                    const PurTotAmt = (parseInt(this.DraftQty) * contact.PurUnitRateWF).toFixed(2);

                    const CGSTAmt = (((contact.UnitMRP * contact.CgstPer) / 100) * this.DraftQty).toFixed(2);
                    const SGSTAmt = (((contact.UnitMRP * contact.SgstPer) / 100) * this.DraftQty).toFixed(2);
                    const IGSTAmt = (((contact.UnitMRP * contact.IgstPer) / 100) * this.DraftQty).toFixed(2);

                    // let DiscAmt= ((parseFloat(TotalMRP) * (contact.DiscPer)) / 100).toFixed(2)

                    const DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
                    const NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

                    const BalQty = contact.BalanceQty - this.DraftQty;

                    this.saleSelectedDatasource.data[i].Qty = this.DraftQty;
                    this.saleSelectedDatasource.data[i].VatAmount = Vatamount;
                    this.saleSelectedDatasource.data[i].TotalAmount = TotalMRP;
                    this.saleSelectedDatasource.data[i].NetAmt = vFinalNetAmount;
                    this.saleSelectedDatasource.data[i].TotalMRP = TotalMRP;
                    this.saleSelectedDatasource.data[i].VatAmount = Vatamount;
                    this.saleSelectedDatasource.data[i].TotalAmount = TotalMRP;
                    this.saleSelectedDatasource.data[i].NetAmt = NetAmt;

                    this.saleSelectedDatasource.data[i].DiscPer = contact.DiscPer;
                    this.saleSelectedDatasource.data[i].DiscAmt = DiscAmt;

                    this.saleSelectedDatasource.data[i].CGSTAmt = CGSTAmt;
                    this.saleSelectedDatasource.data[i].SGSTAmt = SGSTAmt;
                    this.saleSelectedDatasource.data[i].IGSTAmt = IGSTAmt;

                    this.saleSelectedDatasource.data[i].CgstPer = contact.CGSTPer;
                    this.saleSelectedDatasource.data[i].SgstPer = contact.SGSTPer;
                    this.saleSelectedDatasource.data[i].IgstPer = contact.IGSTPer;

                    this.saleSelectedDatasource.data[i].LandedRate = contact.LandedRate;
                    this.saleSelectedDatasource.data[i].LandedRateandedTotal = LandedRateandedTotal;
                    this.saleSelectedDatasource.data[i].PurchaseRate = contact.PurUnitRateWF;
                    this.saleSelectedDatasource.data[i].PurTotAmt = PurTotAmt;

                    this.saleSelectedDatasource.data[i].BalanceQty = BalQty;
                    this.saleSelectedDatasource.data[i].StockId = contact.StockId;
                }
                i++;
            });
        }
        if (!this.Itemflag) {
            if (contact.IssueQty != null) {
                this.DraftQty = DraftQty + contact.IssueQty;

                if (this.DraftQty > contact.BalanceQty) {
                    Swal.fire('Enter Qty less than Balance');
                    this.DraftQty = DraftQty - contact.IssueQty;
                    this.ItemFormreset();
                }
            } else {
                this.DraftQty = DraftQty + 1;
                if (this.DraftQty > contact.BalanceQty) {
                    Swal.fire('Enter Qty less than Balance');
                    this.DraftQty = DraftQty - 1;
                    this.ItemFormreset();
                }
            }

            const TotalMRP = (parseInt(this.DraftQty) * contact.UnitMRP).toFixed(2);
            const Vatamount = ((parseFloat(TotalMRP) * contact.VatPercentage) / 100).toFixed(2);
            const TotalNet = parseFloat(TotalMRP + Vatamount).toFixed(2);
            const LandedRateandedTotal = (parseInt(this.DraftQty) * contact.LandedRate).toFixed(2);
            const v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
            const PurTotAmt = (parseInt(this.DraftQty) * contact.PurUnitRateWF).toFixed(2);

            const CGSTAmt = (((contact.UnitMRP * contact.CGSTPer) / 100) * this.DraftQty).toFixed(2);
            const SGSTAmt = (((contact.UnitMRP * contact.SGSTPer) / 100) * this.DraftQty).toFixed(2);
            const IGSTAmt = (((contact.UnitMRP * contact.IGSTPer) / 100) * this.DraftQty).toFixed(2);

            const DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
            const NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

            this.chargeslistBarcode.push({
                ItemId: contact.ItemId || 0,
                ItemName: contact.ItemName || '',
                BatchNo: contact.BatchNo,
                BatchExpDate: this.datePipe.transform(contact.BatchExpDate, 'yyyy-MM-dd') || '01/01/1900',
                BalanceQty: contact.BalanceQty,
                Qty: this.DraftQty || 0,
                UnitMRP: contact.UnitMRP,
                GSTPer: contact.VatPer || 0,
                GSTAmount: Vatamount || 0,
                TotalMRP: TotalMRP,
                DiscPer: contact.DiscPer,
                DiscAmt: DiscAmt || 0,
                NetAmt: TotalNet,
                RoundNetAmt: parseInt(TotalNet), // Math.round(TotalNet),
                StockId: contact.StockId,
                LandedRate: contact.LandedRate,
                LandedRateandedTotal: LandedRateandedTotal,
                CgstPer: contact.CGSTPer,
                CGSTAmt: CGSTAmt,
                SgstPer: contact.SGSTPer,
                SGSTAmt: SGSTAmt,
                IgstPer: contact.IGSTPer,
                IGSTAmt: IGSTAmt,
                PurchaseRate: contact.PurUnitRateWF,
                PurTotAmt: PurTotAmt,
                MarginAmt: v_marginamt,
                SalesDraftId: 1,
            });
            console.log(this.chargeslistBarcode);
            // });
        }
        this.saleSelectedDatasource.data = this.chargeslistBarcode;
        this.getUpdateNetAmtSum(this.saleSelectedDatasource.data)
        console.log(this.saleSelectedDatasource.data);

        this.vBarcode = 0;
        this.vBarcodeflag = false;
    }
    onEnterItemName(item: IndentList): void {
        const itemId = item.ItemId;
        const storeId = item.StoreId;
        this.selectedTableRowItem = item;
        this.getBatch(itemId, storeId, true);
    }

    focusNext(ref: ElementRef): void {
        ((ref as any).el?.nativeElement as HTMLElement)?.querySelector('input')?.focus();
    }
    isValidForm(): boolean {
        return this.saleSelectedDatasource.data.every((i) => i.Qty > 0 && i.UnitMRP > 0);
    }
    getElementByName(name: string): HTMLElement {
        return document.querySelector(`[name=${name}]`) as HTMLElement;
    }
    // NEW BHAVDIP CODE
    getValidationMessages() {
        return {
            mobileNo: [
                { name: 'required', Message: 'Mobile no required' },
                { name: 'pattern', Message: 'only Number allowed.' },
            ],
            StoreId: [
                // { name: "required", Message: "Invoice No is required" }
            ],
            concessionId: [
                // { name: "required", Message: "Invoice No is required" }
            ],
            doctorName: [
                { name: "required", Message: "Doctor Name No is required" }
            ],
            extAddress: [
                { name: "required", Message: "Address No is required" }
            ],
            PatientName: [
                { name: "required", Message: "Patient Name No is required" }
            ],
            CredirReasonId: [
                { name: "required", Message: "Patient Name No is required" }
            ],

        };
    }

    public onEnterAddress(event): void {
        if (event.which === 13) {
            this.itemid.nativeElement.focus();
        }
    }
    public onF6Reset(event): void {
        if (event.which === 117) {
            this.onClose();
        }
    }
    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.keyCode === 119) {
            this.onsubstitutes();
        }
        if (event.keyCode === 120) {
            this.BillSave(event);
        }
    }
    onsubstitutes() {
        const dialogRef = this._matDialog.open(SubstitutesComponent,
            {
                width: "45%",
                height: "60%",
            });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getWhatsappshareSales(el, vmono) {
        const m_data = {
            insertWhatsappsmsInfo: {
                mobileNumber: vmono || 0,
                smsString:
                    'Dear' +
                    vmono +
                    ',Your Sales Bill has been successfully completed. UHID is ' +
                    el +
                    ' For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur ' || '',
                isSent: 0,
                smsType: 'Sales',
                smsFlag: 0,
                smsDate: this.currentDate,
                tranNo: el,
                PatientType: 2, //el.PatientType,
                templateId: 0,
                smSurl: 'info@gmail.com',
                filePath: this.Filepath || '',
                smsOutGoingID: 0,
            },
        };
        this._BrowsSalesBillService.InsertWhatsappSales(m_data).subscribe((response) => {
            if (response) {
                this.toastr.success('Bill Sent on WhatsApp Successfully.', 'Save !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
            } else {
                this.toastr.error('API Error!', 'Error WhatsApp!', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        });
    }
    OnSalesprint(SalesID, OP_IP_Type) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    { "fieldName": "SalesID", "fieldValue": String(SalesID), "opType": "13" },
                    { "fieldName": "OP_IP_Type", "fieldValue": String(OP_IP_Type), "opType": "13" }
                ],
                "mode": "PharamcyInPatientSalesBillKenya"
            }
            this._salesService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Sales In Patient Bill" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
    getPurchaseRateWise(event) {
        // Update gst type of table data  
        if (this.ItemSubform.get('IsPurchaseWsie')?.value == true) {
            this.ItemSubform.get('FinalDiscPer').reset();
            this.ItemSubform.get('discAmount').reset();
            this.ItemSubform.get('FinalDiscPer').disable();
            this.ItemSubform.get('discAmount').disable();

            this._salesService.ItemSearchGroup.get('DiscPer').reset();
            this._salesService.ItemSearchGroup.get('DiscAmt').reset();
            this._salesService.ItemSearchGroup.get('DiscPer').disable();
            this._salesService.ItemSearchGroup.get('DiscAmt').disable();

            Swal.fire({
                icon: 'info',
                title: 'Discount Disabled',
                text: 'Discounts are disabled while Purchase Rate Wise mode is active.',
                timer: 3000, // auto close after 3 seconds
                confirmButtonText: 'OK',
            });

        } else {
            this.ItemSubform.get('FinalDiscPer').enable();
            this.ItemSubform.get('discAmount').enable();
            this._salesService.ItemSearchGroup.get('DiscPer').enable();
            this._salesService.ItemSearchGroup.get('DiscAmt').enable();
        }
        this.saleSelectedDatasource.data.forEach((item) => {
            this.getCellCalculation(item);
        })
    }
    OnCreditReasonchange(event) {
        this.ItemSubform.patchValue({
            CredirReasonName: event.text
        })
    }
    UserDicPerLimit: any = 0;
    getAccessDetail() {
        // debugger
        const SelectQuery = {
            "first": 0,
            "rows": 999,
            "sortField": "AccessValueId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "LoginId",
                    "fieldValue": String(this._loggedService.currentUserValue.userId), //"30091",
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        this._salesService.getAccessDetailList(SelectQuery).subscribe(response => {
            const getUserAccesDetList = response.data as UserDetail[];
            console.log("get Access data:", getUserAccesDetList)

            const discountData = response.data.find(x => x.accessValueName === 'IsDiscount');
            console.log(discountData)
            if (discountData?.accessValue) {
                this.UserDicPerLimit = discountData?.accessInputValue || 0
            }
        });
    }
    // it allowed only Digit 
    keyPressDigitsOnly(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    // it allowed only Digit & decimal
    keyPressDigitDecimalOnly(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}

export class IndentList {
    SalesNo: any
    ItemId: any;
    ItemName: string;
    ItemShortName: any;
    BatchNo: string;
    BatchExpDate: any;
    BalanceQty: any;
    qtyPerDay: any;
    UnitMRP: any;
    Qty: number;
    IssueQty: number;
    Bal: number;
    StoreId: any;
    StoreName: any;
    GSTPer: any;
    GSTAmount: any;
    TotalMRP: any;
    DiscPer: any;
    DiscAmt: any;
    NetAmt: any;
    StockId: any;
    ReturnQty: any;
    TotalAmount: any;
    Total: any;
    VatPer: any;
    VatAmount: any;
    LandedRate: any;
    CgstPer: any;
    CGSTAmt: any;
    SgstPer: any;
    SGSTAmt: any;
    IgstPer: any;
    IGSTAmt: any;
    LandedRateandedTotal: any;
    PurchaseRate: any;
    PurTotAmt; any;
    BalanceAmount: any;
    PatientName: any;
    SalesReturnId: any;
    DiscAmount: any;
    NetAmount: any;
    MarginAmt: any;
    QtyPerDay: any;
    MRP: any;
    MRPRate: any;
    MRPRateTotal: any;
    IsPurRate: any;
    /**
     * Constructor
     *
     * @param IndentList
     */
    constructor(IndentList) {
        {
            this.SalesNo = IndentList.SalesNo || 0;
            this.ItemId = IndentList.ItemId || 0;
            this.ItemName = IndentList.ItemName || "";
            this.ItemShortName = IndentList.ItemShortName || "";
            this.BatchNo = IndentList.BatchNo || "";
            this.BatchExpDate = IndentList.BatchExpDate || "";
            this.UnitMRP = IndentList.UnitMRP || "";
            this.ItemName = IndentList.ItemName || "";
            this.Qty = IndentList.Qty || 0;
            this.IssueQty = IndentList.IssueQty || 0;
            this.qtyPerDay = IndentList.qtyPerDay || 0;
            this.Bal = IndentList.Bal || 0;
            this.StoreId = IndentList.StoreId || 0;
            this.StoreName = IndentList.StoreName || '';
            this.GSTPer = IndentList.GSTPer || "";
            this.TotalMRP = IndentList.TotalMRP || 0;
            this.DiscAmt = IndentList.DiscAmt || 0;
            this.NetAmt = IndentList.NetAmt || 0;
            this.StockId = IndentList.StockId || 0;
            this.NetAmt = IndentList.NetAmt || 0;
            this.ReturnQty = IndentList.ReturnQty || 0;
            this.TotalAmount = IndentList.TotalAmount || 0;
            this.Total = IndentList.Total || '';
            this.VatPer = IndentList.VatPer || 0;
            this.VatAmount = IndentList.VatAmount || 0;
            this.LandedRate = IndentList.LandedRate || 0;
            this.CgstPer = IndentList.CgstPer || 0;
            this.CGSTAmt = IndentList.CGSTAmt || 0;
            this.SgstPer = IndentList.SgstPer || 0;
            this.SGSTAmt = IndentList.SGSTAmt || 0;
            this.IgstPer = IndentList.IgstPer || 0;
            this.IGSTAmt = IndentList.IGSTAmt || 0;
            this.BalanceAmount = IndentList.BalanceAmount || 0;
            this.PatientName = IndentList.PatientName || '';
            this.SalesReturnId = IndentList.SalesReturnId || 0;
            this.NetAmount = IndentList.NetAmount || 0;
            this.DiscAmount = IndentList.DiscAmount || 0;
            this.MarginAmt = IndentList.MarginAmt || 0;
            this.DiscPer = IndentList.DiscPer || 0;
            this.QtyPerDay = IndentList.QtyPerDay || 0;
            this.MRP = IndentList.MRP || 0;
            this.MRPRate = IndentList.MRPRate || 0;
            this.MRPRateTotal = IndentList.MRPRateTotal || 0;
        }
    }
}







