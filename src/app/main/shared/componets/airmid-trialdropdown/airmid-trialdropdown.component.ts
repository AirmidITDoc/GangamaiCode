import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-airmid-trialdropdown',
  templateUrl: './airmid-trialdropdown.component.html',
  styleUrls: ['./airmid-trialdropdown.component.scss']
})
export class AirmidTrialdropdownComponent implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    // dropdown.component.js
// angular: any.module('app').component('dropdown', {
    bindings: {
      options: '<',          // Array of dropdown options
      selected: '=',         // Two-way binding for the selected option
      onSelect: '&'          // Callback function for option selection
    }
    template: `
      <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" ng-click="$ctrl.toggleDropdown()">
          {{$ctrl.selected || 'Select an option'}}
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" ng-show="$ctrl.isOpen">
          <li ng-repeat="option in $ctrl.options" ng-click="$ctrl.selectOption(option)">
            <a href="#">{{option}}</a>
          </li>
        </ul>
      </div>
    `
        main: any;
        selected: any;
        isOpen : boolean;
    // controller: function () 
    // {
        // return {
    //   this.isOpen = false,
  
    //   this.toggleDropdown = () => {
    //     this.isOpen = !this.isOpen;
    //   };
  
    //   this.selectOption = (option) => {
    //     this.selected = option;
    //     this.isOpen = false;
    //     this.onSelect({ selected: option });
    //   };
    //   }
    // }

}
