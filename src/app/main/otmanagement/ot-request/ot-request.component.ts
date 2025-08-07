import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { PrintserviceService } from "app/main/shared/services/printservice.service";

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
      
    FromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    FirstName: any = ""
    RegNo: any = "0"
    LastName: any = ""
  //  mobileno: any = "%"
  
  //   VBillcount = 0;
  // VOPtoIPcount = 0;
  // vIsDischarg = 0;
  // VAdmissioncount = 0;
  //  VNewcount = 0;
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

        { heading: "Date&Time", key: "otbookingTime", sort: true, align: 'left', emptySign: 'NA', type: 8,width: 200 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Surgeon Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Category Name", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 200},
        { heading: "Site Description", key: "siteDescriptionName", sort: true, align: 'left', emptySign: 'NA',width: 200 },
        { heading: "Surgery Name", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 150 },

       {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }

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
      autocompleteMode: string = "Department";
  
      constructor(
          public _OtRequestService: OtRequestService,
          public toastr: ToastrService, public _matDialog: MatDialog,
          public datePipe: DatePipe,
           private commonService: PrintserviceService,
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
  
      OnEditRegistration(row) {
             this._OtRequestService.populateForm(row);
             const dialogRef = this._matDialog.open(
                 NewRequestComponent,
                 {
                     maxWidth: "95vw",
                     maxHeight: '90%',
                     width: '94%',
                     data: row
                 }
             );
             dialogRef.afterClosed().subscribe((result) => {
                 console.log("The dialog was closed - Insert Action", result);
                 this.grid.bindGridData();
             });
         }
         OnPrint(Param) {
        this.commonService.Onprint("otbookingId", Param.otbookingId, "RequestName");
    } 
 OnCancel(Param) {
        this.commonService.Onprint("otbookingId", Param.otbookingId, "RequestName");
    } 

       onChangeFirst() {
        this.FromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.ToDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.FirstName = this.myFilterform.get('FirstName').value + "%"
        this.LastName = this.myFilterform.get('LastName').value + "%"
        this.RegNo = this.myFilterform.get('RegNo').value || "0"
        //this.mobileno = this.myFilterform.get('MobileNo').value || "%"
        this.getfilterdata();
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
                { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.StartsWith },
                { fieldName: "LastName", fieldValue: this.LastName , opType: OperatorComparer.StartsWith },
               { fieldName: "RegNo", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
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
