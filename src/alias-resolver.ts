const { resolvePath } = require('babel-plugin-module-resolver');
import { toPosixPath } from './utils';

export class AliasResolver {
  public static create(root: string, aliases: any = {}): AliasResolver {
    return new AliasResolver(root, aliases);
  }
  private readonly root: string;
  private readonly aliases: any = {};
  private readonly singleLineRule = /(?:require|import)[^'"]*(?:'|")([^'"]*)(?:'|")/gi;

  private constructor(root: string, aliases: any = {}) {
    this.root = root;
    this.aliases = aliases;
  }

  public resolve(filePath: string, content: string): string {
    let lines = content.split('\n');
    lines = this.joinImports(lines);
    lines = lines.map(line => this.parseLine(line, filePath));
    return lines.join('\n');
  }

  private readonly parseLine = (line: string, filePath: string): string => {
    const transformedLine = line.replace(
      this.singleLineRule,
      (substr: string, moduleId: string): string => {
        const relativeModule = resolvePath(moduleId, filePath, {
          root: this.root,
          alias: this.aliases,
        });

        if (!relativeModule) {
          return substr;
        }

        return substr.replace(moduleId, relativeModule);
      },
    );

    return transformedLine;
  };

  private readonly joinImports = (lines: string[]) => {
    const returnArr = [];
    let foundMultiLineImport = false;

    for (const line of lines) {
      const multiLineRule = { b: /^import {/, e: /^} from '.*';$/ };
      if (foundMultiLineImport) {
        returnArr[returnArr.length - 1] += line;
      } else {
        returnArr.push(line);
      }
      if (line.match(multiLineRule.e)) {
        foundMultiLineImport = false;
        returnArr[returnArr.length - 1].replace('\\', '');
      }

      if (!line.match(this.singleLineRule) && line.match(multiLineRule.b)) {
        foundMultiLineImport = true;
      }
    }
    return returnArr;
  };
}
