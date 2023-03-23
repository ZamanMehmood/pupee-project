

const groupArray = (arr, key, value) => {
    const map = new Map();
    for(const obj of arr) {
        const currSum = map.get(obj[key]) || 0;
        map.set(obj[key], currSum + 1);
    }
    const res = Array.from(map, ([k, v]) => ({[key]: k, [value]: v}));
    return res;
}


const countPortfolioType=(arr,id,value)=>{
    let count=0;
    let asset="";
    for(let a of arr){
        if(a.license_type===value  && a.portfolioId===id){
            count+=1;
            asset=a.asset;
        }
    }
    return {count,asset};
}


export {groupArray,countPortfolioType}