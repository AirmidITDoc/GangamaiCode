import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { OperatorComparer, gridModel } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import Chart from 'chart.js/auto';
import { ToastrService } from 'ngx-toastr';
import { BranchCollectionDetailService } from './branch-collection-detail.service';

@Component({
  selector: 'app-branch-collection-detail',
  templateUrl: './branch-collection-detail.component.html',
  styleUrls: ['./branch-collection-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class BranchCollectionDetailComponent {
  myformSearch: FormGroup;
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  autocompleteModeunit: string = "Hospital";
  @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  constructor(
    public _BranceCollDetService: BranchCollectionDetailService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public _whatsppService: WhatsAppEmailService,
    private _loggedService: AuthenticationService,
    public permissionService: PagePermissionService,
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._BranceCollDetService.createBranchSummarySearchForm();
  }

  allcolumns = [
    { heading: "Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "BillNo", key: "printBillNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "PatientCode", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "TestName", key: "testNames", sort: true, align: 'left', emptySign: 'NA', width: 350 },
    { heading: "Bill Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Reversal Amt", key: "reversalAmt", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Discount Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Discount Amt.Reversed", key: "discountAmtReversed", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    // {
    //   heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate  // Assign ng-template to the column
    // }
  ];

  gridConfig: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "Branch/DailyCollectionDetailList",
    columnsList: this.allcolumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
    ]
  }

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeFirst();
  }

  onChangeFirst() {
    this.UnitId = this.myformSearch.get('UnitId').value || "0"

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")

    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "Branch/DailyCollectionDetailList",
      columnsList: this.allcolumns,
      sortField: "BillDate",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
      this.grid.gridConfig = this.gridConfig;
      this.grid.bindGridData();
    }, 100);
  }

}
