CREATE DATABASE pa;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS models;
DROP TABLE IF EXISTS datasets;

CREATE TABLE users (
  id integer SERIAL PRIMARY KEY NOT NULL,
  nome_utente varchar(30) NOT NULL UNIQUE,
  email varchar(30) NOT NULL UNIQUE,
  password varchar(30) NOT NULL,
  admin boolean NOT NULL,
  credito FLOAT(2,2) DEFAULT 10 NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE datasets (
  deletedAt DATE default NULL NOT NULL
  id integer SERIAL PRIMARY KEY NOT NULL,
  nome varchar(30) NOT NULL UNIQUE,
  tags varchar(30) NOT NULL,
  uid integer NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT userid FOREIGN KEY(id)
    REFERENCES public."users" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE models (
  id integer SERIAL PRIMARY KEY NOT NULL,
  nome varchar(30) NOT NULL,
  datasetid integer NOT NULL,
  userid integer NOT NULL,
  PRIMARY KEY (id)
  CONSTRAINT userid_datasetid_unique UNIQUE (userid, datasetid),
  CONSTRAINT userid FOREIGN KEY(id)
    REFERENCES public."users" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
  CONSTRAINT datasetid FOREIGN KEY(id)
    REFERENCES public."datasets" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

-- Rimuovi l'attributo "deletedAt" dalla tabella "models"
--ALTER TABLE models
--DROP COLUMN deletedAt;

-- Aggiungi l'attributo "deletedAt" alla tabella "datasets"
--ALTER TABLE datasets
--ADD COLUMN deletedAt DATE DEFAULT NULL;


-- Inserisci un nuovo utente nella tabella "users"
INSERT INTO users (
  nome_utente, email, password, admin, credito)
    VALUES ('carlo', 'carlo@carlo.com', 'carlo', true, 10.0);



