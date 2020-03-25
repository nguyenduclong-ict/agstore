import { ModuleWithProviders, NgModule } from '@angular/core';
import { AgStoreConfigRoot } from './type';
import { initStore } from '.';

@NgModule({})
export class AgStoreModule {
  static forRoot(configs: AgStoreConfigRoot): ModuleWithProviders {
    initStore(configs);
    return {
      ngModule: AgStoreModule,
      providers: []
    };
  }
}
