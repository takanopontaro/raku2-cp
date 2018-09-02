import cpFile from 'cp-file';
import globby from 'globby';
import makeDir from 'make-dir';
import ndPath from 'path';

export type TProgressData = {
  completedItems: number;
  totalItems: number;
  completedSize: number;
};

export type TProgressCallback = (data: TProgressData) => void;

function getPath(path: string, dest: string) {
  const { dir, base } = ndPath.parse(path);
  return ndPath.join(dest, dir, base);
}

export default async (src: string[], dest: string, cb?: TProgressCallback) => {
  let paths = await globby(src, {
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

  const files = paths.map(path =>
    cpFile(path, getPath(path, dest)).on('progress', handleProgress)
  );

  const dirs = emptyDirs.map(path => makeDir(getPath(path, dest)));

  await Promise.all<void | string>([...files, ...dirs]);

  if (totalEmptyDirs > 0 && cb) {
    cb({
      completedItems: completedItems + totalEmptyDirs,
      totalItems,
      completedSize
    });
  }
};
