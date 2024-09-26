import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from '../items/schemas/item.schema';
import { Artist } from './schemas/artist.schema';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
    constructor(
        @InjectModel(Artist.name) private artistModel: Model<Artist>,
        @InjectModel(Item.name) private itemModel: Model<Item>,
    ) {}

    async findAll() {
        return this.artistModel.find().exec();
    }

    async create(dto: CreateArtistDto) {
        // const artist = this.artistModel.create(dto);
        // return artist.save();
        const artist = new this.artistModel(dto);
        return artist.save();
    }

    async findOne(id: string) {
        // const doc = await this.artistModel.findById(id);
        const doc = await this.artistModel.findOne({ _id: id }).exec();
        if (!doc) {
            throw new NotFoundException('No Document found with this ID');
        }
        return doc;
    }

    async findItemsByArtistId(artistId: string): Promise<Item[]> {
        const items = await this.itemModel.find({ artist: artistId }).exec();
        return items;
    }

    async update(id: string, dto: UpdateArtistDto) {
        // const doc = await artistModel.findByIdAndUpdate({_id: id}, {$set : dto}, {new: true,}).exec();

        const doc = await this.artistModel
            .findByIdAndUpdate(id, dto, {
                new: true,
            })
            .exec();

        if (!doc) {
            throw new NotFoundException('No Document found with this ID');
        }
        return doc;
    }

    async remove(id: string) {
        const result = await this.artistModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }
        return result;
    }
}
