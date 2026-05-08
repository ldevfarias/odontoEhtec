import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateSubscriberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 11)
  phone?: string | null;
}
