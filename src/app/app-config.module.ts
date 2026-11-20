import { NgModule, InjectionToken } from '@angular/core';
import { AppConfigService } from './core/services/api-config.service';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
	apiEndpoint: string;
    newApiEndPoint:string;	
}

export function appConfigFactory(config: AppConfigService): AppConfig {
	return {
		get apiEndpoint(): string { return config.apiBaseUrl; },
		get newApiEndPoint(): string { return config.apiBaseUrl; }
	};
}

@NgModule({
	providers: [{
		provide: APP_CONFIG,
		useFactory: appConfigFactory,
		deps: [AppConfigService]
	}],
})
export class AppConfigModule { }
