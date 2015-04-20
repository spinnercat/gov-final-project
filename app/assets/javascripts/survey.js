/**
 * Created by denniscui on 4/17/15.
 */
var app = angular.module('MainApp', ['ngRoute']);

app.controller('SurveyCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
    // Questions should have the format
    // {
    //   question: String statement or question to be asked,
    //   type: One of ['multiple-choice', 'agree', 'short-answer'],
    //   answers: List of answers in plain text,
    //   shuffle: true/false
    // }
    $scope.questions = [
        {
            question: 'How do you view US welfare spending?',
            type: 'multiple-choice',
            answers: [
                'Too much.',
                'Just right.',
                'Too little.',
            ],
            shuffle: false
        },
        {
            question: 'How much would you agree with the following statement: Many people who receive welfare do little to improve their own condition.',
            type: 'multiple-choice',
            answers: [
                'Strongly Disagree',
                'Disagree',
                'Neutral',
                'Agree',
                'Strongly Agree'
            ],
            shuffle: false
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

    $scope.questionNum = 0;
    $scope.curQ = null;
    $scope.questionStart = null;
    $scope.questionEnd = null;
    $scope.curAnswer = null;
    $scope.questionText = null;
    $scope.answers = null;

    $scope.warningTimeout = null;
    $scope.warningTime = 3000;
    $scope.warning = "";

    // Person info
    $scope.personId = null;

    $scope.setAnswer = function(answer) {
        $scope.curAnswer = answer;
    }

    $scope.onNextClicked = function() {
        if($scope.surveyMode === $scope.ENTER_INFO) {
            validateInfo();
        } else if($scope.surveyMode === $scope.WAIT) {

        } else if($scope.surveyMode === $scope.ANSWER_QUESTIONS) {
            validateAnswer();

            if($scope.questionNum >= $scope.questions.length) {
                $scope.surveyMode = $scope.REWARD_MODE;
            }
        } else if($scope.surveyMode === $scope.REWARD_MODE) {
            validateReward();
        }
    }

    function validateInfo() {
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

        // Store the user
        $http({
            url: '/api/person/create',
            method: 'POST',
            params: {
                name: $scope.formData.name,
                email: $scope.formData.email,
                treatment: $scope.formData.treatment
            }
        }).success(function(data) {
            $scope.personId = data.id;

            if($scope.formData.treatment) {
                // Make the person wait
                $scope.surveyMode = $scope.WAIT;

                $timeout(function() {
                    $scope.surveyMode = $scope.ANSWER_QUESTIONS;
                    setQuestion();
                }, $scope.waitTime);
            } else {
                $scope.surveyMode = $scope.ANSWER_QUESTIONS;
                setQuestion();
            }
        });
    }

    function validateAnswer() {
        if(!$scope.formData.answers[$scope.questionNum].answer) {
            showWarning("Please answer the question! :)");
            return;
        }

        $scope.questionEnd = moment().format();
        $scope.formData.answers[$scope.questionNum].endTime = $scope.questionEnd;
        $scope.formData.answers[$scope.questionNum].startTime = $scope.questionStart;

        // Store the answer
        $http({
            url: '/api/answer/create',
            method: 'POST',
            params: {
                person_id: $scope.personId,
                question_id: $scope.questionNum,
                answer: $scope.formData.answers[$scope.questionNum].answer,
                start_time: $scope.formData.answers[$scope.questionNum].startTime,
                end_time: $scope.formData.answers[$scope.questionNum].endTime
            }
        });

        $scope.questionNum += 1;
        setQuestion();
    }

    function validateReward() {
        if(!$scope.formData.rewardValue) {
            showWarning("Please input a valid number!");
            return;
        }

        // Update the valuation
        $http({
            url: '/api/person/update_valuation',
            method: 'POST',
            params: {
                id: $scope.personId,
                valuation: $scope.formData.rewardValue
            }
        });

        $scope.surveyMode = $scope.DONE;
    }

    function setQuestion() {
        if($scope.questionNum < $scope.questions.length) {
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
            $scope.answers = $scope.curQ.shuffle ? shuffleArray($scope.curQ.answers) : $scope.curQ.answers
            $scope.questionStart = moment().format();
            $scope.questionText = $scope.curQ.question;
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