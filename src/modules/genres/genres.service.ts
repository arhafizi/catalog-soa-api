import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from '../items/schemas/item.schema';
import { Genre } from './schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { updateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
    constructor(
        @InjectModel(Genre.name) private genreModel: Model<Genre>,
        @InjectModel(Item.name) private itemModel: Model<Item>,
    ) {}

    async findAll() {
        return this.genreModel.find().lean().exec();
    }

    async findOne(id: string) {
        const genre = await this.genreModel.findById(id).exec();
        if (!genre) {
            throw new NotFoundException('No Document found with this ID');
        }
        return genre;
    }

    async create(dto: CreateGenreDto) {
        const newGenre = await this.genreModel.create(dto);
        return newGenre;
    }

    async findItemsByGenreId(genreId: string): Promise<Item[]> {
        const items = await this.itemModel.find({ genre: genreId }).exec();
        return items;
    }

    async update(id: string, dto: updateGenreDto) {
        const genre = await this.genreModel
            .findByIdAndUpdate(id, dto, {
                new: true,
                runValidators: true,
            })
            .exec();

        if (!genre) {
            throw new NotFoundException('No Document found with this ID');
        }
        return genre;
    }

    async remove(id: string) {
        const result = await this.genreModel.findByIdAndDelete(id);
        if (!result)
            throw new NotFoundException(`Document with ID ${id} not found`);
        return result;
    }
}
