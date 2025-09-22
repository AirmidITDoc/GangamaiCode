import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageNames } from '../airmid-fileupload/airmid-fileupload.component';
import { AirmidImageviewComponent } from '../airmid-imageview/airmid-imageview.component';

@Component({
  selector: 'app-airmid-image-icon',
  templateUrl: './airmid-image-icon.component.html',
  styleUrls: ['./airmid-image-icon.component.scss']
})
export class AirmidImageIconComponent {
 @Output() onCloseDialog = new EventEmitter<any>();
    @Input() refId:number=0;
    @Input() refType:PageNames=PageNames.NONE;
    @Input() multiple:boolean=false;
    @Input() docName: string = "default";
    constructor(public _matDialog: MatDialog) { }
    onFiles() {
        const dialogRef = this._matDialog.open(
            AirmidImageviewComponent,
            {
                maxWidth: "50vw",
                maxHeight: "70vh",
                width: "100%",
                data: { refId: this.refId, refType: this.refType, multiple: this.multiple,docName:this.docName }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            this.onCloseDialog.emit(result);
        });
    }
}
