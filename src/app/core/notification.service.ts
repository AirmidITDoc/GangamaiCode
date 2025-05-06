import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiCaller } from './services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar:MatSnackBar,public _httpClient1: ApiCaller) { }

  config: MatSnackBarConfig ={
    duration:1000,
    horizontalPosition:'right',
    verticalPosition:'top'
  }

  success(msg){
    this.config['panelClass'] = ['notification','success'] 
    this.snackBar.open(msg,'',this.config);
  }
  public getNotifications() {
    return this._httpClient1.GetData("Notification/List");
}
}
