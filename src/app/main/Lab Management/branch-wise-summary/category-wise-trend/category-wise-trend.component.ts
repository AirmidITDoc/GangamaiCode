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
import { LabRequest } from '../service-wise-trend/service-wise-trend.component';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-category-wise-trend',
  templateUrl: './category-wise-trend.component.html',
  styleUrls: ['./category-wise-trend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CategoryWiseTrendComponent {
  unitId = "0"
  category = "0"
  monthValue: any;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "Month", key: "fullDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
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

  @ViewChild('grid') grid!: AirmidTableComponent;

  gridConfig!: gridModel;
  filterType: 'Day' | 'Month' = 'Day';

  ngOnInit() {
    this.unitId = this.data.unit
    this.fromDate = this.data.fdate
    this.toDate = this.data.tdate
    this.category = this.data.row.categoryId
    this.loadGrid(); // initial load
    this.getCategoryList();
  }

  loadGrid() {
    this.monthValue = this.filterType === 'Month' ? 'Months' : 'Day';
    this.gridConfig = {
      apiUrl: "Branch/BranchWiseCategorySummaryList",
      columnsList: this.allcolumns,
      sortField: "CategoryId",
      sortOrder: 0,
      filters: [
        { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Contains },
        { fieldName: "CategoryId", fieldValue: String(this.category), opType: OperatorComparer.Contains },
        { fieldName: "Month", fieldValue: this.monthValue, opType: OperatorComparer.Contains },
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
    this.getCategoryList();
  }

  onClose() {
    this._matDialog.closeAll()
  }

  trendData: LabRequest[] = [];
  trendChart: any;

  getCategoryList() {
    this.monthValue = this.filterType === 'Month' ? 'Months' : 'Day';
    var param = {
      "first": 0,
      "rows": 9999,
      "sortField": "CategoryId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "UnitId",
          "fieldValue": String(this.unitId),
          "opType": "Contains"
        },
        {
          "fieldName": "CategoryId",
          "fieldValue": String(this.category),
          "opType": "Contains"
        },
        {
          "fieldName": "Month",
          "fieldValue": this.monthValue,
          "opType": "Contains"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    this._LabResultListService.getTrendcategoryList(param).subscribe(Menu => {
      this.trendData = Menu.data as LabRequest[];

      this.loadTrendChart();
    });

  }

  loadTrendChart() {

    if (!this.trendData || this.trendData.length === 0) {
      return;
    }

    const labels = this.trendData.map(x => x.fullDate);
    const netAmounts = this.trendData.map(x => x.netAmount);

    // Destroy old chart
    if (this.trendChart) {
      this.trendChart.destroy();
    }

    this.trendChart = new Chart('trendChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Amount',
            data: netAmounts,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            backgroundColor: 'rgba(54,162,235,0.3)',
            borderColor: '#36A2EB'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: this.filterType === 'Month' ? 'Month' : 'Day'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Amount'
            }
          }
        }
      }
    });
  }

}
