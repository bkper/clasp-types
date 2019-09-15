[BkperApp]: https://github.com/bkper/bkper-app
[API Extractor]: https://api-extractor.com/
[grant]: https://github.com/grant/google-apps-script-dts
[motemen]: https://github.com/motemen/dts-google-apps-script
[mtgto]: https://github.com/mtgto/dts-google-apps-script-advanced
[Sheets]: https://chrome.google.com/webstore/detail/bkper-sheets/cgjnibofbefehaeeadeomaffglgfpkfl?hl=en
[Forms]: https://chrome.google.com/webstore/detail/bkper-forms/hfhnjepoehncolldclpdddgccibbpeda
[HTML Service]: https://developers.google.com/apps-script/guides/html/communication
[Libraries]: https://developers.google.com/apps-script/guides/libraries
[library]: https://developers.google.com/apps-script/guides/libraries
[Client-side API]: https://developers.google.com/apps-script/guides/html/reference/run
[clasp]: https://github.com/google/clasp
[TypeScript]: https://github.com/google/clasp/blob/master/docs/typescript.md
[inline-source-cli]: https://www.npmjs.com/package/inline-source-cli
[glob-exec]: https://www.npmjs.com/package/glob-exec
[DefinitelyTyped]: http://definitelytyped.org/


# clasp-types

A [TypeScript] definitions generator for [clasp] projects to get **autocomplete** and **type checking** for your Google Apps Script OO [Libraries] and [Client-side API].

Library:
![library-autocomplete](https://raw.githubusercontent.com/maelcaldas/clasp-types/master/imgs/library-autocomplete.png)

Client-side API:
![client-side-api-autocomplete](https://raw.githubusercontent.com/maelcaldas/clasp-types/master/imgs/client-side-api-autocomplete.png)

It works like the [API Extractor], reading ```@public``` comment annotations on any global function, class, interface or enum you want to expose, and generating d.ts files consistently.

> Note: clasp-types is intended for generating d.ts from Apps Script code already written in TypeScript. For generating Built-in and Advanced Apps Script service see https://github.com/grant/google-apps-script-dts

## Install

## Command params



## Library setup


### 1) Add your library **namespace** and **name** to the ```.clasp.json```:
```
{
  "scriptId": "1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF",
  "rootDir": "./src",
  "library": {
    "namespace": "GoogleAppsScript",
    "name": "OAuth2"
  }
}
```

### 2) Add ```@public``` comment annotation to the code you want to expose

```ts
/**
 * Create a service
 * 
 * @public
 */
function createService(serviceName: string) {
  return new Service(serviceName);
}


/**
 * The OAuth service
 * 
 * @public
 */
class Service {
  name: string;
  params_: any;
  constructor(name: string) {
    this.name = name;;
  }

  public getName() {
    return this.name;
  }
  

  /**
   * Sets an additional parameter to use when constructing the authorization URL.
   */
  public setParam(name: string, value: string): Service {
    this.params_[name] = value;
    return this;
  };

}
```

### 3) Run ```clasp-types``` to generate a **npm package** with the index.d.ts:

```ts
declare namespace gsuitedevs {

    /**
     * The main entry point to interact with OAuth2
     *
     * Script ID: **1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF**
     */
    export interface OAuth2 {

        /**
         * Create a service
         */
        createService(serviceName: string): Service;

    }

    /**
     * The OAuth service
     */
    export interface Service {

        getName(): string;

        /**
         * Sets an additional parameter to use when constructing the authorization URL.
         */
        setParam(name: string, value: string): Service;

    }

}

declare var OAuth2: gsuitedevs.OAuth2;
```

> Notes: 
> - Even on the classes annotaded with ```@public```, methods inside then should also be marked as ```public``` in order to be exposed. **Private** or **protected** methods will **not** be exposed. 
> - Interfaces and Enumerations with ```@public``` annotation will have all members exposed by default.

A **npm ready to publish package** is generated in the output folder, with data with some setup instructions on **README.md**, so you can easily share your library types.

> Suggestion: You may add a [dist-tag](https://docs.npmjs.com/cli/dist-tag) to your types package distribution with the same [version](https://developers.google.com/apps-script/guides/versions) of the script, say, ```v23```, so users can link the types version with script version, and use batch that matches.

### Dependencies

If your package expose a transitive dependency on function params or return, such as GoogleAppsScript.HTML.HtmlOutput from @types/google-apps-script, add it to **"dependencies"** section of your package.json, instead of "devDependencies":
```json
  "dependencies": {
    "@types/google-apps-script": "^0.0.59"
  }
```
So, clasp-types will correctly setup the reference on index.d.ts:

 ```ts
 /// <reference types="google-apps-script" />
 ```
And on the resulted package.json:
```json
  "dependencies": {
    "@types/google-apps-script": "*"
  },
```



## Client-side API setup

### 1) Add ```@public``` comment annotation to the code you want to expose to client
```ts
/**
 * Execute a sum on server side, from client side
 */
function sumOnServer(a: number, b: number): number {
  return a + b;
}
```

### 2) Run ```clasp-types --client``` to generate the index.d.ts:

```ts
declare namespace google {

    namespace script {

        export interface Runner {

            withSuccessHandler(handler: Function): Runner;

            withFailureHandler(handler: (error: Error) => void): Runner;

            withUserObject(object: any): Runner;

            createService(serviceName: string): void //Service;

            sumOnServer(a: number, b: number): void //number;
            ...

        }

        export var run: Runner;

    }
    ...

}
```

### TypeScript on Client-side

To develop with [TypeScript] on client, you should work with separated ts files and inline the ```js``` files resulted from TS compilation, as well as the ```css``` in the same page, in order to the resulting html template be processed by the [HTML Service].

To perform the inlining a great tool is the [inline-source-cli], so you can add a ```inline``` tag to your ```js``` and ```css``` references:

```html
<head>
  ...
  <link inline href="page-style.css" rel="stylesheet">
</head>
<body>
  ...
  <script inline src="page-activity.js"></script>
  <script inline src="page-view.js"></script>
</body>
```
And then use a tool such as [glob-exec] to inline all your sources in one single script line:
```sh
glob-exec --foreach './build/**/*.html' --  'cat {{file}} | inline-source --root build > dist/{{file.name}}{{file.ext}}'
```

## Background

The clasp-types was originally created as a foundation for the [BkperApp] library and it's [Sheets] and [Forms] Add-ons, with inspirations on the [API Extractor] and previous work from [grant], [motemen] and [mtgto] - thank you guys :-)

[Libraries] are a great way to share code between scripts, but, once published and others start using it, it requires some level of care like any public API, so, applying some [API Extractor] concepts and principles help to keep the quality of the Library and avoid accidental breaks.

[DefinitelyTyped] is an amazing initiative and works really well for thirdy-party libraries written in js, as well as for the Google Apps Script built-in and advanced services, although, as its recommended in the [official declaration publishing documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html), for libraries written in TypeScript, build in its onw npm package is favored, and give some adtantages:

- Speed on release
- Dist-tag for mapping script versions
- Deployment automation

The down side is that it requires one aditional aditional types configuration step, so, we automatically added it on README for scoped packages to setup the ```typeRoots``` and non scoped packages to setup the ```types```, like the following example: 

https://www.npmjs.com/package/@bkper/bkper-app-types
