import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordFoldersComponent } from './record-folders.component';

describe('RecordFoldersComponent', () => {
  let component: RecordFoldersComponent;
  let fixture: ComponentFixture<RecordFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordFoldersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
