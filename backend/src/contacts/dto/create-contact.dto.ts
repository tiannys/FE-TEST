import { IsString, IsNotEmpty, IsInt, Min, Max, Matches } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\u0E00-\u0E7F\-]+$/, {
    message: 'First name must contain only letters',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\u0E00-\u0E7F\-]+$/, {
    message: 'Last name must contain only letters',
  })
  lastName: string;

  @IsInt()
  @Min(1)
  @Max(150)
  age: number;
}
