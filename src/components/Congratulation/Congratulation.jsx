import { useEffect } from 'react';
import './Congratulation.scss';

const Congratulation = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = 'https://dat.com/';
    }, 5000);
  }, []);
  return (
    <div className="congratulation">
      <img src="/img/completed.png" alt="completed" />
      <p className="congratulation__description">Congratulations your account is verified</p>
    </div>
  );
};

export default Congratulation;
