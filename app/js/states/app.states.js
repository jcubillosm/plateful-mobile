(function() {
  angular
    .module('app.states', [
      "app.states.menu",
      "app.states.item",
      "app.states.map",
      "app.states.login",
      "app.states.splash"
    ]);
}).call(this);
