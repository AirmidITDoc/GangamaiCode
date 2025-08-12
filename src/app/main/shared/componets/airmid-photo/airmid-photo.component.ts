import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { AirmidFileModel, PageNames } from '../airmid-fileupload/airmid-fileupload.component';
import { ApiCaller } from 'app/core/services/apiCaller';

@Component({
  selector: 'app-airmid-photo',
  templateUrl: './airmid-photo.component.html',
  styleUrls: ['./airmid-photo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AirmidPhotoComponent implements OnInit {
  public errors: WebcamInitError[] = [];
  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  public webcamImage!: WebcamImage;
  private trigger: Subject<void> = new Subject();
  private nextWebcam: Subject<boolean | string> = new Subject();
  public sysImage: string = '';

  @Input() refType!: PageNames;
  @Input() refId: number = 0;
  @Input() docName: string = "default";
  objFile!: AirmidFileModel;

  constructor(
    public dialogRef: MatDialogRef<AirmidPhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: ApiCaller
  ) {
    if (data) {
      this.refId = data.refId;
      this.refType = data.refType;
      this.docName = data.docName || 'default';
    }
  }

  ngOnInit(): void {
    this.initializeCamera();
      if (this.refId > 0) {
    this._service.GetData("Files/get-signature?RefId=" + this.refId + "&RefType=" + this.refType).subscribe((data) => {
      if (data?.data) {
        this.sysImage = data.data;
      }
    });
  }
  }

  initializeCamera(): void {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices.length > 1;
    });
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  takeSnapshot(): void {
    this.trigger.next();
  }

  captureImg(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage.imageAsDataUrl;
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
    console.error('Webcam init error:', error);
  }

  onSubmit(): void {
  const imageToSubmit = this.webcamImage?.imageAsDataUrl || this.sysImage;

  if (!imageToSubmit) {
    alert('Please capture an image first.');
    return;
  }
  this.objFile = {
    srNo: 1,
    id: 0,
    docName: this.docName + '_Photo',
    docSavedName: '',
    Document: null,
    isDelete: false,
    base64: imageToSubmit,
    refId: this.refId,
    refType: this.refType
  };

  this._service.PostFromData("Files/save-signature", { objSignature: this.objFile }).subscribe(() => {
    this.dialogRef.close(imageToSubmit);
  });
}


  onClose(): void {
    this.dialogRef.close();
  }
}
