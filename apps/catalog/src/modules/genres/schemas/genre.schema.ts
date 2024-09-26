import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Item } from '../../items/schemas/item.schema';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({ timestamps: true })
export class Genre extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Item' }] })
    items: Item[];
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
