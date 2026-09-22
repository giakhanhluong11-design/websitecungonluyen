import { TopicExercise } from '../../types';
import { MATH_LESSON_EXERCISES } from './mathExercises';
import { LITERATURE_LESSON_EXERCISES } from './literatureExercises';
import { ENGLISH_LESSON_EXERCISES } from './englishExercises';

export const ALL_LESSON_EXERCISES: Record<string, TopicExercise[]> = {
  ...MATH_LESSON_EXERCISES,
  ...LITERATURE_LESSON_EXERCISES,
  ...ENGLISH_LESSON_EXERCISES
};

export { MATH_LESSON_EXERCISES, LITERATURE_LESSON_EXERCISES, ENGLISH_LESSON_EXERCISES };
