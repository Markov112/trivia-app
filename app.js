function decodeHTML(html) {
  let txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
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
    <button class="btn btn-outline-light w-100 my-1 answer-btn"
      data-answer="${answer}">
      ${answer}
    </button>
  `);
});

$(".answer-btn").click(function () {
  checkAnswer($(this).data("answer"), q.correct_answer);
});

function checkAnswer(selected, correct) {
console.log("selected:", selected);
console.log("correct:", correct);
  let userAnswer = decodeHTML(selected);
  let correctAnswer = decodeHTML(correct);

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
