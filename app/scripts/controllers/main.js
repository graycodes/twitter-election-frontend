'use strict';

/**
 * @ngdoc function
 * @name twitterElectionFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the twitterElectionFrontendApp
 */
angular.module('twitterElectionFrontendApp', ['highcharts-ng'])
    .controller('MainCtrl', function ($scope, $http) {

        $scope.election1Config = {

            options: {
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },

            loading: 'Loading pls wait',

            title: {
                text: 'Election Mentions'
            },

            loading: false,


            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            }
        };

        $http.get('http://gmacg.me.uk/election/data').then(function (response) {
            var rawData = response.data;

            var parties = _.uniq(_.pluck(rawData, '_id.party'));

            var data = _.map(parties, function (party) {
                var partyData = _.filter(rawData, function (d) {
                    return d._id.party == party;
                });
                var sorted = _.sortByAll(partyData, ['_id.year', '_id.month', '_id.day', '_id.hour']);
                
                var data = _.map(sorted, function (item) {
                    return [Date.UTC(item._id.year, item._id.month, item._id.day, item._id.hour), item.count];
                });

                return {
                    name: party,
                    data: data
                };
            });
            $scope.election1Config.series = data;
        });
    });
