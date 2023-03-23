import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {
    AddGroupMembersDto,
    CreateGroupDto,
    CreateGroupMessageDto,
    DeleteGroupMemberDto,
    UpdateGroupDto
} from "./dtos/group.dto";
import {GroupChatService} from "./group-chat.service";

@Controller('group')
export class GroupChatController {
    constructor(private groupChatService: GroupChatService) {
    }

    @Post('/')
    async create(@Body() body: CreateGroupDto) {
        const group = await this.groupChatService.createGroup(body);
        return group;
    }

    @Put('/:id')
    async update(@Param('id') id,@Body() body: UpdateGroupDto) {
        const group = await this.groupChatService.updateGroup(id,body);
        return group;
    }

    @Delete('/:id')
    async delete(@Param('id') id) {
        const post = await this.groupChatService.deleteGroup(id);
        return post;
    }

    @Get('/:id')
    async get(@Param('id') id) {
        const group = await this.groupChatService.getGroupById(id);
        return group;
    }

    @Get('/wedding/:id')
    async getGroupByWedding(@Param('id') id) {
        const group = await this.groupChatService.getGroupByWedding(id);
        return group;
    }

    @Put('/add-members/:id')
    async addNewMember(@Param('id') id,@Body() body: AddGroupMembersDto) {
        const group = await this.groupChatService.addNewMembers(id,body);
        return group;
    }

    @Put('/delete-members/:id')
    async removeGroupMembers(@Param('id') id,@Body() body: DeleteGroupMemberDto) {
        const group = await this.groupChatService.removeGroupMembers(id,body);
        return group;
    }

    @Post('/message/:id')
    async createGroupMessage(@Param('id') id,@Body() body: CreateGroupMessageDto) {
        const group = await this.groupChatService.createGroupMessage(id,body);
        return group;
    }

    @Get('/:id/messages/user/:userId')
    async getGroupMessages(@Param('id') id,@Param('userId') userId) {
        const group = await this.groupChatService.getGroupMessages(id,userId);
        return group;
    }

}
