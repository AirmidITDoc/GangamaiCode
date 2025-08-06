import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AirmidFileuploadComponent, PageNames } from '../airmid-fileupload/airmid-fileupload.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'airmid-fileupload-icon',
    templateUrl: './airmid-fileupload-icon.component.html',
    styleUrls: ['./airmid-fileupload-icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AirmidFileuploadIconComponent {
    @Output() onCloseDialog = new EventEmitter<any>();
    @Input() refId:number=0;
    @Input() refType:PageNames=PageNames.NONE;
    @Input() multiple:boolean=false;
    @Input() title: string = '';
    @Input() patientName: string = '';
    constructor(public _matDialog: MatDialog) { }

    get computedTitle(): string {
        return this.patientName ? `${this.patientName} ${this.title}` : this.title;
    }

    onFiles() {
        const dialogRef = this._matDialog.open(
            AirmidFileuploadComponent,
            {
                maxWidth: "50vw",
                maxHeight: "60vh",
                width: "100%",
                data: { refId: this.refId, refType: this.refType, multiple: this.multiple,title: this.computedTitle }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            this.onCloseDialog.emit(result);
        });
    }

}