import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from '@angular/core';
import { ChatComponent } from '../chat.component';
import { ChatService } from 'src/app/services/chat.service';
import { ApiResponse } from 'src/app/types/api.interface';
import { Message } from 'src/app/types/message.interface';
import { Chat, Participant } from 'src/app/types/chat.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnChanges, OnInit ,AfterViewInit,AfterViewChecked {
  currentUserId?: string
  authServices = inject(AuthService)
  chatComponent: ChatComponent = inject(ChatComponent)
  chatServices: ChatService = inject(ChatService)
  changeDectectorRef:ChangeDetectorRef = inject(ChangeDetectorRef)
  @Input() chatId?: string
  @Input() recieverId?: string
  @ViewChild('messageInput') messageInput?: ElementRef<HTMLInputElement>
    @ViewChild('chatContainer', { static: false }) chatContainerRef?: ElementRef<HTMLDivElement>;

   selectedFiles: File[] = [];
  chatMessages: Message[] | [] = [];
  participantData?: Participant
    fileSelectedToShowInUI ?:{url:string,file:File}[]
  ngOnInit(): void {
    this.chatServices.messageReceived$.subscribe((message: Message) => {
      this.chatMessages = [...this.chatMessages,message]
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    
    if (this.chatId) {
this.getMessageById(this.chatId)
    }
    if (this.recieverId) {
      const { _id } = this.authServices.decodeJwtPayload(this.authServices.getAccessToken() as string)
      this.currentUserId = _id
      this.createOrGetChat(this.recieverId,_id)
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
      formData.append('content',' ')
    }
    if (this.selectedFiles.length) {
      this.selectedFiles.forEach((file) => {
        formData.append('attachments',file)
      })
    }
    this.sendMessageToBackend(formData)
    this.selectedFiles = []
    this.fileSelectedToShowInUI = []
   this.messageInput!.nativeElement.value =''

  } 
  sendMessageToBackend(formData:FormData) {
    this.chatServices.sendMessage(this.chatId!, formData).subscribe((response: ApiResponse) => {
      const message = response.data as Message
      this.chatMessages =[...this.chatMessages,message]
    })
  }

  getMessageById(chatId:string) {
          this.chatServices.getMessageById(chatId).subscribe({
        next: (response: ApiResponse) => {
              const messages = response.data as Message[];
              console.log(messages);
          this.chatMessages = messages.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());

        }
      })
  }

  createOrGetChat(recieverId:string,_id:string) {
        this.chatServices.createOrGetAOneOnOneChat(recieverId).subscribe({
        next: (response: ApiResponse) => {
          const chats = response.data as Chat
          const participantData = chats.participants.filter(participant => participant._id !== _id)
          this.participantData = participantData[0]
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
       this.fileSelectedToShowInUI = this.selectedFiles.map((file:File) => {
      return {
        url: this.fileToUrl(file),
        file:file
      }
    })
}
  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
    this.fileSelectedToShowInUI = this.fileSelectedToShowInUI?.filter((f)=> f.file !==file )
}
 

  ngAfterViewInit(): void {
    this.changeDectectorRef.detectChanges()
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
   scrollToBottom() {
    if (this.chatContainerRef && this.chatContainerRef.nativeElement) {
      this.chatContainerRef.nativeElement.scrollTop = this.chatContainerRef.nativeElement.scrollHeight;
    }
  }
}
 