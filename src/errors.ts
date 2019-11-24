import { ServiceError, Metadata, status } from 'grpc';

export class GrpcError implements ServiceError {
  name: string;
  message: string;
  metadata: Metadata = new Metadata();
  code?: status;
  stack?: string;

  constructor(error: string | Error, name?: string, code?: status) {
    this.name = name || 'GrpcError';
    this.code = code;

    if (typeof error === 'string') {
      this.message = error;
    } else {
      this.message = error.message;
      this.stack = error.stack;
    }
  }
}

export class UnimplementedGrpcError extends GrpcError {
  constructor(error: string | Error = 'not implemented') {
    super(error, 'UnimplementedGrpcError', status.UNIMPLEMENTED);
  }
}
