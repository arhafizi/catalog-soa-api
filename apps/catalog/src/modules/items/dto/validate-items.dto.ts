import { IsMongoId, IsArray, ArrayNotEmpty } from 'class-validator';

export class ValidateItemsDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true }) 
    itemIds: string[];
}
