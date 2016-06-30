"use strict";

/**
  This is not to be an example of "how to" in JavaScript
  Actually this code is most likely bad and I would not recommend it.
  It was written just to get a basic working example of our final project.
**/

let state = { users: [], currentUser: {}, search: "" };

const getUsers = (amount) => {
  return axios.get(`http://api.randomuser.me/?results=${amount}`)
}

const parseRanomUsers = _.flowRight(_.get("results"), _.get("data"));

const update = (action, state = {}, data) => {
  switch (action) {
    case "updateUsers":
      const newState = _.assign({ users: data }, state, {});
      const evt = new CustomEvent("$updatedState", newState);
      document.dispatchEvent(evt);
      return newState;
    case "updateCurrentUser":
      const nState = _.assign({ currentUser: data }, (state || {}), {});
      const _e = new CustomEvent("$updatedState", { detail : nState });
      document.dispatchEvent(_e);
      return nState
    default:
      const e = new CustomEvent("$updatedState", state);
      return state;
  }
}

const renderUserProfile = (employee) => {
  const div = document.createElement("div");
  const h1 = document.createElement("h1");
  h1.innerHTML = `${employee.name.first} ${employee.name.last}`
  div.appendChild(h1);
  div.appendChild(renderUserProfileImage(employee));
  div.appendChild(renderEmployeeInformation(employee));
  return div;
}

const renderUserProfileImage = (user) => {
  const img = document.createElement("img");
  const div = document.createElement("div");
  div.classList.add("img-container");
  img.src = user.picture.large;
  div.appendChild(img);
  return div;
}

const renderEmployeeInformation = user => {
  const div = document.createElement("div");
  const employeeInfo = _.pick(["email", "login", "cell"], user);
  const info = _.map(e => {
    const p = document.createElement("p");
    if (_.isObject(employeeInfo[e])) {
      p.innerHTML = `<b>Username</b>: ${employeeInfo[e].username}`;
      return p;
    }
    switch (e) {
      case "email":
        p.innerHTML = `<b>Email</b>: ${employeeInfo[e]}`;
        break;
      case "cell":
        p.innerHTML = `<b>Cell</b>: ${employeeInfo[e]}`;
        break;
    }

    return p;
  }, _.keys(employeeInfo));

  _.each((p) => div.appendChild(p), info);
  div.classList.add("employee-info")
  return div;
}

const renderEmployeeList = (users) => {
  const div = document.createElement("div");
  const input = document.createElement("input");
  const ul = document.createElement("ul");
  const appendLi = _.flowRight(
    _.each(li => ul.appendChild(li)),
    _.map(renderUserDirectory)
  );
  appendLi(users)
  input.placeholder = "Search";
  input.value = state.search;
  input.addEventListener("input", onEmployeeSearch)
  div.classList.add("employee-directory");
  div.appendChild(input);
  div.appendChild(ul);
  return div;
}

const renderUserDirectory = user => {
  const li = document.createElement("li");
  li.innerHTML = `${user.name.first} ${user.name.last}`;
  li.addEventListener("click", onEmployeeNameclick);
  return li;
}

const render = (html, node) => {
  node.innerHTML = "";
  node.appendChild(html);
  document.querySelector("input").focus();
};

const main = () => {
  if (!_.isEmpty(state.users)) {
    renderMain();
  }
  else {
    getUsers(50)
      .then(results => {
        const newState = update("updateUsers", state, parseRanomUsers(results));
        renderMain(newState);
      });
  }
}

const renderMain = (newState) => {
  const currentUser = _.isEmpty(state.currentUser) ? newState.users[0] : state.currentUser;
  if (newState && newState.users) {
    state.users = newState.users;
    render(renderEmployeeList(newState.users), document.querySelector(".directory"));
  }

  render(renderUserProfile(currentUser), document.querySelector(".profile"));
}

const onEmployeeNameclick = (e) => {
  const lastName = _.last(e.target.innerHTML.split(" "));
  update("updateCurrentUser", null, {name: lastName})
}

const onEmployeeSearch = (e) => {
  const value = e.target.value;
  state.search = value;
  if (value === "") {
    renderMain(state);
    return null;
  }
  const filteredEmpolyees = _.filter(user => {
    return _.contains(value, user.name.last);
  }, state.users);

  render(renderEmployeeList(filteredEmpolyees), document.querySelector(".directory"));
}

document.addEventListener("$updatedState", ({ detail }) => {
  if (detail !== null) {
    const currentUserLastName = detail.currentUser.name;
    const newUser = _.head(_.filter(user => {
      return _.get("name.last", user) === currentUserLastName;
    }, state.users));
    state = _.assign({ currentUser: newUser }, state, {})

    const _e = new CustomEvent("$updatedStateComplete", { detail : state });
    document.dispatchEvent(_e);
  }
});

document.addEventListener("$updatedStateComplete", main);
document.addEventListener("DOMContentLoaded", main)
