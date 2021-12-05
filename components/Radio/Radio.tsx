import {FC} from 'react';
import styled from 'styled-components';


interface IRadio {
  name: string;
  value: string;
  formik: any;
}

const Radio: FC<IRadio> = ({ name, value, formik }) => (
  <StyledLabel htmlFor={value}>
    <StyledRadio
      type="radio"
      name={name}
      value={value}
      checked={formik.values.poolPrivacy === value}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
    { value }
  </StyledLabel>
);

const StyledLabel = styled.label`
  position: relative;
  margin: 7.5px;
  cursor: pointer;
  text-transform: capitalize;
`;

const StyledRadio = styled.input`
  position: relative;
  margin: 0 14px 0 0;
  cursor: pointer;

  &:before {
    content: "";
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    background: #3F7923;
    border-radius: 50%;
  }

  &:checked {
    &:before {
      width: 14px;
      height: 14px;
    }
  }

  &:after {
    content: "";
    position: absolute;
    top: -3px;
    left: -3px;
    width: 16px;
    height: 16px;
    background: #fff;
    border: 2px solid #f2f2f2;
    border-radius: 50%;
  }
`;

export { Radio };
export default Radio;