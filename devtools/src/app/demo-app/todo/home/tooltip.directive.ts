/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Attribute, Directive, ElementRef, HostListener, SkipSelf} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  visible = false;
  nested = {
    child: {
      grandchild: {
        prop: 1,
      },
    },
  };

  constructor(@Attribute('class') private c: string, @SkipSelf() elementRef: ElementRef) {
    // setInterval(() => this.nested.child.grandchild.prop++, 500);
  }

  @HostListener('click')
  handleClick(): void {
    this.visible = !this.visible;
    if (this.visible) {
      (this as any).extraProp = true;
    } else {
      delete (this as any).extraProp;
    }
  }
}
