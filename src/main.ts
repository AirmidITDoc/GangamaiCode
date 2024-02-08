import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';
import { hmrBootstrap } from 'hmr';
import { environment } from 'environments/environment.prod';

if ( environment.production )
{
    enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if ( environment.hmr )
{
    if ( module['hot'] )
    {
        hmrBootstrap(module, bootstrap);
    }
    else
    {
        console.error('HMR is not enabled for webpack-dev-server!');
        console.log('Are you using the --hmr flag for ng serve?');
    }
}
else
{
    bootstrap().catch(err => console.error(err));
}

function addScript(link) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = link;
    document.head.append(script);
  }
  function addLink(css) {
    const link = document.createElement('link');
    link.href = css;
    link.rel = 'stylesheet';
    document.head.append(link);
  }
addScript('assets/summernote/jquery-3.4.1.min.js');
addScript("assets/summernote/summernote-lite.min.js");
addLink("assets/summernote/summernote-lite.min.css")
