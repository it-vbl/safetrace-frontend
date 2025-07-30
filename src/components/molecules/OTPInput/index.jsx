'use client';

import { useState, useRef } from 'react';
import { OTPInput as OTPInputField } from '@/components/atoms/OTPInputField';

/**
 * Renders a row of OTP inputs and manages focus / value changes.
 *
 * Props
 * ──────────────────────────────────────────────────────────
 * length      – How many digits the OTP has (default = 6)
 * onChange    – Called every time a digit changes
 * onComplete  – Called once all digits are entered
 */
export default function OTPInput({ length = 6, onChange, onComplete }) {
  // Store each digit separately so re-rendering is fast
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]); // Holds refs to every <input />

  // Runs whenever a single digit changes
  const handleDigitChange = (value, index) => {
    const next = [...otp];
    next[index] = value;
    setOtp(next);

    const otpString = next.join('');
    onChange?.(otpString);

    // Autofocus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Fire onComplete when every box is filled
    if (!next.includes('') && otpString.length === length) {
      onComplete?.(otpString);
    }
  };

  // Handle ← / → / Backspace and Paste navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.metaKey && e.key === 'v' && otp.join('').length < length) {
      navigator.clipboard
        .readText()
        .then((pasted) => {
          const pastedArray = pasted.replace(/[^0-9]/g, '').split('');
          if (!pastedArray.length) return;
          const next = [...otp];
          let i;
          for (i = index; i < length; i++) {
            if (pastedArray[i - index]) {
              next[i] = pastedArray[i - index];
            }
          }
          if (pastedArray.length > 1) {
            inputRefs.current[i - 1]?.focus();
          }
          setOtp(next);
          const otpString = next.join('');
          if (pastedArray.length === length) {
            onChange?.(otpString);
            onComplete?.(otpString);
          }
        })
        .catch(() => {
          console.log('Failed to read clipboard');
        });
    }
  };

  return (
    <div className='flex justify-center gap-3'>
      {otp.map((digit, idx) => (
        <OTPInputField
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          value={digit}
          index={idx}
          autoFocus={idx === 0}
          onKeyDown={handleKeyDown}
          onChange={(val) => handleDigitChange(val, idx)}
        />
      ))}
    </div>
  );
}
