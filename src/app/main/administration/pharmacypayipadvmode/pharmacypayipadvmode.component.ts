import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PharmacypayipadvmodeService } from './pharmacypayipadvmode.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-pharmacypayipadvmode',
    templateUrl: './pharmacypayipadvmode.component.html',
    styleUrls: ['./pharmacypayipadvmode.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PharmacypayipadvmodeComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "BankMaster/List",
        columnsList: [
            { heading: "Code", key: "bankId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TallyInterfaceName", key: "bankName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._PharmacypayipadvmodeService.deactivateTheStatus(data.bankId).subscribe((response: any) => {
                                this.toastr.success(response.Message);
                                this.grid.bindGridData;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "bankId",
        sortOrder: 0,
        filters: [
            { fieldName: "BankName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _PharmacypayipadvmodeService: PharmacypayipadvmodeService,
         public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }

    onSearchClear() {
        this._PharmacypayipadvmodeService.myformSearch.reset({
            BankNameSearch: "",
            IsDeletedSearch: "2",
        });

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        // const dialogRef = this._matDialog.open(NewTallyComponent,
        //     {
        //         maxWidth: "45vw",
        //         height: '35%',
        //         width: '70%',
        //         data: row
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         that.grid.bindGridData();
        //     }
        //     console.log('The dialog was closed - Action', result);
        // });
    }

}