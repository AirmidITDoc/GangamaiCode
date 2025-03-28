import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AdvanceDetailObj, ChargesList } from '../ip-search-list.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { IPSearchListService } from '../ip-search-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common'; 
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { MatAccordion } from '@angular/material/expansion'; 
import { InterimBillComponent } from '../interim-bill/interim-bill.component';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr'; 
import { PrebillDetailsComponent } from './prebill-details/prebill-details.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service'; 
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';


@Component({
  selector: 'app-ip-billing',
  templateUrl: './ip-billing.component.html',
  styleUrls: ['./ip-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBillingComponent implements OnInit {
  displayedColumns = [
    'checkbox',
    'IsCheck',
    'ChargesDate',
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
    'buttons',
  ];
  tableColumns = [
    'ServiceName',
    'Price'
  ];
  PackageBillColumns = [
    'BDate',
    'PBillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'BalanceAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'Action'
  ];

  opD_IPD_Id: any = "0"
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
  ngAfterViewInit() {
    // Assign the template to the column dynamically 
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
  }

  allColumns = [
    { heading: "Date", key: "bDate", sort: true, align: 'left', emptySign: 'NA', width: 110 },
    { heading: "billNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 110 },
    { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "cashPayAmt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "chequePayAmt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "cardPayAmt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "AdvUsedAmt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Action", key: "action", align: "right", width: 110, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate1  // Assign ng-template to the column
    }
  ]
  AdvanceColumns = [
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UsedAmt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PayTM Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    {  heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
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
 

  Ipbillform: FormGroup;  
  BillDiscperFlag: boolean = false; 
  sIsLoading: string = '';
  showTable: boolean; 
  chargeslist: any = [];
  chargeslist1: any = []; 
  currentDate: Date = new Date(); 
  vClassId: any = 0;
  vClassName: any;
  vService: any;
  vAdminPer: any; 
  b_isPath = '';
  b_isRad = '';  
  dateTimeObj: any;
  PharmacyAmont: any = 0; 
  ServiceName: any;
  interimArray: any = [];
  screenFromString = 'Common-form';
  isLoadingStr: string = ''; 
  paidamt: any;
  balanceamt: any; 
  flagSubmit: boolean;
  Adminamt: any;
  Adminper: any; 
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
  showAutocomplete = false;
  Serviceform: FormGroup; 
  SelectedAdvancelist: any = []; 
  vPrice: any = '0';
  vQty: any;
  vServiceTotalAmt: any;
  vServiceNetAmt: any;
  vServiceDiscPer: any;
  doctorName: any
  doctorID: any;
  serviceId: any;
  vAdvanceId: any = 0;
  TotalAdvanceAmt: any = 0;
  BillBalAmount: any = 0; 
  ApiURL: any;

  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";
  autocompleteModeClass: string = "Class";

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('drawer') public drawer: MatDrawer;

  dataSource = new MatTableDataSource<ChargesList>();
  dataSource1 = new MatTableDataSource<ChargesList>();
  prevbilldatasource = new MatTableDataSource<Bill>();
  advancedatasource = new MatTableDataSource<any>();
  PackageDatasource = new MatTableDataSource
 
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: UntypedFormBuilder) {
    this.showTable = false;
  } 

  ngOnInit(): void { 
    this.createserviceForm();
    this.createBillForm();
    if (this.data) {
      this.selectedAdvanceObj = this.data.Obj;
      console.log(this.selectedAdvanceObj)
      this.opD_IPD_Id = this.selectedAdvanceObj.admissionId || "0"
      console.log(this.opD_IPD_Id)
      this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + 2 + "&ServiceName="
      this.getdata(this.selectedAdvanceObj.admissionId)
      this.getadvancelist(this.selectedAdvanceObj.admissionId)
      this.Serviceform.get("ChargeClass").setValue(this.selectedAdvanceObj.classId)
    }
    this.getChargesList();
    this.getBillheaderList();
    this.getPharmacyAmount();
    this.getRequestChargelist(); 


    if (this.selectedAdvanceObj.isDischarged) {
      this.Ipbillform.get('GenerateBill').enable();
      this.Ipbillform.get('GenerateBill').setValue(true);
    }
    else {
      this.Ipbillform.get('GenerateBill').disable();
      this.Ipbillform.get('GenerateBill').setValue(false);
    }
    if (this.selectedAdvanceObj.companyName) {
      this.Ipbillform.get('CreditBill').enable();
      this.Ipbillform.get('CreditBill').setValue(true);
    }
    else { 
      this.Ipbillform.get('CreditBill').setValue(false);
    }
    this.setupFormListener();
  }
  private setupFormListener(): void { 
    this.handleChange('price', () => this.calculateTotalCharge());
    this.handleChange('qty', () => this.calculateTotalCharge());
    this.handleChange('discPer', () => this.updateDiscountAmount());
    this.handleChange('discAmount', () => this.updateDiscountdiscPer()); 
  }
 
  isOpen: boolean = false; // Sidebar starts open

  toggleSidebar(obj) { 
    this.isOpen = !this.isOpen; 
  }
  calculateTotalCharge(row: any = null): void {
    let qty = +this.Serviceform.get("qty").value;
    let price = +this.Serviceform.get("price").value;

    if (qty <= 0 || price <= 0) return;

    let total = qty * price;
    this.Serviceform.patchValue({
      TotalAmt: total,
      netAmount: total  // Set net amount initially
    }, { emitEvent: false }); // Prevent infinite loop

    this.updateDiscountAmount();
    this.updateDiscountdiscPer();

  }
  // Trigger when discount discPer change
  updateDiscountAmount(row: any = null): void { 
    if (this.isUpdating) return; // Stop recursion
    this.isUpdating = true;

    const perControl = this.Serviceform.get("discPer");
    if (!perControl.valid) {
      this.Serviceform.get("discAmount").setValue(0);
      this.Serviceform.get("discPer").setValue(0);
      this.isUpdating = false;
      this.toastr.error("Enter discount % between 0-100");
      return;
    }
    let discPer = perControl.value;
    let totalAmount = this.Serviceform.get("TotalAmt").value;
    let discountAmount = parseFloat((totalAmount * discPer / 100).toFixed(2));
    let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));

    this.Serviceform.patchValue({
      discAmount: discountAmount,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  } 
  // Trigger when discount amount change
  updateDiscountdiscPer(): void {
    
    if (this.isUpdating) return;
    this.isUpdating = true;

    let discountAmount = this.Serviceform.get("discAmount").value;
    let totalAmount = this.Serviceform.get("TotalAmt").value;

    if (discountAmount < 0 || discountAmount > totalAmount) {
      this.Serviceform.get("discAmount").setValue(0);
      this.Serviceform.get("discPer").setValue(0);
      this.isUpdating = false;
      this.toastr.error("Discount must be between 0 and the total amount.");
      return;
    }

    let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
    let netAmount = Number((totalAmount - discountAmount).toFixed(2));
    this.Serviceform.patchValue({
      discPer: percent,
      netAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop

    this.isUpdating = false; // Reset flag
  } 
  getFixedDecimal(value: number) {
    return Number(value.toFixed(2));
  }
  // Create registered form group
  createserviceForm() {
    this.Serviceform = this.formBuilder.group({
      ChargeClass: ['', Validators.required],
      Date: [new Date()],
      ServiceName: ['', Validators.required],
      price: [0, Validators.required],
      qty: [1, Validators.required],
      TotalAmt: [0, Validators.required],
      DoctorID: [''],
      discPer: [0, [Validators.min(0), Validators.max(100)]],
      discAmount: [0, [Validators.min(0)]],
      netAmount: [0, Validators.required]
    });
  }
  createBillForm() {
    this.Ipbillform = this.formBuilder.group({ 
      AdminPer: ['', Validators.max(100)],
      AdminAmt: [0,[Validators.min(0)]], 
      totaldiscPer: [0,[Validators.min(0), Validators.max(100)]],
      totalconcessionAmt:  [0,[Validators.min(0)]], 
      ConcessionId: [''], 
      FinalAmount: [0,Validators.required], 
      CashCounterID: [4], 
      Remark: [''],
      Admincheck: [''],
      GenerateBill: [1],
      CreditBill: [''],
      ChargeDate:[new Date()]
    });
  }
  //service selected data
  getSelectedserviceObj(obj) {
    console.log(obj)
    this.ServiceName = obj.ServiceName;
    this.vPrice = obj.classRate;
    this.vServiceTotalAmt = obj.Price;
    this.vServiceNetAmt = obj.Price;
    this.serviceId = obj.serviceId;
    this.b_isPath = obj.isPathology;
    this.b_isRad = obj.isRadiology;

    if (obj.creditedtoDoctor == true) {
      this.Serviceform.get('DoctorID').reset();
      this.Serviceform.get('DoctorID').setValidators([Validators.required]);
      this.Serviceform.get('DoctorID').enable();
      this.isDoctor = true;

    } else {
      this.Serviceform.get('DoctorID').reset();
      this.Serviceform.get('DoctorID').clearValidators();
      this.Serviceform.get('DoctorID').updateValueAndValidity();
      this.Serviceform.get('DoctorID').disable();
      this.isDoctor = false;
    }
  } 
  //Doctor selected 
  getdocdetail(event) {
    this.doctorName = event.text
    this.doctorID = event.value
  }
  //Class selected 
  getSelectedClassObj(event) {
    this.vClassName = event.text
    this.vClassId = event.value
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + event.value + "&ServiceName="
  }

  // Service Add 
  onSaveAddCharges() {
    let doctorid = 0;
    let doctorName = '';

    let invalidFields = [];

    if (this.isDoctor) {
      if ((this.doctorID == '' || this.doctorID == null || this.doctorID == undefined)) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this.Serviceform.get("DoctorID").value)
        doctorid = this.Serviceform.get("DoctorID").value.DoctorID;

      if (this.Serviceform.get("DoctorID").value)
        doctorName = this.Serviceform.get("DoctorID").value.DoctorName;
    }

    if (this.Serviceform.valid) {
      const formValue = this.Serviceform.value;
      // console.log("Form values:", formValue) 
      // Check VisitFormGroup
      if (this.Serviceform.invalid) {
        for (const controlName in this.Serviceform.controls) {
          if (this.Serviceform.controls[controlName].invalid) {
            invalidFields.push(`Service Form: ${controlName}`);
          }
        }
      }
      // Show a toast for each invalid field
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      } 

      // Calculate total amount, discount amount, and net amount
      const totalAmount = formValue.price * formValue.qty;
      const discountAmount = (totalAmount * formValue.discPer) / 100;
      const netAmount = totalAmount - discountAmount;

      var m_data = {
        "chargesId": 0,
        "chargesDate": this.datePipe.transform(formValue.Date, "yyyy-MM-dd") || '1900-01-01',
        "opdIpdType": 1,
        "opdIpdId": this.opD_IPD_Id,
        "serviceId": formValue.ServiceName.serviceId,
        "price": formValue.price || 0,
        "qty": formValue.qty || 0,
        "totalAmt": totalAmount || 0,
        "concessiondiscPer": formValue.discPer || 0,
        "concessionAmount": discountAmount || 0,
        "netAmount": netAmount || 0,
        "doctorId": doctorid,
        "docdiscPer": 0,
        "docAmt": 0,
        "hospitalAmt": 0,
        "isGenerated": false,
        "addedBy": this.accountService.currentUserValue.userId,
        "isCancelled": false,
        "isCancelledBy": 0,
        "isCancelledDate": "1900-01-01",
        "isPathology": formValue.ServiceName.isPathology,
        "isRadiology": formValue.ServiceName.isRadiology,
        "isDoctorShareGenerated": 0,
        "isInterimBillFlag": 0,
        "isPackage": formValue.ServiceName.isPackage,
        "isSelfOrCompanyService": 0,
        "packageId": 0,
        "chargesTime": this.datePipe.transform(formValue.Date, "yyyy-MM-dd") || '1900-01-01', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
        "packageMainChargeId": 0,
        "classId": formValue.ChargeClass,
        "refundAmount": 0,
        "cPrice": 0,
        "cQty": 0,
        "cTotalAmount": 0,
        "isComServ": false,
        "isPrintCompSer": false,
        "serviceName": "",
        "chPrice": 0,
        "chQty": 0,
        "chTotalAmount": 0,
        "isBillableCharity": false,
        "salesId": 0,
        "billNo": 1,
        "isHospMrk": 0
      }
      console.log("Save JSON:", m_data);
      this._IpSearchListService.InsertIPAddCharges(m_data).subscribe(response => {
        console.log(response)
        this.toastr.success(response.message);
        this.getChargesList();
      }, (error) => {
        this.toastr.error(error.message);
      });

    }
    this.interimArray = [];
    this.isDoctor = false;
    this.onClearServiceAddList();
  }
  onClearServiceAddList() {
    this.Serviceform.get('ServiceName').setValue("");
    this.Serviceform.get('price').reset();
    this.Serviceform.get('qty').reset('1');
    this.Serviceform.get('TotalAmt').reset();
    this.Serviceform.get('DoctorID').reset();
    this.Serviceform.get('discPer').reset();
    this.Serviceform.get('discAmount').reset();
    this.Serviceform.get('netAmount').reset();
  }
  deletecharges(contact) {
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
          this.toastr.success(response.message);
          this.getChargesList();
          this.CalculateAdminCharge();
          this.CalFinalDiscper(); 
        }, (error) => {
          this.toastr.error(error.message); 
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
        "exportType": "JSON"
      }
      setTimeout(() => {
        this._IpSearchListService.AdvanceHeaderlist(vdata).subscribe((response) => {
          this.SelectedAdvancelist = response.data;
          if (this.SelectedAdvancelist.length > 0)
            this.vAdvanceId = this.SelectedAdvancelist[0].advanceId
          this.SelectedAdvancelist.forEach(element => {
            this.TotalAdvanceAmt += element.advanceAmount
          })
          let netAmt = this.Ipbillform.get('FinalAmount').value || 0
          if (this.TotalAdvanceAmt < netAmt) {
            this.BillBalAmount = netAmt - this.TotalAdvanceAmt
          } else {
            this.BillBalAmount = netAmt
          }

        });
      }, 500);
    }
  }
  //Charge list 
  chargeDate='01/01/1900'
  getChargesList() {
    debugger
    this.chargeslist = [];
    this.dataSource.data = []; 
    var vdata = {
      "first": 0,
      "rows": 100,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "OPD_IPD_Id",
          "fieldValue": String(this.opD_IPD_Id),
          "opType": "Equals"
         }
        ,
        {
          "fieldName": "ChargeDate",
          "fieldValue": String(this.chargeDate),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON"
    }
     console.log(vdata);
    this._IpSearchListService.getchargesList(vdata).subscribe(response => {
      this.chargeslist = response.data
      console.log(this.chargeslist)
      this.dataSource.data = this.chargeslist;
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
      this.getNetAmtSum()
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
  
  } 
  //Table Total netAmt
  TotalShowAmt:any=0; 
  DiscShowAmt:any=0;
  FinalNetAmt:any=0;
  getNetAmtSum() {
    this.FinalNetAmt = this.chargeslist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
    this.TotalShowAmt = this.chargeslist.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0);
    this.DiscShowAmt = this.chargeslist.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0);
  
    this.Ipbillform.patchValue({
      FinalAmount: this.FinalNetAmt,
      totalconcessionAmt:this.DiscShowAmt
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
  
  }  
  //Admin Charge Check Box On 
  isAdminDisabled: boolean = false; 
  AdminStatus(event) {
    if (event.checked == true) {
      this.isAdminDisabled = true;
    } else {
      this.isAdminDisabled = false;
      this.Ipbillform.get('AdminPer').reset();
      this.Ipbillform.get('AdminAmt').reset();
    } 
  } 
  //Admin calculation
  AdminShowAmt:any;
  CalculateAdminCharge() {  
    // debugger
    let finalNetAmt = 0
    let finalDiscAmt = 0 
    let discPer = this.Ipbillform.get('totaldiscPer').value || 0; 
    const perControl = this.Ipbillform.get("AdminPer");
    let adminPer = perControl.value;
    let totalAmount = this.TotalShowAmt;
    let adminAmt = parseFloat((totalAmount * adminPer / 100).toFixed(2)); 
    let finalTotalAmt = parseFloat((totalAmount + adminAmt).toFixed(2)); 

    if (!perControl.valid || perControl.value == 0) {  
      if(discPer > 0){ 
        this.ConcessionShow = true
        finalDiscAmt = parseFloat((totalAmount * discPer / 100).toFixed(2));
        finalNetAmt = parseFloat((totalAmount - finalDiscAmt).toFixed(2)); 
        }else{ 
          finalDiscAmt = this.DiscShowAmt  
          finalNetAmt =  this.FinalNetAmt
        } 
        this.Ipbillform.patchValue({
          AdminPer:'',
          AdminAmt: 0,
          totalconcessionAmt: finalDiscAmt, 
          FinalAmount: Math.round(finalNetAmt),
        }, { emitEvent: false }); 
     // this.toastr.error("Enter Admin % between 0-100");  
      return;
    } 
    if(this.DiscShowAmt > 0 ){
      this.ConcessionShow = true
      finalDiscAmt = this.DiscShowAmt
      finalNetAmt = parseFloat((finalTotalAmt - this.DiscShowAmt).toFixed(2));
    }else{ 
      if(discPer > 0){ 
      this.ConcessionShow = true
      finalDiscAmt = parseFloat((finalTotalAmt * discPer / 100).toFixed(2));
      finalNetAmt = parseFloat((finalTotalAmt - finalDiscAmt).toFixed(2));
      }else{
        finalNetAmt = finalTotalAmt
      }
    } 
    this.Ipbillform.patchValue({
      totalconcessionAmt: finalDiscAmt,
      AdminAmt:adminAmt || 0,
      FinalAmount: Math.round(finalNetAmt),
    }, { emitEvent: false }); // Prevent infinite loop
  
  }
  // Total Bill Disc Per cal 
  CalFinalDiscper() {
// debugger
    let netAmount =  this.FinalNetAmt;
    const perControl = this.Ipbillform.get("totaldiscPer");
    let discper = perControl.value;
    let totalAmount = this.TotalShowAmt;
    let AdminAmt = this.Ipbillform.get('AdminAmt').value || 0;
    let discountAmt = 0;
    let finalNetAmt  
    let FinalTotalAmt 

    if (!perControl.valid || perControl.value == 0 || perControl.value == '') { 
      if(AdminAmt > 0){  
          finalNetAmt = ((parseFloat(totalAmount) + parseFloat(AdminAmt))).toFixed(2); 
        }else{ 
          finalNetAmt =  this.FinalNetAmt
        } 
        // if(this.DiscShowAmt > 0)
        //   discountAmt = this.DiscShowAmt
        // else
        //   discountAmt = '' 
        this.ConcessionShow = false
        this.Ipbillform.patchValue({ 
          totaldiscPer:'',
          totalconcessionAmt:'',
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
    this.Ipbillform.patchValue({
      totalconcessionAmt: discountAmt, 
      FinalAmount: Math.round(finalNetAmt),
    }, { emitEvent: false }); // Prevent infinite loop 
  } 
   //Total Bill DiscAMt cal
   vTotalAmount:any;
   getDiscAmtCal() {
    // debugger
    const perControl = this.Ipbillform.get("totalconcessionAmt");
    let netAmount =  this.FinalNetAmt;
    let totalAmount = this.TotalShowAmt; 
    let discAmt = perControl.value; 
    let AdminAmt = this.Ipbillform.get('AdminAmt').value || 0;
    let discper = ''
    let finalNetAmt  
    let FinalTotalAmt 
    
    if (perControl.value == 0 || perControl.value == '' || perControl.value > totalAmount) { 
      if(AdminAmt > 0){  
        finalNetAmt = ((parseFloat(totalAmount) + parseFloat(AdminAmt))).toFixed(2); 
      }else{ 
        finalNetAmt =  this.FinalNetAmt
      } 
      this.ConcessionShow = false
      this.Ipbillform.patchValue({  
        totaldiscPer:'',
        totalconcessionAmt:'',
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

    this.Ipbillform.patchValue({
      totaldiscPer:discper,
      totalconcessionAmt: discAmt, 
      FinalAmount:Math.round(finalNetAmt),
    }, { emitEvent: false }); // Prevent infinite loop 
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
   //Save
   onSave() {
    debugger
    if(this.dataSource.data.length > 0 && this.Ipbillform.invalid){
      this.toastr.warning('Please check form is invalid.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.Ipbillform.get('totalconcessionAmt').value > 0 || this.Ipbillform.get('totaldiscPer').value > 0) {
      if (!this.Ipbillform.get('ConcessionId').value) {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (!this.Ipbillform.get('CashCounterID').value) {
      this.toastr.warning('Please select Cash Counter.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.dataSource.data.length > 0) {
      if (this.Ipbillform.get('GenerateBill').value) {
        Swal.fire({
          title: 'Do you want to generate the Final Bill ',
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Generate!"

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
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
      Swal.fire("Select Data For Save")
    } 
  }
  SaveBill1() {
    if (this.dataSource.data.length > 0 && this.Ipbillform.valid) {
      this.isLoading = 'submit';
      if (this.Ipbillform.get('CreditBill').value || this.selectedAdvanceObj.companyId) {
        this.IPCreditBill();
      }
      else {
        let PatientHeaderObj = {}; 
        PatientHeaderObj['Date'] = this.dateTimeObj.date;
        PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.patientName; 
        PatientHeaderObj['AdvanceAmount'] = this.Ipbillform.get('FinalAmount').value;
        PatientHeaderObj['NetPayAmount'] = this.Ipbillform.get('FinalAmount').value;
        PatientHeaderObj['BillNo'] = 0;
        PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.admissionId;
        PatientHeaderObj['IPDNo'] = this.selectedAdvanceObj.ipdno;
        PatientHeaderObj['RegNo'] = this.selectedAdvanceObj.regNo; 
        PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.doctorname; 
        PatientHeaderObj['CompanyName'] = this.selectedAdvanceObj.companyName;
        PatientHeaderObj['DepartmentName'] = this.selectedAdvanceObj.departmentName;
        PatientHeaderObj['Age'] = this.selectedAdvanceObj.ageYear; 


        console.log('============================== Save IP Billing ===========');
        //==============-======--==============Payment====================== 
        this.advanceDataStored.storage = new AdvanceDetailObj(PatientHeaderObj);
        // const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
        //   {
        //     maxWidth: "85vw",
        //     height: '750px',
        //     width: '100%',
        //     data: {
        //       vPatientHeaderObj: PatientHeaderObj,
        //       FromName: "IP-Bill",
        //       advanceObj: PatientHeaderObj
        //     }
        //   }); 
          const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
            {
              maxWidth: "85vw",
              height: '600px',
              width: '100%',
              data: {
                vPatientHeaderObj: PatientHeaderObj,
                FromName: "IP-Bill",
                advanceObj: PatientHeaderObj
              }
            }); 
        dialogRef.afterClosed().subscribe(result => {
          // console.log('============================== Save IP Billing ===========');
          console.log(result);  
          this.flagSubmit = result.IsSubmitFlag 
          if (this.flagSubmit) {
            this.paidamt = result.PaidAmt;
            this.balanceamt = result.BalAmt;
          }
          else {
            this.balanceamt = result.BalAmt;
          }
          let InsertBillUpdateBillNoObj = {};  
 
          InsertBillUpdateBillNoObj['billNo'] = 0;
          InsertBillUpdateBillNoObj['opdipdid'] = this.selectedAdvanceObj.admissionId;
          InsertBillUpdateBillNoObj['totalAmt'] = this.TotalShowAmt || 0;
          InsertBillUpdateBillNoObj['concessionAmt'] = this.Ipbillform.get('totalconcessionAmt').value || 0;
          InsertBillUpdateBillNoObj['netPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
          InsertBillUpdateBillNoObj['paidAmt'] = this.paidamt || 0;
          InsertBillUpdateBillNoObj['balanceAmt'] = this.balanceamt  || 0;
          InsertBillUpdateBillNoObj['billDate'] = this.datePipe.transform( this.dateTimeObj.date,'yyyy-MM-dd') || '1999-01-01';
          InsertBillUpdateBillNoObj['opdipdType'] = 1;
          InsertBillUpdateBillNoObj['addedBy'] = this.accountService.currentUserValue.userId,
          InsertBillUpdateBillNoObj['totalAdvanceAmount'] = this.TotalAdvanceAmt || 0;
          InsertBillUpdateBillNoObj['billTime'] = this.dateTimeObj.time;
          InsertBillUpdateBillNoObj['concessionReasonId'] = this.Ipbillform.get('ConcessionId').value || 0;
          InsertBillUpdateBillNoObj['isSettled'] = false;
          InsertBillUpdateBillNoObj['isPrinted'] = true;
          InsertBillUpdateBillNoObj['isFree'] = false;
          InsertBillUpdateBillNoObj['companyId'] = this.selectedAdvanceObj.companyId || 0;
          InsertBillUpdateBillNoObj['tariffId'] = this.selectedAdvanceObj.tariffId || 0;
          InsertBillUpdateBillNoObj['unitId'] = this.selectedAdvanceObj.hospitalID || 0;
          InsertBillUpdateBillNoObj['interimOrFinal'] = 0;
          InsertBillUpdateBillNoObj['companyRefNo'] = "";
          InsertBillUpdateBillNoObj['concessionAuthorizationName'] = 0;
          InsertBillUpdateBillNoObj['speTaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
          InsertBillUpdateBillNoObj['speTaxAmt'] = this.Ipbillform.get('AdminAmt').value || 0;
          InsertBillUpdateBillNoObj['discComments'] = this.Ipbillform.get('Remark').value || '';
          InsertBillUpdateBillNoObj['compDiscAmt'] = 0;
          InsertBillUpdateBillNoObj['cashCounterId'] = this.Ipbillform.get('CashCounterID').value || 0; 
    
          let Billdetsarr = [];
          this.dataSource.data.forEach((element) => {
            let BillDetailsInsertObj = {};
            BillDetailsInsertObj['billNo'] = 0;
            BillDetailsInsertObj['chargesId'] = element.chargesId;
            Billdetsarr.push(BillDetailsInsertObj);
          });
    
          let addChargeObj = {};
          addChargeObj['billNo'] = 0; 
    
          let addmissionObj = {};
          addmissionObj['admissionID'] = this.selectedAdvanceObj.admissionId;  

          let UpdateBillBalAmtObj = {}; 
          UpdateBillBalAmtObj['billNo'] = 0;
          UpdateBillBalAmtObj['balanceAmt'] = this.balanceamt || 0; 

          let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
          UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;  
       
          let UpdateAdvanceDetailarr = [];
          if (result.submitDataAdvancePay.length > 0) {
            result.submitDataAdvancePay.forEach((element) => {
              let UpdateAdvanceDetailObj = {};
              UpdateAdvanceDetailObj['advanceDetailID'] = element.AdvanceDetailID;
              UpdateAdvanceDetailObj['usedAmount'] = element.UsedAmount;
              UpdateAdvanceDetailObj['balanceAmount'] = element.BalanceAmount;
              UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
            });
          }
          else {
            let UpdateAdvanceDetailObj = {};
            UpdateAdvanceDetailObj['advanceDetailID'] = 0,
              UpdateAdvanceDetailObj['usedAmount'] = 0,
              UpdateAdvanceDetailObj['balanceAmount'] = 0,
              UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
          }

          let UpdateAdvanceHeaderObj = {};
          if (result.submitDataAdvancePay.length > 0) {
            UpdateAdvanceHeaderObj['advanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
              UpdateAdvanceHeaderObj['advanceUsedAmount'] = UpdateAdvanceDetailarr1[0]['AdvanceAmount'],
              UpdateAdvanceHeaderObj['balanceAmount'] = UpdateAdvanceDetailarr1[0]['BalanceAmount']
          }
          else {
            UpdateAdvanceHeaderObj['advanceId'] = 0,
              UpdateAdvanceHeaderObj['advanceUsedAmount'] = 0,
              UpdateAdvanceHeaderObj['balanceAmount'] = 0
          }

          let addChargessupdate ={}
          addChargessupdate['chargesID'] = 0 ;

          if (this.flagSubmit == true) {
            let submitData = {
              "bill": InsertBillUpdateBillNoObj,
              "billDetail": Billdetsarr,
              "addCharge": addChargeObj,
              "addmission": addmissionObj,
              "payment": result.submitDataPay.ipPaymentInsert,
              "bills": UpdateBillBalAmtObj,
              "advancesupdate": UpdateAdvanceDetailarr,
              "advancesHeaderupdate": UpdateAdvanceHeaderObj,
              "addChargessupdate":addChargessupdate
            };
            console.log(submitData) 
            this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
              this.toastr.success(response.message);
              this._matDialog.closeAll();
              this.viewgetBillReportPdf(response);
              this.getWhatsappshareIPFinalBill(response, this.vMobileNo)
            }, (error) => {
              this.toastr.error(error.message);
            });   
          }
        });
      }
    } 
  }
  IPCreditBill() {
    debugger
    if (this.Ipbillform.get('CreditBill').value) {
      let InsertBillUpdateBillNoObj = {}; 
      InsertBillUpdateBillNoObj['billNo'] = 0;
      InsertBillUpdateBillNoObj['opdipdid'] = this.selectedAdvanceObj.admissionId;
      InsertBillUpdateBillNoObj['totalAmt'] = this.TotalShowAmt || 0;
      InsertBillUpdateBillNoObj['concessionAmt'] = this.Ipbillform.get('totalconcessionAmt').value || 0;
      InsertBillUpdateBillNoObj['netPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertBillUpdateBillNoObj['paidAmt'] = 0;
      InsertBillUpdateBillNoObj['balanceAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertBillUpdateBillNoObj['billDate'] = this.datePipe.transform( this.dateTimeObj.date,'yyyy-MM-dd') || '1999-01-01';
      InsertBillUpdateBillNoObj['opdipdType'] = 1;
      InsertBillUpdateBillNoObj['addedBy'] = this.accountService.currentUserValue.userId,
      InsertBillUpdateBillNoObj['totalAdvanceAmount'] = this.TotalAdvanceAmt || 0;
      InsertBillUpdateBillNoObj['billTime'] = this.dateTimeObj.time;
      InsertBillUpdateBillNoObj['concessionReasonId'] = this.Ipbillform.get('ConcessionId').value || 0;
      InsertBillUpdateBillNoObj['isSettled'] = false;
      InsertBillUpdateBillNoObj['isPrinted'] = true;
      InsertBillUpdateBillNoObj['isFree'] = false;
      InsertBillUpdateBillNoObj['companyId'] = this.selectedAdvanceObj.companyId || 0;
      InsertBillUpdateBillNoObj['tariffId'] = this.selectedAdvanceObj.tariffId || 0;
      InsertBillUpdateBillNoObj['unitId'] = this.selectedAdvanceObj.hospitalID || 0;
      InsertBillUpdateBillNoObj['interimOrFinal'] = 0;
      InsertBillUpdateBillNoObj['companyRefNo'] = "";
      InsertBillUpdateBillNoObj['concessionAuthorizationName'] = 0;
      InsertBillUpdateBillNoObj['speTaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
      InsertBillUpdateBillNoObj['speTaxAmt'] = this.Ipbillform.get('AdminAmt').value || 0;
      InsertBillUpdateBillNoObj['discComments'] = this.Ipbillform.get('Remark').value || '';
      InsertBillUpdateBillNoObj['compDiscAmt'] = 0;
      InsertBillUpdateBillNoObj['cashCounterId'] = this.Ipbillform.get('CashCounterID').value || 0; 

      let billDetailscreditInsert = [];
      this.dataSource.data.forEach((element) => {
        let BillDetailsInsertObj = {};
        BillDetailsInsertObj['billNo'] = 0;
        BillDetailsInsertObj['chargesId'] = element.chargesId;
        billDetailscreditInsert.push(BillDetailsInsertObj);
      });

      let addChargeObj = {};
      addChargeObj['billNo'] = 0; 

      let addmissionObj = {};
      addmissionObj['admissionID'] = this.selectedAdvanceObj.admissionId; 

      let billsObj = {}; 
      billsObj['billNo'] = 0;
      billsObj['balanceAmt'] = parseFloat(this.Ipbillform.get('FinalAmount').value) || 0; 
 
      let advancesupdate = []; 
      let advancesupdateObj = {};
      advancesupdateObj['advanceDetailID'] = 0,
      advancesupdateObj['usedAmount'] = 0,
      advancesupdateObj['balanceAmount'] = 0,
      advancesupdate.push(advancesupdateObj);

      let advancesHeaderupdate = {};
      advancesHeaderupdate['advanceId'] = 0,
      advancesHeaderupdate['advanceUsedAmount'] = 0,
      advancesHeaderupdate['balanceAmount'] = 0 
     
     
      let submitData = {
        "bill": InsertBillUpdateBillNoObj,
        "billDetail": billDetailscreditInsert,
        "addCharge": addChargeObj,
        "addmission": addmissionObj, 
        "bills": billsObj,
        "advancesupdate": advancesupdate,
        "advancesHeaderupdate": advancesHeaderupdate 
      };
      console.log(submitData);
      this._IpSearchListService.InsertIPBillingCredit(submitData).subscribe(response => {
        this.toastr.success(response.message);
        this.viewgetBillReportPdf(response);  
        this._matDialog.closeAll();
      }, (error) => {
        this.toastr.error(error.message);
      }); 
    }
    else {
      Swal.fire('check is a credit bill or not ')
    }

    this.advanceDataStored.storage = [];
  }
  onSaveDraft() {
debugger
    if (this.dataSource.data.length > 0 && this.Ipbillform.valid) { 
      this.isLoading = 'submit'; 
      let InsertDraftBillOb = {};
      InsertDraftBillOb['drbno'] = 0;
      InsertDraftBillOb['opdIpdId'] = this.selectedAdvanceObj.admissionId;
      InsertDraftBillOb['totalAmt'] = this.TotalShowAmt || 0;
      InsertDraftBillOb['concessionAmt'] = this.Ipbillform.get('totalconcessionAmt').value || 0;
      InsertDraftBillOb['netPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertDraftBillOb['paidAmt'] = 0;
      InsertDraftBillOb['balanceAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertDraftBillOb['billDate'] = this.datePipe.transform( this.dateTimeObj.date,'yyyy-MM-dd') || '1999-01-01';
      InsertDraftBillOb['opdIpdType'] = 1;
      InsertDraftBillOb['totalAdvanceAmount'] = this.TotalAdvanceAmt || 0;
      InsertDraftBillOb['advanceUsedAmount'] = 0;
      InsertDraftBillOb['addedBy'] = this.accountService.currentUserValue.userId; 
      InsertDraftBillOb['billTime'] = this.dateTimeObj.time;
      InsertDraftBillOb['concessionReasonId'] = this.Ipbillform.get('ConcessionId').value || 0;
      InsertDraftBillOb['isSettled'] = true;
      InsertDraftBillOb['isPrinted'] = true;
      InsertDraftBillOb['isFree'] = false;
      InsertDraftBillOb['companyId'] = this.selectedAdvanceObj.companyId || 0;
      InsertDraftBillOb['tariffId'] =this.selectedAdvanceObj.tariffId || 0;
      InsertDraftBillOb['unitId'] = this.selectedAdvanceObj.hospitalID || 0;
      InsertDraftBillOb['interimOrFinal'] = 0;
      InsertDraftBillOb['companyRefNo'] = "";
      InsertDraftBillOb['concessionAuthorizationName'] = 0;
      InsertDraftBillOb['taxPer'] = this.Ipbillform.get('AdminPer').value || 0;
      InsertDraftBillOb['taxAmount'] = this.Ipbillform.get('AdminAmt').value || 0;

      let DraftBilldetsarr = [];
      this.dataSource.data.forEach((element) => {
        let DraftBillDetailsInsertObj = {};
        DraftBillDetailsInsertObj['drNo'] = 0;
        DraftBillDetailsInsertObj['chargesId'] = element.chargesId;
        DraftBilldetsarr.push(DraftBillDetailsInsertObj);
      }); 
      
      let submitData = {
        "tDrbill": InsertDraftBillOb,
        "tdrBillDet": DraftBilldetsarr
      };
      console.log('============== Save IP Draft Bill Json ===========',submitData)
      this._IpSearchListService.InsertIPDraftBilling(submitData).subscribe(response => {
        this.toastr.success(response.message);
        this.viewgetDraftBillReportPdf(response);  
        this._matDialog.closeAll();
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
    this._matDialog.closeAll();
  }
  onClose() {
    this.dialogRef.close({ result: "cancel" });
    this.advanceDataStored.storage = [];
  }

//Interim bill
  //select cehckbox
  tableElementChecked(event, element) {
    console.log(event)
    console.log(element)
    if (event.checked) {
      this.interimArray.push(element);
      console.log(this.interimArray)
    } else if (this.interimArray.length > 0) {
      let index = this.interimArray.indexOf(element);
      if (index !== -1) {
        this.interimArray.splice(index, 1);
      }
    }
  }
  //Intrim bill popup 
  getInterimData() {
    debugger
    if (this.interimArray.length > 0) {
      console.log('this.interimArray==', this.interimArray);
      this._matDialog.open(InterimBillComponent,
        {
          maxWidth: "85vw",
          width: '100%',
          height: "75%",
          data: {
            PatientHeaderObj: this.selectedAdvanceObj,
            Obj: this.interimArray
          }
        });
    } else {
      Swal.fire('Warring !', 'Please select check box ', 'warning');
    }
    this.getChargesList();
    this.interimArray = [];
  }

 
 
  //Pharamcy Amount 
  getPharmacyAmount() {
    let Query = "select isnull(Sum(BalanceAmount),0) as PhBillCredit from T_SalesHeader where OP_IP_Type=1 and OP_IP_ID=" + this.selectedAdvanceObj.AdmissionID
    this._IpSearchListService.getPharmacyAmt(Query).subscribe((data) => {
      console.log(data)
      this.PharmacyAmont = data[0].PhBillCredit;
    })
  }

  getRequestChargelist() {
    this.chargeslist1 = [];
    this.dataSource1.data = [];
    var m = {
      OP_IP_ID: this.selectedAdvanceObj.AdmissionID,
    }
    this._IpSearchListService.getchargesList1(m).subscribe(data => {
      this.chargeslist1 = data as ChargesList[];
      this.dataSource1.data = this.chargeslist1;
      // console.log(this.dataSource1.data)
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
    //console.log(Query); 
    this._IpSearchListService.getBillheaderList(Query).subscribe(data => {
      this.billheaderlist = data[0].AdminPer;
      // console.log(this.billheaderlist)
      if (this.billheaderlist > 0) {
        this.isAdminDisabled = true;
        this.Ipbillform.get('Admincheck').setValue(true)
        this.vAdminPer = this.billheaderlist
        //   console.log(this.vAdminPer)
      } else {
        this.isAdminDisabled = false;
        this.Ipbillform.get('Admincheck').setValue(false)
      }
    });
  }
  //nursing Service List added
  AddList(m) {
    console.log(m)
    var m_data = {
      "chargeID": 0,
      "chargesDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
      "opD_IPD_Type": 1,
      "opD_IPD_Id": m.OP_IP_ID,
      "serviceId": m.ServiceId,
      "price": m.price,
      "qty": 1,
      "totalAmt": (m.price * 1),
      "concessiondiscPer": 0,
      "concessionAmount": 0,
      "netAmount": (m.price * 1),
      "doctorId": 0,
      "docdiscPer": 0,
      "docAmt": 0,
      "hospitalAmt": 0,
      "isGenerated": 0,
      "addedBy": this.accountService.currentUserValue.userId,
      "isCancelled": 0,
      "isCancelledBy": 0,
      "isCancelledDate": "01/01/1900",
      "isPathology": m.IsPathology,
      "isRadiology": m.IsRadiology,
      "isPackage": 0,
      "packageMainChargeID": 0,
      "isSelfOrCompanyService": false,
      "packageId": 0,
      "chargeTime": this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
      "classId": this.Serviceform.get("ChargeClass").value.ClassId
    }
    let submitData = {
      "addCharges": m_data
    };
    this._IpSearchListService.InsertIPAddChargesNew(submitData).subscribe(data => {
      if (data) {
        Swal.fire('Success !', 'ChargeList Row Added Successfully', 'success');
        this.getChargesList();
      }
    });
    this.onClearServiceAddList() 
    this.isLoading = '';
  }
 
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  } 
  chkprint: boolean = false;
  AdList: boolean = false;
  viewgetIPAdvanceReportPdf(contact) {
    this.chkprint = true;
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
      this.AdList = true;

      this._IpSearchListService.getViewAdvanceReceipt(
        contact.AdvanceDetailID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Ip advance Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100)
    this.chkprint = false;
  }
  // onwhatsappbill() {
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
  viewgetInterimBillReportPdf(contact) {
    this._IpSearchListService.getIpInterimBillReceipt(
      contact.BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Interim Bill  Viewer"
          }
        });
    });
  }
  //For testing 
  viewgetDraftBillReportPdf(AdmissionID) {
    this._IpSearchListService.getIpDraftBillReceipt(
      AdmissionID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Draft Bill  Viewer"
          }
        });
    });
  }
  viewgetBillReportPdf(BillNo) {
    this._IpSearchListService.getIpFinalBillReceiptgroupwise(
      BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Bill  Viewer"
          }
        });
    });
  }
 
  showAllFilter(event) {
    console.log(event);
    if (event.checked == true) 
      this.isFilteredDateDisabled = true;
    if (event.checked == false) {
      this.chargeDate  = '01/01/1900'
      this.getChargesList();
      this.isFilteredDateDisabled = false;
    }
  }
  getDatewiseChargesList(param) {
    debugger
    this.chargeslist = [];
    this.dataSource.data = [];
    this.chargeDate  = this.datePipe.transform(this.Ipbillform.get('ChargeDate').value,"MM/dd/yyyy")
    this.getChargesList()
  }
  OnDateChange() { 
    // if (this.selectedAdvanceObj.AdmDateTime) {
    //   const day = +this.selectedAdvanceObj.AdmDateTime.substring(0, 2);
    //   const month = +this.selectedAdvanceObj.AdmDateTime.substring(3, 5);
    //   const year = +this.selectedAdvanceObj.AdmDateTime.substring(6, 10);

    //  // this.vExpDate = `${year}/${this.pad(month)}/${day}`;
    // }
    //const serviceDate = this.datePipe.transform(this.Serviceform.get('Date').value,"dd/MM/yyyy") || 0;
   // const AdmissionDate = this.datePipe.transform(this.selectedAdvanceObj.AdmDateTime,"yyyy-MM-dd 00:00:00.000") || 0;
    // if(serviceDate > AdmissionDate){
    //   Swal.fire('should not chnage');
    // }
    // else{
    //   Swal.fire('ok');
    // }
  
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
 
  getPreBilldet(contact) {
    //console.log(contact)
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
  }

}

export class BillDetails {
  BillNo: number;
  ChargesID: number;

  constructor(BillDetailsInsertObj) {
    this.BillNo = BillDetailsInsertObj.BillNo || 0;
    this.ChargesID = BillDetailsInsertObj.ChargesID || 0;
  }

}
export class Cal_DiscAmount {
  BillNo: number;

  constructor(Cal_DiscAmount_IPBillObj) {
    this.BillNo = Cal_DiscAmount_IPBillObj.BillNo || 0;
  }

}

export class AdmissionIPBilling {
  AdmissionID: number;

  constructor(Cal_DiscAmount_IPBillObj) {
    this.AdmissionID = Cal_DiscAmount_IPBillObj.AdmissionID || 0;
  }

}


export class PatientBilldetail {
  AdmissionID: Number;
  BillNo: any;
  BillDate: Date;
  concessionReasonId: number;
  tariffId: number;
  RemarkofBill: string
  /**
 * Constructor
 *
 * @param PatientBilldetail
 */
  constructor(PatientBilldetail) {
    {
      this.AdmissionID = PatientBilldetail.AdmissionID || '';
      this.BillNo = PatientBilldetail.BillNo || '';
      this.BillDate = PatientBilldetail.BillDate || '';
      this.concessionReasonId = PatientBilldetail.concessionReasonId || '';
      this.tariffId = PatientBilldetail.tariffId || '';
      this.RemarkofBill = PatientBilldetail.RemarkofBill;
    }
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