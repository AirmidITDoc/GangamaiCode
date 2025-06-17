import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewReligionMasterComponent } from "./new-religion-master/new-religion-master.component";
import { ReligionMasterService } from "./religion-master.service";

@Component({
    selector: "app-religion-master",
    templateUrl: "./religion-master.component.html",
    styleUrls: ["./religion-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReligionMasterComponent implements OnInit {
   @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
 msg: any;
 religionName: any = "";

    allcolumns = [
            { heading: "Code", key: "religionId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Religion Name", key: "religionName", sort: true, align: 'left', emptySign: 'NA' },
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
                            this._religionService.deactivateTheStatus(data.religionId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters =  [
            { fieldName: "religionName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "ReligionMaster/List",
        columnsList: this.allcolumns,
        sortField: "religionId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(public _religionService: ReligionMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'ReligionNameSearch')
    //         this._religionService.myformSearch.get('AreaNaReligionNameSearchmeSearch').setValue("")

    //   //  this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.religionName = this._religionService.myformSearch.get('ReligionNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._religionService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "ReligionMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "religionId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "religionName", fieldValue: this.religionName, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewReligionMasterComponent,
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


