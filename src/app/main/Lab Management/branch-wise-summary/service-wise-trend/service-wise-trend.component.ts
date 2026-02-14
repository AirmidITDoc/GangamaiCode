import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { LabResultListService } from '../../lab-result-list/lab-result-list.service';

@Component({
  selector: 'app-service-wise-trend',
  templateUrl: './service-wise-trend.component.html',
  styleUrls: ['./service-wise-trend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ServiceWiseTrendComponent {
  unitId = "0"
  serviceId = "902"
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  // @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "Month", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Total", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Dicount", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Net", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Count", key: "testCount", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    // {
    //   heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate  // Assign ng-template to the column
    // }
  ];

  constructor(
    public _LabResultListService: LabResultListService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,) { }


  // ngOnInit(): void {
  //   if (this.data) {
  //     // debugger
  //     this.unitId = this.data.unit
  //     this.fromDate = this.data.fdate
  //     this.toDate = this.data.tdate
  //   }
  //     this.getfilterdata()
  // }

  // gridConfig: gridModel = {
  //   apiUrl: "Branch/BranchWiseTestSummaryList",
  //   columnsList: this.allcolumns,
  //   sortField: "ServiceId",
  //   sortOrder: 0,
  //   filters: [
  //     { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Equals },
  //     { fieldName: "ServiceId", fieldValue: String(this.serviceId), opType: OperatorComparer.Equals },
  //     { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
  //     { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  //   ]
  // }

  // getfilterdata() {
  //   this.gridConfig = {
  //     apiUrl: "Branch/BranchWiseTestSummaryList",
  //     columnsList: this.allcolumns,
  //     sortField: "ServiceId",
  //     sortOrder: 0,
  //     filters: [
  //       { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Equals },
  //       { fieldName: "ServiceId", fieldValue: String(this.serviceId), opType: OperatorComparer.Equals },
  //       { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
  //       { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  //     ]
  //   }
  //   // debugger
  //   this.grid.gridConfig = this.gridConfig;
  //   this.grid.bindGridData();
  // }

  @ViewChild('grid') grid!: AirmidTableComponent;

  gridConfig!: gridModel;
  filterType: 'Day' | 'Month' = 'Day';

  ngOnInit() {
    this.unitId = this.data.unit
    this.fromDate = this.data.fdate
    this.toDate = this.data.tdate
    this.loadGrid(); // initial load
  }

  loadGrid() {
    this.gridConfig = {
      apiUrl: "Branch/BranchWiseTestSummaryList",
      columnsList: this.allcolumns,
      sortField: "ServiceId",
      sortOrder: 0,
      filters: [
        { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Equals },
        { fieldName: "ServiceId", fieldValue: String(this.serviceId), opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
      ]
    };
  }
  setFilterType(type: 'Day' | 'Month') {
    this.filterType = type;
    // this.getfilterdata();
  }

  // loadGrid() {
  //   this.gridConfig = {
  //     apiUrl: "Branch/BranchWiseTestSummaryList",
  //     columnsList: this.allcolumns,
  //     sortField: "ServiceId",
  //     sortOrder: 0,
  //     filters: [
  //       { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Equals },
  //       { fieldName: "ServiceId", fieldValue: String(this.serviceId), opType: OperatorComparer.Equals },
  //       {
  //         fieldName: "Type",              // 👈 only this
  //         fieldValue: this.filterType,    // Day or Month
  //         opType: OperatorComparer.Equals
  //       }
  //     ]
  //   };
  // }


  getfilterdata() {
    this.loadGrid();

    // wait until ViewChild exists
    if (this.grid) {
      this.grid.bindGridData();
    }
  }

  onClose() {
    this._matDialog.closeAll()
  }
}
