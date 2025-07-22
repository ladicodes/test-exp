export abstract class BaseService {
  protected handleError(error: any, context: string): never {
    const errorMessage = `${context}: ${error.message}`;
    throw new Error(errorMessage);
  }

  protected validateRequired(value: any, fieldName: string): void {
    if (!value) {
      throw new Error(`${fieldName} is required`);
    }
  }
}
