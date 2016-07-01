module View exposing (view)

import String

import Http
import Html exposing (Html, text, button, div, p)
import Html.Events exposing (onClick)

import Types exposing (Model, Msg(..))

view : Model -> Html Msg
view model =
  div
    []
    [ button [ onClick OnUserClick ] [ text "GET A USER!" ]
    , p
      []
      [ text
          <| (String.concat << List.intersperse " ") [model.user.title, model.user.first, model.user.last] ]
    ]

