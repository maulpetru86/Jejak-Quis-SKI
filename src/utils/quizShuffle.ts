import { AnswerLetter, QuizQuestion } from '../config/quizConfig';

/**
 * Fisher-Yates shuffle array algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffles the answer options of a QuizQuestion while keeping the correct answer synchronized.
 * True/False questions (Benar / Salah) retain standard A: Benar, B: Salah order for natural test ergonomics.
 */
export function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  if (question.type === 'true_false') {
    return { ...question };
  }

  const standardLetters: AnswerLetter[] = ['A', 'B', 'C', 'D', 'E'];
  // Active options present in this question (non-empty, non-dash)
  const activeEntries = standardLetters
    .map((l) => ({ letter: l, text: question.options[l] }))
    .filter((entry) => Boolean(entry.text) && entry.text !== '-');

  if (activeEntries.length <= 1) {
    return { ...question };
  }

  // Find which entry text was correct
  const correctText = question.options[question.correctAnswer];
  if (!correctText) {
    return { ...question };
  }

  // Shuffle the texts among the available slots
  const shuffledTexts = shuffleArray(activeEntries.map((e) => e.text));

  const newOptions = { ...question.options };
  let newCorrectLetter: AnswerLetter = question.correctAnswer;

  activeEntries.forEach((entry, idx) => {
    const text = shuffledTexts[idx];
    newOptions[entry.letter] = text;
    if (text === correctText) {
      newCorrectLetter = entry.letter;
    }
  });

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectLetter,
  };
}

/**
 * Prepares questions for a quiz session based on user configuration:
 * 1. Randomizes question sequence if shuffleQuestions is enabled
 * 2. Randomizes answer option positions (A-E) if shuffleOptions is enabled
 */
export function prepareQuizQuestions(
  questions: QuizQuestion[],
  options: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
  }
): QuizQuestion[] {
  let result = [...questions];

  if (options.shuffleQuestions) {
    result = shuffleArray(result);
  }

  if (options.shuffleOptions) {
    result = result.map((q) => shuffleQuestionOptions(q));
  }

  return result;
}
