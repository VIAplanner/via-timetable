const { Schema } = require("mongoose");
//  Two options, not sure which one to use
const courses = new Schema({
  "type": "object",
  "properties": {
    "_id": {
      "type": "object",
      "properties": {
        "$oid": {
          "type": "string"
        }
      },
      "required": [
        "$oid"
      ]
    },
    "id": {
      "type": "string"
    },
    "code": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "division": {
      "type": "string"
    },
    "department": {
      "type": "string"
    },
    "prerequisites": {
      "type": "string"
    },
    "exclusions": {
      "type": "string"
    },
    "level": {
      "type": "object",
      "properties": {
        "$numberInt": {
          "type": "string"
        }
      },
      "required": [
        "$numberInt"
      ]
    },
    "campus": {
      "type": "string"
    },
    "term": {
      "type": "string"
    },
    "breadths": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "$numberInt": {
              "type": "string"
            }
          },
          "required": [
            "$numberInt"
          ]
        }
      ]
    },
    "meeting_sections": {
      "type": "array",
      "items": [
        {
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            },
            "instructors": {
              "type": "array",
              "items": [
                {
                  "type": "string"
                }
              ]
            },
            "times": {
              "type": "array",
              "items": [
                {
                  "type": "object",
                  "properties": {
                    "day": {
                      "type": "string"
                    },
                    "start": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "end": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "duration": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "location": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "day",
                    "start",
                    "end",
                    "duration",
                    "location"
                  ]
                }
              ]
            },
            "size": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            },
            "enrolment": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            }
          },
          "required": [
            "code",
            "instructors",
            "times",
            "size",
            "enrolment"
          ]
        },
        {
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            },
            "instructors": {
              "type": "array",
              "items": {}
            },
            "times": {
              "type": "array",
              "items": [
                {
                  "type": "object",
                  "properties": {
                    "day": {
                      "type": "string"
                    },
                    "start": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "end": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "duration": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "location": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "day",
                    "start",
                    "end",
                    "duration",
                    "location"
                  ]
                }
              ]
            },
            "size": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            },
            "enrolment": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            }
          },
          "required": [
            "code",
            "instructors",
            "times",
            "size",
            "enrolment"
          ]
        },
        {
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            },
            "instructors": {
              "type": "array",
              "items": {}
            },
            "times": {
              "type": "array",
              "items": [
                {
                  "type": "object",
                  "properties": {
                    "day": {
                      "type": "string"
                    },
                    "start": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "end": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "duration": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "location": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "day",
                    "start",
                    "end",
                    "duration",
                    "location"
                  ]
                }
              ]
            },
            "size": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            },
            "enrolment": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            }
          },
          "required": [
            "code",
            "instructors",
            "times",
            "size",
            "enrolment"
          ]
        },
        {
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            },
            "instructors": {
              "type": "array",
              "items": {}
            },
            "times": {
              "type": "array",
              "items": [
                {
                  "type": "object",
                  "properties": {
                    "day": {
                      "type": "string"
                    },
                    "start": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "end": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "duration": {
                      "type": "object",
                      "properties": {
                        "$numberInt": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "$numberInt"
                      ]
                    },
                    "location": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "day",
                    "start",
                    "end",
                    "duration",
                    "location"
                  ]
                }
              ]
            },
            "size": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            },
            "enrolment": {
              "type": "object",
              "properties": {
                "$numberInt": {
                  "type": "string"
                }
              },
              "required": [
                "$numberInt"
              ]
            }
          },
          "required": [
            "code",
            "instructors",
            "times",
            "size",
            "enrolment"
          ]
        }
      ]
    }
  },
  "required": [
    "_id",
    "id",
    "code",
    "name",
    "description",
    "division",
    "department",
    "prerequisites",
    "exclusions",
    "level",
    "campus",
    "term",
    "breadths",
    "meeting_sections"
  ]
})

module.exports.courses = courses;







  //   var courses2 = new Schema({
//     "_id": {
//       "$oid": {
//         "type": "ObjectId"
//       }
//     },
//     "id": {
//       "type": "String"
//     },
//     "code": {
//       "type": "String"
//     },
//     "name": {
//       "type": "String"
//     },
//     "description": {
//       "type": "String"
//     },
//     "division": {
//       "type": "String"
//     },
//     "department": {
//       "type": "String"
//     },
//     "prerequisites": {
//       "type": "String"
//     },
//     "exclusions": {
//       "type": "String"
//     },
//     "level": {
//       "$numberInt": {
//         "type": "Date"
//       }
//     },
//     "campus": {
//       "type": "String"
//     },
//     "term": {
//       "type": "String"
//     },
//     "breadths": {
//       "type": [
//         "Mixed"
//       ]
//     },
//     "meeting_sections": {
//       "type": [
//         "Mixed"
//       ]
//     }
//   })




