import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Item, ItemSchema } from '../items/schemas/item.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Artist.name, schema: ArtistSchema },
            { name: Item.name, schema: ItemSchema },
        ]),
    ],
    providers: [ArtistsService],
    controllers: [ArtistsController],
})
export class ArtistsModule {}
