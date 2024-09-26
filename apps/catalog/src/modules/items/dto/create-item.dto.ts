import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsDate,
    IsObject,
    ValidateNested,
    IsNotEmpty,
} from 'class-validator';

export class PriceDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;
}

export class CreateItemDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsString()
    readonly labelName: string;

    @IsString()
    readonly pictureUri: string;

    @IsDate()
    readonly releaseDate: Date;

    @IsString()
    readonly format: string;

    @IsNumber()
    readonly availableStock: number;

    @IsObject()
    @ValidateNested()
    @Type(() => PriceDto)
    readonly price: PriceDto;

    @IsString()
    readonly genreName: string;

    @IsString()
    readonly artistName: string;
}
