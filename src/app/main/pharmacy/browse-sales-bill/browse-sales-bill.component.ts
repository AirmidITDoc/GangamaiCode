import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BrowsSalesBillService } from '../brows-sales-bill/brows-sales-bill.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-browse-sales-bill',
  templateUrl: './browse-sales-bill.component.html',
  styleUrls: ['./browse-sales-bill.component.scss']
})
export class BrowseSalesBillComponent {
salesForm:FormGroup;
 isShowDetailTable: boolean = false;
  constructor(
    public _BrowsSalesBillService: BrowsSalesBillService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.salesForm=this._BrowsSalesBillService.SearchFilter();
   }

  StoreId1 = this._BrowsSalesBillService.userForm.get('StoreId').value || 0;
  FromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  ToDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  firstName: any = "%";
  LastName: any = "%";
 OpIpType: any = "0";
  salesNo: any = "0";
    autocompletestore: string = "Store";


   gridConfig1: gridModel = new gridModel();


  //Sales 
  @ViewChild('patientTypetemp') patientTypetemp!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('patientTypetempReturn') isPrintTemplate!: TemplateRef<any>;

  //Sales Return
  @ViewChild('patientTypetempReturn') patientTypetempReturn!: TemplateRef<any>;
  @ViewChild('actionButtonTemplateRetrun') actionButtonTemplateRetrun!: TemplateRef<any>;

  //patient list
   @ViewChild('isPatientTemplate') isPatientTemplate!: TemplateRef<any>;
   @ViewChild('isPatientPrintTemplate') isPatientPrintTemplate!: TemplateRef<any>;

   ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'Status')!.template = this.patientTypetemp;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isPrint')!.template = this.isPrintTemplate;
    // //Sales Return
    // this.gridConfig2.columnsList.find(col => col.key === 'Status')!.template = this.patientTypetempReturn;
    // this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateRetrun;
    // //patient list
    //  this.gridConfig4.columnsList.find(col => col.key === 'Status')!.template = this.isPatientTemplate; 
    //  this.gridConfig4.columnsList.find(col => col.key === 'action')!.template = this.isPatientPrintTemplate; 
  }

  // @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionButtonTemplateone') actionButtonTemplateone!: TemplateRef<any>;

  @ViewChild('ipBrowse', { static: false }) grid: AirmidTableComponent;
  @ViewChild('ipRefund', { static: false }) grid1: AirmidTableComponent;

  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  PBillNo: any = "0"

  af_name: any = ""
  aregNo: any = "0"
  al_name: any = ""
  afromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  atoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  BrowseHColumns = [
    {
      heading: "", key: "Status", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.patientTypetemp
    },
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 8 },
    { heading: "Sales No", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 140, type: gridColumnTypes.amount },
    { heading: "Paid Type", key: "paidType", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "IPD No", key: "ipno", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    // {
    //   heading: "IsPrint", key: "isPrint", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.template,
    //   template: this.isPrintTemplate
    // },
    {
      heading: "Action", key: "action", align: "right", width: 140, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  //Sales detail list columns
  BrowseDetColumns = [
    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 180, },
    { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 9 },
    { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Unit MRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA', width: 130, type: gridColumnTypes.amount },
    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 140, type: gridColumnTypes.amount },
    { heading: "Disc%", key: "discPer", sort: true, align: 'left', emptySign: 'NA', width: 110, type: gridColumnTypes.amount },
    { heading: "Disc Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
    { heading: "Gross Amt", key: "grossAmount", sort: true, align: 'left', emptySign: 'NA', width: 140, type: gridColumnTypes.amount },
    { heading: "GST%", key: "vatPer", sort: true, align: 'left', emptySign: 'NA', width: 110, type: gridColumnTypes.amount },
    { heading: "cGST%", key: "cgstPer", sort: true, align: 'left', emptySign: 'NA', width: 110, type: gridColumnTypes.amount },
    { heading: "SGST%", key: "sgstPer", sort: true, align: 'left', emptySign: 'NA', width: 110, type: gridColumnTypes.amount },
    { heading: "IGST%", key: "igstPer", sort: true, align: 'left', emptySign: 'NA', width: 110, type: gridColumnTypes.amount },

  ]
  gridConfig: gridModel = {
    apiUrl: "Sales/salesbrowselist",
    columnsList: this.BrowseHColumns,
    sortField: "SalesId",
    sortOrder: 0,
    filters: [
      { fieldName: "LName", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "FName", fieldValue: "%", opType: OperatorComparer.Equals },
      { fieldName: "FromDt", fieldValue: this.FromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDt", fieldValue: this.ToDate, opType: OperatorComparer.Equals },
      { fieldName: "StoreId", fieldValue: String(this.StoreId1), opType: OperatorComparer.Equals },
      { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "SalesNo", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "OPIPType", fieldValue: "0", opType: OperatorComparer.Equals }
    ],
  }

  getSaleslistdata() {
    debugger
    this.gridConfig = {
      apiUrl: "Sales/salesbrowselist",
      columnsList: this.BrowseHColumns,
      sortField: "SalesId",
      sortOrder: 0,
      filters: [
        { fieldName: "LName", fieldValue: this.firstName, opType: OperatorComparer.Equals },
        { fieldName: "FName", fieldValue: this.LastName, opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.StoreId1), opType: OperatorComparer.Equals },
        { fieldName: "FromDt", fieldValue: this.FromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDt", fieldValue: this.ToDate, opType: OperatorComparer.Equals },
        { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "SalesNo", fieldValue: this.salesNo, opType: OperatorComparer.Equals },
        { fieldName: "OPIPType", fieldValue: this.OpIpType, opType: OperatorComparer.Equals }
      ],
    }
    // this.grid.bindGridData();
  }

  getsalesdetaillist(event) {
    console.log(event)
//     this.isShowDetailTable = true;
// debugger
//     this.gridConfig1 = {
//       apiUrl: "Sales/SalesBrowseDetailList",
//       columnsList: this.BrowseDetColumns,
//       sortField: "SalesId",
//       sortOrder: 0,
//       filters: [
//         { fieldName: "SalesID", fieldValue: String(event.salesId), opType: OperatorComparer.Equals },
//         { fieldName: "OP_IP_Type", fieldValue: String(event.oP_IP_Type), opType: OperatorComparer.Equals }
//       ]
//     }
    
//     this.grid1.gridConfig = this.gridConfig1;
//     this.grid1.bindGridData();

   
        this.gridConfig1 = {
            apiUrl: "Sales/SalesBrowseDetailList",
            columnsList:this.BrowseDetColumns,
            sortField: "SalesId",
            sortOrder: 0,
             filters: [
        { fieldName: "SalesID", fieldValue: String(event.salesId), opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: String(event.oP_IP_Type), opType: OperatorComparer.Equals }
      ]
        };
        this.isShowDetailTable = true;
        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        }, 500);
  }

        onChangeFirst() { 
    this.isShowDetailTable = false;
    this.firstName = this._BrowsSalesBillService.userForm.get('F_Name').value || "%"
    this.LastName = this._BrowsSalesBillService.userForm.get('L_Name').value || "%"
    this.StoreId1 = this._BrowsSalesBillService.userForm.get('StoreId').value || 2
    this.FromDate = this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd")
    this.ToDate = this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd")
    this.regNo = this._BrowsSalesBillService.userForm.get('RegNo').value || "0"
    this.salesNo = this._BrowsSalesBillService.userForm.get('SalesNo').value || "0"
    this.OpIpType = this._BrowsSalesBillService.userForm.get('OP_IP_Type').value || "0"
    this.getSaleslistdata();
  }

    getValidationMessages() {
    return {
      RegNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      IPDNo: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      F_Name: [
        // { name: "required", Message: "Item Name is required" }
      ],
      M_Name: [
        // { name: "required", Message: "Batch No is required" }
      ],
      L_Name: [
        // { name: "required", Message: "Invoice No is required" }
      ],
      SalesNo: [
        // { name: "required", Message: "Invoice No is required" }
      ],
      StoreId: [
        // { name: "required", Message: "Invoice No is required" }
      ]

    };
  }
    selectChangeStore(value) {
    if (value.value !== 0)
      this.StoreId1 = value.value
    else
      this.StoreId1 = "0"

    this.onChangeFirst();
  }
}
