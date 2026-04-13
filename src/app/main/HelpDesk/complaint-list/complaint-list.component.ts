import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { NewComplaintComponent } from "./new-complaint/new-complaint.component";
import { ComplaintListService } from "./complaint-list.service";
import { DatePipe } from "@angular/common";



@Component({
    selector: 'app-complaint-list',
    templateUrl: './complaint-list.component.html',
    styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent {

    hasSelectedContacts: boolean;

    myformSearch: FormGroup;

    vPatientName = "%"
    Reg_No = "%"

    From_Dt = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    To_Dt = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');


    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplateactive') actionsTemplateactive!: TemplateRef<any>;
    @ViewChild('actionsTemplatebatch') actionsTemplatebatch!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        // this.gridConfig.columnsList.find(col => col.key === 'Isdeleted')!.template = this.actionsTemplateactive;

    }

    allColumns = [
        // { heading: "", key: "Isdeleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        // { heading: "", key: "isBatchRequired", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "Date", key: "complaintTime", sort: true, align: 'left', emptySign: 'NA', width: 200,type:9 },
     
        { heading: "Person Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "OPDIPD No", key: "opdipdNo", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "EmailId", key: "emailId", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        // { heading: "IGST", key: "igst", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        // { heading: "Location", key: "prodLocation", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        { heading: "Complaint", key: "complaint", sort: true, align: 'left', emptySign: 'NA', width: 380 },
        // { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },

        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]


    allFilters = [
        { fieldName: "PatientName", fieldValue:"%", opType: OperatorComparer.StartsWith },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.StartsWith },

        { fieldName: "From_Dt", fieldValue: this.From_Dt, opType: OperatorComparer.StartsWith },

        { fieldName: "To_Dt", fieldValue: this.To_Dt, opType: OperatorComparer.StartsWith },
    ]

    gridConfig: gridModel = {
        // permissionCode: permissionCodes.ItemMaster,
        apiUrl: "HelpdeskPatientComplaints/ComplaintList",
        columnsList: this.allColumns,
        sortField: "complaintId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _ComplaintListService: ComplaintListService, private accountService: AuthenticationService,
        public _matDialog: MatDialog, public datePipe: DatePipe,
        public toastr: ToastrService, public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._ComplaintListService.createSearchForm();
    }


    Clearfilter(event) {

        console.log(event)
        if (event == 'NameSearch')
            this.myformSearch.get('NameSearch').setValue("")

        if (event == 'RegNo')
            this.myformSearch.get('RegNo').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {

        this.vPatientName = this.myformSearch.get('NameSearch').value + "%"
        this.Reg_No = this.myformSearch.get('RegNo').value || "0"
      
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "HelpdeskPatientComplaints/ComplaintList",
            columnsList: this.allColumns,
            sortField: "complaintId",
            sortOrder: 0,
            filters: [
                { fieldName: "PatientName", fieldValue: this.vPatientName, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.Reg_No, opType: OperatorComparer.Equals },

                { fieldName: "From_Dt", fieldValue: this.From_Dt, opType: OperatorComparer.StartsWith },

                { fieldName: "To_Dt", fieldValue: this.To_Dt, opType: OperatorComparer.StartsWith },

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    onEdit(row) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewComplaintComponent,
            {
                maxWidth: "70vw",
                maxHeight: '80%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }

    onSave() {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewComplaintComponent,
            {
                maxWidth: "70vw",
                maxHeight: '80%',
                width: '70%'
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }


    delitem(obj) {

        this._ComplaintListService.deactivateTheStatus(obj.complaintId).subscribe((response: any) => {
            this.grid.bindGridData();
        });
    }
}