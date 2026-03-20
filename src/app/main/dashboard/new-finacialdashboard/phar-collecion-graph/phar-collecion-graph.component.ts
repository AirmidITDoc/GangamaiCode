import { DatePipe } from '@angular/common';
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

@Component({
  selector: 'app-phar-collecion-graph',
  templateUrl: './phar-collecion-graph.component.html',
  styleUrls: ['./phar-collecion-graph.component.scss']
})
export class PharCollecionGraphComponent {
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

   
    ngOnInit() {
        this.unitId = this.data.unit

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

        this.fromDate =this.data.fdate
        this.toDate = this.data.tdate
        const vadat = {
            "UnitId": this.unitId,
            'FromDate': this.fromDate,
            'ToDate': this.toDate
        }
        this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {
            this.Financedata = data
            this.trendData = this.Financedata.pharmacySaleOP
            this.trendData1 = this.Financedata.pharmacySaleIP
          
            if (this.trendData){

                this.modalityData = [
                    ...this.modalityData,
                    ...this.trendData.map(item => ({

                        modality: item.opNetAmount,
                        opcount: item.oPprofitamount
                    }))
                ];
            }
             if (this.trendData1){
            this.modalityData1 = [
                ...this.modalityData1,
                ...this.trendData1.map(item => ({
                    modality: item.ipNetAmount,
                    opcount: item.iPprofitamount
                }))
            ];
         }
          
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
                        label: 'Pharmacy OP Sales Profit',
                        data: this.modalityData.map(d => d.opcount),
                        backgroundColor: ['#e9ac1b','#9661db',  '#28af28', '#70c7bd', '#ff5a8a'],
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
                        label: 'Pharmacy IP Sales Profit',
                        data: this.modalityData1.map(d => d.opcount),
                        backgroundColor: [ '#e9ac1b','#9661db', '#28af28', '#70c7bd', '#ff5a8a'],
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
    opNetAmount: any;
    oPprofitamount: any;
    ipNetAmount: any;
    iPprofitamount: any;


    constructor(test: any) {
        this.opNetAmount = test.opNetAmount || '';
        this.oPprofitamount = test.oPprofitamount || 0;
        this.ipNetAmount = test.ipNetAmount || '';
        this.iPprofitamount = test.iPprofitamount || 0;
     
    }
}