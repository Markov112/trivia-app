// Taulukko, johon haetut kysymykset tallennetaan
let questions = [];

// Nykyne kysymys
let current = 0;

// Pelaajan pisteet
let score = 0;

// voi vastaa van yhen
let answered = false;

$(document).ready(function () {

  // startti nappi
  $("#start-btn").on("click", startGame);

  // restartti
  $("#restart-btn").on("click", () => location.reload());

  // vastaus klikki
  $(document).on("click", ".answer-btn", function () {
    if (answered) return; // jos kysymykseen on jo vastattu, estä lisäklikkaukset

    answered = true;

    let selected = $(this); // klikattu nappi
    let answer = selected.data("answer"); // valittu vastaus
    let correct = questions[current].correct_answer; // oikea vastaus

    checkAnswer(answer, correct, selected);
  });

});

// Aloittaa pelin ja hakee kysymykset API:sta
function startGame() {

  score = 0;
  current = 0;

  $("#score").text(score);
  $("#start-screen").hide();
  $("#quiz-screen").removeClass("d-none");

  // hakee 10 kyssäriä tuola opentrivia databasesta
  axios.get("https://opentdb.com/api.php?amount=10&type=multiple")
    .then(res => {
      questions = res.data.results;
      showQuestion();
    });
}

// Näyttää kysymyksen ja vastausvaihtoehdot
function showQuestion() {

  answered = false;
  $("#feedback").text(""); // tyhjennä palaute

  let q = questions[current]; // nykyinen kysymys

  // yhdistetään oikea ja väärät vastaukset
  let answers = [...q.incorrect_answers, q.correct_answer];

  // sekoittaa vastaukset
  answers.sort(() => Math.random() - 0.5);

  $("#question").html(q.question);
  $("#answers").empty();

  // luodaan vastauspainikkeet
  answers.forEach(ans => {
    $("#answers").append(`
      <button class="btn btn-outline-light w-100 my-2 answer-btn"
        data-answer="${ans}">
        ${ans}
      </button>
    `);
  });
}

// Tarkistaa onko oikein vastaus
function checkAnswer(selected, correct, btn) {

  if (selected === correct) {
    score++;
    $("#score").text(score);

    $("#feedback").text("✔ Correct!").css("color", "lightgreen");

    // oikea vastaus vihreäksi
    btn.removeClass("btn-outline-light").addClass("btn-success");
  } else {
    $("#feedback").text("✖ Wrong!").css("color", "red");

    // väärä vastaus punaiseksi
    btn.removeClass("btn-outline-light").addClass("btn-danger");

    // näytä oikea vastaus vihreänä
    $(".answer-btn").each(function () {
      if ($(this).data("answer") === correct) {
        $(this).addClass("btn-success");
      }
    });
  }

  // siirrytään seuraavaan kysymykseen viiveen jälkeen
  setTimeout(() => {
    current++;

    if (current < questions.length) {
      showQuestion();
    } else {
      endGame();
    }
  }, 1000);
}

// peli loppuu ja tulos näkyville
function endGame() {
  $("#quiz-screen").addClass("d-none");
  $("#end-screen").removeClass("d-none");
  $("#final-score").text(score);
}
