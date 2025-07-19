import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AirmidFileuploadComponent, PageNames } from '../airmid-fileupload/airmid-fileupload.component';

@Component({
    selector: 'airmid-fileupload-icon',
    templateUrl: './airmid-fileupload-icon.component.html',
    styleUrls: ['./airmid-fileupload-icon.component.scss']
})
export class AirmidFileuploadIconComponent {
    @Output() onCloseDialog = new EventEmitter<any>();
    @Input() refId:number=0;
    @Input() refType:PageNames=PageNames.NONE;
    @Input() multiple:boolean=false;
    constructor(public _matDialog: MatDialog) { }
    onFiles() {
        const dialogRef = this._matDialog.open(
            AirmidFileuploadComponent,
            {
                maxWidth: "95vw",
                maxHeight: "94vh",
                width: "100%",
                data: { refId: this.refId, refType: this.refType, multiple: this.multiple }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            this.onCloseDialog.emit(result);
        });
    }

}