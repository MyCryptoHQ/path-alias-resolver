# myc-path-alias-resolver

Resolve aliases in ts files. Useful for when you want to publish a package with the `typings` file in `package.json`, as a project consuming your package will not respect your package's baseurl and path mappings. This will convert all path mappings to relative paths.

# Installation

`npm i -D myc-path-alias-resolver`

# Caveats

Due to the nature of the regex used to resolve multi-line imports, it currently has the limitation of only working with `prettier` and the follow configuration file:

```json
{
  "printWidth": 80,
  "singleQuote": true,
  "useTabs": false,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

# How to use

Let's say you have a project that has its source files in `<rootDir>/src`, and you want to ignore any `*.spec.ts` or `*.test.ts` files.

## Example tsconfig.json

```json
{
  "compilerOptions": {
    "outDir": "dist",
    "target": "es2017",
    "sourceMap": true,
    "module": "es2015",
    "baseUrl": "./",
    "lib": ["es2017", "dom"],
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@src*": ["src*"],
      "@test*": ["__test__*"]
    },
    "moduleResolution": "node",
    "noEmitOnError": false,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitThis": true,
    "pretty": true
  },
  "include": ["./src/", "./__test__/"]
}
```

Example File Tree

```
├── coverage
├── dist
├── docs
├── gulpfile.js
├── node_modules
├── package.json
├── package-lock.json
├── readme.md
├── rollup.config.ts
├── src
├── __test__
├── tsconfig-build.json
├── tsconfig.json
└── tslint.json
```

Corresponding script `gulpfile.js` to use with above setup

```js
const gulp = require('gulp');
const alias = require('path-alias-resolver/gulp');

gulp.task('default', () => {
  return gulp
    .src(['./src/**/*.ts', '!./src/**/*.spec.ts', '!./src/**/*.test.ts'])
    .pipe(alias('.', { '@src': './src' }))
    .pipe(gulp.dest('./dist/lib'));
});
```

## Breaking gulpfile.js down

```js 
['./src/**/*.ts', '!./src/**/*.spec.ts', '!./src/**/*.test.ts']
```

Ignore any `*.spec.ts` or `*.test.ts` files while including all other `.ts` files in `src`

```js 
alias('.', { '@src': './src' })
```

The first parameter corresponds to your `baseUrl` setting in `tsconfig.json`.

The second parameter is an object of mappings from the `paths` key in `tsconfig.json` to its value.
```js 
gulp.dest('./dist/lib')
```

Pass the resulting transformed files to `./dist/list`
