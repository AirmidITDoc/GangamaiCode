import { NgModule, InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

import SampleJson from './../assets/url.json';

export class AppConfig {
	apiEndpoint: string;	
}

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: SampleJson["url"]
};

@NgModule({
	providers: [{
		provide: APP_CONFIG,
		useValue: APP_DI_CONFIG
	}],
})
export class AppConfigModule { }
