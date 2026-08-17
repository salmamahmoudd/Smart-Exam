import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultDetails } from './result-details';

describe('ResultDetails', () => {
  let component: ResultDetails;
  let fixture: ComponentFixture<ResultDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
