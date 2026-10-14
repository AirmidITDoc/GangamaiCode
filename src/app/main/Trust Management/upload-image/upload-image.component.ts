import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ImageViewComponent } from 'app/main/opd/appointment-list/image-view/image-view.component';
import { AirmidFileModel, PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { ImageCropComponent } from 'app/main/shared/componets/image-crop/image-crop.component';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UploadImageComponent implements OnInit {

  sanitizeImagePreview: string | null = '';
  objFile: AirmidFileModel;
  isFileUpload: boolean = false;
  @Input() refType: PageNames
  @Input() refId: number = 0;
  @Input() docName: string = "default";
  constructor(
    public dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialog: MatDialog,
    private _service: ApiCaller,) { }

  vmembershipId: 0
  vrefType: ''

  ngOnInit(): void {
    // console.log("upload image dialog data", this.data)

    if (this.data?.membershipId > 0 && this.data?.refType) {
      this.vmembershipId = this.data.membershipId
      this.refType = this.data.refType
      this._service.GetData('Files/get-signature?RefId=' + this.data.membershipId + '&RefType=' + this.data.refType).subscribe((response: any) => {

        if (response?.data) {
          this.sanitizeImagePreview = response.data;
          this.isFileUpload = true;
        }

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
  onClose() {
    this.dialogRef.close();
  }

  removeFile() {
    if (this.vmembershipId > 0 && this.sanitizeImagePreview) {
      this.objFile = {
        srNo: 1,
        id: 0,
        docName: this.refType === 'TrustHusband_Photo'
          ? 'TrustHusband_Photo' + '_File'
          : 'TrustWife_Photo_File' + '_File',
        docSavedName: '',
        Document: null,
        isDelete: true,
        base64: this.sanitizeImagePreview,
        refId: this.vmembershipId,
        refType: this.refType
      };
      this.sanitizeImagePreview = null;
      this.isFileUpload = false;

      return;
    }

    // No existing image to delete; clear only the selected preview.
    this.sanitizeImagePreview = null;
    this.isFileUpload = false;
    this.objFile = null;
  }


  OnSubmit() {
    // if (!this.sanitizeImagePreview) {
    //   return;
    // }
    if (this.objFile?.isDelete) {
      this._service.PostFromData("Files/save-signature", { objSignature: this.objFile })
        .subscribe(() => {
          this.dialogRef.close(null);
        });
      return;
    }
    // Return the selected/cropped image to the parent form.
    if (this.sanitizeImagePreview) {
      // this.isFileUpload = true;
      this.dialogRef.close(this.sanitizeImagePreview);
    }
  }
}
