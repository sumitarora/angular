/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

import {InjectorGraphComponent} from './injector-graph.component';

@NgModule({
  declarations: [InjectorGraphComponent],
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule],
  exports: [InjectorGraphComponent],
})
export class InjectorGraphModule {
}
