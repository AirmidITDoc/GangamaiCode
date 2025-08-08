import { DatePipe, Time } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { ConfigService } from 'app/core/services/config.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { OpAdvanceService } from './op-advance.service';

@Component({
  selector: 'app-op-advance',
  templateUrl: './op-advance.component.html',
  styleUrls: ['./op-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OpAdvanceComponent {
  myFilterform: FormGroup;
  vOPIPId = 0;
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  m_name: any = ""
  IPDNo: any = ""
  status = "0"
  apiUrl: any;
  IsDischarge: boolean = false
  autocompleteModedeptdoc: string = "ConDoctor";

@ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  constructor(
    public _opAdvanceService: OpAdvanceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    private commonService: PrintserviceService,
    public datePipe: DatePipe,
    private _configue: ConfigService,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.myFilterform = this._opAdvanceService.filterForm();
  }

  allcolumns = [
    { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, width: 50 },
    { heading: "Bill", key: "isBillGenerated", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "IsMLC", key: "isMLC", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 70 },
    { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
    { heading: "OPD No", key: "ipdno", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Ref Doc Name", key: "refDocName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', type: 10, width: 350 },
    { heading: "Adv Amount", key: "AdvanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Charges Amount", key: "ChargesAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    {
        heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template, width: 200,
        // template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  gridConfig: gridModel = {
    apiUrl: "",
    columnsList: this.allcolumns,
    sortField: "",
    sortOrder: 1,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: "", opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: "", opType: OperatorComparer.Equals },
      { fieldName: "Admtd_Dschrgd_All", fieldValue: this.status, opType: OperatorComparer.Equals },
      { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals },
    ],
    row: 25
  }

  onChangeFirst(event) {
    this.getfilterdata();
  }

  getfilterdata() {
    // debugger
    // this.gridConfig = {
    //   apiUrl: this.apiUrl,
    //   columnsList: this.allcolumns,
    //   sortField: "AdmissionId",
    //   sortOrder: 0,
    //   filters: [
    //     { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
    //     { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
    //     { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
    //     { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
    //     { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    //     { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    //     { fieldName: "Admtd_Dschrgd_All", fieldValue: this.status, opType: OperatorComparer.Equals },
    //     { fieldName: "M_Name", fieldValue: this.m_name, opType: OperatorComparer.Equals },
    //     { fieldName: "IPNo", fieldValue: this.OPDNo, opType: OperatorComparer.Equals }

    //   ],
    //   row: 25
    // }
    // this.grid.gridConfig = this.gridConfig;
    // this.grid.bindGridData();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterform.get('LastName').setValue("")
      else
        if (event == 'MiddleName')
          this.myFilterform.get('MiddleName').setValue("")
    if (event == 'RegNo')
      this.myFilterform.get('RegNo').setValue("")
    if (event == 'OPDNo')
      this.myFilterform.get('OPDNo').setValue("")

    this.onChangeFirst(event);
  }

   getSelectedRow(row: any): void {
        console.log("Selected row : ", row);
    }
}
