import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { PrintserviceService } from "app/main/shared/services/printservice.service";
import Swal from "sweetalert2";
import { AuthenticationService } from "app/core/services/authentication.service";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { OtBillingService } from "./ot-billing.service";
import { NewOtBillingComponent } from "./new-ot-billing/new-ot-billing.component";

@Component({
  selector: 'app-ot-billing',
  templateUrl: './ot-billing.component.html',
  styleUrls: ['./ot-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OtBillingComponent {
  myFilterform: FormGroup
  msg: any;
  RequestName: any = "";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  FirstName: any = ""
  regNo: any = "0"
  LastName: any = ""
  opipType: any = "2"
 
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'opiptype')!.template = this.actionsTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

  allcolumns = [
    { heading: "-", key: "opiptype", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
    // { heading: "", key: "isNewRecord", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
    { heading: "OTReser-Date&Time", key: "otReservationDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Surgery Date", key: "surgeryDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    // { heading: "Estimate Time", key: "estimateTime", sort: true, align: 'left', emptySign: 'NA', type: 7, width: 150 },
    // { heading: "Operation Date-Time", key: "opstartTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
    { heading: "UHID NO", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Blood Group", key: "bloodGroup", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Category Type", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Theater Name", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    {
      heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ];

  allFilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
    { fieldName: "OPIPType", fieldValue: this.opipType, opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    apiUrl: "OTReservation/OTReservationlist",
    columnsList: this.allcolumns,
    sortField: "OtreservationId",
    sortOrder: 0,
    filters: this.allFilters
  }

  constructor(
    public _otBillService: OtBillingService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._otBillService.createSearchForm();
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
    this.FirstName = this.myFilterform.get('FirstName').value + "%"
    this.LastName = this.myFilterform.get('LastName').value + "%"
    this.regNo = this.myFilterform.get('RegNo').value || "0"
    this.opipType = this.myFilterform.get('opipType').value
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "OTReservation/OTReservationlist",
      columnsList: this.allcolumns,
      sortField: "OtreservationId",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "OPIPType", fieldValue: this.opipType, opType: OperatorComparer.Equals },
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

  onNew(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur();

    const dialogRef = this._matDialog.open(NewOtBillingComponent,
      {
        maxWidth: "90vw",
        maxHeight: '90vh',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

}


export class OtAnethesia {
    resourceType: any;
    attendentType: any;
    attendent: any;
    fromTime: any;
    toTime: any;
    priceType: any;
    baseRs: any;
    basePer: any;
    grossAmt: any;
    concPer: any;
    concAmt: any;
    netAmt: any;
    currentDate = new Date();
   /**
     * Constructor
     *
     * @param OtAnethesia
     */

    constructor(OtAnethesia) {
        {
            this.resourceType = OtAnethesia.resourceType || 0;
            this.attendentType = OtAnethesia.attendentType || 0;
            this.attendent = OtAnethesia.attendent;
            this.fromTime = OtAnethesia.fromTime || this.currentDate;
            this.toTime = OtAnethesia.toTime || this.currentDate;
            this.priceType = OtAnethesia.priceType || '%';
            this.baseRs = OtAnethesia.baseRs || 0;
            this.basePer = OtAnethesia.basePer || 0;
            this.grossAmt = OtAnethesia.grossAmt 
            this.concPer = OtAnethesia.concPer || this.currentDate;
            this.concAmt = OtAnethesia.concAmt || 0;
            this.netAmt = OtAnethesia.netAmt || '';
          
        }
      }
    }