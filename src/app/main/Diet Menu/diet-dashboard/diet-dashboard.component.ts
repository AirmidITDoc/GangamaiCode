import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { PatientDietReauestComponent } from 'app/main/canteenmanagement/patient-diet-reauest/patient-diet-reauest.component';
import { NewDietRequestComponent } from 'app/main/nursingstation/diet-request/new-diet-request/new-diet-request.component';
import { NewMealtypeMasterComponent } from 'app/main/setup/DietMaster/mealtype-master/new-mealtype-master/new-mealtype-master.component';
import { NewMenuMasterComponent } from 'app/main/setup/DietMaster/menu-master/new-menu-master/new-menu-master.component';

@Component({
  selector: 'app-diet-dashboard',
  templateUrl: './diet-dashboard.component.html',
  styleUrls: ['./diet-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DietDashboardComponent {

  dateTimeObj: any;
  screenFromString = 'Common-form';

  constructor(
    public _matDialog: MatDialog
  ) { }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  openDietPlan(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const dialogRef = this._matDialog.open(NewDietRequestComponent,
      {
        maxWidth: "100vw",
        maxHeight: '100%',
        width: '90%',
        height: '100%',
        data: row
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { }
    });
  }

  openDietMenu(row: any = null): void {
console.log("Clicked")
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const dialogRef = this._matDialog.open(NewMenuMasterComponent,
      {
        maxWidth: "85vw",
        maxHeight: '100%',
        width: '90%',
        height: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { }
    });
  }

  openKitchenOrder(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const dialogRef = this._matDialog.open(PatientDietReauestComponent,
      {
        maxWidth: "85vw",
        maxHeight: '100%',
        width: '90%',
        height: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { }
    });
  }

  openMealMaster(row: any = null): void {

    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const dialogRef = this._matDialog.open(NewMealtypeMasterComponent,
      {
        maxWidth: "50vw",
        maxHeight: '50%',
        width: '70%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { }
    });
  }

}
