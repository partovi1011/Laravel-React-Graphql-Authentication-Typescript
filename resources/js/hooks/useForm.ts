// import { useState } from "react";

// interface useFormProps {
//     callback: ()=>{}
//     initialiseState: any
// }
// export const useForm = (callback, initialiseState): useFormProps => {
//     const [values, setValues]= useState(initialiseState)
//     const onChange = (event)=>{
//         setValues({...values, [event.target.name]: [event.target.value]})
//     }
//     const onSubmit = (event) => {
//         event.preventDefault();
//         callback()
//     }
//     return {
//         values,
//         onChange,
//         onSubmit
//     }
// }

import { useState } from "react";

export interface UseFormMethods<FormFields> {
  setFieldValue: (key: keyof FormFields, value: any) => void;
  setFieldsValue: React.Dispatch<React.SetStateAction<FormFields>>;
  getFieldValue: (key: keyof FormFields) => any;
  getFieldsValue: FormFields;
  getFieldProps: (
    key: keyof FormFields
  ) => {
    name: keyof FormFields;
    value: FormFields[keyof FormFields];
    onChange: (event: React.ChangeEvent<any>) => void;
  };
}

export function useForm<FormFields extends { [key: string]: any }>(
  initalValues: FormFields
): UseFormMethods<FormFields> {
  const [values, setValues] = useState<FormFields>(initalValues);

  const setFieldValue = (key: keyof FormFields, value: any) =>
    setValues({
      ...values,
      [key]: value
    });

  const getFieldValue = (key: keyof FormFields) => values[key];

  const getFieldProps = (key: keyof FormFields) => ({
    name: key,
    value: values[key],
    onChange: (event: React.ChangeEvent<any>) =>
      setFieldValue(event.target.name as keyof FormFields, event.target.value)
  });

  return {
    getFieldProps,
    getFieldValue,
    setFieldValue,
    getFieldsValue: values,
    setFieldsValue: setValues
  };
}