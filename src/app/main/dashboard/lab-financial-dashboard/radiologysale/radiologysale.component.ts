import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../dashboard.service';
import { RadioList } from '../lab-financial-dashboard.component';

@Component({
    selector: 'app-radiologysale',
    templateUrl: './radiologysale.component.html',
    styleUrls: ['./radiologysale.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RadiologysaleComponent {

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    unitId = 0
    trendRadioData: RadioList[] = [];
    trendChart: any;

       public RadioDailysalesChart: any;


    constructor(
        public _dashboardServices: DashboardService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,) { }

    ngOnInit() {
        // this.unitId = this.data.unit
        this.getRadiologyList();
    }


    // setFilterType(type: 'Day' | 'Month') {

    //     this.getRadiologyList();
    // }
  modalityData = [
        { name: '', value: 0 }
    ];
    getRadiologyList() {
        
        const vadat = {
            "UnitId": this.data.unit,
            'FromDate': this.data.fdate,
            'ToDate': this.data.tdate
        }
        this._dashboardServices.getLabSummarydetailList(vadat).subscribe((data: any) => {
            this.trendRadioData = data.radiologySales
            console.log(this.trendRadioData)
            if (this.trendRadioData) {
                this.modalityData = [
                    ...this.modalityData,
                    ...this.trendRadioData.map(item => ({

                        name: item.radDate,
                        value: item.dailyRadiologySale
                    }))
                ];
            }

          
            if (this.trendRadioData)
                this.RadioDailysalesChart = this.getRadioSalesBarChart();

        });
    }
    getRadioSalesBarChart() {
        if (this.RadioDailysalesChart) {
            this.RadioDailysalesChart.destroy();
        }


        return new Chart('RadioDailysalesChart', {
            type: 'bar',
            data: {
                labels: this.modalityData.map(d => this.datePipe.transform(d.name, 'dd-MMM')),
                datasets: [
                    {
                        label: 'Date',
                        data: this.modalityData.map(d => d.value),
                        backgroundColor: [
                            '#bbdefb',   // very pale blue
                            '#abd4f6',   // light sky blue
                            '#7dc1f9',   // medium light blue
                            '#749bf6',   // your bright one
                            '#8082fd',   // indigo transition
                            '#6b70f8',   // deep vivid blue
                            '#c57bf7',   // bluish purple
                            '#a660d5'    // final vivid purple
                        ],
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

    onClose() {
        this._matDialog.closeAll()
    }
}

