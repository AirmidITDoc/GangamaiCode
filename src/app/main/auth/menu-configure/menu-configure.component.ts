import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-menu-configure',
  templateUrl: './menu-configure.component.html',
  styleUrls: ['./menu-configure.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuConfigureComponent implements OnInit {
  constructor( ) { 
  }
  ngOnInit(): void {
  }
 
}
