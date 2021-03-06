(function() {
  var MenusTab = function($stateProvider, $urlRouterProvider) {
    return $stateProvider.state("tab.menus", {
      url: "/menus",
      views: {
        "tab-menus": {
          templateUrl: "js/tabs/menus/views/menus.html",
          controller: "MenusCtrl as vm"
        }
      },
      resolve: {
        locationData: function() {
          return {
            lat: window.currLocation.coords.latitude,
            lng: window.currLocation.coords.longitude,
            dist: 0.6
          };
        },
        resolvedMenuData: function(Menu, BackgroundGeo, $ionicLoading) {
          var coords = this.resolve.locationData();
          $ionicLoading.show({template:'Loading Menus...'});
          return Menu.getByLocation(coords, null)
            .then(function(menus) {
              // Add distance from user to each menu.
              _.each(menus, function(menu) {
                menu.dist = BackgroundGeo.distance(menu.latitude, menu.longitude);
              });
              $ionicLoading.hide();
              return menus;
            });
        }
      }
    }).state("tab.menus-map", {
      url: "/menus/map",
      views: {
        "tab-menus": {
          templateUrl: "js/states/map/views/menusMap.html",
          controller: "MenusMapCtrl as vm"
        }
      }
    }).state("tab.menus-item", {
      url: '/menus/item/:itemId',
      views: {
        "tab-menus": {
          templateUrl: "js/states/item/item.html",
          controller: "ItemCtrl as vm"
        }
      }
    }).state("tab.menus-menu", {
      url: '/menus/menu/:menu_id',
      views: {
        "tab-menus": {
          templateUrl: "js/states/menu/menu.html",
          controller: "MenuCtrl as vm"
        }
      },
      resolve: {
        menuInit: function(Menu, $stateParams) {
          return Menu.find($stateParams.menu_id)
            .then(function(data) {
              return data;
            });
        },
        menuItemsInit: function(Menu, $stateParams) {
          return Menu.getMenuItems($stateParams.menu_id)
            .then(function(data) {
              return data;
            });
        }
      }
    });

    ////////////////////

    function resolveMenusCtrl(BackgroundGeo, ngGPlacesAPI){

      return BackgroundGeo.current()
        .then(function (data){
          var searchQuery = {
            vicinity: 'San Francisco',
            latitude: data.latitude,
            longitude: data.longitude
          };
          return ngGPlacesAPI.nearbySearch( searchQuery )
            .then(function (data) {
              return data;
            });
        });
    }
  };

MenusTab.$inject = [
  '$stateProvider',
  '$urlRouterProvider'
];
angular
  .module('app.tabs.menus', [
    'app.tabs.menus.controllers',
    'app.tabs.menus.services'
  ])
  .config(MenusTab);

}).call(this);
