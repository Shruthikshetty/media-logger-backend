import { ConvexHttpClient } from 'convex/browser';

// create convex client
if (!process.env.CONVEX_URL) {
  throw new Error('CONVEX_URL environment variable is required');
}

const convex = new ConvexHttpClient(process.env.CONVEX_URL);
export default convex;
