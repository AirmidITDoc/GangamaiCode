import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ip-settlement',
  templateUrl: './ip-settlement.component.html',
  styleUrls: ['./ip-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPSettlementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
