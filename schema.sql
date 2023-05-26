DROP TABLE IF EXISTS  ownMovies;

CREATE TABLE IF NOT EXISTS ownMovies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date DATE,
    poster_path VARCHAR(255),
    overview TEXT,
    comment TEXT
);

DROP TABLE IF EXISTS reviews ;

DROP TABLE IF EXISTS user_comments;

CREATE TABLE user_comments (
  potato SERIAL PRIMARY KEY,
  email VARCHAR(255),
  location_id VARCHAR(255),
  comments VARCHAR(255),
  rating FLOAT
);