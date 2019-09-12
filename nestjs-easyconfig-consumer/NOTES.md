# Notes

## About

This simple project is a POC of how to use external packages like `jwt` in a sub module inside a jest package, and override errors
## Bootstrap App

```shell
# boostrap app
$ nest new nestjs-easyconfig-consumer
$ cd nestjs-easyconfig-consumer/
$ npm install ../nestjs-easyconfig
```

```json
"dependencies": {
  "nestjs-easyconfig": "file:../nestjs-easyconfig",
},
```

consume `EasyconfigModule`

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

now consume `EasyconfigModule` change `src/app.controller.ts`

and add

```shell
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

## try to Use externam package inside EasyconfigModule

```shell
# cde or open a new code
$ cd ../nestjs-easyconfig
# deps
$ npm i @nestjs/jwt
```

```shell
# generate module and service
$ nest g module jsonWebToken
$ nest g service jsonWebToken
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

add export `to src/json-web-token/json-web-token.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';

@Module({
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
})
export class JsonWebTokenModule {}
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

## Return to consumer App

`src/app.module.ts` and import `JsonWebTokenService`

```typescript
...
import { EasyconfigModule, JsonWebTokenService } from 'nestjs-easyconfig';

@Module({
  imports: [
    EasyconfigModule.register({ path: './config/.env' }),
    JsonWebTokenService,
  ],
  controllers: [AppController],
  providers: [AppService],
})
...
```

now use `JsonWebTokenService` it in `src/app.service.ts`

```typescript
...
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

## Start Fixing problems

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
