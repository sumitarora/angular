import {Component, forwardRef, Inject} from '@angular/core';

import {Service1, Service2, Service3, Service4} from './di.services';

@Component({
  selector: 'di-component',
  template: `
    <div>
      <h1>DI Component</h1>
      <component1></component1>
      <component2></component2>
    </div>
  `,
})
export class DIComponent {
}

@Component({
  selector: 'component1',
  template: `
    <h3>Component One</h3>
    <p>{{ service3Value }}</p>
    <div class="pl4">
      <component3></component3>
      <component4></component4>
    </div>
  `,
})
export class Component1 {
  service3Value: string;

  constructor(private s3: Service3) {
    this.service3Value = this.s3.value;
  }
}

@Component({
  selector: 'component2',
  providers: [Service1],
  template: `
    <h3>Component Two - provides Service1</h3>
    <p>{{ service1Value }}</p>
    <p>{{ service2Value }}</p>
    <div class="pl4">
      <component5></component5>
      <component6></component6>
    </div>
  `,
})
export class Component2 {
  service1Value: string;
  service2Value: string;

  constructor(
      private s1: Service1,
      private s2: Service2,
  ) {
    this.service1Value = s1.value;
    this.service2Value = s2.value;
  }
}

@Component({
  selector: 'component3',
  template: `
    <h3>Component Three</h3>
    <p>{{ service1Value }}</p>
    <p>{{ service3Value }}</p>
  `,
})
export class Component3 {
  service1Value: string;
  service3Value: string;

  constructor(
      private s1: Service1,
      @Inject(forwardRef(() => Service3)) private s3: Service3,
  ) {
    this.service1Value = this.s1.value;
    this.service3Value = this.s3.value;
  }
}

@Component({
  selector: 'component4',
  template: `
    <h3>Component Four</h3>
    <p>{{ service1Value }}</p>
    <p>{{ service4Value }}</p>
  `,
})
export class Component4 {
  service1Value: string;
  service4Value: string;

  constructor(
      private s1: Service1,
      @Inject(Service4) private s4: Service4,
  ) {
    this.service1Value = this.s1.value;
    this.service4Value = this.s4.value;
  }
}

@Component({
  selector: 'component5',
  providers: [Service3, Service4],
  template: `
    <h3>Component Five - provides Service3, Service4</h3>
    <p>{{ service3Value }}</p>
    <p>{{ service4Value }}</p>
  `,
})
export class Component5 {
  service3Value: string;
  service4Value: string;

  constructor(
      private s3: Service3,
      private s4: Service4,
  ) {
    this.service3Value = s3.value;
    this.service4Value = s4.value;
  }
}

@Component({
  selector: 'component6',
  providers: [Service2],
  template: `
    <h3>Component Six - provides Service2</h3>
    <p>{{ service1Value }}</p>
    <p>{{ service2Value }}</p>
  `,
})
export class Component6 {
  service1Value: string;
  service2Value: string;

  constructor(
      private s1: Service1,
      private s2: Service2,
  ) {
    this.service1Value = this.s1.value;
    this.service2Value = this.s2.value;
  }
}

export const DI_TREE_COMPONENTS = [
  Component1,
  Component2,
  Component3,
  Component4,
  Component5,
  Component6,
];
