import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { OtRequestService } from "./ot-request.service";
import { NewRequestComponent } from "./new-request/new-request.component";
import { DatePipe } from "@angular/common";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-ot-request',
  templateUrl: './ot-request.component.html',
  styleUrls: ['./ot-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTRequestComponent implements OnInit {
 myFilterform: FormGroup
   msg: any;
      RequestName: any = "";
      
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    mobileno: any = "%"
  
  //   VBillcount = 0;
  // VOPtoIPcount = 0;
  // vIsDischarg = 0;
  // VAdmissioncount = 0;
  //  VNewcount = 0;
      @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  
       allcolumns = [
        { heading: "Status", key: "otbookingId", sort: true, align: 'left', emptySign: 'NA', type: 6, width:130 },
        { heading: "Date&Time", key: "regTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
        { heading: "UHID NO", key: "opIpId", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Surgeon Name", key: "surgeonId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
        { heading: "Category Name", key: "categoryId", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Site Description", key: "siteDescId", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Surgery Name", key: "surgeryId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Department Name", key: "departmentId", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        {
            heading: "AddedBy", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
           // template: this.actionButtonTemplate  // Assign ng-template to the column
        }

        // {
        //     heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.action, actions: [
        //         {action: gridActions.edit, callback: (data: any) => {
        //                 this.onEdit(data);
        //                 this.grid.bindGridData();
        //             }},]
        // }
    ];
  
      allFilters = [
          { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
          //  { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains }
      ]
      gridConfig: gridModel = {
          apiUrl: "OT/OTBookinglist",
          columnsList: this.allcolumns,
          sortField: "OTBookingID",
          sortOrder: 0,
          filters: this.allFilters
      }
      autocompleteMode: string = "CityMaster";
  
      constructor(
          public _OtRequestService: OtRequestService,
          public toastr: ToastrService, public _matDialog: MatDialog,
          public datePipe: DatePipe
      ) { }
  
      ngOnInit(): void { }
  
    //   onChangeStartDate(value) {
    //     this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    // }
    // onChangeEndDate(value) {
    //     this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    // }
  onNewotrequest(row: any = null) {
          const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
          buttonElement.blur(); // Remove focus from the button
          let that = this;
          const dialogRef = this._matDialog.open(NewRequestComponent,
              {
                  maxWidth: "90vw",
                  maxHeight: '90%',
                  width: '90%',
  
              });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  this.grid.bindGridData();
              }
          });
      }
  
     
       onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        //this.mobileno = this.myFilterform.get('MobileNo').value || "%"
        this.getfilterdata();
    }
     getfilterdata() {
        this.gridConfig = {
            apiUrl: "OT/OTBookinglist",
            columnsList: this.allcolumns,
            sortField: "OTBookingID",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                //{ fieldName: "MobileNo", fieldValue: this.mobileno, opType: OperatorComparer.Contains }
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
        // if (event == 'MobileNo')
        //     this.myFilterform.get('MobileNo').setValue("")

        this.onChangeFirst();
    }
      selectChange(obj: any) {
          console.log(obj);
      }
}
