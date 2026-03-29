
import { getProfile } from "./profile";
import { verifyUsername } from "./verify-username";
import { updateProfile } from "./update";

class User {
    getProfile = getProfile;
    verifyUsername = verifyUsername;
    updateProfile = updateProfile;
}

export const user = new User();