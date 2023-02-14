import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BonusesOfSalesmanComponent} from './bonuses-of-salesman.component';

describe('BonusesOfSalesmanComponent', () => {
    let component: BonusesOfSalesmanComponent;
    let fixture: ComponentFixture<BonusesOfSalesmanComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BonusesOfSalesmanComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BonusesOfSalesmanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
