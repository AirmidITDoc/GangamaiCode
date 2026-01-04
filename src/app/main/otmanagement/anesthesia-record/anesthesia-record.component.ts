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
import { AnesthesiaRecordService } from "./anesthesia-record.service";
import { NewAnesthesiaRecordComponent } from "./new-anesthesia-record/new-anesthesia-record.component";
import { permissionCodes } from "app/main/shared/model/permission.model";

@Component({
  selector: 'app-anesthesia-record',
  templateUrl: './anesthesia-record.component.html',
  styleUrls: ['./anesthesia-record.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class AnesthesiaRecordComponent {
  myFilterform: FormGroup
  msg: any;
  RequestName: any = "";
  currentDate = new Date();
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
    { heading: "OTReser-Date&Time", key: "otReservationDateTime", sort: true, align: 'left', emptySign: 'NA', width: 160 },
    { heading: "Surgery Date", key: "surgeryDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    // { heading: "Estimate Time", key: "estimateTime", sort: true, align: 'left', emptySign: 'NA', type: 7, width: 150 },
    // { heading: "Operation Date-Time", key: "opstartTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 220 },
    { heading: "Blood Group", key: "bloodGroup", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Category Type", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "Theater Name", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 170 },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
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
    permissionCode: permissionCodes.OTReservation,
    apiUrl: "OTReservation/OTReservationlist",
    columnsList: this.allcolumns,
    sortField: "OtreservationId",
    sortOrder: 0,
    filters: this.allFilters
  }

  constructor(
    public _anesthesiaRecordService: AnesthesiaRecordService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._anesthesiaRecordService.createSearchForm();
  }

  onChangeFirst() {
    debugger

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
        { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: this.LastName, opType: OperatorComparer.StartsWith },
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
    console.log(row)
    const dialogRef = this._matDialog.open(NewAnesthesiaRecordComponent,
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

  onAnesthesiaRecord(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur();

    const dialogRef = this._matDialog.open(NewAnesthesiaRecordComponent,
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
  OnCancel(data: any) {
    Swal.fire({
      title: 'Do you want to cancel Anethesia?',
      text: "Please provide a reason for cancellation",
      icon: "warning",
      // input: 'text',
      // inputPlaceholder: 'Enter cancellation reason...',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!",
      preConfirm: (reason) => {
        if (!reason || reason.trim() === '') {
          Swal.showValidationMessage('Reason is required');
        }
        return reason;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // let submitData = {
        //   anesthesiaId: data.anesthesiaId,
        //   reason: result.value,
        //   isCancelledBy: this._loggedService.currentUserValue.userId
        // };
        console.log(data.anesthesiaId);
        this._anesthesiaRecordService.OnCancel(data.anesthesiaId).subscribe((res) => {
          this.toastr.success(res.message);
          this.grid.bindGridData();
        });
      }
    });
  }

  viewgetAnethesiaReportPdf(element) {
    console.log(element)
    debugger
    const param = {
      searchFields: [
        {
          fieldName: "OPIPID",
          fieldValue: String(element.opIpId),
          opType: "Equals"
        },
        {
          fieldName: "OPIPType",
          fieldValue: String(element.opIpType),
          opType: "Equals"
        }
      ],
      mode: "OTAnaesthesiaRecord"
    };
    this._anesthesiaRecordService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "OTAnaesthesia Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {

      });
    });
    // this.commonService.Onprint("AnesthesiaId", element.AnesthesiaId, "OTAnaesthesiaRecord");

  }


}


export class Otanesthesia {
  anesthesiaId: any;
  otreservationId: any;
  anesthesiaDate: any;
  anesthesiaTime: any;
  anesthesiaNo: any;
  opipid: any;
  opiptype: any;
  anesthesiaStartDate: any;
  anesthesiaStartTime: any;
  anesthesiaEndDate: any;
  anesthesiaEndTime: any;
  recoveryStartDate: any;
  recoveryStartTime: any;
  recoveryEndDate: any;
  recoveryEndTime: any;
  anesthesiaType: any;
  anesthesiaNotes: any;
  currentDate = new Date();
  tOtAnesthesiaPreOpdiagnoses: AnesthesiaPreOpdiagnoses[];
  /**
   * Constructor
   *
   * @param Otanesthesia
   */

  constructor(Otanesthesia) {
    {
      this.anesthesiaId = Otanesthesia.anesthesiaId || 0;
      this.otreservationId = Otanesthesia.otreservationId || 0;
      this.anesthesiaDate = Otanesthesia.anesthesiaDate || this.currentDate;
      this.anesthesiaTime = Otanesthesia.anesthesiaTime;
      this.anesthesiaNo = Otanesthesia.anesthesiaNo;
      this.opipid = Otanesthesia.opipid || '';
      this.opiptype = Otanesthesia.opiptype || 1;
      this.anesthesiaStartDate = Otanesthesia.anesthesiaStartDate || '';
      this.anesthesiaStartTime = Otanesthesia.anesthesiaStartTime || this.currentDate;
      this.anesthesiaEndDate = Otanesthesia.anesthesiaEndDate || this.currentDate;
      this.anesthesiaEndTime = Otanesthesia.anesthesiaEndTime || 0;
      this.recoveryStartDate = Otanesthesia.recoveryStartDate || '';
      this.recoveryStartTime = Otanesthesia.recoveryStartTime || '';
      this.recoveryEndDate = Otanesthesia.recoveryEndDate || this.currentDate;
      this.recoveryEndTime = Otanesthesia.recoveryEndTime;
      this.anesthesiaType = Otanesthesia.anesthesiaType || '0';
      this.anesthesiaNotes = Otanesthesia.anesthesiaNotes || 0;


    }
  }
}

export class AnesthesiaPreOpdiagnoses {
  otanesthesiaPreOpdiagnosisId: any;
  anesthesiaId: any;
  descriptionName: any;
  descriptionType: any;

  constructor(AnesthesiaPreOpdiagnoses) {
    {
      this.otanesthesiaPreOpdiagnosisId = AnesthesiaPreOpdiagnoses.otanesthesiaPreOpdiagnosisId || 0;
      this.anesthesiaId = AnesthesiaPreOpdiagnoses.anesthesiaId || 0;
      this.descriptionName = AnesthesiaPreOpdiagnoses.descriptionName || '';
      this.descriptionType = AnesthesiaPreOpdiagnoses.descriptionType || '';
    }
  }
}
