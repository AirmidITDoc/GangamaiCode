import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";

import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { NewReservationComponent } from "./new-reservation/new-reservation.component";
import { OtReservationService } from "./ot-reservation.service";
import { DatePipe } from "@angular/common";
import { PrintserviceService } from "app/main/shared/services/printservice.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";

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
tOtbookingRequestsForm:FormGroup;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    FirstName: any = ""
    regNo: any = "0"
    LastName: any = ""

votbookingId: any = ""
registerobj: any;
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
        { heading: "Date", key: "opdate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100 },
        { heading: "OPDate&Time", key: "reservationTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
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


        {
            heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
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
        public _OtReservationService: OtReservationService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        private commonService: PrintserviceService,
         private _FormvalidationserviceService: FormvalidationserviceService,
                private _formBuilder: FormBuilder,
        public datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        
    }
   

    onChangeStartDate(value) {
        this.gridConfig.filters[1].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[2].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onNewotrequest(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        let that = this;
        const dialogRef = this._matDialog.open(NewReservationComponent,
            {
                //   maxWidth: "90vw",
                //   maxHeight: '90vh',
                //   height:'90%',
                //   width: '90%',
                maxWidth: "90vw",
                height: '90%',
                width: '90%',

            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }


    OnEditRegistration(row) {
        this._OtReservationService.populateForm(row);
        const dialogRef = this._matDialog.open(
            NewReservationComponent,
            {
                //    maxWidth: "95vw",
                //    maxHeight: '90%',
                //    width: '94%',
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.grid.bindGridData();
        });
    }
   OnPrint(Param) {
       const param = {
         searchFields: [
            {
             fieldName: "OTReservationId",
             fieldValue: String(Param.OTReservationId),
             opType: "Equals"
           },
           {
             fieldName: "OPIPType",
             fieldValue: String(Param.opIpType),
             opType: "Equals"
           }
         ],
         mode: "OTReservationReport"
       };
   
       console.log(param);
   
       this._OtReservationService.getReportView(param).subscribe(res => {
         const matDialog = this._matDialog.open(PdfviewerComponent, {
           maxWidth: "85vw",
           height: '750px',
           width: '100%',
           data: {
             base64: res["base64"] as string,
             title: "Pathology Test Report With Header Viewer"
           }
         });
   
         matDialog.afterClosed().subscribe(result => {
   
         });
       });
     }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.FirstName = this.myFilterform.get('FirstName').value + "%"
        this.LastName = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.getfilterdata();
    }
    getfilterdata() {
        debugger
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
                { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },

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

    selectChange(obj: any) {
        console.log(obj);
    }
}
