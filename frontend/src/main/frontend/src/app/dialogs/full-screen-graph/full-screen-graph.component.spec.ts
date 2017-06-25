import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenGraphComponent } from './full-screen-graph.component';

describe('FullScreenGraphComponent', () => {
  let component: FullScreenGraphComponent;
  let fixture: ComponentFixture<FullScreenGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullScreenGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
