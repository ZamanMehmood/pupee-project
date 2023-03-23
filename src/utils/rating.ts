
const calculateRatingById=(ratings)=>{
    const rating=ratings.rating;
    const one=rating["1"],two=rating["2"],three=rating["3"],four=rating["4"],five=rating["5"];

    const averageRating=(5*five.length + 4*four.length + 3*three.length + 2*two.length + one.length*1) /
        (five.length+four.length+three.length+two.length+one.length);

    const ratingsCount=five.length+four.length+three.length+two.length+one.length;

    return {averageRating,ratingsCount};
}


const calculateRatingByUser=(ratings)=>{
    let five=0,four=0,three=0,two=0,one=0;
    for(let serviceRating of ratings){
        const rating=serviceRating.rating;
        five+=rating["5"].length;
        four+=rating["4"].length;
        three+=rating["3"].length;
        two+=rating["2"].length;
        one+=rating["1"].length;

    }
    const averageRating=(5*five + 4*four + 3*three + 2*two + one*1) /
        (five+four+three+two+one);

    const ratingsCount=five+four+three+two+one;

    return {averageRating,ratingsCount};
}


export {calculateRatingById,calculateRatingByUser}