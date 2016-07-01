module Main exposing (main)

import Html.App as App

import View exposing (view)
import Update exposing (update)
import Types exposing (Model, Msg(..), UserNameInfo)

main : Program Never
main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


init : (Model, Cmd Msg)
init =
  ({ user = UserNameInfo "" "" "" }, Cmd.none)


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

