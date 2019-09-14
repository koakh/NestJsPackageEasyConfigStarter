# Notes

## About

This simple minimal POC project, of how to use **external packages** in a **nestjs package** with a module and service exposed like `@nestjs/jwt` in a sub module `json-web-token`...confusing

I want to create a package, that have sub-modules, one of then use a external module and service, like `@nestjs/jwt`, but its is not easy peasy for me, I achieve that with the help of our friends `@jmcdo29` and `@Y Prospect` from nestjs discord channel

this is based on `@jmcdo29` package <https://github.com/rubiin/nestjs-easyconfig>, just add a submodule and and external module `@nestjs/jwt`

thanks guys :)

## Some Links

- [Publishing NestJS Packages with npm](https://dev.to/nestjs/publishing-nestjs-packages-with-npm-21fm)
- [Dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules)

## Bootstrap Consumer App

`nestjs-easyconfig`

```shell
# boostrap app
$ nest new nestjs-easyconfig-consumer
$ cd nestjs-easyconfig-consumer/
$ npm install ../nestjs-easyconfig
```

add local package

```json
"dependencies": {
  "nestjs-easyconfig": "file:../nestjs-easyconfig",
},
```

consume `EasyconfigModule` in consumer app

```typescript
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [
    EasyconfigModule.register({ path: './config/.env' }),
  ],
```

```shell
# create env file
$ mkdir config
$ code ./config/.env
```

with

```
ENV_VAR1=FOO
ENV_VAR2=BAR
```

done!

now consume `EasyconfigModule` in `src/app.service.ts`

```shell
import { Injectable } from '@nestjs/common';
import { EasyconfigService } from 'nestjs-easyconfig';

@Injectable()
export class AppService {
  constructor(
    private readonly easyconfigService: EasyconfigService,
    ) { }

  getHello(): string {
    const envVar = this.easyconfigService.get('ENV_VAR1');
    return `Hello World! ${envVar}`;
  }
}
```

run it and got to <http://localhost:3000>

Done, we see **Hello World! FOO**

## Now the hard Part, Use external package inside EasyconfigModule submodule `json-web-token`

start change `nestjs-easyconfig` package from ourv guy `@jmcdo29`

```shell
# code or open a new code
$ cd ../nestjs-easyconfig
# deps
$ npm i @nestjs/jwt
```

create module and service

```shell
# generate module and service
$ nest g module jsonWebToken
$ nest g service jsonWebToken
```

start to change `jsonWebTokenModule`

`src/json-web-token/json-web-token.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // Y Prospect TIP :), without that it never works, respect Y Prospect
  imports: [
    JwtModule.register({
      secret: 'just a stupid password',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
})

export class JsonWebTokenModule { }
```

`src/json-web-token/json-web-token.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JsonWebTokenService {
  constructor(
    private readonly jwtService: JwtService,
  ) { }

  getToken(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload);
  }
}
```

add it to `index.ts`

```typescript
export * from './easyconfig.module';
export * from './easyconfig.service';
export * from './json-web-token/json-web-token.module';
export * from './json-web-token/json-web-token.service';
```

```shell
# don't forget to build module else we can't import it in consumer app
$ npm run build
```

done with package

## Return to consumer App

`src/app.module.ts` and import `JsonWebTokenModule`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EasyconfigModule, JsonWebTokenModule } from 'nestjs-easyconfig';

@Module({
  imports: [
    EasyconfigModule.register({ path: './config/.env' }),
    // the trick is import the module, not the service here
    JsonWebTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
```

now use `JsonWebTokenService` in `src/app.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { EasyconfigService, JsonWebTokenService } from 'nestjs-easyconfig';

@Injectable()
export class AppService {
  constructor(
    private readonly easyconfigService: EasyconfigService,
    private readonly jsonWebTokenService: JsonWebTokenService,
    ) { }

  getHello(): string {
    const envVar = this.easyconfigService.get('ENV_VAR1');
    const token = this.jsonWebTokenService.getToken({ username: 'koakh', sub: 28 });
    return `Hello World! ${envVar} ${token}`;
  }
}
```

run it, and browse <http://localhost:3000>

now we see the jwt too :)

```
Hello World! FOO eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtvYWtoIiwiaWF0IjoxNTY4MzMxMzMzLCJleHAiOjE1NjgzMzEzOTN9.dHd-iEm3JfmJJCprN0hZMk0TQRjCH0iuQAMJx9kn5gQ
```

awesome

## Fixing problems Notes

[Nest] 3778   - 2019-09-12 22:07:56   [ExceptionHandler] Nest cannot export a provider/module that is not a part of the currently processed module (EasyconfigModule). Please verify whether each exported unit is available in this particular context. +20ms

fix adding `JsonWebTokenService` to `EasyconfigModule` `providers`

```typescript
export class EasyconfigModule {
      providers: [
        ...
        },
        JsonWebTokenService,
    };
```

```shell
# don't forget to build module
$ npm run build
```

done now we have the error that gets us here

```
[Nest] 6038   - 2019-09-12 22:11:42   [ExceptionHandler] Nest can't resolve dependencies of the JsonWebTokenService (?). Please make sure that the argument at index [0] is available in the JsonWebTokenModule context. +40ms
```

the above error its the one that 'waste' some hours to find the simple way to do......simple after you know how to do it, always the same.......

## try to use package module inside consumer app module auth (sub module)

```shell
# creata auth module
$ nest g module auth
$ nest g service auth
$ nest g controller auth
```

add code to module, service and controller and test with

<http://localhost:3000/auth>

now try to remove dependencies from app.module.ts
