import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { AirmidFileModel, PageNames } from '../airmid-fileupload/airmid-fileupload.component';
import { ApiCaller } from 'app/core/services/apiCaller';
import { DateUpdateComponent } from 'app/main/administration/paymentmodechanges/date-update/date-update.component';
import { ImageCropComponent } from '../image-crop/image-crop.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-airmid-imageview',
  templateUrl: './airmid-imageview.component.html',
  styleUrls: ['./airmid-imageview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AirmidImageviewComponent {
  sanitizeImagePreview = "";
     isFileUpload: boolean = false;
     @Input() refType: PageNames
     @Input() refId: number = 0;
     @Input() docName: string = "default";
     
     
     objFile: AirmidFileModel;
   
     constructor(
         public dialogRef: MatDialogRef<AirmidImageviewComponent>,
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
             this._service.GetData("Files/get-files?RefId=" + this.refId + "&RefType=" + this.refType).subscribe((data) => {
                console.log(data)

                debugger
                // if (data.data) {
                   
                //          this.sanitizeImagePreview = data.data;
                //          this.isFileUpload = true;
                     
                //  }

                  this.sanitizeImagePreview = data[0];
                 
             });
         }
     }
     
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
           
           
         }
         this._service.PostFromData("Files/save-signature", { objSignature: this.objFile }).subscribe((data) => {
            //  this.dialogRef.close(this.signaturePad.toDataURL());
         });
     }
 }