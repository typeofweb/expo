import * as path from 'path';

import { getPngInfo, getMimeType } from '../Image';

describe(getMimeType, () => {
  (
    [
      ['https://example.com/image.png?query=1', 'image/png'],
      ['../foo.jpg', 'image/jpeg'],
      ['more.ios.jpeg', 'image/jpeg'],
      // Invalid
      ['more.ios.jpeg?foo', null],
      // Unsupported
      ['more.ios.avif', null],
    ] as const
  ).forEach(([url, mimeType]) => {
    it(`returns mime type for URL: ${url}`, () => {
      expect(getMimeType(url)).toBe(mimeType);
    });
  });
});

describe('Image #getPngInfo', () => {
  it('returns false if the file does not exist', async () => {
    try {
      await getPngInfo('random/path');
    } catch (e) {
      expect(e.message).toEqual("ENOENT: no such file or directory, open 'random/path'");
    }
  });

  it('returns false if the file is a jpg', async () => {
    try {
      await getPngInfo(path.join(__dirname, '/assets/icon.jpg'));
    } catch (e) {
      expect(e.message).toEqual('Invalid file signature');
    }
  });

  it('returns false if the file is a svg', async () => {
    try {
      await getPngInfo(path.join(__dirname, '/assets/icon.svg'));
    } catch (e) {
      expect(e.message).toEqual('Invalid file signature');
    }
  });

  it('returns false if the file is a pdf', async () => {
    try {
      await getPngInfo(path.join(__dirname, '/assets/icon.pdf'));
    } catch (e) {
      expect(e.message).toEqual('Invalid file signature');
    }
  });

  it('returns false if the file is a jpg with the file exstention chaneg to png', async () => {
    try {
      await getPngInfo(path.join(__dirname, '/assets/fakePng.png'));
    } catch (e) {
      expect(e.message).toEqual('Invalid file signature');
    }
  });

  it('returns true if the file is a png', async () => {
    expect(await getPngInfo(path.join(__dirname, '/assets/icon.png'))).toHaveProperty('width', 100);
  });
});
