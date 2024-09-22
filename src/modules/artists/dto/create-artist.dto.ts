import { IsString } from 'class-validator';

export class CreateArtistDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly biography: string;
}
