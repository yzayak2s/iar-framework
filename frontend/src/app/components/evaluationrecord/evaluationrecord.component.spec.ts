import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EvaluationrecordComponent} from './evaluationrecord.component';

describe('EvaluationrecordComponent', () => {
    let component: EvaluationrecordComponent;
    let fixture: ComponentFixture<EvaluationrecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EvaluationrecordComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EvaluationrecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
