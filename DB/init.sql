CREATE TABLE public."User" (
  id serial PRIMARY KEY,
  email varchar(254) NOT NULL
);

CREATE TABLE public."Caterer" (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email varchar(254) NOT NULL
);

CREATE TABLE public."Item" (
  id serial PRIMARY KEY,
  name text NOT NULL,
  rating real NOT NULL,
  caterer_id serial REFERENCES public."Caterer"(id)
);

CREATE TABLE public."Rating" (
  id serial PRIMARY KEY,
  user_id serial REFERENCES public."User"(id),
  item_id serial REFERENCES public."Item"(id),
  rating real NOT NULL
);

CREATE TABLE public."Order" (
  id serial PRIMARY KEY,
  user_id serial REFERENCES public."User"(id),
  item_id serial REFERENCES public."Item"(id),
  caterer_id serial REFERENCES public."Caterer"(id)
);
