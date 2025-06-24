import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { NewSurgeryMasterComponent } from './new-surgery-master/new-surgery-master.component';
import { SurgeryMasterService } from './surgery-master.service';

@Component({
  selector: 'app-surgery-master',
  templateUrl: './surgery-master.component.html',
  styleUrls: ['./surgery-master.component.scss'],
   encapsulation: ViewEncapsulation.None,
          animations: fuseAnimations,
})
export class SurgeryMasterComponent implements OnInit {
msg: any;
 surgeryName: any = "";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
         allColumns =  [
            { heading: "Code", key: "surgeryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "SurgeryName", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DepartmentName", key: "departmentId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "SurgeryCategoryName", key: "surgeryCategoryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "SiteDescriptionName", key: "siteDescId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Amount", key: "surgeryAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._SurgeryMasterService.deactivateTheStatus(data.surgeryId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
       allFilters =[
            { fieldName: "surgeryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
        apiUrl: "SurgeryMaster/List",
        columnsList: this.allColumns,
        sortField: "SurgeryId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _SurgeryMasterService: SurgeryMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewSurgeryMasterComponent,
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
