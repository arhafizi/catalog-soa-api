import { IsArray, IsEmail, IsMongoId, IsOptional } from 'class-validator';

export class CreateCartDto {
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    itemsIds: string[] ;

    @IsEmail()
    userEmail: string;
}
