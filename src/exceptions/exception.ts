import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(id: number) {
    super(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

// export class BadCredentials extends HttpExcepton {
//   constructor() {
//     super(`Invalid `)
//   }
// }

export class NotOwnerException extends HttpException {
  constructor() {
    super(`You are not the owner of this project`, HttpStatus.NOT_FOUND);
  }
}
