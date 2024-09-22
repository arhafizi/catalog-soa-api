import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Item, ItemSchema } from '../items/schemas/item.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Genre.name, schema: GenreSchema },
            { name: Item.name, schema: ItemSchema },
        ]),
    ],
    providers: [GenresService],
    controllers: [GenresController],
})
export class GenresModule {}
