import {Component} from '@angular/core';

import {Service1} from './services/service1';
import {Service2} from './services/service2';
import {Service3} from './services/service3';
import {Service4} from './services/service4';

@Component({
  selector: 'app-child-four',
  providers: [Service2],
  template: `
    <div class="child">
      <h4>App Child Four</h4>
      <p class="service">{{ service1Value }}</p>
      <p class="service">{{ service2Value }}</p>
      <p class="service">{{ service3Value }}</p>
      <p class="service">{{ service4Value }}</p>
      <app-child-five></app-child-five>
      <hr />
      <app-child-six></app-child-six>
    </div>
  `
})
export class ChildFourComponent {
  service1Value: string;
  service2Value: string;
  service3Value: string;
  service4Value: string;

  constructor(s1: Service1, s2: Service2, s3: Service3, s4: Service4) {
    this.service1Value = s1.value;
    this.service2Value = s2.value;
    this.service3Value = s3.value;
    this.service4Value = s4.value;
  }
}
