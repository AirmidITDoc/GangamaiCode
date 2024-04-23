import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClinicalCareChartService } from './clinical-care-chart.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-clinical-care-chart',
  templateUrl: './clinical-care-chart.component.html',
  styleUrls: ['./clinical-care-chart.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ClinicalCareChartComponent implements OnInit {
  displayedColumns: string[] = [
    'patientId',
    'PatientName' 
  ]
  displayedPainAsse: string[] = [
    'givendate',
    'giventime',
    'PainAssess',
    'Employeename',
    'Action'
  ]

  FloorList:any=[];
  WardList:any=[];
  isRegIdSelected:boolean=false;
  //screenFromString:'fromdate-form';
  screenFromString1:'todate-form';
  screenFromString = 'fromdate-form';
  dateTimeObj:any;

  dsClinicalcarePatient = new MatTableDataSource<PatientList>();
  dsPainsAssessment =new MatTableDataSource;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
  constructor(
    public _ClinicalcareService:ClinicalCareChartService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSelectedObjReg(){
    
  }
}
export class PatientList {
  patientId: any;
  PatientName: string; 

  constructor(PatientList) {
    {

      this.patientId = PatientList.patientId || 0;
      this.PatientName = PatientList.PatientName || ""; 
    }
  }
}
