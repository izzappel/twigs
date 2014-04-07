'use strict';


angular.module('twigsDemo')
    .controller('DemoChooseCtrl', function ($scope) {


        $scope.allCountries = [
            {id: 1, name: 'Switzerland', code: 'CH'},
            {id: 2, name: 'Austria', code: 'AU'},
            {id: 3, name: 'Germany', code: 'DE'}
        ];


        $scope.setSelectedCountry = function (id) {
            $scope.selectedCountry = {
                id: id
            };

            $scope.nSelectedCountry = id;
        };

        $scope.setSelectedCountries = function (idArray) {
            $scope.nSelectedCountries = idArray;
            var idObjectArray = [];

            idArray.forEach(function (item) {
                idObjectArray.push({id: item});
            });
            $scope.selectedCountries = idObjectArray;
        };

        $scope.setSelectedCountry(2);
        $scope.setSelectedCountries([1, 3]);

    });