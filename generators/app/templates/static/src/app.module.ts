import { Module } from '@nestjs/common';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';


@Module({
	imports: [ConfigurationModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
