/**
 * Created by denniscui on 4/17/15.
 */
var app = angular.module('MainApp', ['ngRoute']);

app.controller('SurveyCtrl', ['$scope', '$timeout', '$http', function($scope, $timeout, $http) {
    // Questions should have the format
    // {
    //   question: String statement or question to be asked,
    //   type: One of ['multiple-choice', 'short-answer'],
    //   answers: List of answers in plain text,
    //   shuffle: true/false
    // }
    $scope.questions = [
        // WELFARE
        {
          question: "These first questions will ask your opinion about the welfare system in the US.",
          type: "info"
        },
        {
            question: 'How do you view the current level of welfare spending by the US government?',
            type: 'multiple-choice',
            answers: [
                'Too much',
                'Just right',
                'Too little',
                'Undecided'
            ],
            shuffle: false
        },
        {
            question: 'How much would you agree with the following statement: "Many people who receive welfare do little to improve their own condition"',
            type: 'multiple-choice',
            answers: [
                'Strongly Disagree',
                'Slightly Disagree',
                'Neutral',
                'Slightly Agree',
                'Strongly Agree'
            ],
            shuffle: false
        },
        {
            question: 'What is your opinion about the current way that welfare is handled in the US?',
            type: 'multiple-choice',
            answers: [
                'Very Unfavorable',
                'Slightly Unfavorable',
                'Neutral',
                'Slightly Favorable',
                'Very Favorable',
                'Undecided'
            ],
            shuffle: false
        },
        // SECURITY
        {
            question: "These next questions will ask questions about the security of the US.",
            type: "info"
        },
        {
            question: 'How much danger do you believe Iran\'s nuclear weapon program poses to the US?',
            type: 'multiple-choice',
            answers: [
                'No Danger',
                'Slight Danger',
                'Moderate Danger',
                'Extreme Danger',
                'Undecided'
            ],
            shuffle: false
        },
        {
            question: 'Would you favor the US taking military action against Iran if this were the only way to stop them from developing nuclear weapons?',
            type: 'multiple-choice',
            answers: [
                'Strongly Oppose',
                'Slightly Oppose',
                'Neutral',
                'Slightly Favor',
                'Strongly Favor',
                'Undecided'
            ],
            shuffle: false
        },
        // NSA
        {
            question: "These next questions will ask about the National Security Administration (NSA). If you are not familiar with the" +
            "programs mentioned, feel free to select 'Undecided' from the answer choices.",
            type: "info"
        },
        {
            question: 'Do you believe the NSA wrongfully violated civil liberties with its PRISM program?',
            type: 'multiple-choice',
            answers: [
                'Yes',
                'No',
                'No Opinion / Undecided'
            ],
            shuffle: false
        },
        {
            question: 'How personally threatened do you feel by the NSA\'s actions?',
            type: 'multiple-choice',
            answers: [
                'Not At All',
                'Slightly Threatened',
                'Moderately Threatened',
                'Extremely Threatened',
                'Undecided'
            ],
            shuffle: false
        },
        {
          type: "info",
          question: "These next questions will ask you to consider two hypothetical presidential candidates and select which one you would be more likely to vote for."
        },
        {
            
        }
        // TODO: CANDIDATES STUFF IF WE WANTS

        {
            question: "These next questions will ask for your opinion of how the US government is performing in their duties.",
            type: "info"
        },
        {
            question: 'What do you think of the job that Obama is currently doing as president?',
            type: 'multiple-choice',
            answers: [
                'Extremely Unfavorable',
                'Slightly Unfavorable',
                'Neutral',
                'Slightly Favorable',
                'Extremely Favorable',
                'Undecided'
            ],
            shuffle: false
        },
        {
            question: 'What do you think of the job that Congress is currently doing?',
            type: 'multiple-choice',
            answers: [
                'Extremely Unfavorable',
                'Slightly Unfavorable',
                'Neutral',
                'Slightly Favorable',
                'Extremely Favorable',
                'Undecided'
            ],
            shuffle: false
        },

        // Demographics
        {
            question: "This concludes the main part of our survey. These final questions will ask some demographic data about your political background. To be entered in the drawing for the Amazon gift card, you need to completely all of these questions.",
            type: "info",
            noDelay: true
        },
        {
            question: "How would you classify your political ideologies?",
            type: 'multiple-choice',
            answers: [
                'Extremely Liberal',
                'Slightly Liberal',
                'Neutral',
                'Slightly Conservative',
                'Extremely Conservative',
                'Undecided / Apolitcal'
            ],
            noDelay: true
        },
        {
            question: "How passionate about the issues mentioned in this survey would you say you are?",
            type: 'multiple-choice',
            answers: [
                'Not At All',
                'Slightly Passionate',
                'Moderately Passionate',
                'Extremely Passionate'
            ],
            noDelay: true
        },
        {
            question: "How likely are you to vote in a 2016 Presidential Primary race?",
            type: 'multiple-choice',
            answers: [
                'Extremely Unlikely',
                'Slightly Unlikely',
                'Neither Likely Nor Unlikely',
                'Slightly Likely',
                'Extremely Likely'
            ],
            noDelay: true
        },
        {
            question: "The final questions ask about the methodologies used in our survey.",
            type: 'info',
            noDelay: true
        },
        {
            question: "Do you have any comments about the methoodology of this survey, or did you have any issues while taking the survey?",
            type: 'short-answer',
            noDelay: true
        },
        {
            question: "For the drawing to win an Amazon gift card, what do you believe would be the fair amount of money to put on the card to give the winner?",
            type: 'short-answer',
            noDelay: true
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
                alert('MARCUS YOU HAVE MADE A SLIGHT ERROR - ITS OKAY I FORGIVE YOU!');
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