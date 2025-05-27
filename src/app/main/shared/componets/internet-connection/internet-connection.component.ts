import { Component, Input, OnInit } from '@angular/core';

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
