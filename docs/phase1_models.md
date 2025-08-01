# **Database Models**

The following is a description of the database models used in the application phase 1

### User Model

#### Table: Users

| Field Name | Data Type | Description                         |
| ---------- | --------- | ----------------------------------- |
| name       | string    | User's name                         |
| password   | string    | User's password                     |
| email      | string    | User's email                        |
| profileImg | string    | User's profile image URL            |
| role       | string    | User's role (enum: `user`, `admin`) |
| xp         | number    | User's experience points            |
| location   | string    | User's location                     |
| bio        | string    | User's bio                          |

### TV Show Model

#### Table: TV Shows

| Field Name    | Data Type     | Description                             |
| ------------- | ------------- | --------------------------------------- |
| title         | string        | TV show title                           |
| description   | string        | TV show description                     |
| averageRating | number        | TV show average rating                  |
| genre         | array[string] | TV show genres (enum: `GENRE_MOVIE_TV`) |
| releaseDate   | date          | TV show release date                    |
| cast          | array[string] | TV show cast                            |
| directors     | array[string] | TV show directors                       |
| runTime       | number        | TV show run time                        |
| languages     | array[string] | TV show languages                       |
| posterUrl     | string        | TV show poster URL                      |

### TV Season Model

#### Table: TV Seasons

| Field Name        | Data Type | Description                           |
| ----------------- | --------- | ------------------------------------- |
| tvShow            | ObjectId  | Reference to the TV show              |
| seasonNumber      | number    | Season number                         |
| title             | string    | Season title                          |
| description       | string    | Season description                    |
| releaseDate       | date      | Season release date                   |
| noOfEpisodes      | number    | Number of episodes                    |
| posterUrl         | string    | Season poster URL                     |
| seasonRating      | number    | Season rating                         |
| status            | string    | Season status (enum: `SEASON_STATUS`) |
| trailerYoutubeUrl | string    | Season trailer YouTube URL            |

### TV Episode Model

#### Table: TV Episodes

| Field Name    | Data Type | Description                |
| ------------- | --------- | -------------------------- |
| season        | ObjectId  | Reference to the TV season |
| title         | string    | Episode title              |
| description   | string    | Episode description        |
| episodeNumber | number    | Episode number             |
| releaseDate   | date      | Episode release date       |
| runTime       | number    | Episode run time           |

### Movie Model

#### Table: Movies

| Field Name    | Data Type     | Description                           |
| ------------- | ------------- | ------------------------------------- |
| title         | string        | Movie title                           |
| description   | string        | Movie description                     |
| averageRating | number        | Movie average rating                  |
| genre         | array[string] | Movie genres (enum: `GENRE_MOVIE_TV`) |
| releaseDate   | string        | Movie release date                    |
| cast          | array[string] | Movie cast                            |
| directors     | array[string] | Movie directors                       |
| runTime       | number        | Movie run time                        |
| languages     | array[string] | Movie languages                       |
| posterUrl     | string        | Movie poster URL                      |

### Game Model

#### Table: Games

| Field Name    | Data Type     | Description                        |
| ------------- | ------------- | ---------------------------------- |
| title         | string        | Game title                         |
| description   | string        | Game description                   |
| averageRating | number        | Game average rating                |
| genre         | array[string] | Game genres (enum: `GAME_GENRES`)  |
| releaseDate   | string        | Game release date                  |
| posterUrl     | string        | Game poster URL                    |
| backdropUrl   | string        | Game backdrop URL                  |
| isActive      | boolean       | Game active status                 |
| status        | string        | Game status (enum: `MEDIA_STATUS`) |
| platforms     | array[string] | Game platforms                     |

Note: The `ObjectId` type refers to the MongoDB ObjectId type, which is used to reference other documents in the database.
