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

         var partyColorMap = {
              tusc: '#ED0282',
              'lib dem': '#FCCB05',
              snp: '#fff58c',
              plaid: '#40832C',
              green: '#3CB921',
              conservative: '#3E7Bb8',
              ukip: '#7E3C9A',
              labour: '#EC4B43'
         };

        $scope.election1Config = {

            title: {
                text: 'Party Mentions on Twitter Over Time'
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

            var formatDates = function (item) {
                return [Date.UTC(item._id.year, item._id.month - 1, item._id.day, item._id.hour + 1), item.count];
            };

            var formatData =  function (party) {
                var partyData = _.filter(rawData, function (d) {
                    return d._id.party == party;
                });

                var sorted = _.sortByAll(partyData, ['_id.year', '_id.month', '_id.day', '_id.hour']);

                return {
                    name: party,
                    data: _.map(sorted, formatDates),
                    color: partyColorMap[party]
                };
            };

            $scope.election1Config.series = _.map(parties, formatData);;
        });
    });
