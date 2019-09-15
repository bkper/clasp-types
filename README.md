[BkperApp]: https://github.com/bkper/bkper-app
[API Extractor]: https://api-extractor.com/
[grant]: https://github.com/grant/google-apps-script-dts
[motemen]: https://github.com/motemen/dts-google-apps-script
[mtgto]: https://github.com/mtgto/dts-google-apps-script-advanced
[Sheets]: https://chrome.google.com/webstore/detail/bkper-sheets/cgjnibofbefehaeeadeomaffglgfpkfl?hl=en
[Forms]: https://chrome.google.com/webstore/detail/bkper-forms/hfhnjepoehncolldclpdddgccibbpeda
[HTML Service]: https://developers.google.com/apps-script/reference/html/


# clasp-types

A [Typescript](https://www.typescriptlang.org/) definitions generator for [clasp](https://github.com/google/clasp) projects, so you can get **autocomplete** and **type checking** for your [Google Apps Script](https://developers.google.com/apps-script/) code.

It works by adding the ```@public``` comment annotation to any global function, class, interface or enum you want to expose, so

### the source code:

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
  constructor(name: string) {
    this.name = name;;
  }

  /**
   * Get service name
   */
  public getName() {
    return this.name;
  }
}

```
### ...with the **libray**  definition added to ```.clasp.json``` file:
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

### ...will generate the d.ts:

```ts
declare namespace GoogleAppsScript {

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

        /**
         * Get service name
         */
        getName(): string;

    }

}

declare var OAuth2: GoogleAppsScript.OAuth2;
```

It also supports generation of **Client-side API** to be used with [HTML Service], giving autocomplete and type checking for params of your exposed server functions, on client, so

## the same source code, ```--client``` option, will generate the d.ts:

```ts
declare namespace google {

    namespace script {

        export interface Runner {

            withSuccessHandler(handler: Function): Runner;

            withFailureHandler(handler: (error: Error) => void): Runner;

            withUserObject(object: any): Runner;

            createService(serviceName: string): void //Service;

        }

        /**
         * The OAuth service
         */
        export interface Service {

            /**
             * Get service name
             */
            getName(): string;

        }

        export var run: Runner;

    }

}

```


The clasp-types was originally created as a foundation for the [BkperApp] library and it's [Sheets] and [Forms] Add-ons, with inspirations on the [API Extractor] and previous work from [grant], [motemen] and [mtgto] - thank you guys :-)


# Server Library

# Client-side API

# Background