import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import useUserInfo from "../../userInfo/UserInfoHook";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticatinFields from "../AuthenticationFields";
import {
  RegisterPresenter,
  RegisterView,
} from "../../../presenters/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const doRegister = async () => {
    setIsLoading(true);

    presenter.doRegister(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension,
      rememberMe
    );

    setIsLoading(false);
  };

  const listener: RegisterView = {
    displayErrorMessage: displayErrorMessage,
    updateUserInfo: updateUserInfo,
    navigate: navigate,
    setImageUrl: setImageUrl,
    setImageBytes: setImageBytes,
    setImageFileExtension: setImageFileExtension,
  };

  const [presenter] = useState(new RegisterPresenter(listener));

  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={(event) =>
              presenter.registerOnEnter(
                event,
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageUrl,
                imageFileExtension,
                rememberMe
              )
            }
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={(event) =>
              presenter.registerOnEnter(
                event,
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageUrl,
                imageFileExtension,
                rememberMe
              )
            }
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticatinFields
          onEnterEvent={(event) =>
            presenter.registerOnEnter(
              event,
              firstName,
              lastName,
              alias,
              password,
              imageBytes,
              imageUrl,
              imageFileExtension,
              rememberMe
            )
          }
          setAlias={setAlias}
          setPassword={setPassword}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={(event) =>
              presenter.registerOnEnter(
                event,
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageUrl,
                imageFileExtension,
                rememberMe
              )
            }
            onChange={(event) => presenter.handleFileChange(event)}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() =>
        presenter.checkSubmitButtonStatus(
          firstName,
          lastName,
          alias,
          password,
          imageUrl,
          imageFileExtension
        )
      }
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
