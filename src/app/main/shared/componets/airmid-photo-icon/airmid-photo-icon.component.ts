import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageNames } from '../airmid-fileupload/airmid-fileupload.component';
import { AirmidPhotoComponent } from '../airmid-photo/airmid-photo.component';


@Component({
  selector: 'app-airmid-photo-icon',
  templateUrl: './airmid-photo-icon.component.html',
  styleUrls: ['./airmid-photo-icon.component.scss']
})
export class AirmidPhotoIconComponent {
  @Output() onCloseDialog = new EventEmitter<any>();
  @Input() refId: number = 0;
  @Input() refType: PageNames = PageNames.NONE;
  @Input() multiple: boolean = false;
  @Input() docName: string = "default";
  @Input() imagePreview: string = ''; 
   defaultImage = '/assets/images/default.jpg';

  constructor(private _matDialog: MatDialog) {}

  onFiles() {
    const dialogRef = this._matDialog.open(AirmidPhotoComponent, {
      maxWidth: "40vw",
      maxHeight: "75vh",
      width: "90%",
      data: {
        refId: this.refId,
        refType: this.refType,
        multiple: this.multiple,
        docName: this.docName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onCloseDialog.emit(result);
    });
  }
}
