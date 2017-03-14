var all_checked_categories = [];
var teams = [];
var question_chosen;
var category_chosen;
var points;

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.scores = [0,0,0,0];
    $scope.teams=[];
    $scope.button_clicked=false;
    $scope.increaseScore = function(index) {
        $scope.scores[index] += (parseInt(question_chosen) + 1) * 100;
        $scope.button_clicked = true;
    }
    $scope.enable_buttons = function() {
        $scope.button_clicked=false;
    }
});

function get_chosen_categories() {
    $('.messageCheckbox:checked').each(function() {
        all_checked_categories.push($(this).val());
    });

    $.ajax({url:"http://localhost:8080/"}).done(function(data) {
        for (var i = 0; i < all_checked_categories.length; i++) {
            $('#category_headers').append('<th>' + all_checked_categories[i] + '</th>');
            var id = all_checked_categories[i];
            $('#100').append('<td><a href="javascript:void(0)" class="question_link" id="0\n'+id+'" onclick="get_question()">' + 100 + '</a></td>');
            $('#200').append('<td><a href="javascript:void(0)" class="question_link" id="1\n'+id+'" onclick="get_question()">' + 200 + '</a></td>');
            $('#300').append('<td><a href="javascript:void(0)" class="question_link" id="2\n'+id+'" onclick="get_question()">' + 300 + '</a></td>');
            $('#400').append('<td><a href="javascript:void(0)" class="question_link" id="3\n'+id+'" onclick="get_question()">' + 400 + '</a></td>');
            $('#500').append('<td><a href="javascript:void(0)" class="question_link" id="4\n'+id+'" onclick="get_question()">' + 500 + '</a></td>');
        }
    });
}

function validate_setup() {
    $('.team_name').each(function() {
        if ($(this).val() != '') {
            teams.push($(this).val());
        }
    });

    var number_of_categories_chosen = 0;

    $('input:checkbox.messageCheckbox').each(function () {
        if (this.checked) {
            number_of_categories_chosen += 1;
        }
    });

    if (number_of_categories_chosen != 5 || teams.length < 2) {
        if (number_of_categories_chosen != 5) {
            alert("You must choose 5 categories");
        }
        if (teams.length < 2) {
           alert("There must be more than 2 teams"); 
        }
        number_of_categories_chosen = 0;        
        teams = [];
    } else {
        get_chosen_categories();
        set_game_without_questions_visible();
        get_questions();
    }
    
    for (var i = 0; i < teams.length; ++i) {
        console.log(teams[i]);
    }
}

function set_game_without_questions_visible() {
    $('.setup').css("display", "none");
    $('.game_without_questions').css("display", "block");
}

function get_questions() {
    for (var i = 0; i < all_checked_categories.length; ++i) {
        var url2 = "http://localhost:8080/questions/"+all_checked_categories[i];
        $.getJSON( url2, function( data ) { 
            $.each(data, function(i, field){
                $('#100_point_questions').empty().append('<td>' + field[0].question + '</td>');
                $('#200_point_questions').empty().append('<td>' + field[1].question + '</td>');
                $('#300_point_questions').empty().append('<td>' + field[2].question + '</td>');
                $('#400_point_questions').empty().append('<td>' + field[3].question + '</td>');
                $('#500_point_questions').empty().append('<td>' + field[4].question + '</td>');
            });
        });
    }
}

function get_question() {
    var question_clicked = event.target.id;
    console.log(question_clicked);
    var question_done = document.getElementById(question_clicked);
    question_done.style.setProperty("text-decoration", "line-through");
    question_done.style.setProperty("pointer-events", "none");
    question_done.style.setProperty("color", "black");
    var dataArray = question_clicked.split("\n");
    var question_id = dataArray[0];
    question_chosen = question_id;
    var category = dataArray[1];
    category_chosen = category;
    $('.game_without_questions').css("display", "none");
    $('.game_with_question').css("display", "block");
    var url2 = "http://localhost:8080/questions/"+category;
    $.getJSON( url2, function( data ) { 
        $.each(data, function(i, field){
            $('#question').empty().append(field[question_id].question);
        });
    });
};

function show_answer() {
    var url2 = "http://localhost:8080/questions/"+category_chosen;
    $.getJSON( url2, function( data ) { 
        $.each(data, function(i, field){
            $('#display_answer').empty().append(field[question_chosen].answer);
        });
    });
};

function return_to_game() {
    $('#display_answer').empty();
    $('.game_without_questions').css("display", "block");
    $('.game_with_question').css("display", "none");
}