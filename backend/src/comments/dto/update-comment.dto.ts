import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(5000)
  content!: string;
}
