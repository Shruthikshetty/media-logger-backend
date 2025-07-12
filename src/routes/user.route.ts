/**
 * @file contains all the routes related to a user
 */
//@TODO in progress
import { Router } from 'express';

// initialize router
const route = Router();

//Route to create a user
route.post('/', (_, res) => {
  res.send('create user');
});

// export all routers clubbed
export default route;
