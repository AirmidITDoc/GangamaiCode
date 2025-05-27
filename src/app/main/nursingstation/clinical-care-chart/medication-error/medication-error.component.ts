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
import { Observable } from 'rxjs';
import { ClinicalCareChartService } from '../clinical-care-chart.service';

@Component({
  selector: 'app-medication-error',
  templateUrl: './medication-error.component.html',
  styleUrls: ['./medication-error.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MedicationErrorComponent implements OnInit {
  displayedColumns: string[] = [
    'ErrorID',
    'Added',
    'ErrorIdList',
    'AddedDate',
    'ID',
    'Date',
    'Remark'
  ]
  displayedColumnsError: string[]=[
     'Select',
     'Errors'
  ]

  MyForm:FormGroup;
  SearchMyForm:FormGroup;
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
  isErrorTypeSelected:boolean=false;
  ErrorTypeListfilteredOptions:Observable<string[]>;
  vRemark:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  dsMedicationList = new MatTableDataSource
  dsErrorTypeList = new MatTableDataSource

  
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
    this.CreateSearchMyForm();
  }
  CreateMyForm(){
    this.MyForm = this._formbuilder.group({
      ErrorType:[''],
      Remark:['']
    });
  }
  CreateSearchMyForm(){
    this.SearchMyForm = this._formbuilder.group({
      start:[new Date().toISOString()],
      end:[new Date().toISOString()]
    });
  }

getErrorTypeList(){

}
  getSelectedObjErrorType(obj){

  }
  getOptionTextErrorType(option){
    return option.ErrorType
  }
  getMedicationList(){

  } 
  onClose(){
    this._matDialog.closeAll(); 
  }
}
