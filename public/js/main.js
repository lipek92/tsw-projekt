"use strict";

var socket = io.connect('http://' + location.host);

$(document).ready(function (){

	$("#sendMsg").click(function() {

		//dopisac ifa
		var option = $("#option").find(":selected").val();
	//	var goalteam = $("#goalTeam").find(":selected").text();
		var time = $("#time").val();
		var comment = $("#comment").val();

		// if($scope.min === undefined || $scope.min.text === null  || $scope.option === undefined) {
		// 	option = "withoutMin";
		// 	min = "withoutMin";
		// }

        if (time === "")
        {
            time = "withoutMin";
            option = "withoutMin";
        }

		var data = {
			image: option,
			min: time,
			msg: comment
		//	goalTeam: goalteam
		};

		socket.emit('send msg', data);

        $("comment").text = '';
        $("#option").text = 'none';
   //     $("#goalTeam").hide();
	});

    $("#saveClubs").click(function() {
        var firstClub = $("#firstClubInput").val();
        var secondClub = $("#secondClubInput").val();
        var data = {
            fc: firstClub,
            sc: secondClub,
            fcScore: "0",
            scScore: "0"
        };
        var msg = {
            image: "withoutMin",
            min: "withoutMin",
            msg: "Za chwilę rozpocznie się relacja z meczu "
            +firstClub+ " - " +secondClub+"!"
        };

        socket.emit("send clubs", data);
        socket.emit('send msg', msg);
    });

    socket.on("recScore", function(data) {
    	$("#score > p").text(data.team1 + " : " + data.team2);
    });

    socket.on("rec msg", function(data) {
    	// console.log(data);
    	// var divParent = document.createElement("div");
    	// var divIcon = document.createElement("div");
    	// $(divIcon).addClass("icon").attr("src", "images/"+data.image+".png");
    	// var divMin = document.createElement("div");
    	// $(divMin).addClass("min").text(data.min + " min.");
    	// var divComment = document.createElement("div");
    	// $(divComment).addClass("comment").text(data.msg);
    	// $(divParent).append(divIcon).append(divMin).append(divComment);
    	// $("#relation").append(divParent);
        var text = "";
        text += '<div class="message">'
        text += '<div class="icon '+data.image+'"><img src = "images/'+data.image+'.png" /></div>'
        text += '<div class="min '+data.min+'" >'+data.min+' min.</div>'
        text += '<div class="comment">'+data.msg+'</div>'
        text += '</div>';

        $('#relation').prepend(text);

    });

    socket.on('history', function (data) {
        var text = "";
        $.each(data,function(i,el){

            text += '<div class="message">'
            text += '<div class="icon '+el.image+'"><img src = "images/'+el.image+'.png" /></div>'
            text += '<div class="min '+el.min+'">'+el.min+' min.</div>'
            text += '<div class="comment">'+el.msg+'</div>'
            text += '</div>';
        });
        $('#relation').html(text);

    });

    socket.on('rec clubs', function (data) {
        
        $('#firstClub').html(data.fc);
        $('#secondClub').html(data.sc);

        if (data.fc !== "" && data.sc !== "")
        {
            $('#score').html(data.fcScore + " : " + data.scScore);
        } else {
            $('#score').html("Brak relacji!");
        } 
        

    });

});