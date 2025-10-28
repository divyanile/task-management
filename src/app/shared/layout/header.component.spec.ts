import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HeaderComponent] }).compileComponents();
  });

  it('renders brand', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Task Management');
  });
});
