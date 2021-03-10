const fs = require('fs')
const inquirer = require('inquirer')
const readline = require('readline-sync')

const filePath = './test.txt'

const REGEX_ANSWER_MIDDLE = /[A|B|C|D]\)/mg
const REGEX_QUESTION_MIDDLE = /\d+\./mg

function shuffle (array) {
  return array.sort(() => Math.random() - 0.5)
}

function randint (min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

async function main () {
  let lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).join('')
  lines = lines.split(REGEX_QUESTION_MIDDLE)

  const quizzes = []
  let currentQuiz = null

  for (let line of lines) {
    line = line.trim()
    if (!line) continue
    const pieces = line.split(REGEX_ANSWER_MIDDLE).map(item => item.trim())
    const answers = pieces.slice(1)
    currentQuiz = {
      question: pieces[0],
      correct: answers[0],
      answers: shuffle(answers)
    }
    quizzes.push(currentQuiz)
  }

  while (quizzes.length) {
    const index = randint(0, quizzes.length)
    const quiz = quizzes[index]

    const answers = await inquirer.prompt([
      {
        name: 'answers',
        message: quiz.question,
        type: 'list',
        choices: quiz.answers
      }
    ])

    console.log('\nRisposta:', quiz.correct)
    quizzes.splice(index, 1)
    readline.question('')
  }
}

main()
