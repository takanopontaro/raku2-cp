declare function Raku2Cp(
  src: string | string[],
  dest: string,
  options?: Raku2Cp.Options | null,
  cb?: Raku2Cp.ProgressCallback
): Promise<Raku2Cp.ProgressData>;

declare namespace Raku2Cp {
  type Options = {
    cwd?: string;
    [key: string]: any;
  };
  type ProgressData = {
    completedItems: number;
    totalItems: number;
    completedSize: number;
  };
  type ProgressCallback = (data: ProgressData) => void;
}

export = Raku2Cp;
