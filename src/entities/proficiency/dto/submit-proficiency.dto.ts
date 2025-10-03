import { IsInt, Min, Max } from "class-validator";

export class SubmitProficiencyDto {
  @IsInt()
  @Min(1)
  @Max(5)
  backendScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  frontendScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  qaScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  uiUxScore: number;

  @IsInt()
  @Min(1)
  @Max(5)
  dataScienceScore: number;
}