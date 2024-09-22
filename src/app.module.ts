import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArtistsModule } from './modules/artists/artists.module';
import { GenresModule } from './modules/genres/genres.module';
import { ItemsModule } from './modules/items/items.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/catalog-db'),
        ArtistsModule,
        GenresModule,
        ItemsModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
