import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { fuseAnimations } from '@fuse/animations';
import { ImageViewComponent } from 'app/main/opd/appointment/image-view/image-view.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageCropComponent } from 'app/main/shared/componets/image-crop/image-crop.component';
// import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import {
    NgxSignaturePadComponent,
    SignaturePadOptions
} from "@o.krucheniuk/ngx-signature-pad";
@Component({
    selector: 'app-signature-view',
    templateUrl: './signature-view.component.html',
    styleUrls: ['./signature-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SignatureViewComponent implements OnInit {
    sanitizeImagePreview = "";
    constructor(
        public dialogRef: MatDialogRef<ImageViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialog: MatDialog,
        // public safe: SafePipesPipe

    ) {
    }
    onImageChange(event) {
        let Imgflag = "";
        if (!event.target.files.length) return;
        const file = event.target.files[0];
        this.matDialog.open(ImageCropComponent, { data: { file } }).afterClosed().subscribe(
            (event: ImageCroppedEvent) => (this.sanitizeImagePreview = event.base64,
                Imgflag = event.base64
            )
        );
    }
    @ViewChild("testPad", { static: true })
    signaturePadElement: NgxSignaturePadComponent;

    config: SignaturePadOptions = {
        minWidth: 1,
        maxWidth: 10,
        penColor: "blue"
    };

    public clear() {
        this.signaturePadElement.clear();
    }
    ngOnInit(): void {
    }
    onClose() {
        this.dialogRef.close();
    }
    OnSubmit(){
        debugger
        if(this.sanitizeImagePreview){
            this.dialogRef.close(this.sanitizeImagePreview)
        }
        else{
            this.dialogRef.close(this.signaturePadElement.toDataURL());
        }
    }
}
