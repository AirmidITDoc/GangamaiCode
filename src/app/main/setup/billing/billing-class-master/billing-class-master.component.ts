import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BillingClassMasterService } from "./billing-class-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { MatDialog } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewClassComponent } from "./new-class/new-class.component";

@Component({
    selector: "app-billing-class-master",
    templateUrl: "./billing-class-master.component.html",
    styleUrls: ["./billing-class-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BillingClassMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
 className: any = "";
   
        allcolumns = [
            { heading: "Code", key: "classId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Billing Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._BillingClassMasterService.deactivateTheStatus(data.classId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       
        allfilters = [
            { fieldName: "className", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "ClassMaster/List",
        columnsList: this.allcolumns,
        sortField: "classId",
        sortOrder: 0,
        filters: this.allfilters
    }


    constructor(
        public _BillingClassMasterService: BillingClassMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-27/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'ClassNameSearch')
            this._BillingClassMasterService.myformSearch.get('ClassNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.className = this._BillingClassMasterService.myformSearch.get('ClassNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._BillingClassMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "ClassMaster/List",
            columnsList: this.allcolumns,
            sortField: "classId",
            sortOrder: 0,
            filters: [
                { fieldName: "className", fieldValue: this.className, opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
            ]
        }
        // this.grid.gridConfig = this.gridConfig;
        // this.grid.bindGridData();
        console.log("GridConfig:", this.gridConfig);

    if (this.grid) {
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    } else {
        console.error("Grid is undefined!");
    }
    }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewClassComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
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