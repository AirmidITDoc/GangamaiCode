import { Component, Inject,ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-applicationdialog',
  templateUrl: './applicationdialog.component.html',
  styleUrls: ['./applicationdialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApplicationdialogComponent {
   // url: string = 'https://kanaad.kanaad.co.in/kanaad-web/login';
  //    url: string = 'https://uat.airmid.co.in'; // Default URL 
   url: string = 'https://kanaad.co.in/abdm/client-login/1/c27c727f-54ad-47ec-8603-b4124e4398f9';
   safeUrl: SafeResourceUrl | undefined;
  loadFailed = false;
  constructor(
    public sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ApplicationdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string }
  ) {    
  //this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com'); 
  // this.sanitizer.bypassSecurityTrustResourceUrl("www.google.com")
    //this.openAbha(this.data.url);    
  }
 
    onIframeError() {
    this.loadFailed = true;
    console.error('Iframe failed to load — site likely blocks framing.');
  }
  ngOnInit() {
    debugger 
    console.log('URL passed to dialog:', this.data.url); 
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url)   
  }

openAbha(url: string): void {
  if (!url) {
    console.error('ABHA URL is missing');
    return;
  } 
  window.location.href = url;
}

}
