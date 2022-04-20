import path from 'path';
import dotenv from 'dotenv';

/*
 * For local dev & local test, use `.env` and `.env.test` respectively
 * For remote envrionments, use the server environments
 */
const envFile = 'uniforms.env';

const result = dotenv.config({ path: path.normalize(envFile) });

if (result.error) {
  console.warn(
    [
      `You are in environment '${process.env.NODE_ENV}', but file '${envFile}' does not exist.`,
      `File '${envFile}' is the intended way of setting environment variable in ${process.env.NODE_ENV}.`,
      'Please ensure you have set your environment variables correctly.',
    ].join('\n'),
  );

  throw new Error(result.error.message);
}
