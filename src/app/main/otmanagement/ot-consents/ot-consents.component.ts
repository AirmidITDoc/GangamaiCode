import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { NewOtconsentsComponent } from './new-otconsents/new-otconsents.component';
import { OtConsentsService } from './ot-consents.service';
import { DatePipe } from '@angular/common';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ot-consents',
  templateUrl: './ot-consents.component.html',
  styleUrls: ['./ot-consents.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OtConsentsComponent {
  msg: any;
  consentName: any = "";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  FirstName: any = ""
  regNo: any = "0"
  LastName: any = ""
   myFilterform: FormGroup

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig.columnsList.find(col => col.key === 'opIpId')!.template = this.actionsTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'surgeryTypeId')!.template = this.actionsTemplate1;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

  allcolumns = [
    { heading: "", key: "opIpId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
    { heading: "", key: "surgeryTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
    { heading: "Date-Time", key: "reservationTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
    { heading: "Operation Date-Time", key: "opstartTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
    { heading: "UHID NO", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Surgeon Name1", key: "surgenName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Surgeon Name2", key: "surgenName1", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "AnathesDrName1", key: "anestheticsDr", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "AnathesDrName2", key: "anestheticsDr1", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Surgery name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "OTTableName", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "AnesthType", key: "anesthTypeId", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Instruction", key: "instruction", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    { heading: "IsCancelledDate", key: "isCancelledDateTime", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 8 },
    { heading: "Reasons", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    {
      heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  allFilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },

  ]
  gridConfig: gridModel = {
    apiUrl: "OTReservation/OTReservationlist",
    columnsList: this.allcolumns,
    sortField: "OtreservationId",
    sortOrder: 0,
    filters: this.allFilters
  }

  constructor(
    public _OtConsentService: OtConsentsService,
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
      FirstName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      LastName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      RegNo: []
    });
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
    this.FirstName = this.myFilterform.get('FirstName').value + "%"
    this.LastName = this.myFilterform.get('LastName').value + "%"
    this.regNo = this.myFilterform.get('RegNo').value || "0"
    this.getfilterdata();
  }
  getfilterdata() {
    this.gridConfig = {
      apiUrl: "OTReservation/OTReservationlist",
      columnsList: this.allcolumns,
      sortField: "OtreservationId",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.Contains },
        { fieldName: "LastName", fieldValue: this.LastName, opType: OperatorComparer.Contains },
        { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },

      ],
      row: 25
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterform.get('RegNo').setValue("")

    this.onChangeFirst();
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(NewOtconsentsComponent,
      {
        maxWidth: "90vw",
        maxHeight: '85%',
        width: '70%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.grid.bindGridData();
      }
    });
  }
}
