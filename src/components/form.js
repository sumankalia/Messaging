import React from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";

const options = [
  { label: "Inbox", value: "inbox" },
  { label: "Outbox", value: "outbox" },
];

const formSchema = Yup.object().shape({
  index: Yup.string().required("Required"),
  option: Yup.string().required("Required"),
  name: Yup.string().required("Required"),
  subject: Yup.string().required("Required"),
  message: Yup.string().required("Required"),
});

const MessagingForm = ({ handleSubmit }) => {
  return (
    <Formik
      initialValues={{
        index: "",
        option: "inbox",
        name: "",
        subject: "",
        message: "",
      }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({ values, handleSubmit }) => (
        <form className="mx-auto" onSubmit={handleSubmit}>
          <Field name="index">
            {({ field, form: { touched, errors }, meta }) => (
              <div>
                <label>Index</label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...field}
                />
                {meta.touched && meta.error && (
                  <div className="error ">{meta.error}</div>
                )}
              </div>
            )}
          </Field>

          <Field name="name">
            {({ field, form: { touched, errors }, meta }) => (
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...field}
                />
                {meta.touched && meta.error && (
                  <div className="error ">{meta.error}</div>
                )}
              </div>
            )}
          </Field>

          <Field type="select" name="option">
            {({ field, form, meta }) => (
              <div>
                <label>Option</label>
                <select {...field} className="form-control" name="option">
                  {options.map((payment) => (
                    <option key={payment?.value} value={payment?.value}>
                      {payment?.label}
                    </option>
                  ))}
                </select>

                {meta.touched && meta.error && (
                  <div className="error ">{meta.error}</div>
                )}
              </div>
            )}
          </Field>

          <Field name="subject">
            {({ field, form: { touched, errors }, meta }) => (
              <div>
                <label>Subject</label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...field}
                />
                {meta.touched && meta.error && (
                  <div className="error ">{meta.error}</div>
                )}
              </div>
            )}
          </Field>

          <Field name="message">
            {({ field, form: { touched, errors }, meta }) => (
              <div>
                <label>Message</label>
                <input
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...field}
                />
                {meta.touched && meta.error && (
                  <div className="error ">{meta.error}</div>
                )}
              </div>
            )}
          </Field>

          <button type="submit" className="btn btn-primary mt-2">
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
};

export default MessagingForm;
