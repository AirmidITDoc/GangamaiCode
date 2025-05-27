import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { PhysiotherapistScheduleService } from '../physiotherapist-schedule.service';

@Component({
  selector: 'app-physio-schedule',
  templateUrl: './physio-schedule.component.html',
  styleUrls: ['./physio-schedule.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PhysioScheduleComponent implements OnInit {




  constructor(
       public _PhysiotherapistScheduleService: PhysiotherapistScheduleService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        public datePipe: DatePipe,
        private commonService: PrintserviceService
  )
  {}

  ngOnInit(): void {
    
  }

}
