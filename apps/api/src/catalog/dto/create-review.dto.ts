import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateReviewDto {
  @Transform(trim)
  @IsString({ message: 'Escribe tu nombre.' })
  @MinLength(2, { message: 'Tu nombre debe tener al menos 2 caracteres.' })
  @MaxLength(60, { message: 'Tu nombre puede tener máximo 60 caracteres.' })
  customerName!: string;

  @IsInt({ message: 'Elige una calificación de 1 a 5 estrellas.' })
  @Min(1, { message: 'Elige una calificación de 1 a 5 estrellas.' })
  @Max(5, { message: 'Elige una calificación de 1 a 5 estrellas.' })
  rating!: number;

  @Transform(trim)
  @IsString({ message: 'Escribe tu reseña.' })
  @MinLength(10, { message: 'Tu reseña debe tener al menos 10 caracteres.' })
  @MaxLength(1000, { message: 'Tu reseña puede tener máximo 1000 caracteres.' })
  comment!: string;

  /** Honeypot: real users never fill it; bots usually do. */
  @IsOptional()
  @IsString()
  website?: string;
}
