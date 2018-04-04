import { Transform } from 'stream';
import { AliasResolver } from './alias-resolver';

module.exports = (root = '.', aliases: any = {}) => {
  const aliasResolver = AliasResolver.create(root, aliases);

  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform: (chunk: any, encoding: string, cb: any) => {
      try {
        const content = aliasResolver.resolve(
          chunk.history[0],
          chunk.contents.toString('utf-8'),
        );

        chunk.contents = Buffer.from(content);

        cb(null, chunk);
      } catch (err) {
        cb(err);
      }
    },
  });
};
