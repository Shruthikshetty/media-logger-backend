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

| Field Name     | Data Type | Description                               |
| -------------- | --------- | ----------------------------------------- |
| tvShow         | ObjectId  | Reference to the TV show                  |
| seasonNumber   | number    | Season number                             |
| title          | string    | Season title                              |
| description    | string    | Season description                        |
| releaseDate    | date      | Season release date                       |
| noOfEpisodes   | number    | Number of episodes                        |
| posterUrl      | string    | Season poster URL                         |
| seasonRating   | number    | Season rating                             |
| status         | string    | Season status (enum: `SEASON_STATUS`)     |
| youtubeVideoId | string    | Season trailer YouTube embed ID           |
| averageRating  | number    | average user rating for the season (0-10) |

### TV Episode Model

| Field Name    | Data Type | Description                                  |
| ------------- | --------- | -------------------------------------------- |
| season        | ObjectId  | Reference to the TV season                   |
| title         | string    | Episode title                                |
| description   | string    | Episode description                          |
| episodeNumber | number    | Episode number within the season             |
| releaseDate   | date      | Episode release date                         |
| runTime       | number    | Episode run time in minutes                  |
| stillUrl      | string    | URL for a still image from the episode       |
| averageRating | number    | Average rating of the episode (from 0 to 10) |

### Movie Model

#### Table: Movies

| Field Name     | Data Type     | Description                           |
| -------------- | ------------- | ------------------------------------- |
| title          | string        | Movie title                           |
| description    | string        | Movie description                     |
| averageRating  | number        | Movie average rating                  |
| genre          | array[string] | Movie genres (enum: `GENRE_MOVIE_TV`) |
| releaseDate    | string        | Movie release date                    |
| cast           | array[string] | Movie cast                            |
| directors      | array[string] | Movie directors                       |
| runTime        | number        | Movie run time                        |
| languages      | array[string] | Movie languages                       |
| posterUrl      | string        | Movie poster URL                      |
| backdropUrl    | string        | Movie backdrop URL                    |
| isActive       | boolean       | Movie active status                   |
| status         | string        | Movie status (enum: `MEDIA_STATUS`)   |
| tags           | array[string] | Movie tags                            |
| ageRating      | number        | Movie age rating                      |
| youtubeVideoId | string        | Movie trailer YouTube embed ID        |

### Game Model

#### Table: Games

| Field Name     | Data Type     | Description                        |
| -------------- | ------------- | ---------------------------------- |
| title          | string        | Game title                         |
| description    | string        | Game description                   |
| averageRating  | number        | Game average rating                |
| genre          | array[string] | Game genres (enum: `GAME_GENRES`)  |
| releaseDate    | date          | Game release date                  |
| posterUrl      | string        | Game poster URL                    |
| backdropUrl    | string        | Game backdrop URL                  |
| isActive       | boolean       | Game active status                 |
| status         | string        | Game status (enum: `MEDIA_STATUS`) |
| platforms      | array<string> | Game platforms                     |
| developer      | string        | Game developer                     |
| ageRating      | number        | Game age rating                    |
| youtubeVideoId | string        | Game trailer embed ID              |

Note: The `ObjectId` type refers to the MongoDB ObjectId type, which is used to reference other documents in the database.
