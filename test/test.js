const assert = require('chai').assert;
const del = require('del');
const fs = require('fs');
const makeDir = require('make-dir');
const path = require('path');

const cp = require('..');

process.chdir(__dirname);

/*
src
|-- 1.txt
`-- a
    |-- 2.txt
    |-- b
    |   `-- 3.txt
    `-- empty-dir
*/
before(async () => {
  await makeDir('src/a/b');
  await makeDir('src/a/empty-dir');
  fs.writeFileSync('src/1.txt', '');
  fs.writeFileSync('src/a/2.txt', '');
  fs.writeFileSync('src/a/b/3.txt', '');
});

after(async () => {
  await del(['src']);
});

afterEach(async () => {
  await del('dest');
});

describe('File(s)', () => {
  it('relative to relative', async () => {
    await cp('src/1.txt', 'dest');
    assert.equal(true, fs.existsSync('dest/src/1.txt'));
  });
});

describe('File(s)', () => {
  it('relative to relative (2)', async () => {
    process.chdir('src/a');
    await cp('../1.txt', '../../dest');
    process.chdir(__dirname);
    assert.equal(true, fs.existsSync('dest/1.txt'));
  });
});

describe('File(s)', () => {
  it('absolute to relative', async () => {
    await cp(path.resolve('src/1.txt'), 'dest');
    assert.equal(true, fs.existsSync('dest/src/1.txt'));
  });
});

describe('File(s)', () => {
  it('relative to absolute', async () => {
    await cp('src/1.txt', path.resolve('dest'));
    assert.equal(true, fs.existsSync('dest/src/1.txt'));
  });
});

describe('File(s)', () => {
  it('absolute to absolute', async () => {
    await cp(path.resolve('src/1.txt'), path.resolve('dest'));
    assert.equal(true, fs.existsSync('dest/src/1.txt'));
  });
});

describe('Directory(s)', () => {
  it('relative to relative', async () => {
    await cp('src/a', 'dest');
    assert.equal(true, fs.existsSync('dest/src/a/b'));
    assert.equal(true, fs.existsSync('dest/src/a/empty-dir'));
    assert.equal(true, fs.existsSync('dest/src/a/2.txt'));
    assert.equal(true, fs.existsSync('dest/src/a/b/3.txt'));
  });
});
