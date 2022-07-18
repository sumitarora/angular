import {Component, Input} from '@angular/core';

import {IndexedNode} from '../directive-forest/index-forest';

@Component({
  selector: 'ng-injector-graph',
  templateUrl: './injector-graph.component.html',
  styleUrls: ['./injector-graph.component.scss'],
})
export class InjectorGraphComponent {
  @Input() currentSelectedElement: IndexedNode;
  @Input() parents: any[];

  ngOnInit() {
    console.log(
        'this.currentSelectedElement.nativeElement', this?.currentSelectedElement?.nativeElement);
  }
}
