import { IsNotEmpty, IsEnum } from 'class-validator';
import { StatusEnum } from 'src/enums/status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(StatusEnum, {
    message: 'Status must be a valid enum value (PENDING | IN_PROGRESS | DONE)',
  })
  status: StatusEnum;
}
