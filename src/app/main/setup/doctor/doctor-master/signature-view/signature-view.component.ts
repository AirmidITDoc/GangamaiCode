import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { fuseAnimations } from '@fuse/animations';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageCropComponent } from 'app/main/shared/componets/image-crop/image-crop.component';
import { ImageViewComponent } from 'app/main/opd/appointment-list/image-view/image-view.component';
import SignaturePad from 'signature_pad';
// import { WebcamImage, WebcamInitError } from 'ngx-webcam';
// import {
//     NgxSignaturePadComponent,
//     SignaturePadOptions
// } from "@o.krucheniuk/ngx-signature-pad";
@Component({
    selector: 'app-signature-view',
    templateUrl: './signature-view.component.html',
    styleUrls: ['./signature-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SignatureViewComponent implements OnInit {
    sanitizeImagePreview = "";
    @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
    private signaturePad!: SignaturePad;
    private canvas!: HTMLCanvasElement;

    ngAfterViewInit(): void {
        this.canvas = this.signaturePadElement.nativeElement;
        this.setupSignaturePad();
    }

    private setupSignaturePad(): void {
        // Set canvas size
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // Initialize signature pad
        this.signaturePad = new SignaturePad(this.canvas, {
            backgroundColor: 'rgb(255, 255, 255)',
            penColor: 'rgb(0, 0, 0)'
        });

        // Handle window resize
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    private resizeCanvas(): void {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        this.canvas.width = this.canvas.offsetWidth * ratio;
        this.canvas.height = this.canvas.offsetHeight * ratio;
        this.canvas.getContext('2d')?.scale(ratio, ratio);

        // This library does not listen for canvas changes, so after the canvas is automatically
        // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
        // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
        // that the state of this library is consistent with visual state of the canvas, you
        // have to clear it manually.
        this.signaturePad.clear();
    }

    clear(): void {
        this.signaturePad.clear();
    }

    constructor(
        public dialogRef: MatDialogRef<ImageViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialog: MatDialog,
        // public safe: SafePipesPipe

    ) {
    }
    // onImageChange(event) {
    //     let Imgflag = "";
    //     if (!event.target.files.length) return;
    //     const file = event.target.files[0];
    //     this.matDialog.open(ImageCropComponent, { data: { file } }).afterClosed().subscribe(
    //         (event: ImageCroppedEvent) => (this.sanitizeImagePreview = event.base64,
    //             Imgflag = event.base64
    //         )
    //     );
    // }

    onImageChange(event: any) {
        debugger
        if (!event.target.files.length) return;
        const file = event.target.files[0];

        const dialogRef = this.matDialog.open(ImageCropComponent, {
            width: '600px',
            data: { file }
        });

        dialogRef.afterClosed().subscribe((croppedBase64) => {
            debugger
            console.log("Dialog closed. Received:", croppedBase64);
            if (croppedBase64) {
                this.sanitizeImagePreview = croppedBase64;
            } else {
                console.warn("Dialog returned empty or null.");
            }
        });
    }


    @ViewChild("testPad", { static: true })
    //signaturePadElement: any;// NgxSignaturePadComponent;

    // config: SignaturePadOptions = {
    //     minWidth: 1,
    //     maxWidth: 10,
    //     penColor: "blue"
    // };
    config: any;

    // public clear() {
    //     this.signaturePadElement.clear();
    // }
    ngOnInit(): void {
    }
    onClose() {
        this.dialogRef.close();
    }
    OnSubmit() {
        debugger
        if (this.sanitizeImagePreview) {
            this.dialogRef.close(this.sanitizeImagePreview)
        }
        else {
            if (this.signaturePad.isEmpty()) {
                alert('Please provide a signature first.');
                return;
            }
            this.dialogRef.close(this.signaturePad.toDataURL());
        }
    }
}
