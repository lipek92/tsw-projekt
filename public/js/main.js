
/*jshint globalstrict: true, devel: true, browser: true, jquery: true */
/* global io */
"use strict";

var socket = io.connect('http://' + location.host);

$(document).ready(function (){

	$("#messageForm").submit(function() {

		var option = $("#option").find(":selected").val();
		var time = $("#time").val();
		var comment = $("#comment").val();
        var goalTeam = $("#goalTeam").find(":selected").val();

        if (time === "")
        {
            time = "withoutMin";
            option = "withoutMin";
        }

		var data = {
			image: option,
			min: time,
			msg: comment,
		};

		socket.emit('send msg', data);

        if (option === "gol")
        {
            socket.emit('send score', goalTeam);
        }

	});

    $("#clubsForm").submit(function() {
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
            msg: "Za chwilę rozpocznie się relacja z meczu "+firstClub+ " - " +secondClub+"!"
        };

        socket.emit("send clubs", data);
        socket.emit("send msg", msg);
    });

    $("#option").change(function() {
        var value = $("#option").val();

        if (value === "gol")
        {
            $("#goalTeam").show();
        }
        else
        {
            $("#goalTeam").hide();
        }
    });

    $("#endForm").submit(function()
    {
        socket.emit("end relation");
    });

    socket.on("rec score", function(data) {
        $('#score').html(data.fcScore + " : " + data.scScore);
        document.title = (data.fc + " " + data.fcScore + ":" + data.scScore + " " + data.sc);

    });

    socket.on("rec msg", function(data) {

        var text = "";
        text += '<div class="message">';
        text += '<div class="icon '+data.image+'"><img src = "images/'+data.image+'.png" /></div>';
        text += '<div class="min '+data.min+'" >'+data.min+' min.</div>';
        text += '<div class="comment">'+data.msg+'</div>';
        text += '</div>';

        $('#relation').prepend(text);

        if (data.image === "penalty")
        {
            $("<embed src='sounds/whistle.mp3' hidden='true' autostart='true' loop='false' class='playSound'>" + "<audio autoplay='autoplay' style='display:none;' controls='controls'><source src='sounds/whistle.mp3' /></audio>").appendTo('body');
        } else if (data.image === "gol"){
            $("<embed src='sounds/goal.mp3' hidden='true' autostart='true' loop='false' class='playSound'>" + "<audio autoplay='autoplay' style='display:none;' controls='controls'><source src='sounds/goal.mp3' /></audio>").appendTo('body');

        }

    });

    socket.on('history', function (data) {
        var text = "";
        $.each(data,function(){
            var el = arguments[1];
            text += '<div class="message">';
            text += '<div class="icon '+el.image+'"><img src = "images/'+el.image+'.png" /></div>';
            text += '<div class="min '+el.min+'">'+el.min+' min.</div>';
            text += '<div class="comment">'+el.msg+'</div>';
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

            $("#firstClubInput").val(data.fc);
            $("#secondClubInput").val(data.sc);

            $("#option").removeAttr("disabled");
            $("#time").removeAttr("disabled");
            $("#comment").removeAttr("disabled");
            $("#messageSubmit").removeAttr("disabled");
            $("#endRelation").removeAttr("disabled");
        } else {
            $('#score').html("Brak relacji!");

            $("#firstClubInput").removeAttr("disabled");
            $("#secondClubInput").removeAttr("disabled");
            $("#clubsSubmit").removeAttr("disabled");
        } 
        

    });

});