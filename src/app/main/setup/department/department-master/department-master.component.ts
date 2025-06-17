import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { DepartmentMasterService } from "./department-master.service";
import { NewDepartmentComponent } from "./new-department/new-department.component";

@Component({
    selector: "app-department-master",
    templateUrl: "./department-master.component.html",
    styleUrls: ["./department-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DepartmentMasterComponent implements OnInit {
     @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    msg: any;
    departmentName: any = "";

        allcolumns =[
            { heading: "Code", key: "departmentId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._departmentService.deactivateTheStatus(data.departmentId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters = [
            { fieldName: "departmentName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    gridConfig: gridModel = {
        apiUrl: "DepartmentMaster/List",
        columnsList: this.allcolumns,
        sortField: "departmentId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _departmentService: DepartmentMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-27/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'DepartmentNameSearch')
    //         this._departmentService.myformSearch.get('DepartmentNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.departmentName = this._departmentService.myformSearch.get('DepartmentNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._departmentService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "DepartmentMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "departmentId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "departmentName", fieldValue: this.departmentName, opType: OperatorComparer.Contains },
    //             { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     // this.grid.gridConfig = this.gridConfig;
    //     // this.grid.bindGridData();
    //     console.log("GridConfig:", this.gridConfig);

    // if (this.grid) {
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // } else {
    //     console.error("Grid is undefined!");
    // }
    // }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewDepartmentComponent,
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