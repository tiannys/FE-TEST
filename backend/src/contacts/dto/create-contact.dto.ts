import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  Matches,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

const THAI_PATTERN = /^[\u0E00-\u0E7F\s\-]+$/;
const LATIN_PATTERN = /^[a-zA-Z\s\-]+$/;

function detectScript(text: string): 'thai' | 'latin' | 'mixed' {
  const hasThai  = THAI_PATTERN.test(text);
  const hasLatin = LATIN_PATTERN.test(text);
  if (hasThai)  return 'thai';
  if (hasLatin) return 'latin';
  return 'mixed';
}

@ValidatorConstraint({ name: 'SameLanguage', async: false })
export class SameLanguageConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments): boolean {
    const obj = args.object as Record<string, string>;
    const firstName = obj['firstName'] ?? '';
    const lastName  = obj['lastName']  ?? '';

    if (!firstName || !lastName) return true; // let @IsNotEmpty handle it

    const s1 = detectScript(firstName);
    const s2 = detectScript(lastName);

    if (s1 === 'mixed' || s2 === 'mixed') return false;
    return s1 === s2;
  }

  defaultMessage(): string {
    return 'First name and last name must be in the same language (both Thai or both English)';
  }
}

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\u0E00-\u0E7F\s\-]+$/, {
    message: 'First name must contain only Thai or English letters',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z\u0E00-\u0E7F\s\-]+$/, {
    message: 'Last name must contain only Thai or English letters',
  })
  @Validate(SameLanguageConstraint)
  lastName: string;

  @IsInt()
  @Min(1)
  @Max(150)
  age: number;
}
