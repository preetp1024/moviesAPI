const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const router = express.Router();

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(port, '0.0.0.0', ()=>{
        console.log(`server listening on: ${port}`);
    });
}).catch((err)=>{
    console.log(err);
});


app.get('/', (req, res) => {
  res.json({ message: "API Listening" });
});

router.post('/api/movies', async (req, res) => {
    try {
      const newMovie = await db.addNewMovie(req.body);
      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/api/movies', async (req, res) => {
    const { page, perPage, title } = req.query;
  
    try {
      const movies = await db.getAllMovies(page, perPage, title);
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/api/movies/:id', async (req, res) => {
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

  router.put('/api/movies/:id', async (req, res) => {
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

  router.delete('/api/movies/:id', async (req, res) => {
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
  
  module.exports = router;