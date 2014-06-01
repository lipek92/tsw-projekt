var app = angular.module('relacja', []);

app.factory('socket', function () {
    var socket = io.connect('http://' + location.host);
    return socket;
});

app.controller('relacjaCtrlr', ['$scope', 'socket',
    function ($scope, socket) {
        var tagsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        var replaceTag = function (tag) {
            return tagsToReplace[tag] || tag;
        };
        var safe_tags_replace = function (str) {
            return str.replace(/[&<>]/g, replaceTag);
        };
        $scope.msgs = [];
        $scope.connected = false;
        $scope.sendMsg = function () {

            if ($scope.msg && $scope.msg.text) {
           //     socket.emit('send min', safe_tags_replace($scope.min.text));

           //     socket.emit('send msg', safe_tags_replace($scope.msg.text));

                var mssg = {
                image: $scope.option.text,
                min: $scope.min.text,
                msg: $scope.msg.text
            };
        socket.emit('send msg',mssg);

                $scope.msg.text = '';
            }
        };
        socket.on('connect', function () {
            $scope.connected = true;
            $scope.$digest();
        });
        socket.on('history', function (data) {
            $scope.msgs = data;
            $scope.$digest();
        });
        socket.on('rec msg', function (data) {
            $scope.msgs.unshift(data);
            $scope.$digest();
        });
    }
]);
