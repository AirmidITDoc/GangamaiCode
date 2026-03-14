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
    selector: 'app-drwisecollection',
    templateUrl: './drwisecollection.component.html',
    styleUrls: ['./drwisecollection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DrwisecollectionComponent {
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
    unitId = 0
    
    ngOnInit() {
        this.unitId = this.data.unit
       
        this.getdrwiseList();
    }


    setFilterType(type: 'Day' | 'Month') {

        this.getdrwiseList();
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

    // modalityData: { modality: string; opcount: number }[] = [
    //     { modality: 'X-Ray', opcount: 45 }
    // ];
    modalityData = [
        { modality: '', opcount: 0 }
    ];

    modalityData1 = [
        { modality: '', opcount: 0 }
    ];
    public chargeList: modilitydata[] = [];
    getdrwiseList() {
        debugger
        var vadat = {
            "UnitId": this.unitId,
            'FromDate': this.data.fdate,
            'ToDate': this.data.tdate
        }
        this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {
            this.Financedata = data
            this.trendData = this.Financedata.doctorWiseTotalBusiness
            this.trendData1 = this.Financedata.doctorWisePatientCount

            console.log(this.trendData)
            if (this.trendData) {

                this.modalityData = [
                    ...this.modalityData,
                    ...this.trendData.map(item => ({

                        modality: item.doctorName,
                        opcount: item.totalBusiness
                    }))
                ];
            }
            if (this.trendData1) {
                debugger
                 this.modalityData1 = [
                    ...this.modalityData1,
                    ...this.trendData1.map(item => ({

                        modality: item.doctorName,
                        opcount: item.patientCount
                    }))
                ];

            }

            console.log(this.modalityData)
            
            // if (this.modalityData)
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
                            label: 'Dr.Name',
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
                        label: 'Number of Tests',
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
    totalBusiness: any;
    doctorName: any;
    opCollection: any;
    patientCount: any;

    constructor(test: any) {
        this.totalBusiness = test.totalBusiness || 0;
        this.doctorName = test.doctorName || '';
         this.opCollection = test.opCollection || 0;
        this.patientCount = test.patientCount || 0;

    }
}
export class modilitydata {
    modality: any;
    opcount: any;


    constructor(test: any) {
        this.modality = test.modality || '';
        this.opcount = test.opcount || 0;


    }
}

