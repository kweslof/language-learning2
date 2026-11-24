$(document).ready(function() {

    const wordsByLevel = {
        beginner: [
            {word: "cat", translation: ["кіт", "кішка"]},
            {word: "dog", translation: ["собака", "пес"]},
            {word: "house", translation: ["будинок", "дім"]},
            {word: "car", translation: ["машина", "автомобіль"]},
            {word: "book", translation: ["книга", "книжка"]},
            {word: "water", translation: ["вода"]},
            {word: "sun", translation: ["сонце"]},
            {word: "apple", translation: ["яблуко"]},
            {word: "friend", translation: ["друг"]},
            {word: "time", translation: ["час"]},
            {word: "day", translation: ["день"]},
            {word: "good", translation: ["добрий", "хороший", "гарний"]},
            {word: "big", translation: ["великий"]},
            {word: "work", translation: ["робота", "праця", "працювати"]},
            {word: "always", translation: ["завжди"]}
        ],
        intermediate: [
            {word: "weather", translation: ["погода"]},
            {word: "morning", translation: ["ранок"]},
            {word: "question", translation: ["питання", "запитання"]},
            {word: "answer", translation: ["відповідь"]},
            {word: "travel", translation: ["подорож", "подорожувати"]},
            {word: "holiday", translation: ["свято", "відпустка", "вихідний"]},
            {word: "health", translation: ["здоров'я"]},
            {word: "mistake", translation: ["помилка"]},
            {word: "remember", translation: ["пам'ятати", "згадувати"]},
            {word: "tomorrow", translation: ["завтра"]},
            {word: "expensive", translation: ["дорогий"]},
            {word: "different", translation: ["різний", "інший"]},
            {word: "together", translation: ["разом"]},
            {word: "important", translation: ["важливий"]},
            {word: "usually", translation: ["зазвичай"]}
        ],
        advanced: [
            {word: "knowledge", translation: ["знання"]},
            {word: "experience", translation: ["досвід"]},
            {word: "decision", translation: ["рішення"]},
            {word: "advice", translation: ["порада"]},
            {word: "success", translation: ["успіх"]},
            {word: "memory", translation: ["пам'ять", "спогад"]},
            {word: "freedom", translation: ["свобода"]},
            {word: "choice", translation: ["вибір"]},
            {word: "reason", translation: ["причина"]},
            {word: "hope", translation: ["надія", "сподіватися"]},
            {word: "believe", translation: ["вірити"]},
            {word: "improve", translation: ["покращувати", "вдосконалювати"]},
            {word: "possible", translation: ["можливий"]},
            {word: "dangerous", translation: ["небезпечний"]},
            {word: "suddenly", translation: ["раптом", "несподівано"]}
        ]
    };

    const totalWords = 10;
    let activeWords = [];
    let currentWordIndex = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    $("#answerInput").html(`<input type="text" id="userInput" placeholder="Enter the translation" autocomplete="off" style="width: 80%; padding: 10px; font-size: 24px; text-align: center; font-family: inherit; margin-top: 15px;">`);
    
    $("body").append(`
        <div id="modalOverlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); justify-content:center; align-items:center; z-index:1000;">
            <div style="background:#fff; color:#000; padding:30px 40px; border-radius:12px; text-align:center; min-width:320px; box-shadow:0 5px 20px rgba(0,0,0,0.3);">
                <h2 style="margin-top:0;">You have ended the test</h2>
                <p id="modalLevel" style="font-size: 22px; margin: 20px 0;"></p>
                <button id="restartBtn" style="padding: 10px 24px; font-size: 18px; cursor: pointer; border: 1px solid #000; background: #f0f0f0;">Retry</button>
            </div>
        </div>
    `);

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function startTest() {
        const selectedLevel = $('input[name="difficulty"]:checked').val() || "beginner";
        const currentPool = wordsByLevel[selectedLevel];

        activeWords = shuffle([...currentPool]).slice(0, totalWords);
        currentWordIndex = 0;
        correctCount = 0;
        incorrectCount = 0;
        $("#modalOverlay").css("display", "none");
        updateUI();
    }

    function updateUI() {
        const currentItem = activeWords[currentWordIndex];

        $("#output").css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "cursor": "pointer",
            "user-select": "none"
        }).text(currentItem.word);

        $("#count").css({
            "display": "flex",
            "align-items": "center",
            "justify-content": "center",
            "gap": "20px"
        }).html(`
            <span id="prevBtn" style="cursor:pointer; user-select:none;">&#8592;</span> 
            ${currentWordIndex + 1}/${totalWords} 
            <span id="nextBtn" style="cursor:pointer; user-select:none;">&#8594;</span>
        `);

        $("#correct").text(`Correct: ${correctCount}`);
        $("#incorrect").text(`Incorrect: ${incorrectCount}`);
        $("#userInput").val("").focus();
    }

    function checkAnswer() {
        const val = $("#userInput").val().trim().toLowerCase();
        if (!val) return;

        const target = activeWords[currentWordIndex].translation;
        const isCorrect = target.some(t => t.toLowerCase() === val);

        if (isCorrect) {
            correctCount++;
        } else {
            incorrectCount++;
        }

        if (currentWordIndex < activeWords.length - 1) {
            currentWordIndex++;
            updateUI();
        } else {
            showResultModal();
        }
    }

    function showResultModal() {
        $("#correct").text(`Correct: ${correctCount}`);
        $("#incorrect").text(`Incorrect: ${incorrectCount}`);

        const percentage = (correctCount / totalWords) * 100;
        let levelText = "";

        if (percentage >= 90) {
            levelText = `Your level: <b>Advanced</b> (${correctCount}/${totalWords})`;
        } else if (percentage >= 70) {
            levelText = `Your level: <b>Intermediate</b> (${correctCount}/${totalWords})`;
        } else if (percentage >= 50) {
            levelText = `Your level: <b>Elementary</b> (${correctCount}/${totalWords})`;
        } else {
            levelText = `Your level: <b>Beginner</b> (${correctCount}/${totalWords})`;
        }

        $("#modalLevel").html(levelText);
        $("#modalOverlay").css("display", "flex");
    }

    $("#output").on("click", checkAnswer);

    $(document).on("keypress", "#userInput", function(e) {
        if (e.which === 13) {
            checkAnswer();
        }
    });

    $(document).on("click", "#prevBtn", function() {
        if (currentWordIndex > 0) {
            currentWordIndex--;
            updateUI();
        }
    });

    $(document).on("click", "#nextBtn", function() {
        if (currentWordIndex < totalWords - 1) {
            currentWordIndex++;
            updateUI();
        }
    });

    $('input[name="difficulty"]').on("change", function() {
        startTest();
    });

    $(document).on("click", "#restartBtn", startTest);

    startTest();
});