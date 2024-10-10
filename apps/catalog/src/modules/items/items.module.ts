import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schema';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Genre, GenreSchema } from '../genres/schemas/genre.schema';
import { Artist, ArtistSchema } from '../artists/schemas/artist.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ITEM_EVENTS',
                transport: Transport.NATS,
                options: {
                    servers: [process.env.NATS_URL],
                },
            },
        ]),
        MongooseModule.forFeature([
            { name: Item.name, schema: ItemSchema },
            { name: Artist.name, schema: ArtistSchema },
            { name: Genre.name, schema: GenreSchema },
        ]),
    ],
    providers: [ItemsService],
    controllers: [ItemsController],
})
export class ItemsModule {}
