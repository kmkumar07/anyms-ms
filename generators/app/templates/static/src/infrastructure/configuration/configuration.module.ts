import * as path from 'path'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MediatorModule, RequestContextModule } from '@softobiz-df/shared-lib'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConnectionService } from './typeorm-config.service'
import { configProviders } from './configuration.providers'

@Global()
@Module({
	imports: [
		MediatorModule,
		RequestContextModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: path.resolve(process.cwd(), 'env', `.${process.env.APP_ENV || 'local'}.env`),
		}),
		ServeStaticModule.forRoot({
			rootPath: path.resolve(process.cwd(), 'docs', 'api'),
			renderPath: /(api\/doc)$/,
		}),
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConnectionService }),
	],
	providers: [...configProviders],
	exports: [...configProviders],
})
export class ConfigurationModule {}
