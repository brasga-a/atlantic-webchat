import { signIn } from "./sign-in";
import { signOut } from "./sign-out";

class Auth {
    signIn = signIn;
    signOut = signOut;
}

export const auth = new Auth();