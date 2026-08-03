import {AuthRoutes} from "./auth.routes";
import {AvatarRoutes} from "./avatar.routes";
import {DocumentRoutes} from "./document.routes";
import {ProfileRoutes} from "./profile.routes";
import {TutorProfileRoutes} from "./tutor.profile.routes";
import {TutorDocumentRoutes} from "./tutor.document.routes";
import {ReviewRoutes} from "./review.routes";

export const Routes = [
    ...AuthRoutes,
    ...AvatarRoutes,
    ...DocumentRoutes,
    ...ProfileRoutes,
    ...TutorProfileRoutes,
    ...TutorDocumentRoutes,
    ...ReviewRoutes,
]