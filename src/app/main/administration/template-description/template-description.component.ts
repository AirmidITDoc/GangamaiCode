import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TempDescService } from './temp-desc.service';
import { MatDialog } from '@angular/material/dialog';
import { NewTemplateDescComponent } from './new-template-desc/new-template-desc.component';
import { NewHospitalComponent } from 'app/main/setup/PersonalDetails/hospital-master/new-hospital/new-hospital.component';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-description',
  templateUrl: './template-description.component.html',
  styleUrls: ['./template-description.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TemplateDescriptionComponent implements OnInit {

  resultsLength:any=0;
  displayedColumns: string[] = [
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
      maxWidth: "95vw",
      maxHeight: "95vh",
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
    maxWidth: "95vw",
    maxHeight: "95vh",
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


onDeactive(TemplateId) {

       
  Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to Change Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change Status!'
  }).then((result) => {
      if (result.isConfirmed) {
          let Query
          if (!this.DSList.data.find(item => item.TemplateId === TemplateId).IsActive) {
              Query = "Update M_ReportTemplateConfig set IsActive=1 where TemplateId=" + TemplateId;
              
          }
          else {
               Query = "Update M_ReportTemplateConfig set IsActive=0 where TemplateId=" + TemplateId;
          }
          console.log(Query);
          this._TempDescService.deactivateTheStatus(Query)
              .subscribe((data) => {
                  // Handle success response
                  Swal.fire('Changed!', 'Template Status has been Changed.', 'success');
                  this.getTemplateMaster();
              }, (error) => {
                  // Handle error response
                  Swal.fire('Error!', 'Failed to deactivate category.', 'error');
              });
      }
  });
}
}


export class TemplateMaster {
  TemplateId: any;
  TemplateName: any;
  TemplateDescription: any;
  IsActive:any;
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
          this.IsActive = TemplateMaster.IsActive || "";
              }
  }
}