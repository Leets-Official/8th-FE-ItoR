import assert from 'node:assert/strict';
import { test } from 'node:test';

import { optimizeImage } from '../src/shared/utils/optimizeImage.ts';

test('JPEG optimization preserves proportions, file metadata and safe fallbacks', async (t) => {
  let dimensions = [4000, 3000];
  let encoded = new Blob(['small'], { type: 'image/jpeg' });
  let decodeError = false;
  let hasContext = true;
  let canvas;

  globalThis.Image = class {
    naturalWidth = dimensions[0];
    naturalHeight = dimensions[1];
    async decode() {
      if (decodeError) throw new Error('Invalid image');
    }
  };
  globalThis.document = {
    createElement() {
      canvas = {
        getContext: () => (hasContext ? { drawImage() {} } : null),
        toBlob: (resolve) => resolve(encoded),
      };
      return canvas;
    },
  };
  t.after(() => {
    delete globalThis.Image;
    delete globalThis.document;
  });
  const revoke = t.mock.method(URL, 'revokeObjectURL');
  const original = new File(['x'.repeat(100)], 'photo.jpg', {
    type: 'image/jpeg',
    lastModified: 123,
  });

  const optimized = await optimizeImage(original, 1600);
  assert.deepEqual([canvas.width, canvas.height], [1600, 1200]);
  assert.ok(optimized.size < original.size);
  assert.equal(optimized.name, original.name);
  assert.equal(optimized.type, original.type);
  assert.equal(optimized.lastModified, original.lastModified);

  dimensions = [3000, 4000];
  await optimizeImage(original, 256);
  assert.deepEqual([canvas.width, canvas.height], [192, 256]);

  dimensions = [80, 40];
  await optimizeImage(original, 1600);
  assert.deepEqual([canvas.width, canvas.height], [80, 40]);

  for (const type of ['image/png', 'image/gif', 'image/webp', 'image/svg+xml']) {
    const file = new File(['original'], 'image', { type });
    assert.equal(await optimizeImage(file, 256), file);
  }

  encoded = new Blob(['x'.repeat(100)], { type: 'image/jpeg' });
  assert.equal(await optimizeImage(original, 256), original);
  encoded = new Blob(['small'], { type: 'image/png' });
  assert.equal(await optimizeImage(original, 256), original);
  encoded = null;
  assert.equal(await optimizeImage(original, 256), original);
  hasContext = false;
  assert.equal(await optimizeImage(original, 256), original);

  decodeError = true;
  await assert.rejects(optimizeImage(original, 256), /Invalid image/);
  assert.equal(revoke.mock.callCount(), 8, 'release object URLs on success, fallback and failure');
});
