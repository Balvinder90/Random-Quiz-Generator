/* 
    ========================================================================================
                                          HOW IT WORKS
    ========================================================================================

    1. GETQUESTIONS() IS CALLED WHICH FETCHES DATA FROM JSON FILE.
    
    2. DATA RETURNED IS THEN PASSED TO THE RANDOM QUESTIONS FUNCTION WHICH 
       RANDOMLY SELECTS QUESTIONS DEPENDING ON THE QUESTION COUNT AND STORES THE NEW RANDOM
       QUESTIONS IN AN ARRAY.

    3. DATA RETURNED FROM THE RANDOM QUESTIONS FUNCTION IS THEN PASSED TO THE UPDATE QUIZ
       FUNCTION WHICH OUTPUTS THE UI ON SCREEN AND STORES CORRECT ANSWERS IN AN ARRAY

    4. THE CHECKS ARE DONE WHEN THE FORM HAS BEEN SUBMITTED AND RESULTS AND APPROPIRATE UI
       ELEMENTS ARE CHANGED.

    5. PLAY AGAIN BUTTON RESTARTS QUIZ IF THERE ARE QUESTIONS REMAINING IN THE QUESTION,
       IF QUESTION ARRAY IS EMPTY THEN THE ABOVE PROCESS IS REPEATED.
  
    ========================================================================================
                                              NOTES
    ========================================================================================

    1. WILL NOT WORK PROPERLY OFFLINE BECAUSE OF CORS BROWSER RESTRICTION SO INSTEAD USE
       LIVE SERVER TO USE THE QUIZ OR HOST IT ONLINE.

    2. THERE SHOULD BE 10 QUESTIONS PER GAME SO MAKE SURE THE JSON FILE DATA LENGTH IS A 
       MULTIPLE OF 10

    2. IF YOU WANT TO ADD MORE QUESTIONS THEN JUST UPDATE THE JSON FILE WITH NEW OBJECTS 
       WHICH WILL SIGNIFY NEW QUESTIONS AND MAKE SURE THE VALUE PROPERTYS ARE INCREASING BY 
       THE PREVIOUS OBJECTS VALUES AND MAKE SURE THE ID IS ALSO INCREASED BY THE PREVIOUS 
       OBJECTS ID.

    FOR EXAMPLE :

       {
        "id": "100",
        "theQuestion": "How long does it take to become a British Royal Marine Commando?",
        "correctAnswer": "32 Weeks",
        "value1": "q397",
        "wrongAnswer1": "28 Weeks",
        "value2": "q398",
        "wrongAnswer2": "24 Weeks",
        "value3": "q399",
        "wrongAnswer3": "20 Weeks",
        "value4": "q400"
    },
       {
        "id": "101",
        "theQuestion": "Your Question",
        "correctAnswer": "ans",
        "value1": "q401",
        "wrongAnswer1": "ans",
        "value2": "q402",
        "wrongAnswer2": "ans",
        "value3": "q403",
        "wrongAnswer3": "ans",
        "value4": "404"
    }
 
  */

// UI VARIABLES
const form = document.querySelector("form");

// AMBIENT MUSIC OBJECT
const musicObj = {
  MP3: new Audio("./music/ambient.mp3"),
  OGG: new Audio("./music/ambient.ogg"),
};

// CHECK TO SEE WHETHER BROWSER CAN PLAY MP3 OR NOT
if (musicObj.MP3.canPlayType("audio/mpeg")) {
  musicObj.MP3.volume = 0.3;
  musicObj.MP3.loop = true;
  musicObj.MP3.play();
} else {
  musicObj.OGG.volume = 0.3;
  musicObj.OGG.loop = true;
  musicObj.OGG.play();
}

// ARRAY VARIABLES
let questionArr = [];
let randomArr = [];
let userAnswers = [];
let answers = [];

// GET QUESTIONS FUNCTION
const getQuestions = async () => {
  const response = await fetch("../json/data.json");

  if (response.status !== 200) {
    throw new Error("Cannot fetch data.");
  }

  questionArr = await response.json();

  return questionArr;
};

// RANDOM QUESTION FUNCTION
const randomQuestions = (data) => {
  userAnswers = [];
  randomArr = [];
  let randomNumber = null;
  // 10 IS USED TO OUTPUT EXACTLY 10 QUESTIONS
  for (let i = 0; i < 10; i++) {
    randomNumber = Math.floor(Math.random() * data.length);
    randomArr.push(data[randomNumber]);
    questionArr.splice(randomNumber, 1);
  }
  return randomArr;
};

// CORRECT ANSWERS FUNCTION
const correctAnswers = () => {
  answers = [];
  randomArr.forEach((question) => {
    const { correctAnswer } = question;
    answers.push(correctAnswer);
  });
};

// USER CHOICE FUNCTION
const userChoice = (input, color) => {
  const circle = document.createElement("div");
  circle.classList.add("chosen", color);
  input.nextElementSibling.after(circle);
};

// INCREMENT SCORE FUNCTION
const incrementScore = (score) => {
  let result = document.querySelector(".results__count");
  let count = 0;
  const countTimer = setInterval(() => {
    result.innerText = count;
    if (score === count) {
      clearInterval(countTimer);
    } else {
      count++;
    }
  }, 120);
};

// SCROLL UP FUNCTION WHICH SCROLLS THE PAGE UP SMOOTHLY
const ScrollUp = () => {
  let windowHeight = window.outerHeight;
  const scrollUpTimer = setInterval(() => {
    if (0 === windowHeight || 0 > windowHeight) {
      clearInterval(scrollUpTimer);
    } else {
      windowHeight -= 10;
      window.scrollTo(0, windowHeight);
    }
  }, 5);
};

// QUESTION TEMPLATE FUNCTION
const questionTemplate = (
  color,
  index,
  theQuestion,
  value1,
  value2,
  value3,
  value4,
  wrongAnswer1,
  wrongAnswer2,
  wrongAnswer3,
  correctAnswer
) => {
  // STORE EACH FORMGROUP IN VARIABLES
  const formGroup1 = `<div class="question__form-group">
  <label class="question__label ${color}-label ${color}-text" for="${value1}"
    >${correctAnswer}</label
  >
  <input
    class="question__radio-offscreen-${color}"
    data-correct="true"
    type="radio"
    name="${value1}"
    value="${correctAnswer}"
    id="${value1}"
  />
  <label class="question__radio ${color}-radio" for="${value1}"></label>
</div>`;

  const formGroup2 = `<div class="question__form-group">
<label class="question__label ${color}-label ${color}-text" for="${value2}"
  >${wrongAnswer1}</label
>
<input
  class="question__radio-offscreen-${color}"
  data-correct="false"
  type="radio"
  name="${value1}"
  value="${wrongAnswer1}"
  id="${value2}"
  
/>
<label class="question__radio ${color}-radio" for="${value2}"></label>
</div>`;

  const formGroup3 = `<div class="question__form-group">
<label class="question__label ${color}-label ${color}-text" for="${value3}"
  >${wrongAnswer2}</label
>
<input
  class="question__radio-offscreen-${color}"
  data-correct="false"
  type="radio"
  name="${value1}"
  value="${wrongAnswer2}"
  id="${value3}"
/>
<label class="question__radio ${color}-radio" for="${value3}"></label>
</div>`;

  const formGroup4 = `<div class="question__form-group">
<label class="question__label ${color}-label ${color}-text" for="${value4}"
  >${wrongAnswer3}</label
>
<input
  class="question__radio-offscreen-${color}"
  data-correct="false"
  type="radio"
  name="${value1}"
  value="${wrongAnswer3}"
  id="${value4}"
/>
<label class="question__radio ${color}-radio" for="${value4}"></label>
</div>`;

  // RANDOMIZING FORM GROUP POSITIONS
  const groups = [formGroup1, formGroup2, formGroup3, formGroup4];
  const randomGroups = [];

  groups.forEach((group) => {
    if (Math.random(Math.floor) * 1 > 0.5) {
      randomGroups.push(group);
    } else {
      randomGroups.unshift(group);
    }
  });

  return `<div class="question-container ${color}-background">
  <div class="question">
    <div class="question__number ${color}-number">${index + 1}</div>
    <p class="question__description ${color}-text">
      ${theQuestion}
    </p>
    <div class="question__form-groups">
     ${randomGroups[0]}
     ${randomGroups[1]}
     ${randomGroups[2]}
     ${randomGroups[3]} 
    </div>
  </div>
</div>`;
};

// RESULT TEMPLATE FUNCTION
const resultTemplate = (color) => {
  return `<div class="question-container ${color}-background">
<div class="results">
  <button class="results__btn" type="submit" value="Submit">
    Submit
  </button>
  <p class="results__score">
    You scored <span class="results__count">...</span> out of 10
  </p>
</div>
</div>`;
};

// UPDATE UI FUNCTION
const updateQuiz = (questions) => {
  let htmlTemplate = "";
  let isGreen = true;
  let color = "";

  questions.forEach((question, index) => {
    const {
      theQuestion,
      correctAnswer,
      value1,
      wrongAnswer1,
      value2,
      wrongAnswer2,
      value3,
      wrongAnswer3,
      value4,
    } = question;
    // GREEN TEMPLATE
    if (isGreen) {
      color = "green";
      htmlTemplate += questionTemplate(
        color,
        index,
        theQuestion,
        value1,
        value2,
        value3,
        value4,
        wrongAnswer1,
        wrongAnswer2,
        wrongAnswer3,
        correctAnswer
      );
      isGreen = !isGreen;
    } else {
      // WHITE TEMPLATE
      color = "white";
      htmlTemplate += questionTemplate(
        color,
        index,
        theQuestion,
        value1,
        value2,
        value3,
        value4,
        wrongAnswer1,
        wrongAnswer2,
        wrongAnswer3,
        correctAnswer
      );
      isGreen = !isGreen;
    }
  });

  htmlTemplate += resultTemplate("green");

  form.innerHTML = htmlTemplate;

  form.addEventListener("submit", (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    let btn = e.target.lastElementChild.children[0].children[0];
    // IF BUTTON CONTAINING THE TEXT SUBMIT IS CLICKED
    if (btn.innerText === "Submit") {
      btn.innerText = "Play again";
      // CHECKS TO SEE WHAT THE CORRECT/INCORRECT ANSWERS ARE AND ASSIGNS THE APPROPRIATE CLASSES
      const inputs = form.querySelectorAll("input");
      inputs.forEach((input) => {
        if (input.dataset.correct === "true") {
          input.nextElementSibling.classList.add("correct");
        } else {
          input.nextElementSibling.classList.add("wrong");
        }
      });
      // CREATES AND ASSIGNS GREEN/WHITE CIRCLE TO SHOW WHAT THE USER SELECTED
      inputs.forEach((input) => {
        if (
          input.checked &&
          input.classList.contains("question__radio-offscreen-green")
        ) {
          userChoice(input, "chosen-green");
        }

        if (
          input.checked &&
          input.classList.contains("question__radio-offscreen-white")
        ) {
          userChoice(input, "chosen-white");
        }

        input.disabled = "true";
      });
      // STORES USER ANSWERS INPUT VALUES INTO ARRAY E.G Q43, Q21, Q7 ETC
      randomArr.forEach((random, index) => {
        userAnswers[index] = random.value1;
      });

      // STORES USER ANSWERS INTO ARRAY USING PREVIOUS VALUES E.G MGS2, 3, CHINA ETC
      userAnswers.forEach((value, index) => {
        userAnswers[index] = form[userAnswers[index]].value;
      });

      // CHECKS AND UPDATES SCORE
      let score = 0;
      answers.forEach((answer, index) => {
        if (answer === userAnswers[index]) {
          score++;
        }
      });

      // UPDATE SCORE INCREMENTALLY
      incrementScore(score);
    }
    // IF BUTTON CONTAINING SOMETHING OTHER THAN "SUBMIT" IS CLICKED ("PLAY AGAIN")
    else {
      // CHECK TO SEE IF THE QUESTIONS ARRAY HAS QUESTIONS
      if (questionArr.length) {
        randomQuestions(questionArr);
        updateQuiz(randomArr);
        // PAGE SCROLLS UP FUNCTION
        ScrollUp();
      }
      // IF IT DOES NOT THEN REPEAT THE INITIAL PAGE LOAD FUNCTIONS
      else {
        getQuestions()
          .then((data) => randomQuestions(data))
          .then((data) => updateQuiz(data))
          .catch((err) => console.log("Rejected:", err.message));
        // PAGE SCROLLS UP FUNCTION
        ScrollUp();
      }
    }
  });

  // CORRECT ANSWERS FROM THE CHOSEN RANDOM QUESTIONS ARE PUSHED INTO ANSWERS ARRAY
  correctAnswers();
};

// QUESTIONS BEING FETCHED AND RAN THROUGH FUNCTIONS ON INITAL LOAD
getQuestions()
  .then((data) => randomQuestions(data))
  .then((data) => updateQuiz(data))
  .catch((err) => console.log("Rejected:", err.message));
