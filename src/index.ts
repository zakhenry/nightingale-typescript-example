import { createExampleServer } from './server';

export async function main(): Promise<void> {

  await createExampleServer();

}

if (require.main === module) {
  main().catch(console.error);
}
