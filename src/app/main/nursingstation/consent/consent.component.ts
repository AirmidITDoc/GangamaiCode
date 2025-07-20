import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { ConsentService } from './consent.service';
import { NewConsentComponent } from './new-consent/new-consent.component';
import { FormGroup } from '@angular/forms';

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
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
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
  isRegIdSelected: boolean = false;
  vTemplateDesc: any;
  DepartmentList: any = [];
  TemplateList: any = [];
  PatientName: any;
  vOPDNo: any;
  Gender: any;
  Age: any;
  patientsource: any;
  CompanyName: any;
  TarrifName: any;
  DoctorName: any;
  myFormSearch: FormGroup
  patientName = "%";
  regNo = "0";
  opiptype: any = "2"

  dsConsentList = new MatTableDataSource

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('actionsIPOP') actionsIPOP!: TemplateRef<any>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'opipType')!.template = this.actionsIPOP;
  }
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  allcolumns = [
    {
        heading: "-", key: "opipType", sort: true, align: 'left', type: gridColumnTypes.template,
        template: this.actionsIPOP
    },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Date&Time", key: "createdDatetime", sort: true, align: 'left', emptySign: 'NA', type:9,width:200},
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA',width:200},
    { heading: "Consent Name", key: "consentName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Consent Desc", key: "consentText", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Age", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Added By", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.OnEdit(data);
          }
        }, {
          action: gridActions.print, callback: (data: any) => {
          }
        }]
    }
  ]

  allfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "PatientName", fieldValue: this.patientName, opType: OperatorComparer.Equals },
    { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
    { fieldName: "OPIPType", fieldValue: this.opiptype, opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    apiUrl: "NursingConsent/ConsentpatientInfoList",
    columnsList: this.allcolumns,
    sortField: "ConsentId",
    sortOrder: 0,
    filters: this.allfilters
  }

  constructor(
    public _ConsentService: ConsentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.myFormSearch = this._ConsentService.createSearchForm()
  }

  onChangeFirst() {
    debugger
    this.fromDate = this.datePipe.transform(this.myFormSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFormSearch.get('end').value, "yyyy-MM-dd")
    this.patientName = this.myFormSearch.get('PatientName').value + "%"
    this.regNo = this.myFormSearch.get('RegNo').value || ""
    this.opiptype = this.myFormSearch.get('IsIPOrOP').value

    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "NursingConsent/ConsentpatientInfoList",
      columnsList: this.allcolumns,
      sortField: "ConsentId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "PatientName", fieldValue: this.patientName, opType: OperatorComparer.Equals },
        { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "OPIPType", fieldValue: this.opiptype, opType: OperatorComparer.Equals },
      ]
    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'PatientName')
      this.myFormSearch.get('PatientName').setValue("")
    if (event == 'RegNo')
      this.myFormSearch.get('RegNo').setValue("")

    this.onChangeFirst();
  }

  NewConsent() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button
    const dialogRef = this._matDialog.open(NewConsentComponent,
      {
        maxHeight: '90vh',
        width: '100%'
      });
    dialogRef.afterClosed().subscribe(result => {
        this.grid.bindGridData();
    });
  }

  OnEdit(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(NewConsentComponent,
      {
        maxHeight: '90vh',
        width: '100%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
    that.grid.bindGridData();
      
    });
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
