import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';

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


  onSliderChange(value) {
    this.zoom = value;
    const scale = value >= 0 ? value + 1 : 1 - (value / this.max) * -1;
    this.transform = { scale };
  }

  onClose() {
    debugger
    this.dialogRef.close();
  }

  onAccept() {
    debugger
    const event = this.imageCropper.crop();
    this.dialogRef.close(event);
  }
}