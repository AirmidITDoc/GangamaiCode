import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ClinicalCareChartService } from '../clinical-care-chart.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lab-reports-view',
  templateUrl: './lab-reports-view.component.html',
  styleUrls: ['./lab-reports-view.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabReportsViewComponent implements OnInit {

  constructor(
    public _formbuilder:FormBuilder,
    public  _ClinicalcareService: ClinicalCareChartService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }


  onClose(){
    this._matDialog.closeAll();
  }
}
