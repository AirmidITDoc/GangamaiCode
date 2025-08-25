import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OtRequestService } from '../../ot-request/ot-request.service';
import { DatePipe } from '@angular/common';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { OtReservationService } from '../ot-reservation.service';

@Component({
  selector: 'app-otrequestlist',
  templateUrl: './otrequestlist.component.html',
  styleUrls: ['./otrequestlist.component.scss'],
  providers: [DatePipe]
})
export class OtrequestlistComponent implements OnInit {

  otRequestList: any[] = [];
  myFilterForm: FormGroup;
  isLoading: boolean = false;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
   @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    FromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    FirstName: any = ""
    regNo: any = "0"
    LastName: any = ""
 

  constructor(
    public _otreservationService: OtReservationService,
    public _fb: FormBuilder,
    public _dialogRef: MatDialogRef<OtrequestlistComponent>,
     public datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.getfilterdata()
  }

    allcolumns = [
    { heading: "", key: "opIpType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
    { heading: "", key: "surgeryTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },

    { heading: "Date&Time", key: "otbookingTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Category Name", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Surgery Name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Surgeon Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Site Description", key: "siteDescriptionName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 150 },

  ];
 allFilters = [
    { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "FromDate", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
  ]
  gridConfig: gridModel = {
    apiUrl: "OTBooking/OtbookingRequestList",
    columnsList: this.allcolumns,
    sortField: "DoctorId",
    sortOrder: 0,
    filters: this.allFilters
  }
    getfilterdata() {
    this.gridConfig = {
      apiUrl: "OTBooking/OtbookingRequestList",
      columnsList: this.allcolumns,
      sortField: "DoctorId",
      sortOrder: 0,
      filters: [
        { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: this.LastName, opType: OperatorComparer.StartsWith },
        { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },

        { fieldName: "FromDate", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },

      ],
      row: 25
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }
  onSelectRequest(row: any): void {
    this._dialogRef.close(row); // send selected row to parent (OtReservationComponent)
  }
    onChangeFirst() {
        this.FromDate = this.datePipe.transform(this._otreservationService.myformSearch.get('fromDate').value, "yyyy-MM-dd")
        this.ToDate = this.datePipe.transform(this._otreservationService.myformSearch.get('enddate').value, "yyyy-MM-dd")
        this.getfilterdata();
    }

  onClose(): void {
    this._dialogRef.close(); // allow close without selection
  }

  GetRecord(row){
    this._dialogRef.close(row);
  }
}

