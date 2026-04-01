import { signIn } from "./sign-in";
import { signOut } from "./sign-out";
import { signUp } from "./sign-up";

class Auth {
    signIn = signIn;
    signOut = signOut;
    signUp = signUp;

}

export const auth = new Auth();