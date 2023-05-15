DROP TABLE IF EXISTS ownMovies;

CREATE TABLE IF NOT EXISTS ownMovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date DATE,
    poster_path VARCHAR(255),
    overview TEXT,
    comment TEXT
);
