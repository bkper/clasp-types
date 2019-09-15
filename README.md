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
[Typescript]: https://github.com/google/clasp/blob/master/docs/typescript.md

# clasp-types

A [Typescript] definitions generator for [clasp] projects to get **autocomplete** and **type checking** for your Google Apps Script OO [Libraries]:

![library-autocomplete](https://raw.githubusercontent.com/maelcaldas/clasp-types/master/imgs/library-autocomplete.png)

Also for generation of [Client-side API] to be used with [HTML Service], giving autocomplete and type checking for params of your exposed server functions, on client:

![client-side-api-autocomplete](https://raw.githubusercontent.com/maelcaldas/clasp-types/master/imgs/client-side-api-autocomplete.png)


It works like [API Extractor], reading ```@public``` comment annotations on any global function, class, interface or enum you want to expose, and generating d.ts files consistently.

## Install

## [Libraries]

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

> Notes: 
> - Even the classes annotaded with ```@public```, methods inside then should also be marked as ```public``` in order to be exposed. **Private** or **protected** methods will **not** be exposed. 
> - Interfaces and Enumerations with ```@public``` annotation will have all members exposed by default.



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