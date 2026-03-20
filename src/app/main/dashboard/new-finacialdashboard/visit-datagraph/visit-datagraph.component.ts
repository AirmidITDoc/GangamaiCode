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
  selector: 'app-visit-datagraph',
  templateUrl: './visit-datagraph.component.html',
  styleUrls: ['./visit-datagraph.component.scss']
})
export class VisitDatagraphComponent {

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
  public modalityChart2: any;
  onClose() {
    this._matDialog.closeAll()
  }

  trendData: Servicecharge[] = [];
  trendData1: Servicecharge[] = [];
  trendData2: Servicecharge[] = [];
  trendChart: any;
  Financedata: any


  modalityData = [
    { modality: '', opcount: 0 }
  ];

  modalityData1 = [
    { modality: '', opcount: 0 }
  ];
  modalityData2 = [
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
      this.trendData = this.Financedata.typeOfVisit
      this.trendData1 = this.Financedata.ipRefDoctorCount
      // this.trendData2 = this.Financedata.ipRefDoctorCount


      console.log(this.Financedata)
      if (this.trendData) {

        this.modalityData = [
          ...this.modalityData,
          ...this.trendData.map(item => ({

            modality: item.typeOFVisit,
            opcount: item.patientCount
          }))
        ];
      }
      if (this.trendData1) {
        this.modalityData1 = [
          ...this.modalityData1,
          ...this.trendData1.map(item => ({
            modality: item.refName,
            opcount: item.opRefCount
          }))
        ];
      }
      if (this.trendData1) {
        this.modalityData2 = [
          ...this.modalityData2,
          ...this.trendData1.map(item => ({
            modality: item.refName,
            opcount: item.ipRefCount
          }))
        ];
      }
      console.log(this.modalityData)

      this.modalityChart = this.getModalityBarChart();
      this.modalityChart1 = this.getModalityBarChart1();
      this.modalityChart2 = this.getModalityBarChart2();

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
            label: 'Type Of Visit',
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
            label: 'Refere By',
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

  getModalityBarChart2() {
    return new Chart('modalityChart2', {
      type: 'bar',
      data: {
        labels: this.modalityData2.map(d => d.modality),
        datasets: [
          {
            label: 'Refere By',
            data: this.modalityData2.map(d => d.opcount),
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
  typeOFVisit: any;
  typeOfPatient: any;
  patientCount: any;
  refName: any;
  ipRefCount: any;
  opRefCount: any;
  ip: any;
  op: any;

  constructor(test: any) {
    this.typeOFVisit = test.typeOFVisit || '';
    this.typeOfPatient = test.typeOfPatient || '';
    this.patientCount = test.patientCount || 0;
    this.refName = test.refName || '';
    this.ipRefCount = test.ipRefCount || 0;
    this.opRefCount = test.opRefCount || '';
    this.ip = test.ip || 0;
    this.op = test.op || '';

  }
}
