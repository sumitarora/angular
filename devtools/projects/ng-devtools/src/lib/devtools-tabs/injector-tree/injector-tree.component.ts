import {AfterViewInit, Component, ElementRef, Input, NgModule, OnInit, ViewChild} from '@angular/core';
import {Events, MessageBus} from 'protocol';

import {InjectorTreeGraph} from './injector-tree-graph';

@Component({
  selector: 'ng-injector-tree',
  templateUrl: 'injector-tree.component.html',
  styleUrls: ['./injector-tree.component.scss']
})
export class InjectorTreeComponent implements AfterViewInit {
  @ViewChild('svgContainer', {static: true}) private svgContainer: ElementRef;
  @ViewChild('mainGroup', {static: true}) private g: ElementRef;

  @Input()
  set injectorTree(injectorTree: any[]) {
    if (!this.injectorTreeGraph) {
      return;
    }

    this.injectorTreeGraph.update(injectorTree);
  };
  injectorTreeGraph: InjectorTreeGraph;

  ngAfterViewInit() {
    this.injectorTreeGraph =
        new InjectorTreeGraph(this.svgContainer.nativeElement, this.g.nativeElement);
  }
}


@NgModule({
  exports: [InjectorTreeComponent],
  declarations: [InjectorTreeComponent],
})
export class InjectorTreeModule {
}
