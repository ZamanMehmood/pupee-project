type PersonInfo={
    first_name: string;
    last_name: string;
    profile_image_url: string;
}

type NotificationType = {
    user_id: string;
    type: string;
    message: string;
    profile_info: PersonInfo;
    data?:string

};


export {NotificationType}