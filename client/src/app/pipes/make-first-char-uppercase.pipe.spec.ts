import { MakeFirstCharUppercasePipe } from './make-first-char-uppercase.pipe';

describe('MakeFirstCharUppercasePipe', () => {
  it('create an instance', () => {
    const pipe = new MakeFirstCharUppercasePipe();
    expect(pipe).toBeTruthy();
  });
});
