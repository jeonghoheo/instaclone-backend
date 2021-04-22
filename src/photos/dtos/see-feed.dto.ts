import { Field, ObjectType } from "type-graphql";
import { CommonOutput } from "../../common/common.dto";
import { Photo } from "../entities/photo.entity";

@ObjectType()
export class SeeFeedOutput extends CommonOutput {
  @Field((type) => [Photo], { nullable: true })
  readonly photos?: Photo[];
}
