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
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { NewConsentComponent } from './new-consent/new-consent.component';

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

  dsConsentList = new MatTableDataSource


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  gridConfig: gridModel = {
    apiUrl: "PathCategoryMaster/List",
    columnsList: [
      { heading: "-", key: "type", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "UHID", key: "uhid", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Date&Time", key: "time", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Consent Name", key: "consentName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Consent Desc", key: "consentDesc", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Age", key: "age", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Mobile", key: "mobile", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "Added By", key: "username", sort: true, align: 'left', emptySign: 'NA' },
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
      } //Action 1-view, 2-Edit,3-delete
    ],
    sortField: "RegId",
    sortOrder: 0,
    filters: [
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "patientName", fieldValue: "", opType: OperatorComparer.Contains },
      { fieldName: "uhid", fieldValue: "", opType: OperatorComparer.Contains },
    ],
    row: 25
  }

  constructor(
    public _ConsentService: ConsentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  NewConsent() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(NewConsentComponent,
      {
        maxHeight: '90vh',
        width: '100%'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.grid.bindGridData();
      }
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
      if (result) {
        that.grid.bindGridData();
      }
    });
  }

}
