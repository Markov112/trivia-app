let questions = [];
let current = 0;
let score = 0;
let answered = false;

$(document).ready(function () {

  $("#start-btn").on("click", startGame);
  $("#restart-btn").on("click", () => location.reload());

  $(document).on("click", ".answer-btn", function () {
    if (answered) return;

    answered = true;

    let selected = $(this);
    let answer = selected.data("answer");
    let correct = questions[current].correct_answer;

    checkAnswer(answer, correct, selected);
  });

});

function startGame() {

  score = 0;
  current = 0;

  $("#score").text(score);
  $("#start-screen").hide();
  $("#quiz-screen").removeClass("d-none");

  axios.get("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(res => {
      questions = res.data.results;
      showQuestion();
    });
}

function showQuestion() {

  answered = false;
  $("#feedback").text("");

  let q = questions[current];

  let answers = [...q.incorrect_answers, q.correct_answer];
  answers.sort(() => Math.random() - 0.5);

  $("#question").html(q.question);
  $("#answers").empty();

  answers.forEach(ans => {
    $("#answers").append(`
      <button class="btn btn-outline-light w-100 my-2 answer-btn"
        data-answer="${ans}">
        ${ans}
      </button>
    `);
  });
}

function checkAnswer(selected, correct, btn) {

  if (selected === correct) {
    score++;
    $("#score").text(score);
    $("#feedback").text("✔ Correct!").css("color", "lightgreen");
    btn.removeClass("btn-outline-light").addClass("btn-success");
  } else {
    $("#feedback").text("✖ Wrong!").css("color", "red");
    btn.removeClass("btn-outline-light").addClass("btn-danger");

    // näytä oikea vastaus vihreänä
    $(".answer-btn").each(function () {
      if ($(this).data("answer") === correct) {
        $(this).addClass("btn-success");
      }
    });
  }

  setTimeout(() => {
    current++;

    if (current < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  }, 1000);
}

function endGame() {
  $("#quiz-screen").addClass("d-none");
  $("#end-screen").removeClass("d-none");
  $("#final-score").text(score);
}
