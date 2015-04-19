/**
 * Created by denniscui on 4/17/15.
 */
var app = angular.module('MainApp', ['ngRoute']);

app.controller('SurveyCtrl', ['$scope', '$timeout', function($scope, $timeout) {
    // Questions should have the format
    // {
    //   question: String statement or question to be asked,
    //   type: One of ['multiple-choice', 'agree', 'short-answer'],
    //   answers: List of answers in plain text
    // }
    $scope.questions = [
        {
            question: 'Why is Albert a noob?',
            type: 'multiple-choice',
            answers: [
                'Just because.',
                "Because he's a fish",
                "I'm not sure."
            ]
        }
    ];

    // Form data has the format
    // {
    //   name: The name of the survey taker
    //   email: The email of the survey taker
    //   treatment: 1 for treatment, 0 for control
    //   answers: [{
    //              startTime: The time that the user reached the question,
    //              endTime: The time that the user submitted the answer to the question,
    //              answer: The answer
    //            }]
    // }
    $scope.formData = { name: '', email: '', answers: _.map($scope.questions, function(q) { return {}; }) };

    // Survey modes
    $scope.WAIT = 1;
    $scope.ENTER_INFO = 2;
    $scope.ANSWER_QUESTIONS = 3;
    $scope.DONE = 4;
    $scope.REWARD_MODE = 5;

    $scope.waitTime = 10000;

    $scope.surveyMode = 2;

    // Question types
    $scope.MULTIPLE_CHOICE = 1;
    $scope.AGREE = 2;
    $scope.SHORT_ANSWER = 3;

    $scope.questionMode = $scope.MULTIPLE_CHOICE;

    $scope.questionNum = -2;
    $scope.curQ = null;
    $scope.questionStart = null;
    $scope.questionEnd = null;
    $scope.curAnswer = null;
    $scope.questionText = null;
    $scope.answers = null;

    $scope.warningTimeout = null;
    $scope.warningTime = 3000;
    $scope.warning = "";

    $scope.setAnswer = function(answer) {
        $scope.curAnswer = answer;
    }

    $scope.onNextClicked = function() {
        if($scope.questionNum == -2) {
            // Should we validate name and email?
            if($scope.formData.name.length === 0 || $scope.formData.email.length === 0) {
                showWarning("Please enter a valid name/email.");
                return;
            }

            // Assign control and treatment
            if(Math.random() < 0.5) {
                $scope.formData.treatment = 0;
            } else {
                $scope.formData.treatment = 1;
            }

            if(!$scope.formData.treatment) {
                // Immediately start giving questions
                $scope.questionNum += 1;
            }
        } else if($scope.questionNum >= 0 && $scope.questionNum < $scope.questions.length) {
            if(!$scope.formData.answers[$scope.questionNum].answer) {
                showWarning("Please answer the question! :)");
                return;
            }

            $scope.questionEnd = moment().format();
            $scope.formData.answers[$scope.questionNum].endTime = $scope.questionEnd;
            $scope.formData.answers[$scope.questionNum].startTime = $scope.questionStart;
        }

        $scope.questionNum += 1;

        // Set the survey mode
        if($scope.questionNum >= 0) {
            if($scope.questionNum == $scope.questions.length) {
                $scope.surveyMode = $scope.REWARD_MODE;
            } else if($scope.questionNum > $scope.questions.length) {
                $scope.surveyMode = $scope.DONE;
            } else {
                $scope.surveyMode = $scope.ANSWER_QUESTIONS;
            }

            if($scope.surveyMode == $scope.ANSWER_QUESTIONS) {
                $scope.curQ = $scope.questions[$scope.questionNum];
                var type = $scope.curQ.type;

                if(type === 'multiple-choice') {
                    $scope.questionMode = $scope.MULTIPLE_CHOICE;
                } else if(type === 'agree') {
                    $scope.questionMode = $scope.AGREE;
                } else if(type === 'short-answer') {
                    $scope.questionMode = $scope.SHORT_ANSWER;
                } else {
                    alert('MARCUS YOU FUCKED UP!');
                }

                $scope.curAnswer = null;
                $scope.answers = shuffleArray($scope.curQ.answers);
                $scope.questionStart = moment().format();
                $scope.questionText = $scope.curQ.question;
            }
        } else if($scope.questionNum == -1) {
            $scope.surveyMode = $scope.WAIT;

            $timeout(function() {
                $scope.onNextClicked();
            }, $scope.waitTime);
        }
    }

    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function showWarning(msg) {
        $scope.warning = msg;

        if($scope.warningTimeout) {
            clearTimeout($scope.warningTimeout);
        }

        $scope.warningTimeout = $timeout(function() {
            $scope.warning = '';
        }, $scope.warningTime);
    }
}]);