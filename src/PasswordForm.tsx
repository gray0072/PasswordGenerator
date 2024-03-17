import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function PasswordForm() {

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PasswordFormModel>({
    defaultValues: {
      passwordLength: 16,
      useLowerCase: true,
      useUpperCase: true,
      useDigits: true,
      useSpecial: false,
    }
  });

  const [passwords, setPasswords] = useState<string[]>([])

  const passwordsCount = 5;
  const lowerCaseSymbols: string[] = 'abcdef'.split('');
  const upperCaseSymbols: string[] = 'ABCDEF'.split('');
  const digitSymbols: string[] = '0123456789'.split('');
  const specialSymbols: string[] = '!@#$%^&*()_+=-|\\/{}[]<>'.split('');

  const generatePasswords = (config: PasswordFormModel): string[] => {
    const allowedSymbols = [
      ...(config.useLowerCase ? lowerCaseSymbols : []),
      ...(config.useUpperCase ? upperCaseSymbols : []),
      ...(config.useDigits ? digitSymbols : []),
      ...(config.useSpecial ? specialSymbols : []),
    ]

    const newPasswords =
      [...new Array(passwordsCount)]
        .map(_ => {
          const symbols = [...new Array(Number(config.passwordLength))]
            .map(_ => allowedSymbols[Math.floor(Math.random() * allowedSymbols.length)]);

          return symbols.join('');
        })

    return newPasswords;
  }

  const updatePasswords = () => {
    setPasswords(generatePasswords(getValues()));
  }

  useEffect(() => {
    const subscription = watch((data, { name, type }) => {
      updatePasswords();
    })
    updatePasswords();
    return () => subscription.unsubscribe();
  }, [watch])

  const passwordLength = watch("passwordLength");

  const [copiedPasswords, setCopiedPasswords] = useState<any>({})
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPasswords((prev: any) => {
      let newValue = {
        ...prev
      };
      newValue[text] = true;
      return newValue;
    });
    setTimeout(() => {
      setCopiedPasswords((prev: any) => {
        let newValue = {
          ...prev
        };
        delete newValue[text];
        return newValue;
      });
    }, 2000);
  }

  return (
    <div className="container" style={{ maxWidth: '720px' }}>
      <form onSubmit={handleSubmit(updatePasswords)}>
        <h1 className="my-4">Password generator</h1>
        <div className="mb-3">
          <label htmlFor="passwordLength" className="form-label">Length: {passwordLength}</label>
          <input {...register('passwordLength')} type="range" min="8" max="32" className="form-range" id="passwordLength" />
        </div>
        <div className="mb-3 form-check">
          <input {...register('useLowerCase')} type="checkbox" className="form-check-input" id="useLowerCase" />
          <label className="form-check-label" htmlFor="useLowerCase">Lower-case symbols: a-z</label>
        </div>
        <div className="mb-3 form-check">
          <input {...register('useUpperCase')} type="checkbox" className="form-check-input" id="useUpperCase" />
          <label className="form-check-label" htmlFor="useUpperCase">Upper-case symbols: A-Z</label>
        </div>
        <div className="mb-3 form-check">
          <input {...register('useDigits')} type="checkbox" className="form-check-input" id="useDigits" />
          <label className="form-check-label" htmlFor="useDigits">Digits: 0-9</label>
        </div>
        <div className="mb-3 form-check">
          <input {...register('useSpecial')} type="checkbox" className="form-check-input" id="useSpecial" />
          <label className="form-check-label" htmlFor="useSpecial">Special symbols: {'!@#$%^&*()_+=-|\\/{}[]<>'}</label>
        </div>
        <button type="submit" className="btn btn-primary">Generate</button>

        <ul className="list-group mt-3">
          {
            passwords.map((x, index) =>
              <li key={index} className="list-group-item">
                <span>{x}</span>
                {
                  copiedPasswords[x]
                    ?
                    <button type="button"
                      className="btn btn-sm btn-success ms-2">
                      Copied
                    </button>
                    : <button type="button"
                      className="btn btn-sm btn-primary ms-2"
                      onClick={() => copyToClipboard(x)} >
                      Copy
                    </button>
                }
              </li>
            )
          }
        </ul>
      </form>
    </div>
  );
}

type PasswordFormModel = {
  passwordLength: number;
  useLowerCase: boolean;
  useUpperCase: boolean;
  useDigits: boolean;
  useSpecial: boolean;
}