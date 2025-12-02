import { ConvexHttpClient } from "convex/browser";

// create convex client
const convex = new ConvexHttpClient(process.env.CONVEX_URL!);
export default convex;