/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Preet Patel      Student ID: 175058213      Date: 15th September 2023
*  Cyclic Link: https://tiny-bee-purse.cyclic.cloud/
*
********************************************************************************/ 


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(port, () => {
    console.log(`server listening on: ${port}`);
  });
}).catch((err) => {
  console.log(err);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/movies', async (req, res) => {
  try {
    const newMovie = await db.addNewMovie(req.body);
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/movies', async (req, res) => {
  const { page, perPage, title } = req.query;

  try {
    const movies = await db.getAllMovies(page, perPage, title);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await db.getMovieById(id);
    if (!movie) {
      res.status(404).json({ error: 'Movie not found' });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMovie = await db.updateMovieById(req.body, id);
    if (!updatedMovie) {
      res.status(404).json({ error: 'Movie not found' });
    } else {
      res.status(200).json(updatedMovie);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.deleteMovieById(id);
    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Movie not found' });
    } else {
      res.status(204).send(); // No content for successful delete
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
