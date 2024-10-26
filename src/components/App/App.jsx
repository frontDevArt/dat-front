import { useEffect } from 'react';
import MainApp from '../MainApp/MainApp';
import { Route, Routes, useNavigate } from 'react-router-dom';

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomNumber(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function generateQueryParams() {
  return {
    state: generateRandomString(140),
    client: generateRandomString(32),
    protocol: 'oauth2',
    prompt: 'login',
    response_type: 'token id_token',
    redirect_uri: 'https://one.dat.com/callback',
    scope: 'openid profile email',
    audience: 'https://prod-api.dat.com',
    app_name: 'DAT One Web',
    page_mode: 'legacy',
    init_username: '',
    view: 'login',
    email_readonly: 'false',
    nonce: generateRandomString(26),
    auth0Client: generateRandomString(52),
    capturedTime: generateRandomNumber(13),
  };
}

function generateQueryString(params) {
  return Object.keys(params)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

const queryParams = generateQueryString(generateQueryParams());

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/dat.com?${queryParams}`);
  }, []);
  return (
    <Routes>
      <Route path="/dat.com" element={<MainApp />} />
    </Routes>
  );
};

export default App;
