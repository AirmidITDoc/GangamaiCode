import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CancellationService } from './cancellation.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import Swal from 'sweetalert2';
import { IPBrowseBillService } from 'app/main/ipd/ip-bill-browse-list/ip-browse-bill.service';
import { ToastrService } from 'ngx-toastr';
import { BillDateUpdateComponent } from './bill-date-update/bill-date-update.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CancellationComponent implements OnInit {
  dsRefundOfBillList: any;
  displayedRefundBillColumn: any;
  getSearchRefOfAdvList: any;
  dsRefundOfAdvList: any;
  displayedRefundAdvColumn: any;
  sIsLoading: string = '';
  isLoading = true;
  gridConfig: any;

  dsCancellation = new MatTableDataSource<CancellationList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  getSearchRefOfBillList() {
    throw new Error('Method not implemented.');
  }

  // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('OpdIpd', { static: false }) grid: AirmidTableComponent;
  @ViewChild('AdvanceList', { static: false }) grid1: AirmidTableComponent;
  @ViewChild('IPRefundBillList', { static: false }) grid2: AirmidTableComponent;
  @ViewChild('RefundOfAdvanceList', { static: false }) grid3: AirmidTableComponent;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  constructor(
    public _CancellationService: CancellationService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public _IpBillBrowseListService: IPBrowseBillService,
  ) { }

  ngOnInit(): void {

    this.gridConfig = this.opdGridConfig;

    this._CancellationService.UserFormGroup.get('OP_IP_Type')?.valueChanges.subscribe((value) => {
      console.log("OP_IP_Type changed to:", value);
      this.gridConfig = value === '0' ? this.opdGridConfig : this.ipdGridConfig;
    });
    
    console.log("GridConfig:",this.gridConfig)
  }
  
  ngAfterViewInit() {
          // Assign the template to the column dynamically
          // this.gridConfig.columnsList.find(col => col.key === 'OPD_IPD_Type')!.template = this.actionsTemplate;  
          this.opdGridConfig.columnsList.find(col => col.key === 'opD_IPD_Type')!.template = this.actionsTemplate;  
          this.opdGridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.ColorCodeCancel;  
          this.opdGridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate; 

          this.ipdGridConfig.columnsList.find(col => col.key === 'opD_IPD_Type')!.template = this.actionsTemplateIP;  
          this.ipdGridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.ColorCodeCancelIP; 
          this.ipdGridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIP; 

          this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPAdvance; 
          this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPRefundBill; 
          this.gridConfig3.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPRefundAdv; 
      }
      @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
      @ViewChild('ColorCodeCancel') ColorCodeCancel!: TemplateRef<any>;
      @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

      @ViewChild('ColorCodeCancelIP') ColorCodeCancelIP!: TemplateRef<any>;
      @ViewChild('actionsTemplateIP') actionsTemplateIP!: TemplateRef<any>;
      @ViewChild('actionButtonTemplateIP') actionButtonTemplateIP!: TemplateRef<any>;
      
      @ViewChild('actionButtonTemplateIPAdvance') actionButtonTemplateIPAdvance!: TemplateRef<any>;
      @ViewChild('actionButtonTemplateIPRefundBill') actionButtonTemplateIPRefundBill!: TemplateRef<any>;
      @ViewChild('actionButtonTemplateIPRefundAdv') actionButtonTemplateIPRefundAdv!: TemplateRef<any>;

      f_name: any = ""
      regNo: any = "0"
      l_name: any = ""
      PBillNo: any = "%"
      IsIntrimOrFinal:any="2";

      af_name: any = ""
      aregNo: any = "0"
      al_name: any = ""
      aPBillNo: any = "0"
      afromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
      atoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

      ipf_name: any = ""
      ipregNo: any = "0"
      ipl_name: any = ""
      ipfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
      iptoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

      allopdColumns=[
        { heading: "-", key: "opD_IPD_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "-", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        // { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width:150 },
        { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width:200, type: 9},
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHIDNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA',width:250 },
        { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' }, //not there in payload
        { heading: "DiscountAmt", key: "discountAmt", sort: true, align: 'left', emptySign: 'NA' },//not there in payload
        { heading: "NetAmt", key: "netAmt", sort: true, align: 'left', emptySign: 'NA' },//not there in payload
        {
          heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
          template: this.actionButtonTemplate  // Assign ng-template to the column
      }
      ]

      allopdFilters=[
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals }, //year from 2021 to 2025
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith }
      ]

  // 1st table
  opdGridConfig: gridModel = {
    apiUrl: "OPBill/BrowseOPDBillPagiList",
    columnsList: this.allopdColumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters:this.allopdFilters 
  }

  onChangeopd() {
    this.fromDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this._CancellationService.UserFormGroup.get('FirstName').value + "%"
    this.l_name = this._CancellationService.UserFormGroup.get('LastName').value + "%"
    this.regNo = this._CancellationService.UserFormGroup.get('RegNo').value || "0"
    this.PBillNo = this._CancellationService.UserFormGroup.get('PBillNo').value || "%"
    this.getfilteropd();
}

getfilteropd() {
  debugger    
  this.gridConfig = {
      apiUrl: "OPBill/BrowseOPDBillPagiList",
      columnsList: this.allopdColumns,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals }
      ]
  }
  this.grid.gridConfig = this.gridConfig;
  this.grid.bindGridData();
  console.log("opd:",this.gridConfig)
}

ClearfilterOPD(event) {
  console.log(event)
  if (event == 'FirstName')
      this._CancellationService.UserFormGroup.get('FirstName').setValue("")
  else
      if (event == 'LastName')
          this._CancellationService.UserFormGroup.get('LastName').setValue("")
  if (event == 'RegNo')
      this._CancellationService.UserFormGroup.get('RegNo').setValue("")
  if (event == 'PBillNo')
      this._CancellationService.UserFormGroup.get('PBillNo').setValue("")

  // this.onChangeopd();
  this.onNameFieldChange()
}

  allipdColumns=[
    { heading: "-", key: "opD_IPD_Type", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "-", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    // { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width:200 },      
    { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width:200, type: 9 },
    { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHIDNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:250 },
    { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DiscountAmt", key: "discountAmt", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "NetAmt", key: "netAmt", sort: true, align: 'left', emptySign: 'NA' },//not there in payload
    {
      heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateIP  // Assign ng-template to the column
  } //Action 1-view, 2-Edit,3-delete
  ]

  allipdFilters=[
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith }, //13
    { fieldName: "IsIntrimOrFinal", fieldValue: "2", opType: OperatorComparer.Equals }
  ]

  ipdGridConfig: gridModel = {
    apiUrl: "Billing/BrowseIPBillList",
    columnsList: this.allipdColumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters: this.allipdFilters
  }

  onChangeipd() {
    this.fromDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this._CancellationService.UserFormGroup.get('FirstName').value + "%"
    this.l_name = this._CancellationService.UserFormGroup.get('LastName').value + "%"
    this.regNo = this._CancellationService.UserFormGroup.get('RegNo').value || "0"
    this.PBillNo = this._CancellationService.UserFormGroup.get('PBillNo').value || "%"
    this.IsIntrimOrFinal=this._CancellationService.UserFormGroup.get("IsIntrimOrFinal").value || "2"
    this.getfilteripd();
}

getfilteripd() {
  debugger    
  this.gridConfig = {
      apiUrl: "Billing/BrowseIPBillList",
      columnsList: this.allipdColumns,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
    { fieldName: "IsIntrimOrFinal", fieldValue: "2", opType: OperatorComparer.Equals }
      ]
  }
  this.grid.gridConfig = this.gridConfig;
  this.grid.bindGridData();
  console.log("IPD:",this.gridConfig)
}

// ClearfilterIPD(event) {
//   debugger
//   console.log(event)
//   if (event == 'FirstName')
//       this._CancellationService.UserFormGroup.get('FirstName').setValue("")
//   else
//       if (event == 'LastName')
//           this._CancellationService.UserFormGroup.get('LastName').setValue("")
//   if (event == 'RegNo')
//       this._CancellationService.UserFormGroup.get('RegNo').setValue("")
//   if (event == 'PBillNo')
//       this._CancellationService.UserFormGroup.get('PBillNo').setValue("")

//   this.onChangeipd();
// }

onNameFieldChange(): void {
  debugger
  const selectedType = this._CancellationService.UserFormGroup.get('OP_IP_Type')?.value;

  if (selectedType === '0' || selectedType === 0) {
    this.onChangeopd();
  } else if (selectedType === '1' || selectedType === 1) {
    this.onChangeipd();
  }
}

onRadioChange(event: MatRadioChange) {
  debugger
  const selectedValue = event.value;
  if (selectedValue === '0' || selectedValue === 0) {
    this.onChangeopd();
  } else if (selectedValue === '1' || selectedValue === 1) {
    this.onChangeipd();
  }
}

  // 2nd table
  allColumnsOfAdvanceList=[
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width:200, type: 9 },
    { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:200, },
    { heading: "Advance Amt ", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Balance Amt ", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "RefundAmount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateIPAdvance
  } //Action 1-view, 2-Edit,3-delete
  ]

  allFiltersOfAdvanceList=[
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.StartsWith }
  ]

  gridConfig1: gridModel = {
    apiUrl: "Advance/BrowseAdvanceList",
    columnsList:this.allColumnsOfAdvanceList ,
    sortField: "RegID",
    sortOrder: 0,
    filters: this.allFiltersOfAdvanceList
  }

  onChangeAdvance() {
    debugger
    this.afromDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.atoDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.af_name = this._CancellationService.UserFormGroup.get('FirstName').value + "%"
    this.al_name = this._CancellationService.UserFormGroup.get('LastName').value + "%"
    this.aregNo = this._CancellationService.UserFormGroup.get('RegNo').value || "0"
    this.aPBillNo = this._CancellationService.UserFormGroup.get('PBillNo').value || "0"
    this.getfilterAdvance();
}

getfilterAdvance() {
    this.gridConfig1 = {
        apiUrl: "Advance/BrowseAdvanceList",
        columnsList: this.allColumnsOfAdvanceList,
        sortField: "RegID",
        sortOrder: 0,
        filters: [{ fieldName: "F_Name", fieldValue: this.af_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.al_name, opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.aregNo, opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: this.aPBillNo, opType: OperatorComparer.Equals }
        ]
    }
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
}

ClearfilterAdvance(event) {
    console.log(event)
    if (event == 'FirstName')
        this._CancellationService.UserFormGroup.get('FirstName').setValue("")
    else
        if (event == 'LastName')
            this._CancellationService.UserFormGroup.get('LastName').setValue("")
    if (event == 'RegNo')
        this._CancellationService.UserFormGroup.get('RegNo').setValue("")
    if (event == 'PBillNo')
        this._CancellationService.UserFormGroup.get('PBillNo').setValue("")
    this.onChangeAdvance();
}

  // 3rd table

  allColumnsOfIpRefund= [
    { heading: "RefundDate", key: "refundTime", sort: true, align: 'left', emptySign: 'NA', width:200, type: 9 },
    { heading: "UHIDNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:200 },
    { heading: "RefundAmount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PaymentDate", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', width:200, type: 9},
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 150,sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateIPRefundBill  // Assign ng-template to the column
  } //Action 1-view, 2-Edit,3-delete
  ]
  allFiltersOfIpRefund=[
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

  gridConfig2: gridModel = {
    apiUrl: "Billing/BrowseIPRefundlist",
    columnsList:this.allColumnsOfIpRefund,
    sortField: "RegNo",
    sortOrder: 0,
    filters: this.allFiltersOfIpRefund
  }

  onChangeIPRefund() {
    debugger
    this.ipfromDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.iptoDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.ipf_name = this._CancellationService.UserFormGroup.get('FirstName').value + "%"
    this.ipl_name = this._CancellationService.UserFormGroup.get('LastName').value + "%"
    this.ipregNo = this._CancellationService.UserFormGroup.get('RegNo').value || "0"
    this.getfilterIPRefund();
}

getfilterIPRefund() {
    this.gridConfig2 = {
        apiUrl: "Billing/BrowseIPRefundlist",
        columnsList: this.allColumnsOfIpRefund,
        sortField: "RegNo",
        sortOrder: 0,
        filters: [{ fieldName: "F_Name", fieldValue: this.ipf_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.ipl_name, opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.ipfromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.iptoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.ipregNo, opType: OperatorComparer.Equals }
        ]
    }
    this.grid2.gridConfig = this.gridConfig2;
    this.grid2.bindGridData();
}

ClearfilterIPRefund(event) {
    console.log(event)
    if (event == 'FirstName')
        this._CancellationService.UserFormGroup.get('FirstName').setValue("")
    else
        if (event == 'LastName')
            this._CancellationService.UserFormGroup.get('LastName').setValue("")
    if (event == 'RegNo')
        this._CancellationService.UserFormGroup.get('RegNo').setValue("")
    this.onChangeIPRefund();
}

  // 4th table

  allColumnsOfRefundAd=[
    { heading: "RefundDate", key: "refundTime", sort: true, align: 'left', emptySign: 'NA', width:200, type: 9 },
    { heading: "UHIDNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PatientName ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:200},
    { heading: "AdvanceAmount", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AdvanceUsedAmt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "BalanceAmount", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "RefundAmount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PaymentDate", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', width:200, type: 9  },
    {
      heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateIPRefundAdv  // Assign ng-template to the column
  }  //Action 1-view, 2-Edit,3-delete
  ]

  allFiltersOfRefundAd=[
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
  ]

  gridConfig3: gridModel = {
    apiUrl: "Advance/PatientRefundOfAdvancesList",
    columnsList: this.allColumnsOfRefundAd,
    sortField: "RefundId",
    sortOrder: 0,
    filters: this.allFiltersOfRefundAd
  }

  onChangeRefundAd() {
    debugger
    this.ipfromDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('startdate').value, "yyyy-MM-dd")
    this.iptoDate = this.datePipe.transform(this._CancellationService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.ipf_name = this._CancellationService.UserFormGroup.get('FirstName').value + "%"
    this.ipl_name = this._CancellationService.UserFormGroup.get('LastName').value + "%"
    this.ipregNo = this._CancellationService.UserFormGroup.get('RegNo').value || "0"
    this.getfilterRefundAd();
}

getfilterRefundAd() {
    this.gridConfig3 = {
        apiUrl: "Advance/PatientRefundOfAdvancesList",
        columnsList: this.allColumnsOfIpRefund,
        sortField: "RefundId",
        sortOrder: 0,
        filters: [{ fieldName: "F_Name", fieldValue: this.ipf_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.ipl_name, opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.ipfromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.iptoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.ipregNo, opType: OperatorComparer.Equals }
        ]
    }
    this.grid3.gridConfig = this.gridConfig3;
    this.grid3.bindGridData();
    console.log(this.gridConfig3)
}

ClearfilterRefundAd(event) {
    console.log(event)
    if (event == 'FirstName')
        this._CancellationService.UserFormGroup.get('FirstName').setValue("")
    else
        if (event == 'LastName')
            this._CancellationService.UserFormGroup.get('LastName').setValue("")
    if (event == 'RegNo')
        this._CancellationService.UserFormGroup.get('RegNo').setValue("")
    this.onChangeRefundAd();
}

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    // const dialogRef = this._matDialog.open( NewcreateUserComponent, 
    //     {
    //         maxHeight: '95vh',
    //         width: '90%',
    //         data: row
    //     });
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //         that.grid.bindGridData();
    //     }
    // });
  }

  OnUpdate(row){
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open( BillDateUpdateComponent, 
        {
            maxHeight: "35vh",
            maxWidth: '90vh',
            width: '100%',
            data: row
        });
    dialogRef.afterClosed().subscribe(result => {
        // if (result) {
            this.grid.bindGridData();
        // }
    });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  resultsLength = 0;

  isLoading123: boolean = false;
  BillCancelOP(contact) {
    console.log("Data:",contact)
    Swal.fire({
      title: 'Do you want to cancel the Final Bill ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      
      if (result.isConfirmed) {
          let SubmitDate = {
            "billNo":contact.billNo || 0
          }
        console.log("Json:",SubmitDate)
        this._CancellationService.OpCancelBill(SubmitDate).subscribe(response => {
          if (response) {
            this.toastr.success('OP Bill Cancelled Successfully', 'success !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
          } else {
            this.toastr.error('API Error!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
          this.grid.bindGridData();
        });
      } else {
        // this.getSearchList();
      }
    })
  }

  BillCancelIP(contact) {
    console.log("Data:",contact)
    Swal.fire({
      title: 'Do you want to cancel the Final Bill ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
          let SubmitDate = {
            "billNo":contact.billNo || 0
          }
        console.log("Json:",SubmitDate)
        this._CancellationService.IpCancelBill(SubmitDate).subscribe(response => {
          if (response) {
            this.toastr.success('IP Bill Cancelled Successfully', 'success !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
          } else {
            this.toastr.error('API Error!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
          this.grid.bindGridData();
        });
      } else {
        // this.getSearchList();
      }
    })
  }
  getRecord(contact, m): void {
    if (this._CancellationService.UserFormGroup.get('OP_IP_Type').value == '1') {
      if (!contact.InterimOrFinal) {
        this.viewgetBillReportPdf(contact.BillNo)
      } else {
        this.viewgetInterimBillReportPdf(contact.BillNo)
      }
    } else {
      this.viewgetOPBillReportPdf(contact)
    }
  }
  Billdateupdate(contact) {
    this.isLoading123 = true;
    const dialogRef = this._matDialog.open(BillDateUpdateComponent,
      {
        height: "35%",
        width: '35%',
        data: {
          obj: contact.BillNo
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      // this.getSearchList();
      this.isLoading123 = false;
    });
  }

  viewgetBillReportPdf(BillNo) {
    setTimeout(() => {
      // this.SpinLoading =true;  
      this._IpBillBrowseListService.getIpFinalBillReceipt(
        BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Bill  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.SpinLoading = false; 
        });
      });

    }, 100);
  }
  viewgetInterimBillReportPdf(BillNo) {
    setTimeout(() => {
      this._IpBillBrowseListService.getIpInterimBillReceipt(
        BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Interim Bill  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        });
      });

    }, 100);
  }
  viewgetOPBillReportPdf(contact) {
    setTimeout(() => {
      // this.SpinLoading =true; 
      // this._BrowseOPDBillsService.getOpBillReceipt(
      //   contact.BillNo
      // ).subscribe(res => {
      //   const matDialog = this._matDialog.open(PdfviewerComponent,
      //     {
      //       maxWidth: "85vw",
      //       height: '750px',
      //       width: '100%',
      //       data: {
      //         base64: res["base64"] as string,
      //         title: "OP BILL Viewer"
      //       }
      //     });
      //   matDialog.afterClosed().subscribe(result => {  
      //   });
      // });

    }, 100);
  }

}
export class CancellationList {
  RegNo: any;
  PatientName: string;
  BillAmt: number;
  ConAmt: Number;
  NetpayableAmt: number;
  BillDate: number;
  PBillNo: number;

  constructor(PaymentPharmayList) {
    {
      this.RegNo = PaymentPharmayList.RegNo || 0;
      this.PatientName = PaymentPharmayList.PatientName || "";
      this.BillAmt = PaymentPharmayList.BillAmt || 0;
      this.ConAmt = PaymentPharmayList.ConAmt || 0;
      this.NetpayableAmt = PaymentPharmayList.NetpayableAmt || 0;
      this.BillDate = PaymentPharmayList.BillDate || 0;
      this.PBillNo = PaymentPharmayList.PBillNo || 0;
    }
  }
}
