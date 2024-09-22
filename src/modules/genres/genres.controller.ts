import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post
} from '@nestjs/common';
import { ParamObjId } from 'src/common/decorator/objectId.decorator';
import { CreateGenreDto } from './dto/create-genre.dto';
import { updateGenreDto } from './dto/update-genre.dto';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
    constructor(private readonly service: GenresService) {}

    @Get()
    getAll() {
        return this.service.findAll();
    }

    @Get('/:id')
    getById(@ParamObjId() id: string) {
        return this.service.findOne(id);
    }

    @Get('/:id/items')
    GetItemsByGenreId(@ParamObjId() id: string) {
        return this.service.findItemsByGenreId(id);
    }

    @Post()
    addGenre(@Body() dto: CreateGenreDto) {
        return this.service.create(dto);
    }

    @Patch('/:id')
    editGenre(@ParamObjId() id: string, @Body() dto: updateGenreDto) {
        return this.service.update(id, dto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteById(@ParamObjId() id: string) {
        return this.service.remove(id);
    }
}
