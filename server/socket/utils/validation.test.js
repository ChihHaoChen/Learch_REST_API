const expect = require('expect');

// import is isRealString
const { isRealString } = require('./validation');

// isRealString
describe('isRealString', () => {
  // should reject non-string values
  it('Should reject non-string values', () => {
    let stringInput = 11;
    let isString = isRealString(stringInput);
    expect(isString).toBeFalsy();
  });
  // should reject string with only spaces
  it('Should reject string with only spaces', () => {
    let stringInput = '      ';
    let isString = isRealString(stringInput);
    expect(isString).toBeFalsy();
  });
  //should allow string with non-space characters.
  it('Should allow string with non-space characters', () => {
    let stringInput = '   This is a test string  ';
    let isString = isRealString(stringInput);
    expect(isString).toBeTruthy();
  });
});
