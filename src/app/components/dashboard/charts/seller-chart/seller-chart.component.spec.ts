import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerChartComponent } from './seller-chart.component';

describe('SellerChartComponent', () => {
  let component: SellerChartComponent;
  let fixture: ComponentFixture<SellerChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
