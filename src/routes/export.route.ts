/**
 * @file contains all the routes related to export
 * this will export all the collection data
 */
import { Router } from 'express';
import Game from '../models/game.model';
import { AsyncParser } from '@json2csv/node';
import Movie from '../models/movie.model';

// Initialize router
const route = Router();

route.get('/game', async (_req, res) => {
  try {
    const fileName = `games-${Date.now()}.csv`;

    // Set the headers for a CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // --- SOLUTION: Define all the fields you want in the CSV ---
    const fields = [
      '_id',
      'title',
      'description',
      'averageRating',
      'ageRating',
      'genre',
      'releaseDate',
      'posterUrl',
      'backdropUrl',
      'isActive',
      'status',
      'platforms',
      'avgPlaytime',
      'developer',
      'youtubeVideoId',
      'createdAt',
    ];

    // Get a readable stream from your Mongoose collection
    const dataCursor = Game.find().lean().cursor();

    // Instantiate the AsyncParser with the defined fields
    // The `defaultValue` will fill any missing cell with an empty string.
    const parser = new AsyncParser({ fields, defaultValue: '' });

    // Pipe the data through the parser and into the response
    const parsingPromise = parser.parse(dataCursor).pipe(res);

    parsingPromise.on('error', (err) => {
      console.error('Streaming error:', err);
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

route.get('/movies', async (_req, res) => {
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
    const fileName = `tv-show-${Date.now()}.csv`;

    // Set the headers for a CSV file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    // --- SOLUTION: Define all the fields you want in the CSV ---
    const fields = [
      '_id',
      'title',
      'description',
      'averageRating',
      'genre',
      'releaseDate',
      'cast',
      'directors',
      'avgRunTime',
      'languages',
      'posterUrl',
      'backdropUrl',
      'isActive',
      'status',
      'tags',
      'totalSeasons',
      'totalEpisodes',
      'ageRating',
      'youtubeVideoId',
      'tmdbId',
      'imdbId',
      'createdAt',
    ];

    // Get a readable stream from your Mongoose collection
    const dataCursor = Game.find().lean().cursor();

    // Instantiate the AsyncParser with the defined fields
    // The `defaultValue` will fill any missing cell with an empty string.
    const parser = new AsyncParser({ fields, defaultValue: '' });

    // Pipe the data through the parser and into the response
    const parsingPromise = parser.parse(dataCursor).pipe(res);

    parsingPromise.on('error', (err) => {
      console.error('Streaming error:', err);
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
// Export router
export default route;
