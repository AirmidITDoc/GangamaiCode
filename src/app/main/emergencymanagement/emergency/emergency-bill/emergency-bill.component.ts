import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { element } from 'protractor';
import { EmergencyService } from '../emergency.service';
import { ChargesList } from '../emergency.component';

@Component({
  selector: 'app-emergency-bill',
  templateUrl: './emergency-bill.component.html',
  styleUrls: ['./emergency-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmergencyBillComponent {
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
  NurReqColumns = [
    'ServiceName',
    'Price',
    'reqDate',
    'reqTime',
    'billingUser',
    'Action'
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

  selectedAdvanceObj: any;
  isOpen: boolean = false; // Sidebar starts open  
  screenFromString = 'Common-form';
  dateTimeObj: any;
  Serviceform: FormGroup;
  IpbillFooterform: FormGroup;
  ApiURL: any;
  opD_IPD_Id: any = "0"
  isDoctor: boolean = false;
  doctorID: any;
  interimArray: any = [];
  chargeslist: any = [];
  chargeslist1: any = [];
  currentDate: Date = new Date();
  copiedData: any[] = [];
  isLoadingStr: string = '';
  isFilteredDateDisabled: boolean = false;
  vAdvanceId: any = 0;
  TotalAdvanceAmt: any = 0;
  BillBalAmount: any = 0;
  AdvanceBalAmt: any = 0;
  PharmacyAmont: any = 0;
  BillDiscperFlag: boolean = false;
  public subscription: Array<Subscription> = [];
  public isUpdating = false;
  checkdata:any=0;

  // 
    draftSaveform: FormGroup;
    IPBillMyForm:FormGroup 
    sIsLoading: string = '';  
    vMobileNo: any;
    ConcessionShow: boolean = false;
    // 

  autocompleteModeClass: string = "Class";
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";

  dataSource1 = new MatTableDataSource<ChargesList>();
  dataSource = new MatTableDataSource<ChargesList>();  
  prevbilldatasource = new MatTableDataSource<Bill>();
  PackageDatasource = new MatTableDataSource

  @ViewChild('serviceTable') serviceTable!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate5') actionButtonTemplate5!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
    this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate5;
  }

  constructor(
    public _printPreview: PrintPreviewService,
    public _matDialog: MatDialog,
    public _EmergencyService: EmergencyService,
    // private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<EmergencyBillComponent>,
    private accountService: AuthenticationService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public toastr: ToastrService,
    public _ConfigService: ConfigService,
    private commonService: PrintserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.Serviceform = this.createserviceForm();
    this.Serviceform.markAllAsTouched();

    this.IpbillFooterform = this.createBillForm();
    this.IpbillFooterform.markAllAsTouched();

    this.IPBillMyForm=this.CreateIPBillForm();
    
    if (this.data) {
      this.selectedAdvanceObj = this.data;
      console.log(this.selectedAdvanceObj)
      this.opD_IPD_Id = this.selectedAdvanceObj.admissionId || "0"
      this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=1&ClassId=1&ServiceName="
      // this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + this.selectedAdvanceObj.classId + "&ServiceName="
       this.getdata(this.selectedAdvanceObj.admissionId)
       this.Serviceform.get("classId").setValue(this.selectedAdvanceObj.classId)
       this.IPBillMyForm=this.CreateIPBillForm();
       this.checkdata = 1
    }
    this.getChargesList();
    this.getLabRequestChargelist();
    this.setupFormListener();

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

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  //////////////////////////////////// NURSING TABLE //////////////////////////////

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
  
    gridConfig2: gridModel = {
    apiUrl: "IPBill/PathRadRequestList",
    columnsList: this.NursingReqListColumn,
    sortField: "ServiceId",
    sortOrder: 0,
    filters: [
      { fieldName: "OP_IP_ID", fieldValue: String(this.opD_IPD_Id), opType: OperatorComparer.Equals }
    ]
  }

    //////////////////////////////////// END NURSING TABLE //////////////////////////////

  //////////////////////////////////// 1ST TAB ////////////////////////////////////
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
    this.chargeDate = this.datePipe.transform(this.IpbillFooterform.get('ChargeDate').value, "MM/dd/yyyy")
    this.getChargesList()
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
    console.log(m_data)
    this._EmergencyService.InsertIPAddChargesNew(m_data).subscribe(data => {
      if (data) {
        this.getLabRequestChargelist();
        this.getChargesList();
      }
    });
    this.onClearServiceAddList()
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
        {
          "fieldName": "OP_IP_ID",
          "fieldValue": String(this.opD_IPD_Id),
          "opType": "Equals"
        }

      ],
      "Columns": [],
      "exportType": "JSON"
    }
    this._EmergencyService.getchargesList1(m).subscribe(response => {
      this.chargeslist1 = response.data
      this.dataSource1.data = this.chargeslist1;
      console.log(this.dataSource1.data)
    });
  }

  //Charge list 
  chargeDate = '01/01/1900'
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
      "Columns": [],
      "exportType": "JSON"
    }
    this._EmergencyService.getchargesList(vdata).subscribe(response => {
      this.chargeslist = response.data
      console.log(this.chargeslist)
      this.dataSource.data = this.chargeslist;
      this.copiedData = structuredClone(this.chargeslist);
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    this.getNetAmtSum()
    this.getbillbalamt();
    });
  }

   //Table Total netAmt
  TotalShowAmt: any = 0;
  DiscShowAmt: any = 0;
  FinalNetAmt: any = 0;
  getNetAmtSum() {
    this.FinalNetAmt = this.chargeslist.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
    this.TotalShowAmt = this.chargeslist.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0);
    this.DiscShowAmt = this.chargeslist.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0);

    this.IpbillFooterform.patchValue({
      FinalAmount: this.FinalNetAmt,
      totalconcessionAmt: this.DiscShowAmt,
       TotalAmt:this.TotalShowAmt 
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

  checkAdvBalAmt:any=0;
  getbillbalamt() { 
    this.AdvanceBalAmt = this.checkAdvBalAmt
    if (this.AdvanceBalAmt > 0) {
      let netAmt = this.IpbillFooterform.get('FinalAmount').value || 0
      if (netAmt > this.AdvanceBalAmt) {
        this.AdvanceBalAmt = this.checkAdvBalAmt
        this.BillBalAmount = netAmt - this.checkAdvBalAmt
      } else {
        let balamt = this.AdvanceBalAmt - netAmt
        this.AdvanceBalAmt= balamt
        this.BillBalAmount = 0;
      }
    }
  }

  //////////////////////////////////// END OF 1ST TAB ////////////////////////////////////

  //////////////////////////////////// 2ND TAB ////////////////////////////////////
  openServiceTable(): void {
    this._matDialog.open(this.serviceTable, {
      width: '50%',
      height: '60%',
    })
  }
  oncloseservice() {
    this.dialogRef.close(this.serviceTable);
  }
  ChangeTariffname() {
    Swal.fire({
      title: 'Do you want to change Tariff Name',
      text: "Do you want to change the all the rate or not!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!"
    }).then((flag) => {
      if (flag.isConfirmed) {

      } else {

      }
    })
  }
  ChangeClassname() {
    Swal.fire({
      title: 'Do you want to change Class Name',
      text: "Do you want to change the all the rate or not!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!"
    }).then((flag) => {
      if (flag.isConfirmed) {

      } else {

      }
    })
  }
  //////////////////////////////////// END OF 2ND TAB ////////////////////////////////////

  //////////////////////////////////// 3ND TAB TABLE ////////////////////////////////////

  // 1St table
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

  getpackageDet(contact) {
    // const dialogRef = this._matDialog.open(IPPackageDetComponent,
    //   {
    //     maxWidth: "100%",
    //     height: '75%',
    //     width: '70%',
    //     data: {
    //       Obj: contact,
    //       Selected: this.selectedAdvanceObj,
    //       FormName: 'IPD Package'
    //     }
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   this.getChargesList()
    // });
  }

  gettablecalculation(element) {
    // Checking if old value is same as new value
    const oldElement = this.copiedData.find(i => i.chargesId === element.chargesId);
    element.isUpdated = oldElement.price != element.price || oldElement.qty != element.qty;

    if (element.price > 0 && element.qty > 0) {
      element.totalAmt = element.qty * element.price || 0;
      element.DiscAmt = (element.ConcessionPercentage * element.totalAmt) / 100 || 0;
      element.netAmount = element.totalAmt - element.DiscAmt
    }
    else if (element.price == 0 || element.price == '' || element.qty == '' || element.qty == 0) {
      element.totalAmt = 0;
      element.DiscAmt = 0;
      element.netAmount = 0;
    }
  }

  EditDoctor: boolean = false;
  DocenableEditing(row: ChargesList) {
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
      "doctorId": DoctorId || 0
    }
    console.log(addCharge)
    this._EmergencyService.UpdateChargesDetails(addCharge, element.chargesId).subscribe(response => {
      if (response) {
        this.getChargesList()
      }
    });
  }

  deletecharges(contact) {
    if (contact.isPathTestCompleted == 1) {
      this.toastr.warning('Selected Service Test is Already Completed you cannot delete !', 'warning', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    if (contact.isRadTestCompleted == 1) {
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
        this._EmergencyService.AddchargesDelete(submitData).subscribe(response => {
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

  //Admin calculation
  AdminShowAmt: any;

  CalculateAdminCharge() {
    // debugger
    let finalNetAmt = 0
    let finalDiscAmt = 0
    let discPer = this.IpbillFooterform.get('totaldiscPer').value || 0;
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
  // Total Bill Disc Per cal 
  CalFinalDiscper() {
    // debugger
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

  // 2nd table

  PacakgeList: any = [];
  PacakgeOptionlist: any = [];
  getpackagedetList(obj) {
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "ChargesId",
      "sortOrder": 0,
      "filters": [

        {
          "fieldName": "ChargesId",
          "fieldValue": String(obj.chargesId),
          "opType": "Equals"
        }
      ],
      "columns": [],
      "exportType": "JSON"
    }
    this._EmergencyService.getpackagedetList(vdata).subscribe((response) => {
      this.PacakgeList = response.data as [];
      this.PacakgeList.forEach(element => {
        this.PacakgeOptionlist.data.push(
          {
            ServiceId: element.packageServiceId,
            ServiceName: element.serviceName,
            Price: element.price || 0,
            Qty: element.qty || 1,
            TotalAmt: element.totalAmt,
            ConcessionAmt: element.concessionAmount,
            NetAmount: element.netAmount,
            IsPathology: element.isPathology,
            IsRadiology: element.isRadiology,
            PackageId: element.packageId,
            PackageServiceId: element.serviceId,
            PacakgeServiceName: element.pacakgeServiceName,
            DoctorName: element.doctorName || '',
            DoctorId: element.doctorId || 0,
          })
      })
      this.PackageDatasource.data = this.PacakgeOptionlist
      this.PacakgeList = this.PackageDatasource.data
      console.log(this.PackageDatasource.data);
    });
  }

  // 3nd table
  getPreBilldet(contact) {
    // const dialogRef = this._matDialog.open(PrebillDetailsComponent,
    //   {
    //     maxWidth: "100%",
    //     height: '60%',
    //     width: '74%',
    //     data: {
    //       Obj: contact
    //     }
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    // });
  }

  allColumns = [
    { heading: "Date", key: "bDate", sort: true, align: 'left', emptySign: 'NA', width: 110, type: 9 },
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

  gridConfig1: gridModel = {
    apiUrl: "IPBill/IPPreviousBillList", //"IPBill/IPPreviousBillList",
    columnsList: this.allColumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters: [{ fieldName: "IP_Id", fieldValue: String(this.opD_IPD_Id), opType: OperatorComparer.Equals }]
  }

  viewgetInterimBillReportPdf(element) {
    this.commonService.Onprint("BillNo", element.billNo, "IpInterimBill");
  }

  //////////////////////////////////// END OF 3ND TAB TABLE ////////////////////////////////////

  //////////////////////////////////// 4TH TAB FOOTER ////////////////////////////////////
  isAdminDisabled: boolean = false;
  AdminStatus(event) {
    if (event.checked == true) {
      this.isAdminDisabled = true;
    } else {
      this.isAdminDisabled = false;
      this.IpbillFooterform.get('AdminPer').reset();
      this.IpbillFooterform.get('AdminAmt').reset();
    }
  }
  //Total Bill DiscAMt cal
  vTotalAmount: any;
  getDiscAmtCal() {
    // debugger
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

  onClose() {
    this.dialogRef.close({ result: "cancel" });
    // this.advanceDataStored.storage = [];
  }

  onSave() {
    debugger
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

  SaveBill1() { 
      this.IPBillMyForm.get('bill.totalAmt')?.setValue(this.IpbillFooterform.get('TotalAmt')?.value)
      this.IPBillMyForm.get('bill.concessionAmt')?.setValue(this.IpbillFooterform.get('totalconcessionAmt')?.value)
      this.IPBillMyForm.get('bill.netPayableAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value)
      this.IPBillMyForm.get('bill.billDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
      this.IPBillMyForm.get('bill.billTime').setValue(this.dateTimeObj.time)
      this.IPBillMyForm.get('bill.concessionReasonId')?.setValue(this.IpbillFooterform.get('ConcessionId')?.value)
      this.IPBillMyForm.get('bill.discComments')?.setValue(this.IpbillFooterform.get('Remark')?.value)
      this.IPBillMyForm.get('bill.cashCounterId')?.setValue(this.IpbillFooterform.get('CashCounterID')?.value)
      this.IPBillMyForm.get('bill.totalAdvanceAmount')?.setValue(this.TotalAdvanceAmt)
      this.IPBillMyForm.get('bill.speTaxPer')?.setValue(this.IpbillFooterform.get('AdminPer').value || 0)
      this.IPBillMyForm.get('bill.speTaxAmt')?.setValue(this.IpbillFooterform.get('AdminAmt').value)
  
      if (this.IPBillMyForm.valid && this.dataSource.data.length > 0) {
        if (this.IpbillFooterform.get('CreditBill').value || this.selectedAdvanceObj.companyId) {
          this.IPBillMyForm.get('bill.paidAmt')?.setValue(0)
          this.IPBillMyForm.get('bill.balanceAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value)
          this.IPBillMyForm.get('bills.balanceAmt')?.setValue(this.IpbillFooterform.get('FinalAmount')?.value)
          this.IPBillMyForm.get('payment.paymentDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
          this.IPBillMyForm.get('payment.paymentTime').setValue(this.dateTimeObj.time)
  
          this.BillDetailsArray.clear();
          this.dataSource.data.forEach(item => {
            this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
          });
  
          console.log(this.IPBillMyForm.value);
          this._EmergencyService.InsertIPBillingCredit(this.IPBillMyForm.value).subscribe(response => {
            this.viewgetBillReportPdf(response);
            this._matDialog.closeAll();
          });
        }
        
      } else {
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
      }
    } 

  onSaveDraft() {

  }

   viewgetBillReportPdf(billNo) {
    this.commonService.Onprint("BillNo", billNo, "IPFinalBillGroupwise");
  }

  //////////////////////////////////// END 4TH TAB FOOTER ////////////////////////////////////

  //////////////////////////////////// SIDE BAR CODE ////////////////////////////////////
  
  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  handleChange(key: string, callback: () => void, form: FormGroup = this.Serviceform) {
    this.subscription.push(form.get(key).valueChanges.subscribe(value => {
      callback();
    }));
  }

   private setupFormListener(): void {
    this.handleChange('price', () => this.calculateTotalCharge());
    this.handleChange('qty', () => this.calculateTotalCharge());
    this.handleChange('concessiondiscPer', () => this.updateDiscountAmount());
    this.handleChange('concessionAmount', () => this.updateDiscountdiscPer());
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
      this.toastr.error("Enter discount % between 0-100");
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

  //service selected data
  getselectObj(obj) {
    this.Serviceform.patchValue({
      price: obj.classRate
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
    //this.getpackagedetList(obj) 
  }
  //Doctor selected 
  getdocdetail(event) {
    this.doctorID = event.value
    const discPerElement = document.querySelector(`[name='concessionPercentage']`) as HTMLElement;
    if (event.value) {
      discPerElement.focus();
    }
  }
  //Class selected 
  getSelectedClassObj(event) {
    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=1 &ClassId=" + event.value + "&ServiceName="
    // this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + this.selectedAdvanceObj.tariffId + "&ClassId=" + event.value + "&ServiceName="
  }
  // Service Add 
  onSaveAddCharges() {
    const formValue = this.Serviceform.value
    let doctorid = 0;
    if (this.isDoctor) {
      if ((formValue.doctorId == '' || formValue.doctorId == null || formValue.doctorId == '0')) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (formValue.doctorId)
        doctorid = this.Serviceform.get("doctorId").value;
    }
    debugger

    // this.Serviceform.get("opdIpdId").setValue(this.opD_IPD_Id || 1) //add 0 in or
    this.Serviceform.get("opdIpdId").setValue(1) //add 0 in or
    this.Serviceform.get("isPathology").setValue(formValue.serviceName?.isPathology ?? 0)
    this.Serviceform.get("isRadiology").setValue(formValue.serviceName?.isRadiology ?? 0)
    this.Serviceform.get("isPackage").setValue(formValue.serviceName?.isPackage ?? 0)
    this.Serviceform.get("serviceName").setValue(formValue.serviceName?.serviceName ?? '')
    // this.Serviceform.get("serviceId").setValue(formValue.serviceId?.serviceId ?? 0)
    this.Serviceform.get("doctorId").setValue(doctorid)

    console.log(this.Serviceform.value)
    if (this.Serviceform.valid) {
      console.log('valida service form', this.Serviceform.value)
      this._EmergencyService.InsertIPAddCharges(this.Serviceform.value).subscribe(response => {
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
    this.onClearServiceAddList();
    const serviceIdElement = document.querySelector(`[name='serviceId']`) as HTMLElement;
    if (serviceIdElement) {
      serviceIdElement.focus();
    }
    // this.Serviceform.markAllAsTouched();
    // this.IpbillFooterform.markAllAsTouched();
  }

  onClearServiceAddList() {
    // this.Serviceform.get('serviceId').setValue("a");
    this.Serviceform.get('price').reset();
    this.Serviceform.get('qty').reset('1');
    this.Serviceform.get('totalAmt').reset();
    this.Serviceform.get('doctorId').reset();
    this.Serviceform.get('concessionPercentage').reset();
    this.Serviceform.get('concessionAmount').reset();
    this.Serviceform.get('netAmount').reset();
  }
  //////////////////////////////////// END OF SIDE BAR CODE ////////////////////////////////////

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

  // Create servie form
  createserviceForm() {
    return this.formBuilder.group({
      chargesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01',
      opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdIpdId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      price: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionPercentage: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.onlyNumberValidator()]],
      concessionAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
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
      isPackage: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrCompanyService: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      packageId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '1900-01-01', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
      packageMainChargeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      classId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cPrice: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cTotalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isComServ: [false],
      isPrintCompSer: [false],
      serviceName1: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      chPrice: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chQty: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chTotalAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isBillableCharity: [false],
      salesId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      billNo: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isHospMrk: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      doctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  //Ip Bill Footer form
  createBillForm() {
    return this.formBuilder.group({
      AdminPer: ['', [Validators.max(100)]],
      AdminAmt: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      totaldiscPer: [0, [Validators.min(0), Validators.max(100),]],
      totalconcessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      ConcessionId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
      FinalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
      CashCounterID: [4, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
      Remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      Admincheck: [''],
      GenerateBill: [false],
      CreditBill: [false,],
      ChargeDate: [new Date()],
      BillType: ['1', this._FormvalidationserviceService.onlyNumberValidator()],
      EditDoctor: [''],
      TotalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

   //IP bill save form 
  CreateIPBillForm(): FormGroup {
    return this.formBuilder.group({
      //ipInterim bill header  
      bill: this.formBuilder.group({
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdipdid: [this.selectedAdvanceObj?.admissionId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        paidAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
        opdipdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId],
        totalAdvanceAmount: [this.TotalAdvanceAmt ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        concessionReasonId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isSettled: false,
        isPrinted: true,
        isFree: true,    
        companyId: [this.selectedAdvanceObj?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        tariffId: [this.selectedAdvanceObj?.tariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        unitId: [this.selectedAdvanceObj?.hospitalID, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        interimOrFinal: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        companyRefNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        speTaxPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        speTaxAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        compDiscAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discComments: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
        cashCounterId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
      }),
      // IP bill details in array
      billDetail: this.formBuilder.array([]),
      // Addcharge insert
      addCharge: this.formBuilder.group({
        billNo:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
        cashPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequePayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
        tdsAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      // BIll insert
      bills: this.formBuilder.group({
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }), 
      // Advance details update in array
      advancesupdate: this.formBuilder.array([]),
      // Advacne header update
      advancesHeaderupdate: this.formBuilder.group({
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
        //Addcharges
      addChargessupdate: this.formBuilder.group({
        chargesID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
    });
  }
  createBillDetails(item: any): FormGroup {
    return this.formBuilder.group({
      billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesId: [item?.chargesId, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  createAdvanceUpdate(item: any): FormGroup {
    return this.formBuilder.group({
      advanceDetailID: [item?.AdvanceDetailID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      usedAmount: [item?.UsedAmount ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      balanceAmount: [item?.BalanceAmount ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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