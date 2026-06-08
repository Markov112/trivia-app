let questions = [];
let currentQuestion = 0;
let score = 0;

console.log("APP LOADED");

$(document).ready(function () {

  $("#start-btn").on("click", function () {
    startGame();
  });

  $("#restart-btn").on("click", function () {
    location.reload();
  });

  $(document).on("click", ".answer-btn", function () {
    const selected = $(this).data("answer");
    checkAnswer(selected);
  });

});

function startGame() {

  score = 0;
  currentQuestion = 0;

  $("#score").text(score);

  $("#start-screen").hide();
  $("#end-screen").hide();
  $("#quiz-screen").removeClass("d-none");

  axios.get("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(res => {
      questions = res.data.results;
      showQuestion();
    })
    .catch(err => console.log(err));
}

function showQuestion() {

  const q = questions[currentQuestion];

  const answers = [...q.incorrect_answers, q.correct_answer];

  answers.sort(() => Math.random() - 0.5);

  $("#question").html(q.question);
  $("#answers").empty();

  answers.forEach(a => {
    $("#answers").append(`
      <button class="btn btn-outline-light w-100 my-2 answer-btn"
        data-answer="${a}">
        ${a}
      </button>
    `);
  });
}

function checkAnswer(selected) {

  const correct = questions[currentQuestion].correct_answer;

  const user = decodeHTML(selected);
  const right = decodeHTML(correct);

  if (user === right) {
    score++;
    $("#score").text(score);
  }

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

function decodeHTML(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}
