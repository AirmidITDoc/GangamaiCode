import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { SupplierPaymentStatusService } from '../supplier-payment-status.service';
import { FormGroup } from '@angular/forms';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-supplier-payment-list',
  templateUrl: './supplier-payment-list.component.html',
  styleUrls: ['./supplier-payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierPaymentListComponent implements OnInit {
 

  SupplierListForm: FormGroup;
  isSupplierSelected: boolean = false;
  ToStoreList: any = [];
  dateTimeObj: any;
  filteredSupplier: any;
  noOptionFound: any;
  sIsLoading: string = '';

  dsSupplierList = new MatTableDataSource<SupplierPayStatusList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  supplierN: any = "%";
  SupplierID: any = "0"
  autocompleteSupplier: string = "SupplierMaster"
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  constructor(
    public _SupplierPaymentStatusService: SupplierPaymentStatusService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    public toastr: ToastrService, private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.SupplierListForm = this._SupplierPaymentStatusService.CreateSupplierList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  allColumns = [
    { heading: "SupPayNo", key: "supPayNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Date", key: "supPayDate", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "TotalAmount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CashPayAmt", key: "cashPayAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "ChequePayAmt", key: "chequePayAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PartyReceiptNo", key: "partyReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.print, callback: (data: any) => {
            this.viewgetReportPdf(data)
          }
        }]
    }
  ]

  allFilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "SupplierId", fieldValue: this.SupplierID, opType: OperatorComparer.StartsWith }
  ]

  gridConfig: gridModel = {
    apiUrl: "SupplierPayment/GetSupplierPaymentList",
    columnsList: this.allColumns,
    sortField: "SupplierId",
    sortOrder: 0,
    filters: this.allFilters
  }

  selectChangeSupplier(obj: any) {
   
    if (obj.value !== 0)
      this.SupplierID = obj.value
    else
      this.SupplierID = "0"
  }

  onClose() {
    this._matDialog.closeAll();
  }

    viewgetReportPdf(element) {
        this.commonService.Onprint("SupPayId", element, "SupplierPaymentRecieptByPayment");
    }

  // viewgetReportPdf(element) {
  //   let fromDate = this.datePipe.transform(this.SupplierListForm.get('start').value, "yyyy-MM-dd")
  //   let toDate = this.datePipe.transform(this.SupplierListForm.get('end').value, "yyyy-MM-dd")
  //   var Param = {
  //     "searchFields": [
  //       {
  //         "fieldName": "FromDate",
  //         "fieldValue": fromDate,
  //         "opType": "Equals"
  //       },
  //       {
  //         "fieldName": "ToDate",
  //         "fieldValue": toDate,
  //         "opType": "Equals"
  //       },
  //       {
  //         "fieldName": "SupplierId",
  //         "fieldValue": String(element.supplierId),
  //         "opType": "Equals"
  //       },
  //     ],
  //     "mode": "SupplierPaymentReciept"
  //   }
  //   this._SupplierPaymentStatusService.getReportView(Param).subscribe(res => {

  //     const matDialog = this._matDialog.open(PdfviewerComponent,
  //       {
  //         maxWidth: "85vw",
  //         height: '750px',
  //         width: '100%',
  //         data: {
  //           base64: res["base64"] as string,
  //           title: "Supplier Payment " + " " + "Viewer"
  //         }
  //       });
  //     matDialog.afterClosed().subscribe(result => {
  //     });
  //   });

  // }
}

export class SupplierPayStatusList {
  GRNReturnNo: any;
  SupplierName: string;
  GRNReturnDate: number;
  InvoiceNo: number;
  NetAmount: any;
  PaidAmount: any;
  BalAmount: any;
  InvDate: any;
  Mobile: any;
  constructor(SupplierPayStatusList) {
    {
      this.GRNReturnNo = SupplierPayStatusList.GRNReturnNo || 0;
      this.SupplierName = SupplierPayStatusList.SupplierName || '';
      this.GRNReturnDate = SupplierPayStatusList.GRNReturnDate || 0;
      this.InvoiceNo = SupplierPayStatusList.InvoiceNo || 0;
      this.NetAmount = SupplierPayStatusList.NetAmount || 0;
      this.PaidAmount = SupplierPayStatusList.PaidAmount || 0;
      this.BalAmount = SupplierPayStatusList.BalAmount || '';
      this.InvDate = SupplierPayStatusList.InvDate || '';
      this.Mobile = SupplierPayStatusList.Mobile || 0;
    }
  }
}
