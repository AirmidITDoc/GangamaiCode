import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CompanyMasterService } from "./company-master.service";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { CompanyMasterListComponent } from "./company-master-list/company-master-list.component";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";

@Component({
    selector: "app-company-master",
    templateUrl: "./company-master.component.html",
    styleUrls: ["./company-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;


    gridConfig: gridModel = {
        apiUrl: "CompanyMaster/List",
        columnsList: [
            { heading: "Code", key: "companyId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CompTypeId", key: "compTypeId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "pinNo", key: "pinNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "PhoneNo", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CompanyMasterService.deactivateTheStatus(data.companyId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "companyId",
        sortOrder: 0,
        filters: [
            { fieldName: "companyName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(CompanyMasterListComponent,
            {
                maxWidth: "60vw",
                height: '55%',
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
