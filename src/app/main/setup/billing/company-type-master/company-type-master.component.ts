import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { CompanyTypeMasterService } from "./company-type-master.service";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewCompanyTypeComponent } from "./new-company-type/new-company-type.component";



@Component({
    selector: "app-company-type-master",
    templateUrl: "./company-type-master.component.html",
    styleUrls: ["./company-type-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyTypeMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;


    gridConfig: gridModel = {
        apiUrl: "CompanyTypeMaster/List",
        columnsList: [
            { heading: "Code", key: "companyTypeId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Company Name", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 700 },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CompanyMasterService.deactivateTheStatus(data.companyTypeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "companyTypeId",
        sortOrder: 0,
        filters: [
            { fieldName: "typeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _CompanyMasterService: CompanyTypeMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewCompanyTypeComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}