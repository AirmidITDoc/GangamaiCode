import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageNames } from '../airmid-fileupload/airmid-fileupload.component';
import { AirmidSignatureComponent } from '../airmid-signature/airmid-signature.component';

@Component({
    selector: 'airmid-signature-icon',
    templateUrl: './airmid-signature-icon.component.html',
    styleUrls: ['./airmid-signature-icon.component.scss']
})
export class AirmidSignatureIconComponent {
    @Output() onCloseDialog = new EventEmitter<any>();
    @Input() refId:number=0;
    @Input() refType:PageNames=PageNames.NONE;
    @Input() multiple:boolean=false;
    constructor(public _matDialog: MatDialog) { }
    onFiles() {
        const dialogRef = this._matDialog.open(
            AirmidSignatureComponent,
            {
                maxWidth: "50vw",
                maxHeight: "70vh",
                width: "100%",
                data: { refId: this.refId, refType: this.refType, multiple: this.multiple }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            this.onCloseDialog.emit(result);
        });
    }
}