/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {DirectivePosition, SerializedInjectedService} from 'protocol';

import {DirectivePropertyResolver, DirectiveTreeData,} from '../../property-resolver/directive-property-resolver';
import {FlatNode} from '../../property-resolver/element-property-resolver';

@Component({
  selector: 'ng-property-view-body',
  templateUrl: './property-view-body.component.html',
  styleUrls: ['./property-view-body.component.scss'],
})
export class PropertyViewBodyComponent {
  @Input() directive: string;
  @Input() controller: DirectivePropertyResolver;
  @Input() directiveInputControls: DirectiveTreeData;
  @Input() directiveOutputControls: DirectiveTreeData;
  @Input() directiveStateControls: DirectiveTreeData;

  @Output() inspect = new EventEmitter<{node: FlatNode; directivePosition: DirectivePosition}>();

  categoryOrder = [0, 1, 2];

  get panels(): {
    title: string; hidden: boolean; controls: DirectiveTreeData; documentation: string;
    class: string;
  }[] {
    return [
      {
        title: '@Inputs',
        hidden: this.directiveInputControls.dataSource.data.length === 0,
        controls: this.directiveInputControls,
        documentation: 'https://angular.io/api/core/Input',
        class: 'cy-inputs',
      },
      {
        title: '@Outputs',
        hidden: this.directiveOutputControls.dataSource.data.length === 0,
        controls: this.directiveOutputControls,
        documentation: 'https://angular.io/api/core/Output',
        class: 'cy-outputs',
      },
      {
        title: 'Properties',
        hidden: this.directiveStateControls.dataSource.data.length === 0,
        controls: this.directiveStateControls,
        documentation: 'https://angular.io/guide/property-binding',
        class: 'cy-properties',
      },
    ];
  }

  get controlsLoaded(): boolean {
    return (
        !!this.directiveStateControls && !!this.directiveOutputControls &&
        !!this.directiveInputControls);
  }

  updateValue({node, newValue}: {node: FlatNode; newValue: any}): void {
    this.controller.updateValue(node, newValue);
  }

  drop(event: CdkDragDrop<any, any>): void {
    moveItemInArray(this.categoryOrder, event.previousIndex, event.currentIndex);
  }

  handleInspect(node: FlatNode): void {
    this.inspect.emit({
      node,
      directivePosition: this.controller.directivePosition,
    });
  }
}

@Component({
  selector: 'ng-dependency-viewer',
  template: `
    <mat-accordion class="example-headers-align" multi>
      <mat-expansion-panel>
        <mat-expansion-panel-header collapsedHeight="35px" expandedHeight="35px">
          <mat-panel-title>
            <mat-chip-listbox>
              <mat-chip
                matTooltipPosition="left"
                matTooltip="Dependency injection token"
                (click)="$event.stopPropagation()"
                >{{ dependency.token }}</mat-chip
              >
            </mat-chip-listbox>
          </mat-panel-title>

          <mat-panel-description>
            <mat-chip-listbox>
              <div class="di-flags">
                <mat-chip [highlighted]="true" color="primary" *ngIf="dependency.flags?.optional"
                  >Optional</mat-chip
                >
                <mat-chip [highlighted]="true" color="primary" *ngIf="dependency.flags?.host"
                  >Host</mat-chip
                >
                <mat-chip [highlighted]="true" color="primary" *ngIf="dependency.flags?.self"
                  >Self</mat-chip
                >
                <mat-chip [highlighted]="true" color="primary" *ngIf="dependency.flags?.skipSelf"
                  >SkipSelf</mat-chip
                >
              </div>
            </mat-chip-listbox>
          </mat-panel-description>
        </mat-expansion-panel-header>

        <ng-resolution-path [path]="dependency.resolutionPath"></ng-resolution-path>
      </mat-expansion-panel>
    </mat-accordion>
  `,
  styles: [
    `
      .di-flags {
        display: flex;
        flex-wrap: nowrap;
      }

      :host-context(.dark-theme) ng-resolution-path {
        background: #1a1a1a;
      }

      ng-resolution-path {
        border-top: 1px solid black;
        display: block;
        overflow-x: scroll;
        background: #f3f3f3;
      }

      :host {
        mat-chip {
          --mdc-chip-container-height: 18px;
        }
      }
    `,
  ],
})
export class DependencyViewerComponent {
  @Input() dependency: SerializedInjectedService;
}

class GraphUtils {
  addText(svg: any, x: number, y: number, text: string, maxChars: number = 0) {
    const fittedText =
        maxChars > 0 && text && text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
    svg.append('text').attr('x', x).attr('y', y).text(fittedText);
  }

  addCircle(
      svg: any,
      x: number,
      y: number,
      r: number,
      clazz: string,
      mouseOverFn?: () => void,
      mouseOutFn?: () => void,
  ) {
    svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', r)
        .attr('stroke-width', 1)
        .attr('class', clazz)
        .on('mouseover', mouseOverFn ? mouseOverFn : () => null)
        .on('mouseout', mouseOutFn ? mouseOutFn : () => null);
  }

  addLine(svg: any, x1: number, y1: number, x2: number, y2: number, clazz: string) {
    svg.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2).attr(
        'class', 'link ' + (clazz || ''));
  }
}

const START_X: number = 20;
const START_Y: number = 70;
const NODE_INCREMENT_X: number = 100;
const NODE_INCREMENT_Y: number = 60;
const NODE_RADIUS: number = 8;
const MAX_LABEL_CHARS = 14;

@Component({
  selector: 'ng-injected-services',
  providers: [GraphUtils],
  template: `
    <div #graphContainer style="max-width: 100%;"></div>
    <!-- <ng-dependency-viewer
      *ngFor="let dependency of dependencies; trackBy: dependencyPosition"
      [dependency]="dependency"
    >
    </ng-dependency-viewer> -->
  `,
  styles: [
    `
      ng-dependency-viewer {
        border-bottom: 1px solid color-mix(in srgb, currentColor, #bdbdbd 85%);
        display: block;
      }
    `,
  ],
})
export class InjectedServicesComponent {
  @ViewChild('graphContainer', {static: false}) graphContainer;
  @Input() controller: DirectivePropertyResolver;
  @Input() directive: string;

  private svg: any;

  constructor(private graphUtils: GraphUtils) {}

  ngOnInit() {
    setTimeout(() => this.displayTree(), 500);
  }

  private displayTree() {
    this.svg = d3.select(this.graphContainer.nativeElement)
                   .append('svg')
                   .attr('height', 500)
                   .attr('width', 1500);

    this.render();
  }

  private addNodeAndText(
      posX: number,
      posY: number,
      title: any,
      clazz: string,
      maxChars: number = 0,
      mouseOverFn: () => void,
      mouseOutFn: () => void,
  ) {
    console.log(posX, posY, title, clazz);
    this.graphUtils.addCircle(this.svg, posX, posY, NODE_RADIUS, clazz, mouseOverFn, mouseOutFn);
    this.graphUtils.addText(this.svg, posX - 6, posY - 15, title, maxChars);
  }

  private render() {
    // render legend
    this.graphUtils.addText(this.svg, 5, 15, 'Dependency Origin');
    this.graphUtils.addLine(this.svg, 33, 30, 83, 30, 'stroke-dependency origin dashed5');
    this.graphUtils.addText(this.svg, 150, 15, 'Self Provided');
    this.graphUtils.addCircle(
        this.svg,
        195,
        30,
        10,
        'fill-dependency stroke-dependency provided-here',
    );

    // render component node

    // render injectors

    // render arrows

    let posX, posY, x1, y1, x2, y2;

    this.addNodeAndText(
        50,
        100,
        this.directive,
        '',
        undefined,
        () => {},
        () => {},
    );

    const nodesToDraw = [];
    console.log(this.dependencies);
    this.dependencies.forEach((d, i) => {
      console.log(d, i);
      this.addNodeAndText(
          50,
          175 + 75 * i,
          d.token,
          '',
          undefined,
          () => {},
          () => {},
      );
    });
  }

  get dependencies(): SerializedInjectedService[] {
    return this.controller.directiveMetadata?.dependencies ?? [];
  }

  dependencyPosition(_index, dependency: SerializedInjectedService) {
    return dependency.position[0];
  }
}
