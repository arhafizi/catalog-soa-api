import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.NATS,
            options: {
                servers: [process.env.NATS_URL],
            },
        },
        { inheritAppConfig: true },
    );

    await app.startAllMicroservices();

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
