import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { AirmidFileModel } from '../airmid-fileupload/airmid-fileupload.component';
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
  docData;
  docType;
  docViewType: any;
  sStatus: any = '';
  place;

  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';
  sanitizeImagePreview = "";


  constructor(
    public dialogRef: MatDialogRef<AirmidImageviewComponent>, public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _service: ApiCaller,
    // public safe: SafePipesPipe

  ) {
    console.log(this.data)
    debugger
    this.place = data.place;
    // if (data.type == "image") {
    //   this.docData = data.docData
    //   this.docType = "image";
    // } else if (data.type == "pdf") {
    //   this.docType = "pdf";
    //   this.docViewType = "application/pdf";
    //   data.docData = data.docData.split('data:application/pdf;base64,').pop();
    //   this.docData = this.b64toBlob(data.docData, 'application/pdf');
    // }

      if (data.type == "image") {
      this.docData = data.docData.docSavedName
      this.docType = "image";
    } else if (data.type == "pdf") {
      this.docType = "pdf";
      this.docViewType = "application/pdf";
      data.docData = data.docDat.docSavedName.split('data:application/pdf;base64,').pop();
      this.docData = this.b64toBlob(data.docData, 'application/pdf');
    }


    console.log(this.docData)

    this.sanitizeImagePreview = this.docData
  }

  ngOnInit(): void {
    // this.downloadFile(this.data)
  }

  b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const Url = URL.createObjectURL(blob);
    // return this.safe.transform(Url);
  }

  public getSnapshot(): void {
    this.trigger.next(void 0);
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

  onClose() {
    this.dialogRef.close();
  }
}
