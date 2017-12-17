export const toPosixPath = (modulePath: string) => {
  return modulePath.replace(/\\/g, '/');
};
