import * as grpc from "grpc";
import { ExampleServiceClient, HealthCheckResponse, SetServingStatusRequest } from '../proto-dist';
import { EXAMPLE_SERVER_HOST } from './common';

export class ExampleClient {

  private grpcClient: ExampleServiceClient = new ExampleServiceClient(EXAMPLE_SERVER_HOST, grpc.credentials.createInsecure())

  private async waitForReady(): Promise<void> {
    const beforeConnect = process.hrtime();
    console.log(`Checking client is ready`);

    await new Promise<void>((success, error) =>
      this.grpcClient.waitForReady(new Date().valueOf() + 15000, err => (err ? error(err) : success()))
    );

    console.log(`Client ready after ${process.hrtime(beforeConnect).join('.')}s`);
  }

  private async setServingStatus(status: HealthCheckResponse.ServingStatus): Promise<boolean> {
    await this.waitForReady();
    const req = new SetServingStatusRequest();
    req.setStatus(status);
    return await new Promise((resolve, reject) => {
      this.grpcClient.setServingStatus(req, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    })
  }

  public async makeHealthy(): Promise<void> {
    await this.setServingStatus(HealthCheckResponse.ServingStatus.SERVING);
    console.log('Server status is now healthy')
  }

  public async makeUnhealthy(): Promise<void> {
    await this.setServingStatus(HealthCheckResponse.ServingStatus.NOT_SERVING);
    console.log('Server status is now unhealthy')
  }

  public close() {
    this.grpcClient.close();
  }

  public async handleCliRequest(status: 'healthy' | 'unhealthy'): Promise<void> {

    switch (status) {
      case 'healthy':
        await this.makeHealthy();
        break;
      case 'unhealthy':
        await this.makeUnhealthy();
        break;
      default:
        throw new Error(`Options must be one of 'healthy' | 'unhealthy', ${status} given`)
    }

  }

}


if (require.main === module) {
  const client = new ExampleClient();

  client.handleCliRequest(process.argv[2] as 'healthy' | 'unhealthy').catch(console.error).then(console.log);

}
