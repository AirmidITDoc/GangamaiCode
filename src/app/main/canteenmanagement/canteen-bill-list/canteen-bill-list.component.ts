import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { CanteenmanagementService } from '../canteenmanagement.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { DatePipe } from '@angular/common';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { CanteenSalesComponent } from '../canteen-sales/canteen-sales.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-canteen-bill-list',
  templateUrl: './canteen-bill-list.component.html',
  styleUrls: ['./canteen-bill-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class CanteenBillListComponent {

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  myFilterbillform: FormGroup
  f_name = '%'
  l_name = '%'
  regNo = '0'
  BillNo = "0"
  CustName = ''
  constructor(
    public _CanteenmanagementService: CanteenmanagementService, public toastr: ToastrService,
    private _loggedService: AuthenticationService, private _FormBuilder: UntypedFormBuilder, private _matDialog: MatDialog,
    public datePipe: DatePipe, private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  //  data
  gridConfig1: gridModel = new gridModel();
  @ViewChild('BillGrid', { static: false }) grid: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;
  isShowDetailTable: boolean = false;
  ngOnInit(): void {
    this.myFilterbillform = this._CanteenmanagementService.CanBillbrowseform();

  }
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

  }

  allBillfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "CustomerName", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "BillNo ", fieldValue: "0", opType: OperatorComparer.Equals },

  ];


  allbillcolumns = [
    // { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
    // { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "", key: "refundAmount1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "", key: "balanceAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "BillDate", key: "bDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Customer Name", key: "customerName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    // { heading: "Total Amount", key: "totalAmt", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount }, // It is just example of apply color based on condition
    // { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amount", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },

    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }  // Assign ng-template to the column

  ];

  allbilldetailcolumns = [
    // { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 45 },
    // { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "", key: "refundAmount1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    // { heading: "", key: "balanceAmt1", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
    { heading: "BillDate", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    // { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 400 },
    { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "MRP", key: "unitMrp", sort: true, align: 'left', emptySign: 'NA', width: 100 },

    { heading: "Total Amount", key: "totalAmount", sort: true, align: 'right', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 }, // It is just example of apply color based on condition
    { heading: "Disc Amount", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Paid Amount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Balance Amount", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },

    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }  // Assign ng-template to the column

  ];

  gridConfig: gridModel = {

    apiUrl: "CanteenBill/CanteenBillList",
    columnsList: this.allbillcolumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters: this.allBillfilters
  }

GetDetails1(data: any): void {
debugger
    console.log("detailList:", data)
    let BillNo = data.billNo;

    this.gridConfig1 = {
      apiUrl: "CanteenBill/CanteenBilldetailList",
      columnsList: this.allbilldetailcolumns,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [
        { fieldName: "BillNo", fieldValue: String(BillNo), opType: OperatorComparer.Equals }
      ]
    };
    this.isShowDetailTable = true;
    setTimeout(() => {
      this.grid1.gridConfig = this.gridConfig1;
      this.grid1.bindGridData();
    }, 500);
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'CustomerName')
      this.myFilterbillform.get('CustomerName').setValue("")
    else
      if (event == 'LastName')
        // this.myFilterbillform.get('LastName').setValue("")
        if (event == 'RegNo')
          this.myFilterbillform.get('BillNo').setValue("")


    this.onChangeBill();
  }

  onChangeBill() {
    debugger
    this.fromDate = this.datePipe.transform(this.myFilterbillform.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
    this.CustName = this.myFilterbillform.get('CustomerName').value + "%"
    this.BillNo = this.myFilterbillform.get('BillNo').value || "0"
    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.fromDate = this.datePipe.transform(this.myFilterbillform.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
    this.CustName = this.myFilterbillform.get('CustomerName').value + "%"
    this.BillNo = this.myFilterbillform.get('BillNo').value || "0"


    this.gridConfig = {
      apiUrl: "CanteenBill/CanteenBillList",
      columnsList: this.allbillcolumns,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "CustomerName", fieldValue: this.CustName, opType: OperatorComparer.Contains },
      { fieldName: "BillNo ", fieldValue: this.BillNo, opType: OperatorComparer.Equals },

      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
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


  onSave(row: any = null) {
    // const that = this;
    // const dialogRef = this._matDialog.open(CanteenSalesComponent,
    //     {
    //         maxWidth: "97vw",
    //         height: '98%',
    //         width: '96%',
    //         data: row
    //     });
    // dialogRef.afterClosed().subscribe(result => {
    //     that.grid.bindGridData();
    //     this.isShowDetailTable = false;

    // });
  }

  Billcancle(element) { }

  viewgetReportPdf(element) { }
}
