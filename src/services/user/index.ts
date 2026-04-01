
import { getProfile } from "./profile";
import { verifyUsername } from "./verify-username";
import { verifyEmail } from "./verify-email";
import { updateProfile } from "./update";
import { deleteProfile } from "./delete";
import { uploadAvatar } from "./upload-avatar";

class User {
    getProfile = getProfile;
    verifyUsername = verifyUsername;
    verifyEmail = verifyEmail;
    updateProfile = updateProfile;
    deleteProfile = deleteProfile;
    uploadAvatar = uploadAvatar;
}

export const user = new User();