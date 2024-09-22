// import { QueryDto } from 'src/common/query.dto';
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
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(private readonly service: ItemsService) {}

    @Get()
    getAll() {
        return this.service.findAll();
    }

    @Get('/:id')
    getById(@ParamObjId() id: string) {
        return this.service.findOne(id);
    }

    @Post()
    addItem(@Body() dto: CreateItemDto) {
        return this.service.create(dto);
    }

    @Patch('/:id')
    editItem(@ParamObjId() id: string, @Body() dto: UpdateItemDto) {
        return this.service.update(id, dto);
    }
    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteById(@ParamObjId() id: string) {
        return this.service.remove(id);
    }

    @Delete('/prune')
    DeleteAll() {
        return this.service.removeAll();
    }
}
