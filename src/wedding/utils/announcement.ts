


const formattedDescription=(description:String,firstName,lastName,engagementDate,weddingDate)=>{
    let formattedDescription= description.replace(/{first_name}/g, firstName);
    formattedDescription= formattedDescription.replace(/{last_name}/g, lastName);
    formattedDescription= formattedDescription.replace(/{engagement_date}/g, engagementDate);
    formattedDescription= formattedDescription.replace(/{wedding_date}/g, weddingDate);
    return formattedDescription;
}

export { formattedDescription};
