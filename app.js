let questions = [];
let currentQuestion = 0;
let score = 0;

$(document).ready(function () {

  $("#start-btn").click(function () {
    startGame();
  });

  $("#restart-btn").click(function () {
    location.reload();
  });

});

function startGame() {
  $("#start-screen").hide();
  $("#quiz-screen").removeClass("d-none");

  axios.get("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(response => {
      questions = response.data.results;
      showQuestion();
    });
}

function showQuestion() {
  let q = questions[currentQuestion];

  let answers = [...q.incorrect_answers];
  answers.push(q.correct_answer);

  // shuffle
  answers.sort(() => Math.random() - 0.5);

  $("#question").html(q.question);

  $("#answers").empty();

  answers.forEach(answer => {
    $("#answers").append(`
      <button class="btn btn-outline-light w-100 my-1 answer-btn">
        ${answer}
      </button>
    `);
  });

  $(".answer-btn").click(function () {
    checkAnswer($(this).text(), q.correct_answer);
  });
}

function checkAnswer(selected, correct) {
  if (selected === correct) {
    score++;
  }

  $("#score").text(score);

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

function endGame() {
  $("#quiz-screen").addClass("d-none");
  $("#end-screen").removeClass("d-none");

  $("#final-score").text(score);
}