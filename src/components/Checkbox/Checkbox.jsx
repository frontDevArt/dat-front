import './Checkbox.scss';

const Checkbox = ({ label, width, height, error, ...props }) => {
  return (
    <label className="checkbox">
      <input className="checkbox__input" type="checkbox" {...props} />
      <span style={{ width: width, height: height, ...(props?.style || {}) }} className="checkbox__box">
        {props?.checked && (
          <span className="checkbox__checkmark">
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4 8L11 1" stroke="white" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </span>
        )}
      </span>
      {label && <span className="checkbox__label">{label}</span>}
      {error && <span className="checkbox__error-text">{error}</span>}
    </label>
  );
};

export default Checkbox;
