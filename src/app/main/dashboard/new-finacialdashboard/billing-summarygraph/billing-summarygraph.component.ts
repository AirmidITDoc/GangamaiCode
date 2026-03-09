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
type CollectionRow = {
  mode: string;
  amount: number;
};
type ReceiptSummaryRow = {
  label: string;
  amount: number;

};

@Component({
  selector: 'app-billing-summarygraph',
  templateUrl: './billing-summarygraph.component.html',
  styleUrls: ['./billing-summarygraph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class BillingSummarygraphComponent {

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


    public modalityChart: any;
    public modalityChart1: any;
    onClose() {
        this._matDialog.closeAll()
    }

    trendData: Servicecharge[] = [];
    Financedata: any


    modalityData = [
        { modality: '', opcount: 0 }
    ];

    modalityData1 = [
        { modality: '', opcount: 0 }
    ];

      collection: CollectionRow[] = [
    { mode: 'Cash', amount: 0 },
    { mode: 'Cheque', amount: 0 },
    { mode: 'Card', amount: 0 },
    { mode: 'EFT', amount: 0 },
    { mode: 'ECS', amount: 0 },
  ];

  receiptSummary: ReceiptSummaryRow[] = [
    { label: 'Receipt', amount: 0 },
    { label: 'Advance', amount: 0 },
    { label: 'Return', amount: 0 },
    { label: 'Refund', amount: 0 },
  ];
    getServiceList() {
        debugger

        this.fromDate =this.data.fdate// this.datePipe.transform(this.data.fdate.toISOString(), "yyyy-MM-dd")
        this.toDate = this.data.tdate//this.datePipe.transform(this.data.tdate.toISOString(), "yyyy-MM-dd")
        var vadat = {
            "UnitId": this.unitId,
            'FromDate': this.fromDate,
            'ToDate': this.toDate
        }
        this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {
            this.Financedata = data
            this.trendData = this.Financedata.billSummary

            if (this.Financedata.billSummary) {
        this.collection[0].amount = this.Financedata.billSummary[0]['cash']
        this.collection[1].amount = this.Financedata.billSummary[0]['cheque']
        //  this.collection[2].amount =this.Financedata.billSummary[0]['neft']
        this.collection[2].amount = this.Financedata.billSummary[0]['cardPay']
        this.collection[3].amount = this.Financedata.billSummary[0]['upi']
      }

      
      if (this.Financedata.receiptOPIP) {
        console.log()
        this.receiptSummary[0].amount = this.Financedata.receiptOPIP[0]['receipt']
        this.receiptSummary[1].amount = this.Financedata.advanceOPIP[0]['advance']
        this.receiptSummary[2].amount = this.Financedata.refundOPIP[0]['refund']
        this.receiptSummary[3].amount = this.Financedata.pharmacyReturn[0]['return1']

      }


            console.log(this.Financedata)
            if (this.trendData){

                this.modalityData = [
                    ...this.modalityData,
                    ...this.collection.map(item => ({

                        modality: item.mode,
                        opcount: item.amount
                    }))
                ];
            this.modalityData1 = [
                ...this.modalityData1,
                ...this.receiptSummary.map(item => ({
                    modality: item.label,
                    opcount: item.amount
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
                        label: 'Service Name',
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
    serviceName: any;
    opTotalAMT: any;
    opDiscount: any;
    opCollection: any;
    ipTotalAMT: any;
    ipDiscount: any;
    ipCollection: any;

    constructor(test: any) {
        this.serviceName = test.serviceName || '';
        this.opTotalAMT = test.opTotalAMT || 0;
        this.opDiscount = test.opDiscount || '';
        this.opCollection = test.opCollection || 0;
        this.ipTotalAMT = test.ipTotalAMT || '';
        this.ipDiscount = test.ipDiscount || 0;
        this.ipCollection = test.ipCollection || '';

    }
}
