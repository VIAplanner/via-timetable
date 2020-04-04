/**
 *
 * Returns the combinations of sections of a single course
 * @param {Course} course
 * @returns {CourseMeetingSectionCombinations}
 */
const courseMeetingSectionCombinations = (course: Course): CourseMeetingSectionCombinations => {
    const lectures = course.meeting_sections.filter(section => section.code.charAt(0) === "L");
    const tutorials = course.meeting_sections.filter(section => section.code.charAt(0) === "T");
    const practicals = course.meeting_sections.filter(section => section.code.charAt(0) === "P");
    for (const lecture of lectures){
        lecture.code = course.code + lecture.code
    }
    for (const tutorial of tutorials){
        tutorial.code = course.code + tutorial.code
    }
    for (const practical of practicals){
        practical.code = course.code + practical.code
    }
    const lecTutCombinations = [];
    for (const lecture of lectures) {
        for (const tutorial of tutorials) {
            lecTutCombinations.push([lecture, tutorial]);
        }
        if (tutorials.length === 0) {
            lecTutCombinations.push([lecture]);
        }
    }

    let totalCombinations = []
    for (const section of lecTutCombinations) {
        for (const practical of practicals) {
            totalCombinations.push([...section, practical])
        }
        if (practicals.length === 0){
            totalCombinations = lecTutCombinations
        }
    }
    return { code: course.code, combinations: totalCombinations }
}

/**
 *
 * Returns the combination of courses' section combinations
 * @param {CourseMeetingSectionCombinations[]} courseMeetingSectionCombos
 * @returns {MeetingSection[][]}
 */
const courseCombinations = (courseMeetingSectionCombos: CourseMeetingSectionCombinations[]): MeetingSection[][] => {
    
    const outputs: MeetingSection[][] = [];

    /**
     *
     * This recursive builtin starts from the first array and takes one element from each array to build the combination of arrays
     * @param {CourseMeetingSectionCombinations[]} courseMeetingSecCombos
     * @param {number} [whichArray=0]
     * @param {MeetingSection[]} [output=[]]
     */
    const permute = (courseMeetingSecCombos: CourseMeetingSectionCombinations[], whichArray=0, output:MeetingSection[] =[]) => {
        courseMeetingSecCombos[whichArray].combinations.forEach((arrayElement)=>{
            if( whichArray === courseMeetingSecCombos.length - 1 ){            
                // Base case...
                const temp = [...output]
                temp.push(...arrayElement)
                outputs.push(temp);
            }
            else{
                // Recursive case...
                const temp = [...output]
                temp.push(...arrayElement)
                permute(courseMeetingSecCombos, whichArray+1, temp);
            }
        });/*  forEach() */
    }

    permute(courseMeetingSectionCombos);
    return outputs;
}

export {
    courseMeetingSectionCombinations, 
    courseCombinations
}