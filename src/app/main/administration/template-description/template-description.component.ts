import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TempDescService } from './temp-desc.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTemplateDescComponent } from './new-template-desc/new-template-desc.component';
import { NewHospitalComponent } from 'app/main/setup/PersonalDetails/hospital-master/new-hospital/new-hospital.component';

@Component({
  selector: 'app-template-description',
  templateUrl: './template-description.component.html',
  styleUrls: ['./template-description.component.scss']
})
export class TemplateDescriptionComponent implements OnInit {

  resultsLength:any=0;
  displayedColumns: string[] = [
    // "HospitalId",
    "TemplateId",
    "TemplateName",
    "TemplateDescription",
     "action",
];
DSList=new MatTableDataSource<TemplateMaster>();

@ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    
  constructor( public _TempDescService: TempDescService,
    public _matDialog: MatDialog
   ) { }

  ngOnInit(): void {
    this.getTemplateMaster();

    
  }


  getTemplateMaster() {
  this._TempDescService.getTemplateList().subscribe((data) => {
        this.DSList.data = data as TemplateMaster[];
       
        this.resultsLength=  this.DSList.data.length; 
        console.log(this.DSList.data);
    });
}
onSearch(){

}
onAdd() {

  const dialogRef = this._matDialog.open(NewTemplateDescComponent, {
      maxWidth: "65vw",
      maxHeight: "85vh",
      width: "100%",
      height: "100%",
  });
  dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.getTemplateMaster();
  });
}

onEdit(row){
  this._TempDescService.populateForm(row);
  const dialogRef = this._matDialog.open(NewTemplateDescComponent, {
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
    this.getTemplateMaster();
});
}
}


export class TemplateMaster {
  TemplateId: any;
  TemplateName: any;
  TemplateDescription: any;
 
  /**
   * Constructor
   *
   * @param TemplateMaster
   */
  constructor(TemplateMaster) {
      {
        this.TemplateId = TemplateMaster.TemplateId || 0;
          this.TemplateName = TemplateMaster.TemplateName || "";
          this.TemplateDescription = TemplateMaster.TemplateDescription || "";
              }
  }
}