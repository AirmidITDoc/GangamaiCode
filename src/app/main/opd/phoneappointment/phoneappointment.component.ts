import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
  selector: 'app-phoneappointment',
  templateUrl: './phoneappointment.component.html',
  styleUrls: ['./phoneappointment.component.scss']
})
export class PhoneappointmentComponent implements OnInit {

  dialogRef: any;
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  
  constructor(
    private _fuseSidebarService: FuseSidebarService
  ) { }

  ngOnInit(): void {
  }

}
