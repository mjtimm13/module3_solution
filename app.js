(function () {
'use strict';

angular.module('NarrowItDownApp', [])

.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
// The URL for the REST Endpoint is https://davids-restaurant.herokuapp.com/menu_items.json
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

// Declare and create foundItems directive. The list should be displayed using this
// directive which takes the found array of items specified on it as an attribute
// (think one-way binding with '<'). To implement the functionality of the "Don't want
// this one!" button, the directive should also provide an on-remove attribute that will
// use function reference binding to invoke the parent controller removal an item from the
// found array based on an index into the found array. The index should be passed in from
// the directive to the controller. (Note that we implemented almost identical type of
// behavior in the Lecture 30 Part 2, so as long as you understood that code, it should
// be very close to copy/paste). In the NarrowItDownController, simply remove that item
// from the found array. You can do that using the Array's splice() method. For example,
// to remove an item with the index of 3 from the found array, you would call found.splice(3, 1);.

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '=',
      refineFurther: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'narrowit',
    bindToController: true
  };

  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {

  // call the getMatchedMenuItems method when appropriate and store the result in a property
  //called found attached to the controller instance.

  var narrowit = this;

  var promise = MenuSearchService.getMenuCategories();

  promise.then(function (response) {
    narrowit.menuitems = response.data;
    //narrowit.menuitems = narrowit.menuitems.substring(14);
    console.log(narrowit.menuitems);
  })
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });

  narrowit.logMenuItems = function (searchTerm) {
    var promise = MenuSearchService.getMenuItems();
    var founditems = [] ;
    var i = 0 ;
    //console.log(promise);
    promise.then(function (response) {
      console.log(response.data);
      narrowit.menuitem = response.data;
      console.log(narrowit.menuitem.menu_items.length);
      if (searchTerm == null || searchTerm == ""){
        searchTerm = "qwertyuiop";
      }
      for (i = 0; i < narrowit.menuitem.menu_items.length; i++) {
        var descr = narrowit.menuitem.menu_items[i].description.toLowerCase();
        if (descr !== null &&
            descr !== "" &&
            descr.indexOf(searchTerm.toLowerCase()) !== -1) {
              founditems.push(narrowit.menuitem.menu_items[i]);
           }
        else{
              narrowit.menuitem.menu_items.splice(i, 1);
            }
      }

      console.log(founditems);
      narrowit.founditems = founditems;
      console.log(narrowit.founditems);

    })
    .catch(function (error) {
      console.log(error);
    })

  };

  narrowit.refineFurther = function(itemIndex){
    narrowit.founditems.splice(itemIndex, 1);
  };

}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  //var menusrch = this;

  // getMatchedMenuItems(searchTerm)

  //will be responsible for reaching out to the server (using the $http service) to retrieve
  //the list of all the menu items. Once it gets all the menu items, it should loop through
  //them to pick out the ones whose description matches the searchTerm. Once a list of found
  //items is compiled, it should return that list (wrapped in a promise). Remember that the
  //then function itself returns a promise. Your method would roughly look like this:

  //return $http(...).then(function (result) {
    // ...process result and only keep items that match...
    //var foundItems...

    // ...return processed items...
    //return foundItems;

    var service = this;

    service.getMenuCategories = function () {
      var response = $http({
        method: "GET",
        //url: (ApiBasePath + "/menu_items.json")
        url: (ApiBasePath + "/categories.json")
      });

      return response;
    };

    service.getMenuItems = function () {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      });

      return response;
    };

}

})();
