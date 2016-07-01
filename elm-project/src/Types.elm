module Types exposing (..)

import Http

type alias RandomUserResp =
  { name : UserNameInfo
  }

type alias UserNameInfo =
  { title : String, first: String, last : String
  }

type alias Results =
  { results : List RandomUserResp }

type alias Model =
  { user : UserNameInfo
  }

type Msg
  = OnUserClick
  | FetchFail Http.Error
  | FetchSucceed Results


defaultUserNameInfo : UserNameInfo
defaultUserNameInfo =
  UserNameInfo "" "" ""
