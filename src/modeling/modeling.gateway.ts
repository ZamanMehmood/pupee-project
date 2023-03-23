import {Bind, Injectable} from "@nestjs/common";
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayInit,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import {ModelingService} from "./modeling.service";
import {ChatService} from "./chat.service";


@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

@Injectable()
export class ModelingGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

    @WebSocketServer()
    server: Server;

    constructor(private chatService: ChatService) {
    }

    @Bind(MessageBody(), ConnectedSocket())
    @SubscribeMessage('events')
    handleEvent(data,client): any {
        client.broadcast.emit("message","received")
        return data;
    }

    @Bind(MessageBody(),ConnectedSocket())
    @SubscribeMessage('update_contacts_count_zero')
    handleUpdateCountToZero(data,client): any {
        this.chatService.updateContactsCountZero(data.userId,data.receiverId,client);
        return data;
    }


    @Bind(MessageBody(),ConnectedSocket())
    @SubscribeMessage('user_status')
    handleUserStatus(data,client): any {
        this.chatService.getUserStatus(data.userId,client);
        return data;
    }


    @Bind(MessageBody(),ConnectedSocket())
    @SubscribeMessage('model_status')
    handleModelStatus(data,client): any {
        this.chatService.getModelStatus(data.modelId,client);
        return data;
    }


    afterInit(server: Server) {
    }

    handleDisconnect(client: Socket) {
    }

    handleConnection(client: Socket, ...args: any[]) {
        client.setMaxListeners(20);

    }
}