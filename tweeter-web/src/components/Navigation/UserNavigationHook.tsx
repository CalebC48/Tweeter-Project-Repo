import { useState } from "react";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/UserNavigationPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { AuthToken, User } from "tweeter-shared";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
  extractAlias: (value: string) => string;
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
}

const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    presenter.navigateToUser(event, currentUser, authToken);
  };

  const listener: UserNavigationView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  return {
    navigateToUser: navigateToUser,
    extractAlias: presenter.extractAlias,
    getUser: presenter.getUser,
  };
};

export default useUserNavigation;
