import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { CampMasterService } from "./camp-master.service";
import { NewCampMasterComponent } from "./new-camp-master/new-camp-master.component";



@Component({
  selector: 'app-camp-master',
  templateUrl: './camp-master.component.html',
  styleUrls: ['./camp-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CampMasterComponent implements OnInit {
    msg: any;
    CampName: any = "";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [
        { heading: "Code", key: "campId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Camp Name", key: "campName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Location Name", key: "campLocation", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._CampMasterService.deactivateTheStatus(data.campId).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allFilters = [
        { fieldName: "CampName", fieldValue: this.CampName, opType: OperatorComparer.Contains },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        apiUrl: "CampMaster/List",
        columnsList: this.allColumns,
        sortField: "CampName",
        sortOrder: 0,
        filters: this.allFilters
    }
       // autocompleteModelocation: string = "CampMaster";
     constructor(
            public _CampMasterService: CampMasterService,
            public toastr: ToastrService, public _matDialog: MatDialog
        ) { }
    
        ngOnInit(): void { }

         onSave(row: any = null) {
                const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
                buttonElement.blur(); // Remove focus from the button
        
        
                let that = this;
                const dialogRef = this._matDialog.open(NewCampMasterComponent,
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
        
            selectChange(obj: any) {
                console.log(obj);
            }
}
