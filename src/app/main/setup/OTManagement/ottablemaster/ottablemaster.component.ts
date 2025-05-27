import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { NewOTTablemasterComponent } from './new-ottablemaster/new-ottablemaster.component';
import { OttablemasterService } from './ottablemaster.service';


@Component({
  selector: 'app-ottablemaster',
  templateUrl: './ottablemaster.component.html',
  styleUrls: ['./ottablemaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class OTTablemasterComponent implements OnInit{
msg: any;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "OtTableMaster/List",
        columnsList: [
            { heading: "Code", key: "ottableId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "OT Room Name", key: "ottableName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Location Name", key: "locationId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddedBy", key: "isAddedBy", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                    
                            this._OttablemasterService.deactivateTheStatus(data.ottableId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "OttableId",
        sortOrder: 0,
        filters: [
            // { fieldName: "TableName", fieldValue: "", opType: OperatorComparer.Contains },
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    constructor(
        public _OttablemasterService: OttablemasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewOTTablemasterComponent,
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
