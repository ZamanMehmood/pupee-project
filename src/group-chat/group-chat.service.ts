import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import mongoose, {Model} from 'mongoose';
import {errorResponse, successResponse} from '../utils/response';
import {
    AddGroupMembersDto,
    CreateGroupDto,
    CreateGroupMessageDto,
    DeleteGroupMemberDto,
    UpdateGroupDto
} from './dtos/group.dto';
import {GroupChatDocument} from './models/group-chat';
import {GroupChatConversationDocument} from "./models/group-conversation";
import {WeddingDocument} from "../wedding/models/wedding.model";
import {ContactDocument} from "../users/models/contacts.model";
import {ModelingGateway} from "../modeling/modeling.gateway";

@Injectable()
export class GroupChatService {
    constructor(
        @InjectModel('groups') private readonly groupsChatModel: Model<GroupChatDocument>,
        @InjectModel('groupconversations') private readonly groupConversationsModel: Model<GroupChatConversationDocument>,
        @InjectModel('wedding') private readonly weddingModel: Model<WeddingDocument>,
        @InjectModel('contacts') private readonly contactModel: Model<ContactDocument>,
        private readonly modelingGateway: ModelingGateway

    ) {
    }



    addGroupInContactList=async (group,id)=>{
        let contact=await this.contactModel.findOne({user_id:new mongoose.Types.ObjectId(id)});

        if(!contact) {
            contact=new this.contactModel({user_id:id,list:[]});
            contact=await contact.save();
        }

        const findIndex=(contact.list).findIndex((c)=>(c.id).toString()===(group.id).toString())
        if(findIndex===-1){
            const newContact:any={id:group.id,count:0,last_message:"",userInfo:{group_name:group.name,group_logo:group.logo}};
            (contact.list).push(newContact);
            const savedContactList = await contact.save();
            this.modelingGateway.server.emit("contacts"+(id).toString(),savedContactList);
        }else{
            const selectedContact=JSON.parse(JSON.stringify((contact.list)[findIndex]));
            selectedContact.userInfo={group_name:group.name,group_logo:group.logo};
            (contact.list)[findIndex]=selectedContact;
            const savedContactList = await contact.save();
            this.modelingGateway.server.emit("contacts"+(id).toString(),savedContactList);
        }

    }


    deleteGroupFromContactList=async (group,id)=>{
        let contact=await this.contactModel.findOne({user_id:new mongoose.Types.ObjectId(id)});
        if(contact){
            const findIndex=(contact.list).findIndex((c)=>(c.id).toString()===(group.id).toString())
            if(findIndex!==-1){
                (contact.list).splice(findIndex, 1);
                const savedContactList = await contact.save();
                this.modelingGateway.server.emit("contacts"+(id).toString(),savedContactList);
            }
        }
    }


    createGroup = async (payload: CreateGroupDto) => {
        const group = new this.groupsChatModel(payload);
        const saveGroup:any = await group.save();
        const wedding:any=await this.weddingModel.findById(payload.weddingId).lean();

        const groupUsersList=group.users;
        for(let i=0;i<groupUsersList.length;i++){
            await this.addGroupInContactList(group,groupUsersList[i].id);
        }

        return successResponse(
            200,
            'Group Created',
            {...wedding,group:[saveGroup._doc]},
        );
    };

    updateGroup = async (id: string, payload: UpdateGroupDto) => {
        const group: any = await this.groupsChatModel.findById(id);

        if (group) {
            if (payload.name) group.name = payload.name;
            if (payload.logo) group.logo = payload.logo;
            const savedGroup=await group.save();

            const groupUsersList=savedGroup.users;
            for(let i=0;i<groupUsersList.length;i++){
                await this.addGroupInContactList(savedGroup,groupUsersList[i].id);
            }

            return successResponse(200, 'Group updated', savedGroup);
        } else {
            return errorResponse(404, 'Group not found');
        }
    };

    deleteGroup = async (id: string) => {
        const group: any = await this.groupsChatModel.findById(id);

        if (group) {
            await group.remove();

            const groupUsersList=group.users;
            for(let i=0;i<groupUsersList.length;i++){
                await this.deleteGroupFromContactList(group,groupUsersList[i].id);
            }

            return successResponse(200, 'Group Deleted', group);
        } else {
            return errorResponse(404, 'Group not found.');
        }
    };

    getGroupById = async (id: string) => {
        const group: any = await this.groupsChatModel.findById(id);

        if (group) {
            return successResponse(200, 'Group details', group);
        } else {
            return errorResponse(404, 'Group not found.');
        }
    };


    getGroupByWedding = async (weddingId: string) => {
        const group: any = await this.groupsChatModel.find({weddingId});

        if (group) {
            return successResponse(200, 'Group by weddings', group);
        } else {
            return errorResponse(404, 'W.');
        }
    };


    addNewMembers = async (id: string, payload: AddGroupMembersDto) => {
        const group: any = await this.groupsChatModel.findById(id);

        if (group) {
            if (group.users) {
                const groupUsersList=group.users;
                for(let user of payload.users){
                    const findIndex=groupUsersList.findIndex((u)=>(user.id).toString()===(u.id).toString())
                    if(findIndex===-1){
                        groupUsersList.push(user);
                    }
                }
                group.users = groupUsersList;
            } else {
                group.users = payload.users;
            }
            const savedGroup=await group.save();
            const groupUsersList=payload.users;
            for(let i=0;i<groupUsersList.length;i++){
                await this.addGroupInContactList(savedGroup,groupUsersList[i].id);
            }
            return successResponse(200, 'Group members added', group);
        } else {
            return errorResponse(404, 'Group not found.');
        }
    };

    removeGroupMembers = async (id: string, payload: DeleteGroupMemberDto) => {
        const group: any = await this.groupsChatModel.findById(id);

        if (group) {
            const updatedUsers = (group.users).filter((user) =>
                (payload.users).findIndex((p) => (user.id).toString() === (p).toString())===-1);
            group.users=updatedUsers;
            const savedGroup=await group.save();
            const groupUsersList=payload.users;
            for(let i=0;i<groupUsersList.length;i++){
                await this.deleteGroupFromContactList(group,groupUsersList[i]);
            }
            return successResponse(200, 'Group members removed', savedGroup);
        } else {
            return errorResponse(404, 'Group not found.');
        }
    };


    updateContactList=async (data,userId,isSender)=>{
        let contactsList=await this.contactModel.findOne({user_id:new mongoose.Types.ObjectId(userId)});
        if(!contactsList){
            const contact=new this.contactModel({user_id:userId,list:[]});
            contactsList=await contact.save();
        }

        const index=(contactsList.list).findIndex((user:any)=>(user.id).toString()===(data.id).toString());

        if(isSender){
            data.count=index!==-1?contactsList.list[index].count:0;
        }else{
            data.count=index!==-1?contactsList.list[index].count+1:1;
        }

        if(index>=0){

            contactsList.list[index]=data;
        }else{
            (contactsList.list).push(data)
        }

        const savedContactList=await contactsList.save();

        this.modelingGateway.server.emit("contacts"+(userId).toString(),savedContactList);

    }

    handleContactsList=async (group:any,payload: CreateGroupMessageDto)=>{

        const usersList=group.users;
        if(usersList && usersList.length>0){
            for(let i=0;i<usersList.length;i++){
                const isSender=(usersList[i].id).toString()===(payload.message.sender).toString();
                const data={
                    last_message:payload.message.text,
                    count:0,
                    id:group._id,
                    userInfo:{
                        group_name:group.name,
                        group_logo:group.logo
                    },
                    updated_at:new Date().toISOString()
                };
                await this.updateContactList(data,usersList[i].id,isSender);
            }
        }
    }

    createGroupMessage = async (id: string, payload: CreateGroupMessageDto) => {
        const group: any = await this.groupsChatModel.findById(id);

        if (group) {
            payload.groupId=id;
            const groupConversation = new this.groupConversationsModel(payload);
            const savedConversation=await groupConversation.save();
            await this.handleContactsList(group,payload);
            this.modelingGateway.server.emit("group_message",savedConversation);
            return successResponse(200, 'Group message saved.', savedConversation);
        } else {
            return errorResponse(404, 'Group not found.');
        }
    };


    getGroupMessages = async (id: string,userId:string) => {
        const group: any = await this.groupsChatModel.findById(id);

        if (group) {
            const groupConversation: any = await this.groupConversationsModel.find({groupId:id});

            let senderContacts=await this.contactModel.findOne({user_id:userId});

            if(!senderContacts) {
                senderContacts=new this.contactModel({user_id:userId,list:[]});
                senderContacts=await senderContacts.save();
            }

            const senderIndex=(senderContacts.list).findIndex((user:any)=>user.id===id);
            if(senderIndex>=0){
                senderContacts.list[senderIndex].count=0;
                await senderContacts.save();
            }

            return successResponse(200, 'Group details', groupConversation);
        } else {
            return errorResponse(404, 'Group not found.');
        }
    };

}
