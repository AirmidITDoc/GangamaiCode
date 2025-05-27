import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { NewSiteDescriptionMasterComponent } from './new-site-description-master/new-site-description-master.component';
import { SiteDescriptionService } from './site-description.service';

@Component({
  selector: 'app-site-description',
  templateUrl: './site-description.component.html',
  styleUrls: ['./site-description.component.scss'],
   encapsulation: ViewEncapsulation.None,
              animations: fuseAnimations,
})
export class SiteDescriptionComponent implements OnInit {
msg: any;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "VillageMaster/List",
        columnsList: [
            { heading: "Code", key: "villageId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "OT SiteDesc Name", key: "villageName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Surgery Category", key: "talukaName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddedBy", key: "addedByName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._SiteDescriptionService.deactivateTheStatus(data.villageId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "search facility",
        sortOrder: 0,
        filters: [
            { fieldName: "OTtypeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    constructor(
        public _SiteDescriptionService: SiteDescriptionService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewSiteDescriptionMasterComponent,
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
