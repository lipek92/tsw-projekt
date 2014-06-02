var app = angular.module('relacja', []);

app.factory('socket', function () {
    var socket = io.connect('http://' + location.host);
    return socket;
});


app.controller('relacjaCtrlr', ['$scope', 'socket',
    function ($scope, socket) {

        $scope.msgs = [];
        $scope.connected = false;
        $scope.sendMsg = function () {
            if ($scope.msg && $scope.msg.text) {
                if($scope.min === undefined || $scope.min.text === null  || $scope.option === undefined)
                {
                    var mssg = {
                        image: "withoutMin",
                        min: "withoutMin",
                        msg: $scope.msg.text
                    };
                } else {
                    var mssg = {
                        image: $scope.option.text,
                        min: $scope.min.text,
                        msg: $scope.msg.text
                    };
                }

        socket.emit('send msg',mssg);

                $scope.msg.text = '';
                $scope.option.text = 'none';
            }
        };


        ////////////////////////////////////////////////////////

        $( document ).ready(function()
        {   
            $('#endRelation').click(function(event)
            {
                var mssg = {
                    image: "withoutMin",
                    min: "withoutMin",
                    msg: "Relacja została zakończona!"
                    };

                    socket.emit('send msg',mssg);

            

                 $('#endRelation').prop('disabled', 'disabled');
                 $('#sendMsg').prop('disabled', 'disabled');
                 $('#newRelation').prop('disabled', false);
                    
    });

});






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


app.controller('teamsCtrlr', ['$scope', 'socket',
    function ($scope, socket) {


            $scope.saveClubs = function () {
            var clubs = {
                firstClub: $scope.firstClub.text,
                secondClub: $scope.secondClub.text
            };
            socket.emit('send clubs', clubs);
            
        };


        socket.on('rec clubs', function (data) {
            $scope.$digest();
        });




}
]);
