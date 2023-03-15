flyctl postgres connect -a fs-psql-blog-db
\d
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY, 
    author text, 
    url text NOT NULL, 
    title text NOT NULL, 
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('J.R.R. Tolkien', 'https://www.tolkienestate.com/', 'The Hobbit', 2137);
insert into blogs (author, url, title) values ('Jo Nesbo', 'https://jonesbo.com/', 'Blood moon');