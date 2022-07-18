import {Component} from '@angular/core';

import {Service1} from './services/service1';
import {Service2} from './services/service2';
import {Service3} from './services/service3';

@Component({
  selector: 'app-child-three',
  providers: [Service3],
  template: `
    <div class="child">
      <h4>App Child Three</h4>
      <p class="service">{{ service1Value }}</p>
      <p class="service">{{ service2Value }}</p>
      <p class="service">{{ service3Value }}</p>
    </div>
  `
})
export class ChildThreeComponent {
  service1Value: string;
  service2Value: string;
  service3Value: string;

  constructor(s1: Service1, s2: Service2, s3: Service3) {
    this.service1Value = s1.value;
    this.service2Value = s2.value;
    this.service3Value = s3.value;
  }
}
