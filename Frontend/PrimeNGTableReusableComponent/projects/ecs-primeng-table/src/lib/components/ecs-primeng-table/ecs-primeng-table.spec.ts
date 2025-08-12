import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECSPrimengTable } from './ecs-primeng-table';

describe('ECSPrimengTable', () => {
  let component: ECSPrimengTable;
  let fixture: ComponentFixture<ECSPrimengTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ECSPrimengTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ECSPrimengTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
