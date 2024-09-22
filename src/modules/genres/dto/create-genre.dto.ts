import { IsString, MaxLength } from 'class-validator';

export class CreateGenreDto {
    @IsString()
    @MaxLength(15)
    readonly name: string;

    @IsString()
    readonly description: string;
}
