import { Module, DynamicModule } from '@nestjs/common';
import { EasyconfigService } from './easyconfig.service';
import { Config } from './config.interface';
// Not Needed to work
// import { JsonWebTokenModule } from './json-web-token/json-web-token.module';

@Module({
  // Not Needed to work
  // imports: [JsonWebTokenModule],
})
export class EasyconfigModule {
  static register(options?: Config): DynamicModule {
    return {
      // Dynamic modules must return an object with the exact same interface, plus one additional property called module.
      // The module property serves as the name of the module, and should be the same as the class name of the module,
      // as shown in the example below.
      module: EasyconfigModule,
      providers: [
        {
          provide: EasyconfigService,
          useValue: new EasyconfigService(options),
        },
      ],
      exports: [EasyconfigService],
    };
  }
}
