import { GoogleInitOptions, GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { environment } from "src/environments/environment.development";


const googleLoginOptions: GoogleInitOptions = {
    oneTapEnabled: false, // default is true
  scopes: 'https://www.googleapis.com/auth/user.gender.read'
}; 
 const googleLoginConfig = {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID, googleLoginOptions )
 }
export default googleLoginConfig;