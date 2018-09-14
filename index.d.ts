declare function Raku2Cp(
  src: string | string[],
  dest: string,
  options: Raku2Cp.Options,
  cb: Raku2Cp.ProgressCallback
): Promise<Raku2Cp.ProgressData>;

declare function Raku2Cp(
  src: string | string[],
  dest: string,
  options: Raku2Cp.Options
): Promise<Raku2Cp.ProgressData>;

declare function Raku2Cp(
  src: string | string[],
  dest: string,
  cb: Raku2Cp.ProgressCallback
): Promise<Raku2Cp.ProgressData>;

declare function Raku2Cp(
  src: string | string[],
  dest: string
): Promise<Raku2Cp.ProgressData>;

declare namespace Raku2Cp {
  type Options = {
    cwd?: string;
    overwrite?: boolean;
  };

  type ProgressData = {
    completedItems: number;
    totalItems: number;
    completedSize: number;
  };

  type ProgressCallback = (data: ProgressData) => void;
}

export = Raku2Cp;
