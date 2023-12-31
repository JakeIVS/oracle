import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  useField,
  yupToFormErrors,
} from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

function NewCampaign({ id }) {
  const fieldFormat = 'rounded bg-gradient-to-t from-slate-400 to-white';
  const navigate = useNavigate();

  const MySelect = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <div className="flex flex-col">
        <label htmlFor={props.id || props.name}>{label}</label>
        <select {...field} {...props} className={fieldFormat} />
        {meta.touched && meta.error ? (
          <div className="pb-2 pt-0 text-xs text-red-600">{meta.error}</div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="h-full w-full bg-neutral-800 px-16">
      <Formik
        initialValues={{
          name: '',
          join_code: '',
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Required'),
          join_code: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .min(5, 'Must be 5 digits')
            .max(5, 'Must be 5 digits'),
        })}
        onSubmit={values => {
          fetch('/api/campaigns', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          navigate('/campaigns', { replace: false });
        }}
      >
        <Form className=" flex aspect-video flex-col gap-5">
          <h1 className="col-span-5 col-start-1 text-center font-serif text-2xl font-bold text-white">
            New Campaign
          </h1>
          <div className="col-span-3 col-start-1 flex flex-col">
            <label htmlFor="name" className="row-start-2">
              Campaign Name
            </label>
            <Field name="name" type="text" className={fieldFormat} />
            <ErrorMessage
              name="name"
              render={msg => (
                <div className="pb-2 pt-0 text-xs text-red-600">{msg}</div>
              )}
            />
          </div>
          <div className="col-start-4 flex w-1/4 flex-col">
            <label htmlFor="image_url" className="row-start-2">
              Join Code (optional)
            </label>
            <Field name="join_code" type="text" className={fieldFormat} />
            <ErrorMessage
              name="join_code"
              render={msg => (
                <div className="pb-2 pt-0 text-xs text-red-600">{msg}</div>
              )}
            />
          </div>
          <button
            type="submit"
            className="col-start-5 mt-4 h-12 from-secondary to-transparent p-1 text-base font-semibold text-white outline transition-all hover:bg-gradient-to-t"
          >
            Create
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default NewCampaign;
