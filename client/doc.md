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
    },
    "log": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
}

[WIP] POST /register -> some bot

[WIP] POST /unregister -> some bot

GET /watchers/length -> Number

GET /watchers/last -> 100 last watchers

GET /watchers/last/:n -> n last watchers

GET /watchers/:n -> some watchers

GET /watchers/ -> 100 fst watchers

GET /watchers/:n/:m -> n to m watchers

GET /watchers/:id -> 
  {
    id : number
    type : string
    assigned : boolean
    monals : [ string ]
  }


GET /watchers/ -> [
  {
    id : number
    type : string
    assigned : boolean
    monals : [ string ]
  }
]

POST /watchers -> [
  {
    id : number
    type : string
    assigned : boolean
    monals : [ string ]
  }
]


GET /gamblers/length -> Number

GET /gamblers/last -> 100 last gamblers

GET /gamblers/last/:n -> n last gamblers

GET /gamblers/:n -> some gamblers

GET /gamblers/ -> 100 fst gamblers

GET /gamblers/:n/:m -> n to m gamblers

GET /gamblers/:id -> 
  {
    id : number
    type : string
    assigned : boolean
    symbol : {
      symbol : string
      status : string
      baseAsset : string
      baseAssetPrecision : number
      quoteAsset : string
      quotePrecision : number
      orderTypes : [ string ]
      icebergAllowed : boolean
    }
    hold : number
    ref : number
    gold : number
    state : string
    init : number
    top : number
    bottom : number
    balance : string
  }


GET /gamblers/ -> [
  {
    id : number
    type : string
    assigned : boolean
    symbol : {
      symbol : string
      status : string
      baseAsset : string
      baseAssetPrecision : number
      quoteAsset : string
      quotePrecision : number
      orderTypes : [ string ]
      icebergAllowed : boolean
    }
    hold : number
    ref : number
    gold : number
    state : string
    init : number
    top : number
    bottom : number
    balance : string
  }
]

POST /gamblers -> [
  {
    id : number
    type : string
    assigned : boolean
    symbol : {
      symbol : string
      status : string
      baseAsset : string
      baseAssetPrecision : number
      quoteAsset : string
      quotePrecision : number
      orderTypes : [ string ]
      icebergAllowed : boolean
    }
    hold : number
    ref : number
    gold : number
    state : string
    init : number
    top : number
    bottom : number
    balance : string
  }
]


log : [ string ]
GET /log/length -> Number

GET /log/last -> 100 last log

GET /log/last/:n -> n last log

GET /log/:n -> some log

GET /log/ -> 100 fst log

GET /log/:n/:m -> n to m log

POST /log -> some log. Should has a Content-Type: text/plain


