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
  selector: 'app-service-graph',
  templateUrl: './service-graph.component.html',
  styleUrls: ['./service-graph.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ServiceGraphComponent {
unitId = 1
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
    // this.fromDate = this.data.fdate
    // this.toDate = this.data.tdate
    this.serviceId ="0"// this.data.row.serviceId
    // this.loadGrid(); // initial load
    this.getServiceList();
  }

  // loadGrid() {
  //   this.monthValue = this.filterType === 'Month' ? 'Months' : 'Day';
  //   this.gridConfig = {
  //     apiUrl: "Branch/BranchWiseTestSummaryList",
  //     columnsList: this.allcolumns,
  //     sortField: "ServiceId",
  //     sortOrder: 0,
  //     filters: [
  //       { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Contains },
  //       { fieldName: "ServiceId", fieldValue: String(this.serviceId), opType: OperatorComparer.Contains },
  //       { fieldName: "Month", fieldValue: this.monthValue, opType: OperatorComparer.Contains },
  //     ]
  //   };
  //   setTimeout(() => {
  //     this.grid.gridConfig = this.gridConfig;
  //     this.grid.bindGridData();
  //   }, 100);
  // }
  setFilterType(type: 'Day' | 'Month') {
    this.filterType = type;
    // this.loadGrid();
    this.getServiceList();
  }
 public modalityChart: any;
  public modalityChart1: any;
  onClose() {
    this._matDialog.closeAll()
  }

  trendData: Servicecharge[] = [];
  trendChart: any;
 Financedata: any
// trendData = new MatTableDataSource<Servicecharge>();

    modalityData = [
        { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },
          { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },  { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },
          { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 } , { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 } , { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 } ,  { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },  { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 }
    ];

     modalityData1 = [
        { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },
          { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },  { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },
          { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 } , { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 } , { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 } ,  { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 },  { modality: 'X-Ray', opcount: 45 },
        { modality: 'CT Scan', opcount: 32 },
        { modality: 'MRI', opcount: 28 },
        { modality: 'Ultrasound', opcount: 35 },
        { modality: 'Mammography', opcount: 16 }
    ];
  getServiceList() {
   
     var vadat = {
      "UnitId": this.unitId,
      'FromDate':this.fromDate,
      'ToDate': this.toDate
    }
    this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {
     this.Financedata = data
      this.trendData =  this.Financedata.serviceCharges

      console.log(this.Financedata)
      if (this.trendData)
      
          this.trendData.forEach((item, index) => {
              debugger
              if(item.opCollection > 0){
                this.modalityData[index].modality = item.serviceName
                this.modalityData[index].opcount = item.opCollection
              }
              else if (item.ipCollection > 0){
                   this.modalityData1[index].modality = item.serviceName
                this.modalityData1[index].opcount = item.ipCollection
              }
            });

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
                        label: 'Number of Tests',
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
      serviceName:any;
      opTotalAMT:any;
      opDiscount:any;
      opCollection:any;
      ipTotalAMT:any;
      ipDiscount:any;
      ipCollection:any;

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