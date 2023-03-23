import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {AppModule} from './app.module';




const fs=require("fs");
const cookieSession = require('cookie-session');

async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync('./keys/server.key'),
        cert: fs.readFileSync('./keys/server.crt'),
        ca: fs.readFileSync('./keys/server.ca-bundle'),
    };
    const app = await NestFactory.create(AppModule,
        {
        httpsOptions,
    }
    );


    app.use(
        cookieSession({
            keys: ['asdfasfd'],
        }),
    );
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    app.enableCors();
    await app.listen(3000);
}

bootstrap();
