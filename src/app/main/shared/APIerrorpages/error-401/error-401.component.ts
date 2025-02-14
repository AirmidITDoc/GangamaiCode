import { Component } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-error-401',
  templateUrl: './error-401.component.html',
  styleUrls: ['./error-401.component.scss']
})
export class Error401Component {
    constructor(private _fuseConfigService: FuseConfigService){
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };
    }

}
