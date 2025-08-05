import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OtRequestService } from '../../ot-request/ot-request.service';
import { DatePipe } from '@angular/common';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

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


  constructor(
    private _otRequestService: OtRequestService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<OtrequestlistComponent>,
     public datePipe: DatePipe,
  ) {}

  ngOnInit() {
    const today = new Date();
    this.myFilterForm = this._fb.group({
      fromDate: [today],
      toDate: [today]
    });

    this.getOTRequests(); // Initial load
  }

  getOTRequests() {
    const { fromDate, toDate } = this.myFilterForm.value;
    const formattedFromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    const formattedToDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');

    this.isLoading = true;
    this._otRequestService.getOtRequestList(formattedFromDate, formattedToDate).subscribe(
      (res: any) => {
        this.otRequestList = res || [];
        this.isLoading = false;
      },
      error => {
        console.error('Failed to load OT requests', error);
        this.isLoading = false;
      }
    );
  }
   allcolumns = [
          { heading: "Status", key: "otbookingId", sort: true, align: 'left', emptySign: 'NA', type: 6, width:100 },
          { heading: "Date&Time", key: "otbookingTime", sort: true, align: 'left', emptySign: 'NA', type: 8 },
          { heading: "UHID NO", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
          { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
          { heading: "Surgeon Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 50 },
          { heading: "Category Name", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA', },
          { heading: "Site Description", key: "siteDescriptionName", sort: true, align: 'left', emptySign: 'NA', },
          { heading: "Surgery Name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 50 },
                  { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 50 },
  
          // {
          //     heading: "AddedBy", key: "action", align: "right", width: 50, sticky: true, type: gridColumnTypes.template,
          //    template: this.actionButtonTemplate  // Assign ng-template to the column
          // },
  
          // {
          //     heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.action, actions: [
          //         {action: gridActions.edit, callback: (data: any) => {
          //                 this.OnEditRegistration(data);
                       
          //                 this.grid.bindGridData();
          //             }}
          //         ,
          //     {action: gridActions.print, callback: (data: any) => {
          //                 this.OnPrint(data);
                       
                         
          //             }}]
          // }
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
                  { fieldName: "FromDate", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
                  { fieldName: "ToDate", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
                  { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
                  { fieldName: "LastName", fieldValue: "%" , opType: OperatorComparer.StartsWith },
                 { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },
              ],
              row: 25
          }
          this.grid.gridConfig = this.gridConfig;
          this.grid.bindGridData();
      }
  onSelectRequest(row: any): void {
    this._dialogRef.close(row); // send selected row to parent (OtReservationComponent)
  }

  onClose(): void {
    this._dialogRef.close(); // allow close without selection
  }
}
