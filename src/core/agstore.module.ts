import { ModuleWithProviders } from '@angular/core';
import { AgStoreService } from './agstore.service';
import { AgStoreConfigRoot } from './type';

export class AgStoreModule {
  static forRoot(configs: AgStoreConfigRoot): ModuleWithProviders {
    return {
      ngModule: AgStoreModule,
      providers: [{ provide: AgStoreService, useValue: configs }],
    };
  }
}
