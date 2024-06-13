import {  AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { ChatService } from 'src/app/services/chat.service';
import { ApiError, ApiResponse } from 'src/app/types/api.interface';
import { Message } from 'src/app/types/message.interface';
import { AcceptCallPayload, Chat, Participant, SendChatIdAndRecieverIdInterface } from 'src/app/types/chat.interface';
import { AuthService } from 'src/app/services/auth.service';
import { every } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { AgoraService } from 'src/app/services/agora.service';
import { ConnectService } from 'src/app/services/connect.service';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';


@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnChanges, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  currentUserId?: string
  authServices = inject(AuthService)
  chatComponent: ChatComponent = inject(ChatComponent)
  chatServices: ChatService = inject(ChatService)
  changeDectectorRef: ChangeDetectorRef = inject(ChangeDetectorRef)
  toaxtr: ToastrService = inject(ToastrService)
  matDialoog: MatDialog = inject(MatDialog)
  agoraService: AgoraService = inject(AgoraService)
  authService: AuthService = inject(AuthService)
  connectService: ConnectService = inject(ConnectService)
  @Input() chatId?: string
  @Input() recieverId?: string
  @ViewChild('messageInput') messageInput?: ElementRef<HTMLInputElement>
  @ViewChild('chatContainer', { static: false }) chatContainerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('agoraUiKit',{static:false}) agoraUiKit?:ElementRef<HTMLDivElement>
  selectedFiles: File[] = [];
  chatMessages: Message[] | [] = [];
  participantData?: Participant
  typing: boolean = false;
  fileSelectedToShowInUI?: { url: string, file: File }[]
  typingTimeout: any;
  deletedMessageInfoSubscription$?: Subscription
  chatPageHeight?:number =320
  ngOnInit(): void {
 
    this.chatServices.deletedMessageInfo$.subscribe({
      next: (deletedMessage: Message) => {
        this.updateDeletedMessge(deletedMessage)
      }
    })
    this.chatServices.sendChatIdAndRecieverId$.subscribe((payload: SendChatIdAndRecieverIdInterface) => {
      this.chatId = payload.chatId,
        this.recieverId = payload.recieverId
    })

    this.chatServices.emitJoinChatEvent(this.chatId!)
    this.chatServices.messageReceived$.subscribe((message: Message) => {
      this.chatMessages = [...this.chatMessages, message]
    })

    this.chatServices.typingInfo$.subscribe((chatId: string) => {
      if (this.participantData) {
        // Set typing to true when a typing event is received
        this.participantData.typing = true;

        // Clear any existing timeout
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }

        // Set a new timeout to reset the typing state after 1 second
        this.typingTimeout = setTimeout(() => {
          if (this.participantData) {
            this.participantData.typing = false;
          }
        }, 1000);
      }
    });

  
    this.chatServices.stopTypingInfo$.subscribe((chatId: string) => {
      if (this.chatId === chatId && this.participantData?.typing) {
        this.participantData.typing = false
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    
    if (this.chatId) {
      this.getMessageById(this.chatId)
    }
    if (this.recieverId) {
      const { _id } = this.authServices.decodeJwtPayload(this.authServices.getAccessToken() as string)
      this.currentUserId = _id
      this.createOrGetChat(this.recieverId, _id)
    }
    
  }
  sendMessage() {
    console.log(this.chatId);
    const content = this.messageInput?.nativeElement.value;
    console.log(this.selectedFiles);
    if (!content && !this.selectedFiles.length) return

    const formData = new FormData();

    if (content) {
      formData.append('content', content);
    } else {
      formData.append('content', ' ')
    }
    if (this.selectedFiles.length) {
      this.selectedFiles.forEach((file) => {
        formData.append('attachments', file)
      })
    }
    this.sendMessageToBackend(formData)
    this.selectedFiles = []
    this.fileSelectedToShowInUI = []
    this.messageInput!.nativeElement.value = ''

  }
  sendMessageToBackend(formData: FormData) {
    this.chatServices.sendMessage(this.chatId!, formData).subscribe((response: ApiResponse) => {
      const message = response.data as Message
      this.chatMessages = [...this.chatMessages]
      this.chatServices.messageReceived$.next(message)
    })
  }

  getMessageById(chatId: string) {
    this.chatServices.getMessageById(chatId).subscribe({
      next: (response: ApiResponse) => {
        const messages = response.data as Message[];
        console.log(messages);
        this.chatMessages = messages.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

      }
    })
  }

  createOrGetChat(recieverId: string, _id: string) {
    this.chatServices.createOrGetAOneOnOneChat(recieverId).subscribe({
      next: (response: ApiResponse) => {
        const chats = response.data as Chat
        const participantData = chats.participants.filter(participant => participant._id !== _id)
        this.participantData = { ...participantData[0], typing: false }
      }
    })
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 5) {
      alert('You can only select up to 5 images.');
      event.target.value = ''; // Clear the selected files
      return;
    }
    this.selectedFiles = Array.from(files);
    this.addToFileSelectedArea()
  }


  fileToUrl(file: File): string {
    return URL.createObjectURL(file);
  }
  addToFileSelectedArea() {
    this.fileSelectedToShowInUI = this.selectedFiles.map((file: File) => {
      return {
        url: this.fileToUrl(file),
        file: file
      }
    })
  }
  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
    this.fileSelectedToShowInUI = this.fileSelectedToShowInUI?.filter((f) => f.file !== file)
  }
 




  scrollToBottom() {
    if (this.chatContainerRef && this.chatContainerRef.nativeElement) {
      this.chatContainerRef.nativeElement.scrollTop = this.chatContainerRef.nativeElement.scrollHeight;
    }
  }
  
  onTyping(event: Event) {
    this.chatServices.emitTypingEvent(this.chatId!)
  }

  ngAfterViewInit(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.sendMessage()
        }
      })
    }
    // this.agoraService.setVideoContainer(this.agoraUiKit!)
     

  }
  deleteMessage(messageId: string, chatId: string) {
    if (messageId && chatId) {
      this.matDialoog.open(ConfirmDialogComponent, {
        data: { title: "Confirmation", message: `Are you sure you want to delete this  message? ` },
        disableClose: true
      }).afterClosed().subscribe((res) => {
        if (res) {
          this.chatServices.deleteMessage(chatId, messageId).subscribe({
            next: (res: ApiResponse) => {
              if (res.statusCode === 200) {
                const deleteMessage = res.data as Message
                this.updateDeletedMessge(deleteMessage)
                this.toaxtr.success('message deleted')
              }
            },
            error: (error: any) => {
              this.toaxtr.error(error.error.errorMessage)
            }
          })
        }
      })
    }

    
  }

  updateDeletedMessge(deletedMessage: Message) {
    const deletedIndex = this.chatMessages.findIndex((message) => message._id === deletedMessage._id)
    if (deletedIndex !== -1) {
      this.chatMessages.splice(deletedIndex, 1)
   
    }
  
  }
  startCall() {
    const accessToken = this.authService.getAccessToken()
    const { _id, firstname } = this.authService.decodeJwtPayload(accessToken as string)
    let payload: AcceptCallPayload
    let channelName:string
    this.connectService.getChannelNameForChatCall().subscribe((response: ApiResponse) => {
         channelName = response.data.channelName
         payload = {
        callerName: firstname,
        channelName: channelName,
        uid: _id,
        remoteId:this.recieverId as string
      }
      console.log(payload);
      this.agoraService.startVideoCall(payload)
    })

  
  }
  ngAfterViewChecked(): void {
    this.chatPageHeight = this.chatContainerRef?.nativeElement.scrollHeight
    this.changeDectectorRef.detectChanges()
  }

   endCall() {
 this.agoraService.leaveVideoCall()
  }
    
  startVoiceCall() {
    const accessToken = this.authService.getAccessToken()
    const { _id, firstname, gender } = this.authService.decodeJwtPayload(accessToken as string)
    const customUid = _id+' '+firstname+' '+gender;
    let payload: AcceptCallPayload
    let channelName: string
    this.connectService.getChannelNameForChatCall().subscribe((response: ApiResponse) => {
      channelName = response.data.channelName
      payload = {
        callerName: firstname,
        channelName: channelName,
        uid: _id,
        remoteId: this.recieverId as string
      }
      this.agoraService.startVoiceCall(payload,customUid)
    })
    
  }
  
  ngOnDestroy(): void {
    this.deletedMessageInfoSubscription$?.unsubscribe()
  
  
  }
}
 