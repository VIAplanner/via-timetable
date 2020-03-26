const courseMeetingSectionCombinations = (course: Course): CourseMeetingSectionCombinations => {
    const lectures = course.meeting_sections.filter(section => section.code.charAt(0) === "L");
    const tutorials = course.meeting_sections.filter(section => section.code.charAt(0) === "T");
    const practicals = course.meeting_sections.filter(section => section.code.charAt(0) === "P");
    const lec_tut_combinations = [];
    for (const lecture of lectures) {
        for (const tutorial of tutorials) {
            lec_tut_combinations.push([lecture, tutorial]);
        }
        if (tutorials.length === 0) {
            lec_tut_combinations.push([lecture]);
        }
    }
    let totalCombinations = []
    for (const section of lec_tut_combinations) {
        for (const practical of practicals) {
           totalCombinations.push([...section, practical])
        }
        if (practicals.length === 0){
            totalCombinations = lec_tut_combinations
        }
    }

    return { code: course.code, combinations: totalCombinations }
}

const courseCombinations = (courseMeetingSectionCombos: CourseMeetingSectionCombinations[]): MeetingSection[][] => {
    
    const outputs: MeetingSection[][] = [];

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