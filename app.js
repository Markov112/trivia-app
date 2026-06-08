let questions = [];
let current = 0;
let score = 0;
let canClick = true;

$(document).ready(function () {

  $("#start-btn").click(function () {
    startGame();
  });

  $("#restart-btn").click(function () {
    location.reload();
  });

  $(document).on("click", ".answer-btn", function () {

    if (!canClick) return;
    canClick = false;

    let selected = $(this).data("answer");
    let correct = questions[current].correct_answer;

    if (selected === correct) {
      score++;
      $("#score").text(score);
      $("#feedback").text("✔ Correct").css("color", "lightgreen");
      $(this).addClass("btn-success");
    } else {
      $("#feedback").text("✖ Wrong").css("color", "red");
      $(this).addClass("btn-danger");

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
        canClick = true;
      } else {
        endGame();
      }

    }, 1000);

  });

}); // 👈 TÄMÄ PUUTTUI SUN KOODISTA

function startGame() {

  console.log("START");

  score = 0;
  current = 0;

  $("#score").text(score);
  $("#feedback").text("");

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

  $("#feedback").text("");

  let q = questions[current];

  let answers = [...q.incorrect_answers, q.correct_answer];
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

function endGame() {
  $("#quiz-screen").addClass("d-none");
  $("#end-screen").removeClass("d-none");
  $("#final-score").text(score);
}
  $("#score").text(score);
  $("#feedback").text("");

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

  $("#feedback").text("");

  let q = questions[current];

  let answers = [...q.incorrect_answers, q.correct_answer];
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

function endGame() {
  $("#quiz-screen").addClass("d-none");
  $("#end-screen").removeClass("d-none");
  $("#final-score").text(score);
}
