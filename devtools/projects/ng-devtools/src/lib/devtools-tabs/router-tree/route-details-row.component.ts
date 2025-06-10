/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {JsonPipe} from '@angular/common';
import {Component, computed, input, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

export type RowType = 'text' | 'chip' | 'flag' | 'list';

@Component({
  standalone: true,
  selector: '[ng-route-details-row]',
  templateUrl: './route-details-row.component.html',
  styleUrls: ['./route-details-row.component.scss'],
  imports: [MatButtonModule, JsonPipe],
})
export class RouteDetailsRowComponent {
  readonly label = input.required<string>();
  readonly data = input<any>();
  readonly dataKey = input.required<string>();
  readonly isJsonData = input<boolean>(false);
  readonly type = input<RowType>('text');

  readonly click = output<string>();

  readonly dataArray = computed(() => {
    return this.data()[this.dataKey()] as string[];
  });

  // Lazy and redirecting routes do not have a component associated with them.
  // We need to disable the button click event for these routes.
  readonly isRouteWithoutComponent = computed(() => this.data()?.isLazy || this.data()?.isRedirect);
}
