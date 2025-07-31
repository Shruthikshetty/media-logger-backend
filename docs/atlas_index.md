
## Movie index
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "ageRating": {
        "type": "number"
      },
      "averageRating": {
        "type": "number"
      },
      "genre": [
        {
          "type": "token"
        }
      ],
      "languages": [
        {
          "type": "token"
        }
      ],
      "releaseDate": {
        "type": "date"
      },
      "runTime": {
        "type": "number"
      },
      "status": {
        "type": "token"
      },
      "tags": [
        {
          "type": "token"
        }
      ],
      "title": {
        "type": "string"
      }
    }
  }
}
```

## Games index
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "ageRating": {
        "type": "number"
      },
      "averageRating": {
        "type": "number"
      },
      "genre": [
        {
          "type": "token"
        }
      ],
      "languages": [
        {
          "type": "token"
        }
      ],
      "releaseDate": {
        "type": "date"
      },
      "runTime": {
        "type": "number"
      },
      "status": {
        "type": "token"
      },
      "tags": [
        {
          "type": "token"
        }
      ],
      "title": {
        "type": "string"
      }
    }
  }
}
```