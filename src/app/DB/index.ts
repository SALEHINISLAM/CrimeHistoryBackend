import config from "../config";
import { USER_ROLE } from "../modules/User/user.constants";
import { User } from "../modules/User/user.model";
import { v1 as uuidv1 } from 'uuid';

const superUser = {
    user_id: uuidv1(),
    email: 'super@admin.com',
    password: config.default_pass,
    phone_number: '01640490632',
    needsPasswordChange: false,
    role: USER_ROLE.SuperAdmin,
    is_banned: false,
    is_verified: true,
};

const seedSuperAdmin = async () => {
    //when database is connected, we will check is there any user who is super admin
    const isSuperAdminExits = await User.findOne({ role: USER_ROLE.SuperAdmin });

    if (!isSuperAdminExits) {
        await User.create(superUser);
    }
};

export default seedSuperAdmin