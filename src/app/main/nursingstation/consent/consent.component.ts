import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ConsentService } from './consent.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ConsentComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    // color:true,
    editable: true,
    spellcheck: true,
    height: '7rem',
    minHeight: '7rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };
  onBlur(e:any){
    this.vTemplateDesc=e.target.innerHTML;
  }
  displayedColumns: string[] = [
    'patientId',
    'PatientName',
    'Age',
    'MobileNo',
    'DoctorName',
    'PatienSource',
    'date',
    'Action'
  ]
  isRegIdSelected:boolean=false;
  vTemplateDesc:any;
  DepartmentList:any=[];
  TemplateList:any=[];
  PatientName:any;
  vOPDNo:any;
  Gender:any;
  Age:any;
  patientsource:any;
  CompanyName:any;
  TarrifName:any;
  DoctorName:any;



  dsConsentList = new MatTableDataSource
  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
  constructor(
    public _ConsentService : ConsentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }


}
