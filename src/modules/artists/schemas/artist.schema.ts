import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Item } from 'src/modules/items/schemas/item.schema';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ timestamps: true })
export class Artist extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: String })
    biography: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Item' }] })
    items: Item[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
