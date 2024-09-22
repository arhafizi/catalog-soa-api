import { PartialType } from '@nestjs/mapped-types';
import { CreateGenreDto } from './create-genre.dto';

export class updateGenreDto extends PartialType(CreateGenreDto) {}