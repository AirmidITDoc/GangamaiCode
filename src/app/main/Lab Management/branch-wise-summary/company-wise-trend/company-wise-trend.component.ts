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
  selector: 'app-company-wise-trend',
  templateUrl: './company-wise-trend.component.html',
  styleUrls: ['./company-wise-trend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyWiseTrendComponent {
  // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  unitId = "0"
  companyId = ""
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "Month", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Total", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Dicount", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Net", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
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

  @ViewChild('grid') grid!: AirmidTableComponent;

  gridConfig!: gridModel;
  filterType: 'Day' | 'Month' = 'Day';

  ngOnInit() {
    this.unitId = this.data.unit
    this.fromDate = this.data.fdate
    this.toDate = this.data.tdate
    this.companyId=this.data.row.companyId
    this.loadGrid(); // initial load
  }

  loadGrid() {
    const monthValue = this.filterType === 'Month' ? 'Months' : 'Day';
    this.gridConfig = {
      apiUrl: "Branch/BranchWiseCompanySummaryList",
      columnsList: this.allcolumns,
      sortField: "CompanyId",
      sortOrder: 0,
      filters: [
        { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Contains },
        { fieldName: "CompanyId", fieldValue: String(this.companyId), opType: OperatorComparer.Contains },
        { fieldName: "Month", fieldValue: monthValue, opType: OperatorComparer.Contains },
      ]
    }
    setTimeout(() => {
      this.grid.gridConfig = this.gridConfig;
      this.grid.bindGridData();
    }, 100);
  }

  setFilterType(type: 'Day' | 'Month') {
    this.filterType = type;
    this.loadGrid();
  }

  onClose() {
    this._matDialog.closeAll()
  }
}
