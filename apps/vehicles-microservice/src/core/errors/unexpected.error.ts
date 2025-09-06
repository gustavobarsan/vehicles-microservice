import { ApplicationError } from "./ base.error";

export class UnexpectedError extends ApplicationError {
    constructor(message = 'Ocorreu um erro inesperado.') {
      super(message);
    }
  }