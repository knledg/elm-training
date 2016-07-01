module Tasks exposing (getRandomUser)

import Http
import Task
import Json.Decode as JD exposing ((:=))

import Types exposing (Msg(..), RandomUserResp, Results, UserNameInfo)

getRandomUser : Cmd Msg
getRandomUser =
  let
    url =
      "http://api.randomuser.me"
  in
    Http.get userResultsDecoder url
      |> Task.perform FetchFail FetchSucceed

userDecoder : JD.Decoder RandomUserResp
userDecoder =
  JD.object1 RandomUserResp ("name" := userNameDecoder)

userNameDecoder : JD.Decoder UserNameInfo
userNameDecoder =
  JD.object3 UserNameInfo
    ("title" := JD.string)
    ("first" := JD.string)
    ("last" := JD.string)

userResultsDecoder : JD.Decoder Results
userResultsDecoder =
  JD.object1 Results ("results" := (JD.list userDecoder))
