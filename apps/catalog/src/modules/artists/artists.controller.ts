import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ParamObjId } from '../../common/decorator/objectId.decorator';

@Controller('artists')
export class ArtistsController {
    constructor(private readonly service: ArtistsService) {}

    @Get()
    get() {
        return this.service.findAll();
    }

    @Get('/:id')
    getById(@ParamObjId() id: string) {
        return this.service.findOne(id);
    }

    @Get('/:id/items')
    getItemsById(@ParamObjId() id: string) {
        return this.service.findItemsByArtistId(id);
    }

    @Post()
    addArtist(@Body() dto: CreateArtistDto) {
        return this.service.create(dto);
    }

    @Patch('/:id')
    editeArtist(@ParamObjId() id: string, @Body() dto: UpdateArtistDto) {
        return this.service.update(id, dto);
    }

    @Delete('/:id')
    removeArtist(@ParamObjId() id: string) {
        return this.service.remove(id);
    }
}
