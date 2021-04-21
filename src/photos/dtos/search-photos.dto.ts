import { IsOptional, IsString } from "class-validator";
import { ArgsType, Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Photo } from "../entities/photo.entity";

@ArgsType()
export class SearchPhotosInput {
  @Field((type) => String)
  @IsString()
  readonly keyword: string;
}

@ObjectType()
export class SearchPhotosOutput extends CommonOutput {
  @Field((type) => [Photo], { nullable: true })
  @IsOptional()
  readonly photos?: Photo[];
}
