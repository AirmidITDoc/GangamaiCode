import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ottable-master',
  templateUrl: './ottable-master.component.html',
  styleUrls: ['./ottable-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OTTableMasterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
