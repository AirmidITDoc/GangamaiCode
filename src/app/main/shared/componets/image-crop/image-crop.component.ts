import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss'],
})
export class ImageCropComponent implements OnInit {
  @ViewChild('abc', { static: true }) imageCropper: ImageCropperComponent;
  max: number = 2;
  zoom: number = 0;
  transform: ImageTransform = {};
sliderReady = false;
  constructor(
    public dialogRef: MatDialogRef<ImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { file: File }
  ) {
  }

  ngOnInit() { }
  ngAfterViewInit(){
    if (this.imageCropper) {
      this.imageCropper.imageChangedEvent = this.data.file;
    }
  }

   croppedImageBlob: Blob | null = null;
   croppedImage: string = '';

  // onImageCropped(event: ImageCroppedEvent) {
  //   console.log('Cropped image event fired:', event);
  //   this.croppedImageBlob = event.blob!; // Storing Blob result
  // }

    onImageCropped(event: ImageCroppedEvent) {
      debugger
    const blob = event.blob; // Get the Blob of the cropped image
    if (blob) {
      // Convert the Blob to base64 and store it
      this.convertBlobToBase64(blob).then(base64 => {
        console.log("Converted Base64 image:", base64); // Log base64 string
        this.croppedImage = base64; // Store base64 string
      }).catch(error => {
        console.error("Error converting Blob to Base64:", error);
      });
    }
  }

    convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob); // Read Blob as a Data URL (base64)
    });
  }

 onAccept() {
  debugger
    this.dialogRef.close(this.croppedImage); // Close dialog and pass base64 string
  }

  onSliderChange(value) {
    this.zoom = value;
    const scale = value >= 0 ? value + 1 : 1 - (value / this.max) * -1;
    this.transform = { scale };
  }

  onClose() {
    
    this.dialogRef.close();
  }

  // onAccept() {
  //   debugger
  //   console.log("imageCrop:",this.imageCropper)
  //   const event = this.imageCropper.crop();
  //   this.dialogRef.close(event);
  // }
}