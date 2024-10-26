import { useCallback, useState } from 'react';

import { toTitleCaseFromSnakeCase } from '@/utils/common';

const useFormValidator = (initialState) => {
  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validateNumber = useCallback(
    (name, value) => {
      let error = '';
      const numberPattern = /^-?\d*(\.\d+)?$/; // Allows integers and floating-point numbers

      if (value === '' && formState[name].required) {
        error = `${toTitleCaseFromSnakeCase(name)} is required`;
      } else if (!numberPattern.test(value)) {
        error = `${toTitleCaseFromSnakeCase(name)} must be a valid number`;
      } else if (formState[name].min && parseFloat(value) < formState[name].min) {
        error = `${toTitleCaseFromSnakeCase(name)} must be at least ${formState[name].min}`;
      } else if (formState[name].max && parseFloat(value) > formState[name].max) {
        error = `${toTitleCaseFromSnakeCase(name)} must be less than or equal to ${formState[name].max}`;
      }
      return error;
    },
    [formState]
  );

  // Helper functions for password validations
  const validatePassword = useCallback((name, value) => {
    let error = '';

    // Check for letters
    if (!/[a-zA-Z]/.test(value)) {
      error = `${toTitleCaseFromSnakeCase(name)} must contain at least one letter.`;
    }

    // Check for mixed case (uppercase and lowercase)
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      error = `${toTitleCaseFromSnakeCase(name)} must contain both uppercase and lowercase letters.`;
    }

    // Check for numbers
    if (!/\d/.test(value)) {
      error = `${toTitleCaseFromSnakeCase(name)} must contain at least one number.`;
    }

    // Check for symbols
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      error = `${toTitleCaseFromSnakeCase(name)} must contain at least one special character.`;
    }

    return error;
  }, []);

  // Validate individual fields
  const validateField = useCallback(
    (name, value) => {
      let error = '';

      // Check if required
      if (value === '' && formState[name].required) {
        error = `${toTitleCaseFromSnakeCase(name)} is required`;
      }

      // Check for minLength
      if (formState[name].minLength && value.length < formState[name].minLength) {
        error = `${toTitleCaseFromSnakeCase(name)} must be at least ${formState[name].minLength} characters long`;
      }

      // Check for pattern match (like email regex)
      if (formState[name].pattern && !formState[name].pattern.test(value)) {
        error = `${toTitleCaseFromSnakeCase(name)} is invalid`;
      }

      // Check if the value should be a number
      if (formState[name].isNumber) {
        error = validateNumber(name, value);
      }

      // Check for confirm password
      if (formState[name].isConfirmPassword && value !== formState.password.value) {
        error = 'Passwords do not match';
      }

      // Check for checkbox being checked
      if (formState[name].isCheckbox && formState[name].required && !value) {
        error = `${toTitleCaseFromSnakeCase(name)} must be checked`;
      }

      // Password-specific validations
      if (formState[name].isPassword) {
        error = validatePassword(name, value);
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [formState, validateNumber, validatePassword]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      setFormState((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value: newValue,
        },
      }));

      validateField(name, newValue);
    },
    [validateField]
  );

  const validateForm = useCallback(() => {
    let valid = true;
    Object.keys(formState).forEach((key) => {
      validateField(key, formState[key].value);
      if (errors[key]) {
        valid = false;
      }
    });
    return valid;
  }, [formState, errors, validateField]);

  return {
    formState,
    errors,
    handleChange,
    validateForm,
  };
};

export default useFormValidator;
