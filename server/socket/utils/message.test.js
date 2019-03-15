const expect = require('expect');

let { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('Should generate correct message object', () => {
    let from = 'Jen';
    let text = 'Some message';
    let message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number');

    expect(message).toMatchObject({
      from,
      text
    });
    // store res in variable
    // assert from match
    // assert text match
    // assert createdAt is number
  });
});
