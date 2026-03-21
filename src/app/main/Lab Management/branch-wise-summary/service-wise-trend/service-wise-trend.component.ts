import { DatePipe } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
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
    serviceId = "0"
    monthValue: any;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    // @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    allcolumns = [
        { heading: "Month & Date", key: "fullDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
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
        this.serviceId = this.data.row.serviceId
        this.loadGrid(); // initial load
        this.getServiceList();
    }

    loadGrid() {
        this.monthValue = this.filterType === 'Month' ? 'Months' : 'Day';
        this.gridConfig = {
            apiUrl: "Branch/BranchWiseTestSummaryList",
            columnsList: this.allcolumns,
            sortField: "ServiceId",
            sortOrder: 0,
            filters: [
                { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Contains },
                { fieldName: "ServiceId", fieldValue: String(this.serviceId), opType: OperatorComparer.Contains },
                { fieldName: "Month", fieldValue: this.monthValue, opType: OperatorComparer.Contains },
            ]
        };
        setTimeout(() => {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        }, 100);
    }
    setFilterType(type: 'Day' | 'Month') {
        this.filterType = type;
        this.loadGrid();
        this.getServiceList();
    }

    onClose() {
        this._matDialog.closeAll()
    }

    trendData: LabRequest[] = [];
    trendChart: any;

    getServiceList() {
        this.monthValue = this.filterType === 'Month' ? 'Months' : 'Day';
        const param = {
            "first": 0,
            "rows": 9999,
            "sortField": "ServiceId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.unitId),
                    "opType": "Contains"
                },
                {
                    "fieldName": "ServiceId",
                    "fieldValue": String(this.serviceId),
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

        this._LabResultListService.getTrendserviceList(param).subscribe(Menu => {
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
export class LabRequest {
    fullDate: any;
    netAmount: number;
    price: number;
    ServiceId: any;
    CreditedtoDoctor: any;
    creditedtoDoctor: boolean;
    constructor(LabRequest) {
        this.fullDate = LabRequest.fullDate || '';
        this.netAmount = LabRequest.netAmount || 0;
        this.price = LabRequest.price || 0;
        this.ServiceId = LabRequest.ServiceId || 0;
        this.CreditedtoDoctor = LabRequest.CreditedtoDoctor || 0;
        this.creditedtoDoctor = LabRequest.creditedtoDoctor || 0;
    }
}