import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ChildFiveComponent} from './child-five.component';
import {ChildFourComponent} from './child-four.component';
import {ChildOneComponent} from './child-one.component';
import {ChildSixComponent} from './child-six.component';
import {ChildThreeComponent} from './child-three.component';
import {ChildTwoComponent} from './child-two.component';
import {DITreeComponent} from './di-tree.component';
import {SampleOneComponent} from './sample-one.component';
import {Service1} from './services/service1';
import {Service2} from './services/service2';
import {Service3} from './services/service3';
import {Service4} from './services/service4';

const routes: Routes = [{path: '', component: SampleOneComponent}];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [
    SampleOneComponent, DITreeComponent, ChildOneComponent, ChildTwoComponent, ChildThreeComponent,
    ChildFourComponent, ChildFiveComponent, ChildSixComponent
  ],
  exports: [SampleOneComponent],
  providers: [Service1, Service2, Service3, Service4]
})
export class SampleOneModule {
  constructor() {
    (window as any).SampleOneModule = SampleOneModule;
  }
}
