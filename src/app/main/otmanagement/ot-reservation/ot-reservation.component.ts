import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";

import { FormGroup } from "@angular/forms";
import { NewReservationComponent } from "./new-reservation/new-reservation.component";
import { OtReservationService } from "./ot-reservation.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-ot-reservation',
  templateUrl: './ot-reservation.component.html',
  styleUrls: ['./ot-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTReservationComponent implements OnInit {
 myFilterform: FormGroup
   msg: any;
      RequestName: any = "";
      
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    
  
  //   VBillcount = 0;
  // VOPtoIPcount = 0;
  // vIsDischarg = 0;
  // VAdmissioncount = 0;
  //  VNewcount = 0;
      @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'opIpId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'surgeryTypeId')!.template = this.actionsTemplate1;
       //  this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
     @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
        @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
      
       allcolumns = [
        { heading: "Status", key: "regDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width:100 },
        { heading: "OPDate&Time", key: "reservationTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
        { heading: "UHID NO", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Surgeon Name1", key: "surgeonId", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Surgeon Name2", key: "surgeonId1", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "AnathesDrName1", key: "anestheticsDr", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "AnathesDrName2", key: "anestheticsDr1", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Surgery name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "OTTableName", key: "ottableId", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "AnesthType", key: "AnesthType", sort: true, align: 'left', emptySign: 'NA', width: 130},
        { heading: "Instruction", key: "Instruction", sort: true, align: 'left', emptySign: 'NA', width: 130 },


        {
            heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
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
        //   { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //     { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //     { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
      ]
      gridConfig: gridModel = {
          apiUrl: "OTReservation/OTBookinglist",
          columnsList: this.allcolumns,
          sortField: "OtreservationId",
          sortOrder: 0,
          filters: this.allFilters
      }
     
  
      constructor(
          public _OtReservationService: OtReservationService,
          public toastr: ToastrService, public _matDialog: MatDialog,
          public datePipe: DatePipe
      ) { }
  
      ngOnInit(): void { }
  
      onChangeStartDate(value) {
        this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
  onNewotrequest(row: any = null) {
          const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
          buttonElement.blur(); // Remove focus from the button
          let that = this;
          const dialogRef = this._matDialog.open(NewReservationComponent,
              {
                  maxWidth: "90vw",
                  maxHeight: '90vh',
                  height:'90%',
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
        // this.f_name = this.myFilterform.get('FirstName').value + "%"
        // this.l_name = this.myFilterform.get('LastName').value + "%"
        // this.regNo = this.myFilterform.get('RegNo').value || "0"
        //this.mobileno = this.myFilterform.get('MobileNo').value || "%"
        this.getfilterdata();
    }
     getfilterdata() {
        this.gridConfig = {
            apiUrl: "OTReservation/OTBookinglist",
            columnsList: this.allcolumns,
            sortField: "OtreservationId",
            sortOrder: 0,
            filters: [
                // { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                // { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                // { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
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
