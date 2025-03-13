import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HospitalService } from './hospital.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewHospitalComponent } from './new-hospital/new-hospital.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatAccordion } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';


@Component({
  selector: 'app-hospital-master',
  templateUrl: './hospital-master.component.html',
  styleUrls: ['./hospital-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class HospitalMasterComponent implements OnInit {
 
  msg: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  gridConfig: gridModel = {
      apiUrl: "StateMaster/List",
      columnsList: [
          { heading: "Code", key: "stateId", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "State Name", key: "stateName", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Country Name", key: "countryId", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
          {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          
                      }
                  }]
          } //Action 1-view, 2-Edit,3-delete
      ],
      sortField: "stateId",
      sortOrder: 0,
      filters: [
          { fieldName: "stateName", fieldValue: "", opType: OperatorComparer.Contains },
          { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ]
  }

  constructor( public _HospitalService: HospitalService,
    public _matDialog: MatDialog
   ) { }

  ngOnInit(): void {
        
  }


onSearch(){

}
onAdd() {

  const dialogRef = this._matDialog.open(NewHospitalComponent, {
      maxWidth: "65vw",
      maxHeight: "85vh",
      width: "100%",
      height: "100%",
  });
  dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
     
  });
}

onEdit(row){
  this._HospitalService.populateForm(row);
  const dialogRef = this._matDialog.open(NewHospitalComponent, {
    maxWidth: "65vw",
    maxHeight: "85vh",
    width: "100%",
    height: "100%",
    data: {
      registerObj: row,
  }
});
dialogRef.afterClosed().subscribe((result) => {
    console.log("The dialog was closed - Insert Action", result);
    
});
}
}


export class HospitalMaster {
  HospitalId: any;
  HospitalName: any;
  HospitalAddress: any;
  City: any;
  CityId: any;
  Pin: any;
  Phone : any;
  EmailID:any;
  WebSiteInfo:any;
  Header:any;
  IsDeleted:any;
  /**
   * Constructor
   *
   * @param HospitalMaster
   */
  constructor(HospitalMaster) {
      {
        this.HospitalId = HospitalMaster.HospitalId || 0;
          this.HospitalName = HospitalMaster.HospitalName || "";
          this.HospitalAddress = HospitalMaster.HospitalAddress || "";
          this.City = HospitalMaster.City || "";
          this.CityId = HospitalMaster.CityId || "";
          this.Pin = HospitalMaster.Pin || "";
          this.Phone  =HospitalMaster.Phone  || "";
          this.EmailID = HospitalMaster.EmailID || "";
          this.WebSiteInfo  =HospitalMaster.WebSiteInfo  || "";
          this.Header  =HospitalMaster.Header  || "";
          this.IsDeleted  =HospitalMaster.IsDeleted  || 1;
      }
  }
}