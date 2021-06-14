declare const courseMeetingSectionCombinations: (
  course: Course,
) => CourseMeetingSectionCombinations;
declare const courseCombinations: (
  courseMeetingSectionCombos: CourseMeetingSectionCombinations[],
) => MeetingSection[][];
export { courseMeetingSectionCombinations, courseCombinations };
