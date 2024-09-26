import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { CartModule } from './cart.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        CartModule,
        new FastifyAdapter(),
    );
    
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    await app.listen(3001, '0.0.0.0');
}
bootstrap();
