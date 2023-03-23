import { Types } from 'mongoose';
import {BadRequestException} from "@nestjs/common";
import moment = require("moment");


const getAge=(birthDate)=>{
    const now = new Date();

    function isLeap(year) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }

    // days since the birthdate
    let days = Math.floor((now.getTime() - birthDate.getTime())/1000/60/60/24);
    let age = 0;
    // iterate the years
    for (let y = birthDate.getFullYear(); y <= now.getFullYear(); y++){
        const daysInYear = isLeap(y) ? 366 : 365;
        if (days >= daysInYear){
            days -= daysInYear;
            age++;
            // increment the age only if there are available enough days for the year.
        }
    }
    return age;
}

const diffDays=(startDate,endDate)=>{
    const start = moment(startDate, "YYYY-MM-DD");
    const end = moment(endDate, "YYYY-MM-DD");
    return  moment.duration(start.diff(end)).asDays();
}


export {getAge,diffDays};
