'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

import { whatsappLink } from '@/lib/api';

type FormKind = 'contact' | 'wholesale';

type FormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  quantity: string;
  message: string;
};

type FieldName = Exclude<keyof FormValues, 'message'>;

type FieldDefinition = {
  name: FieldName;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  autoComplete?: string;
  required?: boolean;
  maxLength?: number;
};

const PRODUCT_INTERESTS = [
  'Bedsheets',
  'Towels',
  'Phetas',
  'Blankets',
  'Shawls',
  'Gifting',
];

export function WhatsAppEnquiryForm({
  kind,
}: {
  kind: FormKind;
}) {
  const wholesale = kind === 'wholesale';
  const prefix = wholesale ? 'ws' : 'contact';

  const [values, setValues] = useState<FormValues>({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    quantity: '',
    message: '',
  });

  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [preparedUrl, setPreparedUrl] = useState('');

  const fields: FieldDefinition[] = [
    {
      name: 'name',
      label: 'Your name',
      autoComplete: 'name',
      required: true,
      maxLength: 120,
    },
    ...(wholesale
      ? [
          {
            name: 'company' as const,
            label: 'Company or store',
            autoComplete: 'organization',
            maxLength: 160,
          },
        ]
      : []),
    {
      name: 'email',
      label: 'Email address',
      type: 'email',
      autoComplete: 'email',
      required: true,
      maxLength: 254,
    },
    {
      name: 'phone',
      label: 'Phone / WhatsApp number',
      type: 'tel',
      autoComplete: 'tel',
      required: wholesale,
      maxLength: 30,
    },
    ...(wholesale
      ? [
          {
            name: 'city' as const,
            label: 'City / country',
            autoComplete: 'address-level2',
            maxLength: 160,
          },
          {
            name: 'quantity' as const,
            label: 'Requested quantity',
            type: 'number' as const,
            required: true,
          },
        ]
      : []),
  ];

  function update(
    fieldName: keyof FormValues,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [fieldName]: value,
    }));

    setError('');
    setPreparedUrl('');
  }

  function toggleInterest(value: string) {
    setInterests((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

    setPreparedUrl('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setPreparedUrl('');

    if (values.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }

    if (!values.email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!wholesale && !values.message.trim()) {
      setError('Please enter your message.');
      return;
    }

    if (wholesale) {
      const requestedQuantity = Number(values.quantity);

      if (
        !Number.isInteger(requestedQuantity) ||
        requestedQuantity < 1
      ) {
        setError(
          'Please enter the quantity you would like to enquire about.',
        );
        return;
      }

      const phoneDigits = values.phone.replace(/\D/g, '');

      if (
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
      ) {
        setError(
          'Please enter a valid phone number, including country code where applicable.',
        );
        return;
      }
    }

    const message = [
      'Hello मर्दा ॲन्ड सन्स,',
      '',
      wholesale
        ? 'I would like to make a wholesale enquiry.'
        : 'I would like to contact the store.',
      '',
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      ...(values.phone.trim()
        ? [`Phone: ${values.phone.trim()}`]
        : []),
      ...(wholesale
        ? [
            `Company / store: ${
              values.company.trim() || 'Not provided'
            }`,
            `City / country: ${
              values.city.trim() || 'Not provided'
            }`,
            `Requested quantity: ${values.quantity}`,
            `Interested in: ${
              interests.join(', ') || 'Please advise'
            }`,
          ]
        : []),
      '',
      'Message:',
      values.message.trim() ||
        'Please contact me to discuss.',
      '',
      'Please confirm availability, pricing, taxes and delivery charges.',
    ].join('\n');

    const url = whatsappLink(message);

    setPreparedUrl(url);

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <form
      onSubmit={submit}
      data-testid={`${prefix}-form`}
      className="space-y-7"
      aria-describedby={`${prefix}-help`}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.map((field) => {
          const fieldId = `${prefix}-${field.name}`;

          return (
            <div key={field.name}>
              <label
                htmlFor={fieldId}
                className="mb-2 block font-sub text-sm text-ink"
              >
                {field.label}
                {field.required ? ' *' : ' (optional)'}
              </label>

              <input
                id={fieldId}
                name={field.name}
                type={field.type ?? 'text'}
                autoComplete={field.autoComplete}
                required={field.required}
                maxLength={field.maxLength}
                min={
                  field.type === 'number' ? 1 : undefined
                }
                step={
                  field.type === 'number' ? 1 : undefined
                }
                inputMode={
                  field.type === 'tel'
                    ? 'tel'
                    : field.type === 'number'
                      ? 'numeric'
                      : undefined
                }
                value={values[field.name]}
                onChange={(event) =>
                  update(field.name, event.target.value)
                }
                data-testid={fieldId}
                className="input-line min-h-[44px] text-base"
              />
            </div>
          );
        })}
      </div>

      {wholesale && (
        <fieldset>
          <legend className="mb-3 font-sub text-sm text-ink">
            Products of interest — optional
          </legend>

          <div className="flex flex-wrap gap-3">
            {PRODUCT_INTERESTS.map((interest) => (
              <label
                key={interest}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-line px-3 py-2 font-sub text-sm"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={interests.includes(interest)}
                  onChange={() => toggleInterest(interest)}
                  className="h-4 w-4 accent-brand"
                />

                {interest}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label
          htmlFor={`${prefix}-message`}
          className="mb-2 block font-sub text-sm text-ink"
        >
          Your message
          {wholesale ? ' (optional)' : ' *'}
        </label>

        <textarea
          id={`${prefix}-message`}
          name="message"
          rows={5}
          required={!wholesale}
          maxLength={2000}
          value={values.message}
          onChange={(event) =>
            update('message', event.target.value)
          }
          data-testid={`${prefix}-message`}
          className="input-line resize-y text-base"
        />
      </div>

      <p
        id={`${prefix}-help`}
        className="font-sub text-sm leading-relaxed text-ink-soft"
      >
        This prepares a WhatsApp message. Your enquiry is
        not sent until you press Send in WhatsApp.
      </p>

      {error && (
        <p
          role="alert"
          className="font-sub text-sm text-ink"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        data-testid={`${prefix}-submit`}
        className="btn-primary w-full justify-center"
      >
        Continue on WhatsApp
        <ArrowRight size={15} />
      </button>

      {preparedUrl && (
        <div
          role="status"
          className="space-y-2 font-sub text-sm text-ink-soft"
        >
          <p>
            Your message is ready. Send it from WhatsApp
            to complete your enquiry.
          </p>

          <a
            href={preparedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center underline underline-offset-4"
          >
            If WhatsApp did not open, open it here →
          </a>
        </div>
      )}
    </form>
  );
}
