/**
 * @file contains all the routes related to export
 * this will export all the collection data
 */
import { Router } from 'express';
import Game from '../models/game.model';
import Movie from '../models/movie.model';
import TVShow from '../models/tv-show.mode';

// Initialize router
const route = Router();

route.get('/game', async (_req, res) => {
  try {
    const fileName = `games-${Date.now()}.json`;

    // Set the headers for a CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Get a readable stream from your Mongoose collection
    const dataCursor = Game.find().lean().cursor();

    // Start JSON array
    res.write('[');
    let first = true;

    // Iterate asynchronously over cursor and stream JSON documents
    for await (const doc of dataCursor) {
      if (!first) {
        res.write(',');
      } else {
        first = false;
      }
      res.write(JSON.stringify(doc));
    }

    // End JSON array
    res.write(']');
    res.end();
  } catch (error) {
    console.error('Error setting up export:', error);
    if (!res.headersSent) {
      res.status(500).send('Failed to export data');
    }
  }
});

route.get('/movie', async (_req, res) => {
  try {
    const fileName = `movies-${Date.now()}.json`;

    // Set the headers for a CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Create a Mongoose cursor to stream documents
    const cursor = Movie.find().lean().cursor();

    // Start JSON array
    res.write('[');
    let first = true;

    // Iterate asynchronously over cursor and stream JSON documents
    for await (const doc of cursor) {
      if (!first) {
        res.write(',');
      } else {
        first = false;
      }
      res.write(JSON.stringify(doc));
    }

    // End JSON array
    res.write(']');
    res.end();
  } catch (error) {
    console.error('Error setting up export:', error);
    if (!res.headersSent) {
      res.status(500).send('Failed to export data');
    }
  }
});

route.get('/tv-show', async (_req, res) => {
  try {
    const fileName = `tv-show-${Date.now()}.json`;

    // Set the headers for a CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // Get a readable stream from your Mongoose collection
    const dataCursor = TVShow.find().lean().cursor();

    // Start JSON array
    res.write('[');
    let first = true;

    // Iterate asynchronously over cursor and stream JSON documents
    for await (const doc of dataCursor) {
      if (!first) {
        res.write(',');
      } else {
        first = false;
      }
      res.write(JSON.stringify(doc));
    }

    // End JSON array
    res.write(']');
    res.end();
  } catch (error) {
    console.error('Error setting up export:', error);
    if (!res.headersSent) {
      res.status(500).send('Failed to export data');
    }
  }
});
// Export router
export default route;
