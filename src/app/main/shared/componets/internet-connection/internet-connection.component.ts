import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-internet-connection',
  templateUrl: './internet-connection.component.html',
  styleUrls: ['./internet-connection.component.scss']
})
export class InternetConnectionComponent implements OnInit {

  @Input() isOffLine: boolean;
  @Input() isLoading :boolean;
  constructor() { 
    console.log('this.isOffLine=', this.isOffLine);
  }

  ngOnInit(): void {
  }

}
