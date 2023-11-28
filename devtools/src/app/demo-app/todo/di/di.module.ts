/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DI_TREE_COMPONENTS, DIComponent} from './di.components';
import {DI_TREE_SERVICES} from './di.services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: DIComponent,
      },
    ]),
  ],
  providers: [...DI_TREE_SERVICES],
  declarations: [DIComponent, ...DI_TREE_COMPONENTS],
  exports: [DIComponent],
})
export class DIModule {
}
