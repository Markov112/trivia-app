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

  // GLOBAL click handler (IMPORTANT FIX)
  $(document).on("click", ".answer-btn", function () {
    let selected = $(this).data("answer");
    let correct = questions[currentQuestion].correct_answer;

    checkAnswer(selected, correct);
  });

});

function startGame() {
  $("#start-screen").hide();
  $("#quiz-screen").removeClass("d-none");

  score = 0;
  currentQuestion = 0;

  $("#score").text(score);

  axios.get("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(response => {
      questions = response.data.results;
      showQuestion();
    })
    .catch(err => {
      console.error("API error:", err);
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
      <button class="btn btn-outline-light w-100 my-1 answer-btn"
        data-answer="${answer}">
        ${answer}
      </button>
    `);
  });
}

function checkAnswer(selected, correct) {

  let userAnswer = decodeHTML(selected);
  let correctAnswer = decodeHTML(correct);

  console.log("selected:", userAnswer);
  console.log("correct:", correctAnswer);

  if (userAnswer === correctAnswer) {
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

// FIX HTML ENTITIES (IMPORTANT)
function decodeHTML(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
}
