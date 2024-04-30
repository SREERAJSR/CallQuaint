import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { environment } from "src/environments/environment.development";

 const googleLoginConfig = {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
 }
export default googleLoginConfig;