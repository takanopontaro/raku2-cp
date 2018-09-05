import cpFile from 'cp-file';
import globby from 'globby';
import makeDir from 'make-dir';
import ndPath from 'path';

import { Options, ProgressCallback, ProgressData } from './index.d';

module.exports = async (
  src: string | string[],
  dest: string,
  options?: Options | null,
  cb?: ProgressCallback
) => {
  let paths = await globby(src, {
    ...options,
    markDirectories: true,
    onlyFiles: false
  });

  const emptyDirs: string[] = [];

  paths = paths.sort().filter((path, i) => {
    if (!path.endsWith(ndPath.sep)) return true;
    const next = paths[i + 1];
    if (!next || next.indexOf(path) !== 0) emptyDirs.push(path);
    return false;
  });

  const totalEmptyDirs = emptyDirs.length;
  const totalItems = paths.length + totalEmptyDirs;

  let completedItems = 0;
  let completedSize = 0;

  const handleProgress = (data: cpFile.ProgressData) => {
    if (data.percent === 1) completedItems += 1;
    if (cb) {
      cb({
        completedItems,
        totalItems,
        completedSize: completedSize + data.written
      });
    }
    if (data.percent === 1) completedSize += data.size;
  };

  const resolve = (path: string) =>
    options && options.cwd ? ndPath.resolve(options.cwd, path) : path;

  const getDestPath = (path: string, dest: string) => {
    const { dir, base } = ndPath.parse(resolve(path));
    return ndPath.join(resolve(dest), dir, base);
  };

  const files = paths.map(path =>
    cpFile(resolve(path), getDestPath(path, dest)).on(
      'progress',
      handleProgress
    )
  );

  const dirs = emptyDirs.map(path => makeDir(getDestPath(path, dest)));

  await Promise.all<void | string>([...files, ...dirs]);

  const data: ProgressData = {
    completedItems: completedItems + totalEmptyDirs,
    totalItems,
    completedSize
  };

  if (totalEmptyDirs > 0 && cb) cb(data);

  return data;
};
