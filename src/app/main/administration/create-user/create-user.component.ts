import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateUserComponent implements OnInit {
  form: FormGroup;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      myInput: new FormControl(''),
      myInput1: new FormControl(''),
      myInput2: new FormControl('')
    });

  }
  ngAfterViewInit() {
    this.renderer.selectRootElement('#myInput').focus();
  }

  focusMyNextInput() {
    this.renderer.selectRootElement('#myInput1').focus();

  }
  focusMyNextInput2() {
    this.renderer.selectRootElement('#myInput2').focus();

  }
  focusMyNextInput3() {
    this.renderer.selectRootElement('#Btnsave').focus();

  }
}
