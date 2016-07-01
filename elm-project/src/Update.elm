module Update exposing (update)

import Types exposing (Model, Msg(..), UserNameInfo, defaultUserNameInfo)
import Tasks exposing (getRandomUser)


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    OnUserClick ->
      (model, getRandomUser)

    FetchSucceed results ->
      let
        user =
          case List.head results.results of
            Nothing -> defaultUserNameInfo

            Just user ->
              user.name
      in
        ({ model | user = user }, Cmd.none)

    _ ->
      (model, Cmd.none)
