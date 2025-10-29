import { Router } from "express";
import Game from "../models/game.model";
import { AsyncParser } from '@json2csv/node';

//initialize router
const route = Router();

route.get('/game', async (req, res) => {
try {
    const fileName = `export-${Date.now()}.csv`;

    // Set the headers for a CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Get a readable stream from your Mongoose collection
    const dataCursor = Game.find().lean().cursor();

    // Instantiate the AsyncParser class
    const parser = new AsyncParser();

    // The rest of the code remains the same
    // Pipe the data through the parser and into the response
    const parsingPromise = parser.parse(dataCursor).pipe(res);
    
    parsingPromise.on('error', (err) => {
      console.error('Streaming error:', err);
      // Avoid sending another response if headers are already sent
      if (!res.headersSent) {
        res.status(500).send('Failed to stream data');
      }
    });

  } catch (error) {
    console.error('Error setting up export:', error);
    if (!res.headersSent) {
      res.status(500).send('Failed to export data');
    }
  }
});

//export router
export default route;