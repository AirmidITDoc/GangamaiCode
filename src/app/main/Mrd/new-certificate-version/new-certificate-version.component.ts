import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AirmidConsentformComponent } from 'app/main/shared/componets/airmid-consentform/airmid-consentform.component';
import { NewCertificateVersionService } from './new-certificate-version.service';

@Component({
  selector: 'app-new-certificate-version',
  templateUrl: './new-certificate-version.component.html',
  styleUrls: ['./new-certificate-version.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewCertificateVersionComponent {
 msg: any;
  consentName: any = "";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  regNo: any = "0"
  LastName: any = ""
   myFilterform: FormGroup

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig.columnsList.find(col => col.key === 'opipType')!.template = this.actionsTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

   allcolumns = [
    { heading: "Date", key: "consentDate", sort: true, align: 'left', emptySign: 'NA', width: 200 , type:6},
    { heading: "UHID", key: "regNo", align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", align: 'left', emptySign: 'NA' , width: 300},
    { heading: "Department Name", key: "departmentName", align: 'left', emptySign: 'NA' , width: 300},
    { heading: "Doctor Name", key: "doctorName", align: 'left', emptySign: 'NA' , width: 300},
    { heading: "DOA", key: "admissionDate", align: 'left', emptySign: 'NA' , type:6},
    { heading: "AgeYear", key: "ageYear",align: 'left', emptySign: 'NA',  },
    { heading: "Consent Name", key: "consentName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    {
      heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  ]
  gridConfig: gridModel = {
    apiUrl: "TransactionConsentMaster/TransactionConsentMasterList",
    columnsList: this.allcolumns,
    sortField: "ConsentId",
    sortOrder: 0,
    filters: this.allfilters
  }

  constructor(
      public _certificateService: NewCertificateVersionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder,
  ) { }

  
  ngOnInit(): void { 
    this.myFilterform = this.createSearchForm();}

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      consentName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]]
    });
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
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
      ],
      row: 25
    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'consentName')
      this.myFilterform.get('consentName').setValue("")

    this.onChangeFirst();
  }

   onFiles() {
      const dialogRef = this._matDialog.open(
        AirmidConsentformComponent,
        {
          maxWidth: "90vw",
          maxHeight: '85%',
          width: '70%',
          data: { refId: 0, opipId: 0, opipType: 0, Id: 0,title: 'Certificate',labelType:'MRD' }
        }
      );
  
      dialogRef.afterClosed().subscribe((result) => {
        // this.onCloseDialog.emit(result);
      });
    }
}
