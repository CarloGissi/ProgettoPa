CREATE DATABASE prog_pa;--MODIFICA NOME

CREATE TABLE IF NOT EXISTS public."users"
(
    id integer NOT NULL GENERATED ALWAYS AS NUMERO ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 100),
    nome_utente text  NOT NULL,
    email text  NOT NULL UNIQUE,
    password text  NOT NULL,
    credito decimal(5,2) NOT NULL DEFAULT 10,
    admin boolean NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP DEFAULT NULL,
    "updatedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);


ALTER TABLE IF EXISTS public."users"
    OWNER to "user";


CREATE TABLE IF NOT EXISTS public."datasets"
(
    id integer NOT NULL GENERATED ALWAYS AS NUMERO ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 100 ),
    nome text NOT NULL,
    tags text NOT NULL,
    "uid" integer NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NULL,
    "updatedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT dataset_pkey PRIMARY KEY (id),
    CONSTRAINT user_id FOREIGN KEY ("uid")
        REFERENCES public."user" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

ALTER TABLE IF EXISTS public."datasets"
    OWNER to "user";


CREATE TABLE IF NOT EXISTS public."models"
(
    id integer NOT NULL GENERATED ALWAYS AS NUMERO ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 100 ),
    nome text NOT NULL UNIQUE,
    "userid" integer NOT NULL,
    "datasetid" integer NOT NULL ,
    "createdAt" TIMESTAMP DEFAULT NULL,
    "updatedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT model_pkey PRIMARY KEY (id)
);


ALTER TABLE IF EXISTS public."models"
    OWNER to "user";
