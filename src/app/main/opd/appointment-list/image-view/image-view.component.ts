import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ImageViewComponent implements OnInit {
  docData;
  docType;
  docViewType: any;
  sStatus: any = '';
  place;
  public errors: WebcamInitError[] = [];
  public showWebcam = true;
  public multipleWebcamsAvailable = false;

  private trigger: Subject<any> = new Subject();
  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();
  sysImage = '';

  constructor(
    public dialogRef: MatDialogRef<ImageViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.place = data.place;
    if (data.type == "image") {
      this.docData = data.docData;
      this.docType = "image";
    } else if (data.type == "pdf") {
      this.docType = "pdf";
      this.docViewType = "application/pdf";
      data.docData = data.docData.split('data:application/pdf;base64,').pop();
      this.docData = this.b64toBlob(data.docData, 'application/pdf');
    } else if (data.type == "camera") {
      this.docData = data.docData;
      this.docType = "camera";
    }
  }

  ngOnInit(): void {
    if (this.docType === 'camera') {
      this.initializeCamera();
    }
  }

  private initializeCamera(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
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
    return URL.createObjectURL(blob);
  }

  public takeSnapshot(): void {
    this.trigger.next(void 0);
  }

  public captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage.imageAsDataUrl;
  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    console.error('Webcam initialization error:', error);
  }

  onUpload() {
    this.dialogRef.close({url: this.sysImage, name: 'captured_image'});
  }

  onClose() {
    this.dialogRef.close();
  }
}
