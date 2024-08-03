import { LoaderService } from './loader.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  template: `<div [hidden]="!show"  class="spinner-load-wrapper">
                <div class="spinner">
                    <div class="inner">
                        <div class="gap"></div>
                        <div class="left">
                            <div class="half-circle"></div>
                        </div>
                        <div class="right">
                            <div class="half-circle"></div>
                        </div>
                    </div>
                </div>
            </div>`,
  //styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = true;
  private _subLoader: Subscription;

  constructor(public loader: LoaderService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._subLoader = this.loader.loaderState.subscribe((showState: boolean) => {
      if (showState) {
        this.show = showState;
        this.cd.detectChanges();
      } else {
        setTimeout(() => {
          this.show = showState;
          this.cd.detectChanges();
        }, 500);
      }
    });
  }

  ngOnDestroy() {
    if (this._subLoader) {
      this._subLoader.unsubscribe();
    }
  }

}
