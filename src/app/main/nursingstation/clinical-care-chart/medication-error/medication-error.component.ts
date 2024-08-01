import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClinicalCareChartService } from '../clinical-care-chart.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-medication-error',
  templateUrl: './medication-error.component.html',
  styleUrls: ['./medication-error.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MedicationErrorComponent implements OnInit {

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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
  constructor(
    public _formbuilder:FormBuilder,
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

    });
  }

  onClose(){
    this._matDialog.closeAll(); 
  }
}
