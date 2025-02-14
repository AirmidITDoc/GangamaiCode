import { Component } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector: 'app-error-404',
    templateUrl: './error-404.component.html',
    styleUrls: ['./error-404.component.scss']
})
export class Error404Component {
    constructor(private _fuseConfigService: FuseConfigService) {
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
