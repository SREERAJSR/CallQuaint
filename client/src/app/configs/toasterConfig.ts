import { GlobalConfig } from "ngx-toastr";

export const toasterConfig: Partial<GlobalConfig>={timeOut: 5000,
    positionClass: 'toast-top-right',
      preventDuplicates: true,progressAnimation:'increasing',closeButton:true}