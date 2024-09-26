interface Props {
    onEnterEvent: (event: React.KeyboardEvent<HTMLElement>) => void;
    setAlias: (alias: string) => void;
    setPassword: (password: string) => void;
}

const AuthenticatinFields = (props: Props) => {
    return (
        <>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              size={50}
              id="aliasInput"
              placeholder="name@example.com"
              onKeyDown={props.onEnterEvent}
              onChange={(event) => props.setAlias(event.target.value)}
            />
            <label htmlFor="aliasInput">Alias</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control bottom"
              id="passwordInput"
              placeholder="Password"
              onKeyDown={props.onEnterEvent}
              onChange={(event) => props.setPassword(event.target.value)}
            />
            <label htmlFor="passwordInput">Password</label>
          </div>
        </>
    );
}

export default AuthenticatinFields;