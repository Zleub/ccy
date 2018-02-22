GET / -> client/index.html

GET /data -> {
  "$schema": "http://json-schema.org/schema#",
  "id": "",
  "type": "object",
  "properties": {
    "watchers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number"
          },
          "type": {
            "type": "string"
          },
          "assigned": {
            "type": "boolean"
          },
          "monals": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "gamblers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number"
          },
          "type": {
            "type": "string"
          },
          "assigned": {
            "type": "boolean"
          },
          "symbol": {
            "type": "object",
            "properties": {
              "symbol": {
                "type": "string"
              },
              "status": {
                "type": "string"
              },
              "baseAsset": {
                "type": "string"
              },
              "baseAssetPrecision": {
                "type": "number"
              },
              "quoteAsset": {
                "type": "string"
              },
              "quotePrecision": {
                "type": "number"
              },
              "orderTypes": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              },
              "icebergAllowed": {
                "type": "boolean"
              },
              "filters": {
                "type": "array"
              }
            }
          },
          "hold": {
            "type": "number"
          },
          "ref": {
            "type": "number"
          },
          "gold": {
            "type": "number"
          },
          "state": {
            "type": "string"
          },
          "init": {
            "type": "number"
          },
          "top": {
            "type": "number"
          },
          "bottom": {
            "type": "number"
          },
          "balance": {
            "type": "string"
          }
        }
      }
    }
  }
}

[WIP] POST /register -> some bot

[WIP] POST /unregister -> some bot

[WIP] GET /watchers/:id -> [
    id : number
    type : string
    assigned : boolean
    monals : [ string ]
]

POST /watchers -> [
    id : number
    type : string
    assigned : boolean
    monals : [ string ]
]

[WIP] GET /gamblers/:id -> [
    id : number
    type : string
    assigned : boolean
      symbol : string
      status : string
      baseAsset : string
      baseAssetPrecision : number
      quoteAsset : string
      quotePrecision : number
      orderTypes : [ string ]
      icebergAllowed : boolean
    hold : number
    ref : number
    gold : number
    state : string
    init : number
    top : number
    bottom : number
    balance : string
]

POST /gamblers -> [
    id : number
    type : string
    assigned : boolean
      symbol : string
      status : string
      baseAsset : string
      baseAssetPrecision : number
      quoteAsset : string
      quotePrecision : number
      orderTypes : [ string ]
      icebergAllowed : boolean
    hold : number
    ref : number
    gold : number
    state : string
    init : number
    top : number
    bottom : number
    balance : string
]

