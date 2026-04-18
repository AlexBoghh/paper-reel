import { test, expect } from 'vitest';
import { buildFrameInner, buildContentByKey } from '../tools/lib/frame-builder.mjs';

test('builds inner HTML from a frame state', () => {
  const state = {
    '.hero .text': { translateX: -1000 },
    '.features .media[0]': { translateY: 30 }
  };
  const html = buildFrameInner(state, { width: 480, height: 300 });
  expect(html).toContain('left:-1000px'); // translateX baked into left
  expect(html).toContain('top:30px');     // translateY baked into top
});

test('substitutes real content text for staggered keys when contentByKey is supplied', () => {
  const state = {
    '.mwg_effect004 .paragraph .word[0]': { translateX: 0 },
    '.mwg_effect004 .paragraph .word[1]': { translateX: 0 },
    '.mwg_effect042 .media[0]': { translateY: 0 }
  };
  const contentByKey = {
    '.mwg_effect004 .paragraph .word[0]': 'Scroll',
    '.mwg_effect004 .paragraph .word[1]': 'tells',
    '.mwg_effect042 .media[0]': '01 Capture'
  };
  const html = buildFrameInner(state, { width: 480, height: 300 }, { contentByKey });
  expect(html).toContain('>Scroll<');
  expect(html).toContain('>tells<');
  expect(html).toContain('>01 Capture<');
  expect(html).not.toContain('>mwg_effect004 <'); // no fallback selector label
});

test('falls back to truncated selector label when key has no content entry', () => {
  const state = { '.mwg_effect004 .paragraph .word[0]': { translateX: 0 } };
  const html = buildFrameInner(state, { width: 480, height: 300 }, { contentByKey: {} });
  expect(html).toContain('>mwg_effect004 <'); // first 14 chars of stripped selector
});

test('buildContentByKey extracts headline words from a motion plan', () => {
  const plan = {
    timeline: [{
      recipeId: 'mwg_004',
      primitives: [{
        kind: 'translateX',
        selector: '.mwg_effect004 .paragraph .word',
        stagger: { count: 3, amount: 0.1 }
      }]
    }],
    content: { mwg_004: { headline: 'Hello brave world' } }
  };
  const map = buildContentByKey(plan);
  expect(map['.mwg_effect004 .paragraph .word[0]']).toBe('Hello');
  expect(map['.mwg_effect004 .paragraph .word[1]']).toBe('brave');
  expect(map['.mwg_effect004 .paragraph .word[2]']).toBe('world');
});

test('buildContentByKey extracts card labels from a motion plan', () => {
  const plan = {
    timeline: [{
      recipeId: 'mwg_042',
      primitives: [{
        kind: 'translateY',
        selector: '.mwg_effect042 .media',
        stagger: { count: 2, amount: 0.15 }
      }]
    }],
    content: {
      mwg_042: {
        cards: [{ label: '01 Capture' }, { label: '02 Compose' }]
      }
    }
  };
  const map = buildContentByKey(plan);
  expect(map['.mwg_effect042 .media[0]']).toBe('01 Capture');
  expect(map['.mwg_effect042 .media[1]']).toBe('02 Compose');
});

test('buildContentByKey skips primitives without stagger and recipes without content', () => {
  const plan = {
    timeline: [
      {
        recipeId: 'mwg_004',
        primitives: [{ kind: 'translateX', selector: '.foo' }] // no stagger
      },
      {
        recipeId: 'mwg_999',
        primitives: [{
          kind: 'translateY',
          selector: '.bar',
          stagger: { count: 2, amount: 0.1 }
        }]
      }
    ],
    content: { mwg_004: { headline: 'Hello world' } } // mwg_999 missing
  };
  const map = buildContentByKey(plan);
  expect(map).toEqual({});
});

test('buildContentByKey returns empty for missing/invalid plans', () => {
  expect(buildContentByKey(null)).toEqual({});
  expect(buildContentByKey({})).toEqual({});
  expect(buildContentByKey({ timeline: [] })).toEqual({});
});
