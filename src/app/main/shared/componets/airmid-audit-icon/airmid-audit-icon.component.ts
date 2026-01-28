import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';
import { PagePermissionService } from '../../services/page-permission.service';
import { AirmidAuditComponent } from '../airmid-audit/airmid-audit.component';

@Component({
    selector: 'airmid-audit-icon',
    templateUrl: './airmid-audit-icon.component.html',
    styleUrls: ['./airmid-audit-icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AirmidAuditIconComponent implements OnInit, OnDestroy {
    @Input() EntityId: string = "";
    @Input() EntityName: string = "";
    @Input() ApiUrl: string = "Audit/List";
    constructor(
        public _RequestforlabtestService: RequestforlabtestService,
        public _matDialog: MatDialog,
        public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
    }


    ngOnDestroy() {
    }
    OpenAudit() {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        let row = { "EntityName": this.EntityName ?? '', "EntityId": this.EntityId ?? '', "ApiUrl": this.ApiUrl };
        const dialogRef = this._matDialog.open(AirmidAuditComponent,
            {
                maxWidth: "100vw",
                maxHeight: '95vh',
                width: '50%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //that.grid.bindGridData();
            }
        });
    }

}
