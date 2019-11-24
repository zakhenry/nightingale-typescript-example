import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { sendUnaryData, Server, ServerCredentials, ServerUnaryCall, ServerWriteableStream } from 'grpc';
import {
  ExampleServiceService, HealthCheckRequest,
  HealthCheckResponse, HealthService,
  IExampleServiceServer, IHealthServer,
  SetServingStatusRequest,
} from '../proto-dist';
import { UnimplementedGrpcError } from './errors';

export const SERVING_STATUSES = new Map();

export class ExampleServer implements IExampleServiceServer {

  public setServingStatus(call: ServerUnaryCall<SetServingStatusRequest>, callback: sendUnaryData<Empty>): void {
    SERVING_STATUSES.set(this.constructor.name, call.request.getStatus());
    callback(null, new Empty());
  }

}

export class HealthCheck implements IHealthServer {
  public check(call: ServerUnaryCall<HealthCheckRequest>, callback: sendUnaryData<HealthCheckResponse>): void {
    const res = new HealthCheckResponse();
    res.setStatus(SERVING_STATUSES.get(ExampleServer.name) ?? HealthCheckResponse.ServingStatus.UNKNOWN);
    callback(null, res);
  }

  public watch(call: ServerWriteableStream<HealthCheckRequest>): void {
    throw new UnimplementedGrpcError();
  }
}



export async function createExampleServer(hostname: string = '0.0.0.0', port = 50051): Promise<string> {
  const server = new Server();
  server.addService(ExampleServiceService, new ExampleServer());
  server.addService(HealthService, new HealthCheck());

  const host = `${hostname}:${port}`;
  server.bind(host, ServerCredentials.createInsecure());
  server.start();

  return host;
}
