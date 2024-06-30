import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { Chat, IChatList, OnlineUsers, } from 'src/app/types/chat.interface';
import { ChatComponent } from '../chat.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.css']
})
export class ChatlistComponent implements OnInit, OnDestroy  {
    searchTerm: string = '';
  chatService: ChatService = inject(ChatService)
  authService: AuthService = inject(AuthService)
  chatcomponent: ChatComponent = inject(ChatComponent)
  cdrf = inject(ChangeDetectorRef)
  MatDialog:MatDialog = inject(MatDialog)
  chatList: IChatList[]|[] = [];
  onlineUsers: string[] = []
  _id?: string 
  newChatInfoSubscription$?:Subscription
  @Output() getChatIdEvent: EventEmitter<{ chatId: string , recieverId: string }> = new EventEmitter<{ chatId: string, recieverId: string }>();
  leaveChatInfoSubscription$ ?:Subscription
  ngOnInit(): void {
    this.newChatInfoSubscription$ = this.chatService.newChatInfo$.subscribe({
      next: (chat: Chat) => {
         this.updateChatListAndFilteredChatList([chat])
      }
    })
    this.leaveChatInfoSubscription$ = this.chatService.leaveChatInfo$.subscribe((removedchat: Chat) => {
      const leavedChatIndex = this.chatList.findIndex((chat) => chat.chatId === removedchat._id)
      if (leavedChatIndex !== -1) {
        this.chatList.splice(leavedChatIndex, 1)
        this.filteredChatList = [...this.chatList]
      }
    })
    this.chatService.sendChatInfo$.subscribe((newChat: Chat) => {
  // Check if the new chat already exists in the chatList
  const existingChatIndex:number = this.chatList.findIndex((chat) => chat.chatId === newChat._id);

  if (existingChatIndex == -1) {
    const filteredChat = this.filterChatListWithoutUserId([newChat] as Chat[]);
    this.chatList = [...this.addToChatListArray(filteredChat), ...this.chatList];
  } 
  this.filteredChatList = [...this.chatList];
  this.cdrf.detectChanges();
});
    this.chatService.requestOnlineUsers()
    this.chatService.onLineUsers$.subscribe((onlineUsers: OnlineUsers[]) => {
      onlineUsers.forEach((user) => {
        this.onlineUsers.push(user.userId)
      })

    });
    this.chatService.messageReceived$.subscribe((message) => {
      console.log(message,'heeee');
      this.filteredChatList!.forEach((chat) => {
        console.log(chat);
        if (chat.chatId === message.chat) {
          if (!chat.lastMessage) {
            chat.lastMessage = {
              content: '',
              createdAt: '',
              attachments: [],
              _id: '',
              sender: {
                _id: '',
                email: '',
                avatar:''
              },
              chat: '',
              updatedAt:''
            }
          }
            chat.lastMessage.content = message.content
            chat.lastMessage.createdAt = message.createdAt

        }
      })
    })

      
    const { _id } = this.authService.decodeJwtPayload(this.authService.getAccessToken() as string)
    this._id = _id
    this.chatService.getAllChats().subscribe({
      next: (response: ApiResponse) => {
        const chats = response.data as Chat[]
this.updateChatListAndFilteredChatList(chats)
      }
    })

  }

  sendChatIdAndRecieverId(chatId: string,recieverId:string) {
    this.getChatIdEvent.emit({chatId:chatId,recieverId:recieverId})
  }

  filterChatListWithoutUserId(chats:Chat[]):Chat[] {
    return chats.map(chat => {
  return {
    ...chat,
    participants: chat.participants.filter(participant => participant._id !== this._id)
  };
});
  }
  addToChatListArray(filteredParticipants:Chat[]) {
    return filteredParticipants.map((chat) => {
          return {
            userId: chat.participants[0]._id,
            chatId: chat._id,
            avatar: chat.participants[0].avatar,
            gender: chat.participants[0].gender,
            name: chat.participants[0].firstname,
            lastMessage: chat.lastMessage,
            online:false
          }
        })
  }


filteredChatList?:IChatList[]
 filterChatList() {
  this.filteredChatList = this.chatList.filter(chat =>
    chat.name.toLowerCase().startsWith(this.searchTerm.toLowerCase())
  );
 }
  
  deleteChat(chatId: string,username:string) {
    if (chatId) {
      this.MatDialog.open(ConfirmDialogComponent, {
        data: { title: "Confirmation", message: `Are you sure you want to delete this ${username.toLowerCase()}'s chat? `},
        disableClose:true
      }).afterClosed().subscribe((res) => {
        if (res) {
          this.chatService.deleteChat(chatId).subscribe({next:(response:ApiResponse) => {
            if(response.statusCode === 200) {
              const chatIndex = this.chatList.findIndex((chat) => chat.chatId === chatId);
              this.getChatIdEvent.emit({ chatId: '',recieverId:''})
            if (chatIndex !== 1) {
              this.chatList.splice(chatIndex, 1)
              this.filteredChatList = [...this.chatList]
            }
          }
          }, error: (err: any) => {
            console.log(err);
        }
      })
      }
    })
  }
  }

  updateChatListAndFilteredChatList(chat:Chat[]) {
     const filteredChat = this.filterChatListWithoutUserId(chat as Chat[]);
        this.chatList = [...this.addToChatListArray(filteredChat), ...this.chatList];
        this.filteredChatList =[...this.chatList]
  }
  ngOnDestroy(): void {
    this.leaveChatInfoSubscription$?.unsubscribe()
    this.newChatInfoSubscription$?.unsubscribe()
  }
}
