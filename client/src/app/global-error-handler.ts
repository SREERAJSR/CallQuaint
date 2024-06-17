import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { NotificationService } from "./services/notification.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler{

    constructor(private injector: Injector) { }
    
    handleError(error: Error | HttpErrorResponse): void {
        const notifier = this.injector.get(NotificationService)
        let message: string;

        if (error instanceof HttpErrorResponse) {
            console.log(error);
            notifier.openServerErrorDialog(error.error.errorMessage)
        } else {
            message = error.message ? error.message : error.toString();
            notifier.showClientError(message)
        }
        console.log(error);
    }

}