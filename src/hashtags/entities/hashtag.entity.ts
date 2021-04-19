import { IsOptional, IsString } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import { Common } from "../../common/common.dto";
import { Photo } from "../../photos/entities/photo.entity";

@InputType()
@ObjectType()
export class HashTag extends Common {
  @Field((type) => String)
  @IsString()
  readonly hashtag: String;

  @Field((type) => [Photo], { nullable: true })
  @IsOptional()
  readonly photos?: Photo[];

  @Field((type) => Number, { nullable: true })
  @IsOptional()
  readonly totalPhotos?: number;
}
