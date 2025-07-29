import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import SignaturePad from 'signature_pad';
import { ImageViewComponent } from 'app/main/opd/appointment-list/image-view/image-view.component';
import { ImageCropComponent } from '../image-crop/image-crop.component';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AirmidFileModel, PageNames } from '../airmid-fileupload/airmid-fileupload.component';

@Component({
    selector: 'airmid-signature',
    templateUrl: './airmid-signature.component.html',
    styleUrls: ['./airmid-signature.component.scss']
})
export class AirmidSignatureComponent implements OnInit {
    sanitizeImagePreview = "";
    isFileUpload: boolean = false;
    @Input() refType: PageNames
    @Input() refId: number = 0;
    @Input() docName: string = "default";
    @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
    private signaturePad!: SignaturePad;
    private canvas!: HTMLCanvasElement;
    objFile: AirmidFileModel;
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
        private _service: ApiCaller,
        // public safe: SafePipesPipe

    ) {
    }
    ngOnInit(): void {
        if (this.data) {
            this.refId = this.data.refId;
            this.refType = this.data.refType;
            this.docName=this.data.docName;
        }
        if (this.refId > 0) {
            this._service.GetData("Files/get-signature?RefId=" + this.refId + "&RefType=" + this.refType).subscribe((data) => {
                if (data.data) {
                    if (data.type == "signature") {
                        this.signaturePad.fromDataURL(data.data);
                        this.isFileUpload = false;
                    }
                    else {
                        this.sanitizeImagePreview = data.data;
                        this.isFileUpload = true;
                    }
                }
            });
        }
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
        if (!event.target.files.length) return;
        const file = event.target.files[0];

        const dialogRef = this.matDialog.open(ImageCropComponent, {
            width: '600px',
            data: { file }
        });

        dialogRef.afterClosed().subscribe((croppedBase64) => {
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

    onClose() {
        this.dialogRef.close();
    }
    OnSubmit() {
        debugger
        if (this.isFileUpload) {
            this.objFile = {
                srNo: 1,
                id: 0,
                docName: this.docName + '_File',
                docSavedName: '',
                Document: null,
                isDelete: false,
                base64: this.sanitizeImagePreview,
                refId: this.refId,
                refType: this.refType
            }
        }
        else {
            if (this.signaturePad.isEmpty()) {
                alert('Please provide a signature first.');
                return;
            }
            this.objFile = {
                srNo: 1,
                id: 0,
                docName: this.docName + '_Signature',
                docSavedName: '',
                Document: null,
                isDelete: false,
                base64: this.signaturePad.toDataURL(),
                refId: this.refId,
                refType: this.refType
            }
        }
        this._service.PostFromData("Files/save-signature", { objSignature: this.objFile }).subscribe((data) => {
            this.dialogRef.close(this.signaturePad.toDataURL());
        });
    }
}