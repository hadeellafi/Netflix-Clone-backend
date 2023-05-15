const data = require("./Movie Data/data.json")

const express = require('express');
const cors = require('cors');
const server = express();
require('dotenv').config();

server.use(cors());
const PORT = process.env.PORT || 3005;

const axios = require('axios');

const apiKey = process.env.APIkey;

////lab15
server.use(express.json())

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

//Routes

// Home Route
//https://localhost:3000/
server.get('/', homeHandler);//will be shown in localhost:3000

//https://localhost:3000/trending
server.get('/favorite', favoriteHandler);


////////lab14
server.get('/trending', trendinghandler);
server.get('/search', searchHandler);
server.get('/genre', genreHandler);
server.get('/popular', popularHandler);

////lab15
server.get('/getMovies', getMoviesHandler);
server.post('/getMovies', addMovieHandler);

/////lab16 
server.put('/UPDATE/:id', updateMovieHandler);
server.delete('/DELETE/:id', deleteMovieHandler);
server.get('/getMovieById',getMovieByIdHandler);


function updateMovieHandler(req, res) {
    const id = req.params.id;
    console.log(req.body);
    const sql = `UPDATE ownMovies
    SET title = $1, release_date = $2, poster_path = $3, overview = $4
    WHERE id = ${id};`
    const { title, release_date, poster_path, overview } = req.body;
    const values = [title, release_date, poster_path, overview];
    client.query(sql, values)
        .then(data => {
            res.status(202).send(data);
        })
        .catch(error => {
            errorHandler(error, req, res)
        })

}

function deleteMovieHandler(req, res) {
    const id = req.params.id;
    console.log(req.params);
    const sql = `DELETE FROM ownMovies WHERE id=${id};`
    client.query(sql)
        .then(data => {
            res.status(202).send(data)
        })
        .catch(error => {
            errorHandler(error, req, res)
        })
}

function getMovieByIdHandler(req,res){
    const id=req.query.id;
    console.log(req.query.id);
    sql=`SELECT * FROM ownMovies WHERE id=${id};`
    client.query(sql)
    .then(data=>{
        res.send(data.rows)})
    .catch(error => {
        errorHandler(error, req, res);
    })
}


server.get('*', notFoundHandler);


function homeHandler(req, res) {
    let movie1 = new Movie(data.id, data.title, data.release_date, data.poster_path, data.overview);
    res.send(movie1);
}

function favoriteHandler(req, res) {
    //const x = y + 1; //here if we want to show error 500 we have to create an error cause  it's server error
    res.send("Welcome to Favorite Page");
}

function notFoundHandler(req, res) {
    const notFoundError = { status: 404, responseText: "page not found error" };
    res.status(404).send(notFoundError);
}
/////lab14 functions

function trendinghandler(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let singleTrandmovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return (singleTrandmovie);
                })
                res.send(mapResult);
            })
            .catch((error) => {
                console.log('sorry you have something error', error)
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res)
    }
}

function searchHandler(req, res) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=The&page=2`;
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let singleTrandmovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return (singleTrandmovie);
                })
                res.send(mapResult);
            })
            .catch((error) => {
                console.log('sorry you have something error', error)
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res)
    }

}
function genreHandler(req, res) {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US `;
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.genres.map(item => {
                    let singleGenre = new Genre(item.id, item.name);
                    return (singleGenre);
                })
                res.send(mapResult);
            })
            .catch((error) => {
                console.log('sorry you have something error', error)
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res)
    }
}
function popularHandler(req, res) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1 `;
    try {
        axios.get(url)
            .then(result => {
                let mapResult = result.data.results.map(item => {
                    let singlePopulermovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return (singlePopulermovie);
                })
                res.send(mapResult);
            })
            .catch((error) => {
                console.log('sorry you have something error', error)
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res)
    }
}
///////lab15
function getMoviesHandler(req, res) {
    const sql = `SELECT * FROM ownMovies`;
    client.query(sql)
        .then(data => {
            res.send(data.rows)
        })
        .catch(error => errorHandler(error, req, res))
}
function addMovieHandler(req, res) {
    const movie = req.body;
    console.log(movie);
    const sql = `INSERT INTO ownMovies (title, release_date, poster_path, overview,comment)
    VALUES ($1, $2, $3, $4,$5);`
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview,movie.comment];
    client.query(sql, values)
        .then(data => {
            res.send("The data has been added successfully");
        })
        .catch((error) => {
            errorHandler(error, req, res)
        })
}


function errorHandler(error, req, res) {
    const err = {
        status: 500,
        responseText: "Sorry, something went wrong"
    }
    res.status(500).send(err);
}

function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
function Genre(id, name) {
    this.id = id;
    this.name = name;
}
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} i am ready`)
        })
    })

