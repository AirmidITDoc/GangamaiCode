import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EmergencyListService } from '../emergency-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-emergency',
  templateUrl: './new-emergency.component.html',
  styleUrls: ['./new-emergency.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewEmergencyComponent implements OnInit {

  dateTimeObj:any;
  screenFromString = 'emergency-form';
  vFirstName:any;
  vMiddleName:any;
  vLastName:any;
  vAddress:any;
  vMobileNo:any;
  vPinNo:any;

  constructor(
    public _EmergencyListService:EmergencyListService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  Savebtn:boolean=false;
  OnSave(){

  }
  onClose(){
    this._matDialog.closeAll();
  }
  OnReset(){

  }
}
