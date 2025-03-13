import {
    createContext
} from "react";

import UserData from "schemas/userData";

const userDataContext = createContext<UserData | undefined | null>(undefined);

export default userDataContext;
