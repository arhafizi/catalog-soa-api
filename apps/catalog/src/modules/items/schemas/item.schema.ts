import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Artist } from '../../artists/schemas/artist.schema';
import { Genre } from '../../genres/schemas/genre.schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ timestamps: true })
export class Item extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    labelName: string;

    @Prop({ required: true })
    pictureUri: string;

    @Prop({ required: true })
    format: string;

    @Prop({ required: true })
    availableStock: number;

    @Prop({ default: true })
    active: boolean;

    @Prop({ type: Date, default: Date.now })
    releaseDate: Date;

    @Prop({
        type: {
            amount: { type: Number, required: true },
            currency: { type: String, required: true },
        },
        required: false,
    })
    price: {
        amount: number;
        currency: string;
    };

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Artist' })
    artist: Artist;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Genre' })
    genre: Genre;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
