import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ClinicalCareChartService } from '../clinical-care-chart.service';

@Component({
  selector: 'app-phlebitis-score',
  templateUrl: './phlebitis-score.component.html',
  styleUrls: ['./phlebitis-score.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PhlebitisScoreComponent implements OnInit {
  displayedColumns: string[] = [
    'patientId',
    'RegNo',
    'MobileNo',
    'PatientName' 
  ]
  MyForm:FormGroup;
  PatientType:any;
  RefDocName:any;
  DepartmentName:any;
  Ageyear:any;
  AgeMonth:any;
  AgeDay:any;
  AdmissionDate:any;
  GenderName:any;
  PatientName: any ;
  vAdmissionID: any = 0;
  RegNo:any;
  Doctorname:any;
  Tarrifname:any;
  CompanyName:any;
  WardName:any;
  BedNo:any;
  IPDNo:any;
  sIsLoading:string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  datasource = new MatTableDataSource;
  
  constructor(
    public _formbuilder:UntypedFormBuilder,
    public  _ClinicalcareService: ClinicalCareChartService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService, 
  ) { }

  ngOnInit(): void {
    this.CreateMyForm();
  }
  CreateMyForm(){
    this.MyForm = this._formbuilder.group({
      IVsiteAppears:[''],
      OneIVsitePain:[''],
      OneIVsiteRedness:[''],
      TwoIVsitePain:[''],
      TwoIVsiteRedness:[''],
      TwoIVsiteSwelling:[''],
      AllIVsitePain:[''],
      AllIVsiteRedness:[''],
      AllIVsiteSwelling:[''],
      AllIVsitePainExt:[''],
      AllIVsiteRednessExt:[''],
      AllIVsiteSwellingExt:[''],
      AllIVsitePheleExt:[''],
      AllIVsitePainExt1:[''],
      AllIVsiteRednessExt1:[''],
      AllIVsiteSwellingExt1:[''],
      AllIVsitePhleExt1:[''],
      AllIVsitePyrexExt1:['']
    });
  }

  onClose(){
    this._matDialog.closeAll(); 
  }
}
