import { Component, Inject,ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { MaterialConsumptionService } from '../material-consumption.service';

@Component({
  selector: 'app-applicationdialog',
  templateUrl: './applicationdialog.component.html',
  styleUrls: ['./applicationdialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApplicationdialogComponent { 
   url: string = '';  
  // url: string = 'https://kanaad.co.in/abdm/client-login/1/c27c727f-54ad-47ec-8603-b4124e4398f9';
   safeUrl: SafeResourceUrl | undefined; 
   private intervalId: any;
  constructor(
    public _MaterialConsumptionService: MaterialConsumptionService,
    public sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ApplicationdialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {  url: string;  transactionId: string; }
  ) { } 
  ngOnInit() { 
      console.log('URL:', this.data.url);
      console.log('Transaction ID:', this.data.transactionId);
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data?.url) 
      this.startPolling();
  }  
startPolling() {
  this.intervalId = setInterval(() => { 
    this._MaterialConsumptionService.getAbhaTransactionIdList(this.data?.transactionId).subscribe({
        next: (response: any) => { 
          console.log('GET RESPONSE:', response); 
          console.log('GET RESPONSE.TransID:', response?.transactionId); 
          if (response && response?.transactionId) { 
            console.log('Record found. Closing dialog.'); 
            clearInterval(this.intervalId); 
            this.dialogRef.close(response);
          }
        },
        error: (error) => {
          console.error('Get API Error:', error);
        }
      }); 
  }, 5000);
} 
ngOnDestroy() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
} 
}
