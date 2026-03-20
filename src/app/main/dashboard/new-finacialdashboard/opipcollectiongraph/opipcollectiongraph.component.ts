import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../dashboard.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-opipcollectiongraph',
    templateUrl: './opipcollectiongraph.component.html',
    styleUrls: ['./opipcollectiongraph.component.scss']
})
export class OPIPCollectiongraphComponent {
    unitId = 1

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    constructor(
        public _dashboardServices: DashboardService,
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

        this.getServiceList();
    }


    setFilterType(type: 'Day' | 'Month') {
        this.filterType = type;
        this.getServiceList();
    }
    public modalityChart: any;
    public modalityChart1: any;
    onClose() {
        this._matDialog.closeAll()
    }

    trendData: Servicecharge[] = [];
    trendData1: Servicecharge[] = [];
    trendChart: any;
    Financedata: any


    modalityData = [
        { modality: '', opcount: 0 }
    ];

    modalityData1 = [
        { modality: '', opcount: 0 }
    ];
    getServiceList() {
        debugger

        this.fromDate = this.data.fdate// this.datePipe.transform(this.data.fdate.toISOString(), "yyyy-MM-dd")
        this.toDate = this.data.tdate//this.datePipe.transform(this.data.tdate.toISOString(), "yyyy-MM-dd")
        const vadat = {
            "UnitId": this.unitId,
            'FromDate': this.fromDate,
            'ToDate': this.toDate
        }
        this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {
            this.Financedata = data
            this.trendData = this.Financedata.groupWiseCollectionOP
            this.trendData1 = this.Financedata.groupWiseCollectionIP

            if (this.trendData) {

                this.modalityData = [
                    ...this.modalityData,
                    ...this.trendData.map(item => ({

                        modality: item.groupName,
                        opcount: item.totalAmount
                    }))
                ];
            }
            if (this.trendData1) {
                this.modalityData1 = [
                    ...this.modalityData1,
                    ...this.trendData1.map(item => ({
                        modality: item.groupName,
                        opcount: item.totalAmount
                    }))
                ];
            }
            console.log(this.modalityData)

            this.modalityChart = this.getModalityBarChart();
            this.modalityChart1 = this.getModalityBarChart1();

        });

    }

    // Tests by Modality Bar Chart
    getModalityBarChart() {
        return new Chart('modalityChart', {
            type: 'bar',
            data: {
                labels: this.modalityData.map(d => d.modality),
                datasets: [
                    {
                        label: 'Group Name',
                        data: this.modalityData.map(d => d.opcount),
                        backgroundColor: ['#9661db', '#e9ac1b', '#28af28', '#70c7bd', '#ff5a8a'],
                        borderRadius: 6
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 11 }
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    getModalityBarChart1() {
        return new Chart('modalityChart1', {
            type: 'bar',
            data: {
                labels: this.modalityData1.map(d => d.modality),
                datasets: [
                    {
                        label: 'Group Name',
                        data: this.modalityData1.map(d => d.opcount),
                        backgroundColor: ['#9661db', '#e9ac1b', '#28af28', '#70c7bd', '#ff5a8a'],
                        borderRadius: 6
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 11 }
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

}
export class Servicecharge {
    groupName: any;
    totalAmount: any;

    constructor(test: any) {
        this.groupName = test.groupName || '';
        this.totalAmount = test.totalAmount || 0;
    }
}