import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import useUserInfo from "../../userInfo/UserInfoHook";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticatinFields from "../AuthenticationFields";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const doLogin = async () => {
    setIsLoading(true);

    await presenter.doLogin(alias, password, rememberMe, props.originalUrl);

    setIsLoading(false);
  };

  const inputFieldGenerator = () => {
    return (
      <AuthenticatinFields
        onEnterEvent={(event) =>
          presenter.handleLoginOnEnter(
            event,
            alias,
            password,
            rememberMe,
            props.originalUrl
          )
        }
        setAlias={setAlias}
        setPassword={setPassword}
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  const listener: LoginView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigate: navigate,
  };

  const [presenter] = useState(new LoginPresenter(listener));

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() =>
        presenter.checkSubmitButtonStatus(alias, password)
      }
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
