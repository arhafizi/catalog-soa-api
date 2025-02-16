import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist } from '../artists/schemas/artist.schema';
import { Genre } from '../genres/schemas/genre.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './schemas/item.schema';

@Injectable()
export class ItemsService {
    constructor(
        @InjectModel(Item.name) private readonly itemModel: Model<Item>,
        @InjectModel(Artist.name) private readonly artistModel: Model<Artist>,
        @InjectModel(Genre.name) private readonly genreModel: Model<Genre>,
        @Inject('ITEM_EVENTS') private readonly eventClient: ClientProxy,
    ) {}

    async findAll(): Promise<Item[]> {
        return this.itemModel
            .find({ active: true })
            .lean() // convert to plain js objs for performance
            .exec();
    }

    async findOne(id: string): Promise<Item> {
        const item = await this.itemModel
            .findOne({ _id: id, active: true })
            .populate('artist genre')
            .lean()
            .exec();

        if (!item) {
            throw new NotFoundException('No item found with this ID');
        }
        return item;
    }

    async findMultipleItems(ids: string[]) {
        const items = await this.itemModel.find({ _id: { $in: ids } }).exec();
        if (!items.length) {
            throw new BadRequestException('No valid items found');
        }
        // return items;
        return items.map((item) => item._id.toString());
    }

    async create(itemDto: CreateItemDto): Promise<Item> {
        const artist = await this.artistModel
            .findOne({ name: itemDto.artistName })
            .exec();

        if (!artist) {
            throw new BadRequestException(
                `Artist with name "${itemDto.artistName}" not found`,
            );
        }

        const genre = await this.genreModel
            .findOne({ name: itemDto.genreName })
            .exec();

        if (!genre) {
            throw new BadRequestException(
                `Genre with name "${itemDto.genreName}" not found`,
            );
        }

        const newItem = new this.itemModel({
            ...itemDto,
            artist: artist._id,
            genre: genre._id,
        });
        return newItem.save();
    }

    async update(id: string, itemDto: UpdateItemDto): Promise<Item> {
        let artist = null;
        let genre = null;

        if (itemDto.artistName) {
            artist = await this.artistModel
                .findOne({ name: itemDto.artistName })
                .exec();

            if (!artist) {
                throw new BadRequestException(
                    `Artist with name "${itemDto.artistName}" not found`,
                );
            }
        }

        if (itemDto.genreName) {
            genre = await this.genreModel
                .findOne({ name: itemDto.genreName })
                .exec();
            if (!genre) {
                throw new BadRequestException(
                    `Genre with name "${itemDto.genreName}" not found`,
                );
            }
        }

        const updatedItem = await this.itemModel
            .findByIdAndUpdate(
                id,
                {
                    ...itemDto,
                    artist: artist ? artist._id : undefined,
                    genre: genre ? genre._id : undefined,
                },
                {
                    new: true,
                    runValidators: true,
                },
            )
            .exec();

        if (!updatedItem) {
            throw new NotFoundException('No item found with this ID');
        }

        return updatedItem;
    }

    async remove(id: string): Promise<Item> {
        await this.findOne(id);

        const deletedItem = await this.itemModel.findByIdAndUpdate(
            id,
            {
                active: false,
            },
            {
                new: true,
                runValidators: true,
            },
        );

        this.eventClient.emit('item.sold_out', { id });

        return deletedItem;
    }

    async removeHard(id: string): Promise<Item> {
        const deletedItem = await this.itemModel.findByIdAndDelete(id).exec();
        if (!deletedItem) {
            throw new NotFoundException(`Item with ID ${id} not found`);
        }
        return deletedItem;
    }

    async removeAll(): Promise<string> {
        const result = await this.itemModel.deleteMany({}).exec();
        return `${result.deletedCount} items deleted`;
    }
}
