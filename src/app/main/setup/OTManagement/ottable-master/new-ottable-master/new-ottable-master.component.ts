import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { OttableMasterService } from '../ottable-master.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-new-ottable-master',
  templateUrl: './new-ottable-master.component.html',
  styleUrls: ['./new-ottable-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOttableMasterComponent implements OnInit {

  vOtTableId: any;
  registerObj: any;
  vOtRoomName: any;
  vLocationid:any;
  vIsDeleted:any;
  isLocationSelected:boolean=false;
  LocationcmbList:any=[];
  optionsSearchgroup: any[] = [];
  filteredOptionsLocation: Observable<string[]>;

  constructor(
    public _otTableMasterService: OttableMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewOttableMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getLocationNameCombo();

    if(this.data){
      debugger
      this.registerObj=this.data.Obj;
      console.log("RegisterObj:",this.registerObj)
      this.vOtRoomName = this.registerObj.OTTableName;
      this.vLocationid = this.registerObj.LocationName;
      // this.vIsDeleted=JSON.stringify(this.registerObj.IsActive)
      this.vOtTableId=this.registerObj.OTTableId;
      if(this.registerObj.IsActive==true){
        this._otTableMasterService.myform.get("IsDeleted").setValue(true)
        // this.vIsDeleted=true;
      }else{
        this._otTableMasterService.myform.get("IsDeleted").setValue(false)
        // this.vIsDeleted=false;
      }
    }
  }

  getOptionTextLoc(option){
    debugger
    return option && option.LocationName ? option.LocationName : '';
  }

  getLocationNameCombo(){
    debugger
    this._otTableMasterService.getLocationMasterCombo().subscribe(data => {
      this.LocationcmbList = data;
      this.optionsSearchgroup = this.LocationcmbList.slice();
      this.filteredOptionsLocation = this._otTableMasterService.myform.get('Locationid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filtersearchlocation(value) : this.LocationcmbList.slice()),
      );
      if (this.data) {
        debugger
        const DValue = this.LocationcmbList.filter(item => item.LocationId == this.registerObj.LocationId);
        console.log("LocationName:",DValue)
        this._otTableMasterService.myform.get('Locationid').setValue(DValue[0]);
        this._otTableMasterService.myform.updateValueAndValidity();
        return;
      }
    });
  }

  private _filtersearchlocation(value: any): string[] {
    debugger
    if (value) {
      const filterValue = value && value.LocationName ? value.LocationName.toLowerCase() : value.toLowerCase();
      return this.LocationcmbList.filter(option => option.LocationName.toLowerCase().includes(filterValue));
    }
  }

  onSave(){
    if (this.vOtRoomName == '' || this.vOtRoomName == null || this.vOtRoomName== undefined) {
      this.toastr.warning('Please enter RoomName  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    if (this.vLocationid == '' || this.vLocationid == null || this.vLocationid == undefined) {
      this.toastr.warning('Please enter select location ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._otTableMasterService.myform.get('Locationid').value) {
      if(!this.LocationcmbList.find(item => item.LocationName == this._otTableMasterService.myform.get('Locationid').value.LocationName))
     {
      this.toastr.warning('Please select Valid Location Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
     }
    }

    Swal.fire({
      title: 'Do you want to Save the OtRoom Recode ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Save it!" ,
      cancelButtonText: "No, Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
          this.onSubmit();
      }
    });
  }

  onSubmit() {
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if(!this.vOtTableId){

      var m_dataInsert={
        "saveOTTableMasterParam": {
          "otTableName": this._otTableMasterService.myform.get("OtRoomName").value || '',
          "locationId": parseInt(this._otTableMasterService.myform.get("Locationid").value.LocationId).toString(),
          "isActive": Boolean(JSON.parse(this._otTableMasterService.myform.get("IsDeleted").value) || 0),
          "createdBy": this._loggedService.currentUserValue.user.id,
          "createdDate": formattedDate,
          "otTableId": 0
        }
      }
      console.log("insertJson:", m_dataInsert);

      this._otTableMasterService.OtTableInsert(m_dataInsert).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else{
      debugger
      var m_dataUpdate={
          "updateOTTableMasterParam": {
          "otTableId": this.vOtTableId,
          "otTableName": this._otTableMasterService.myform.get("OtRoomName").value || '',
          "locationId": parseInt(this._otTableMasterService.myform.get("Locationid").value.LocationId).toString(),
          "isActive": Boolean(JSON.parse(this._otTableMasterService.myform.get("IsDeleted").value) || 0),
          "modifiedDate": formattedDate,
          "modifiedBy": this._loggedService.currentUserValue.user.id,
        }
      }
      console.log("UpdateJson:", m_dataUpdate);

      this._otTableMasterService.OtTableUpdate(m_dataUpdate).subscribe(response =>{
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }

  onClose(){
    this._otTableMasterService.myform.reset({IsDeleted: true});
    this.dialogRef.close();
  }
}
export class OtTableMasterList {
  OtTableId:number;
  OtRoomName:string;
  Floor:any;
  IsDeleted:String;
  LocationName:any;
  OTTableName:string;
  IsActive:string;
  OTTableId:string;
  IsCancelled: boolean;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtTableMasterList) {
    {
      this.OTTableId=OtTableMasterList.OTTableId || '';
      this.OtTableId = OtTableMasterList.OtTableId || '';
      this.OtRoomName = OtTableMasterList.OtRoomName || '';
      this.Floor = OtTableMasterList.Floor || '';
      this.IsDeleted = OtTableMasterList.IsDeleted;
      this.LocationName=OtTableMasterList.LocationName || '';
      this.OTTableName=OtTableMasterList.OTTableName || '';
      this.IsActive=OtTableMasterList.IsActive || '';
      this.IsCancelled = OtTableMasterList.IsCancelled || '';
    }
  }
}