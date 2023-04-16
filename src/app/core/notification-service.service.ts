import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  constructor(public snackBar:MatSnackBar) { }

  config: MatSnackBarConfig ={
    duration:1000,
    horizontalPosition:'right',
    verticalPosition:'top'
  }

  success(msg){
    this.config['panelClass'] = ['notification','success'] 
    this.snackBar.open(msg,'',this.config);
  }
}
