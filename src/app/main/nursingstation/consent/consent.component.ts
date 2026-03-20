import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { ConsentService } from './consent.service';
import { NewConsentComponent } from './new-consent/new-consent.component';
import { FormGroup } from '@angular/forms';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { AirmidConsentformComponent } from 'app/main/shared/componets/airmid-consentform/airmid-consentform.component';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ConsentComponent implements OnInit {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.NursingConsent, permissionType.Add);

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
  myFilterform: FormGroup
  patientName = "%";
  regNo = "0";
  opiptype: any = "2"

  dsConsentList = new MatTableDataSource

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('actionsIPOP') actionsIPOP!: TemplateRef<any>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'opipType')!.template = this.actionsIPOP;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

   allcolumns = [
    { heading: "-", key: "opipType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
    { heading: "Date", key: "consentDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 6 },
    { heading: "UHID", key: "regNo", align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Department Name", key: "departmentName", align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Doctor Name", key: "doctorName", align: 'left', emptySign: 'NA', width: 300 },
    { heading: "DOA", key: "admissionDate", align: 'left', emptySign: 'NA', type: 6 },
    { heading: "AgeYear", key: "ageYear", align: 'left', emptySign: 'NA', },
    { heading: "Consent Name", key: "consentName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    {
      heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "TranLabel", fieldValue: 'Nursing', opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.NursingConsent,
    apiUrl: "TransactionConsentMaster/TransactionConsentMasterList",
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
    private commonService: PrintserviceService,
    public toastr: ToastrService, public permissionService: PagePermissionService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._ConsentService.createSearchForm()
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
    this.getfilterdata();
  }

   getfilterdata() {
     this.gridConfig = {
       apiUrl: "TransactionConsentMaster/TransactionConsentMasterList",
       columnsList: this.allcolumns,
       sortField: "ConsentId",
       sortOrder: 0,
       filters: [
         { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
         { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
         { fieldName: "TranLabel", fieldValue: 'Nursing', opType: OperatorComparer.Equals }
       ],
       row: 25
     }
     console.log(this.gridConfig)
     this.grid.gridConfig = this.gridConfig;
     this.grid.bindGridData();
   }

  Clearfilter(event) {
    console.log(event)
    if (event == 'PatientName')
      this.myFilterform.get('PatientName').setValue("")
    if (event == 'RegNo')
      this.myFilterform.get('RegNo').setValue("")

    this.onChangeFirst();
  }

  onFiles() {
    const dialogRef = this._matDialog.open(
      AirmidConsentformComponent,
      {
        maxWidth: "90vw",
        maxHeight: '85%',
        width: '70%',
        data: { refId: 0, opipId: 0, opipType: 1, Id: 0, title: 'NursingConsent', labelType: 'Nursing' }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.grid.bindGridData();
    });
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  OnViewReportPdf(element: any) {

    setTimeout(() => {
      const param = {
        "searchFields": [
          {
            "fieldName": "ConsentId",
            "fieldValue": String(element.consentId),
            "opType": "Equals"
          },
          {
            "fieldName": "OPIPType",
            "fieldValue": String(element.opipType),
            "opType": "Equals"
          }
        ],
        "mode": "ConsentInformation"
      }

      this._ConsentService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Consent Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

}
