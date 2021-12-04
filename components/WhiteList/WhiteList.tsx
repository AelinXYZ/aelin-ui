import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import BaseModal from "components/BaseModal";
import UploadCSV from 'components/UploadCSV';
import Input from "components/Input/Input";
import Button from "components/Button";

import Trash from "assets/svg/trash.svg";

import {IWhiteListComponent, IWhitelist, IStyleProps} from './types';

const WhiteList: FC<IWhiteListComponent> = ({ isOpen, setOpen, formik }) => {
  if (!isOpen) return null;

  const handleAddRows = (): void => {
    const whitelist = [
      ...formik.values.whitelist,
      ...new Array(5).fill(
        {
          address: '',
          amount: null
        }
      )
    ];

    formik.setFieldValue("whitelist", whitelist);
  };

  const handleRemoveRow = (index: number): void => {
    const whitelist = formik.values.whitelist.filter((_, idx: number) => index !== idx);

    formik.setFieldValue("whitelist", whitelist);
  };

  const handleUploadCSV = (whitelist: IWhitelist[]) => {
    formik.setFieldValue("whitelist", [...whitelist]);
  };

  return (
    <BaseModal
      isModalOpen={isOpen}
      setIsModalOpen={(isOpen) => setOpen(isOpen)}
      title={`Whitelist Addresses`}
    >
      <StyledRow>
        <StyledColumn align="center">
          <StyledTitles>Addresses</StyledTitles>
        </StyledColumn>
        <StyledColumn align="center">
          <StyledTitles>Amounts</StyledTitles>
        </StyledColumn>
        <StyledColumn />
      </StyledRow>
      <StyledRowsContainer>
      {
        
        formik.values.whitelist.map((_: string, index: number) => {
          return (
            <StyledRow>
              <StyledColumn>
                <Input
                  type="text"
                  placeholder='0x...'
                  name={`whitelist.${index}.address`}
                  value={formik.values.whitelist[index].address}
                  onChange={formik.handleChange}
                />
              </StyledColumn>
              <StyledColumn>
                <Input
                  type="number"
                  name={`whitelist.${index}.amount`}
                  value={formik.values.whitelist[index].amount}
                  onChange={formik.handleChange}
                />
              </StyledColumn>
              <StyledColumn>
                <Pointer onClick={() => handleRemoveRow(index)}>
                  <Image src={Trash} alt="trash icon"/>
                </Pointer>
              </StyledColumn>
            </StyledRow>
          )
        })
      }
      </StyledRowsContainer>
      <hr />
      <StyledRow>
        <StyledColumn align="center">
          <StyledButton
            size='lg'
            variant='solid'
            onClick={handleAddRows}
          >
            +5 rows
          </StyledButton>
        </StyledColumn>
        <StyledColumn align="center">
          <UploadCSV onUploadCSV={handleUploadCSV}/>
        </StyledColumn>
      </StyledRow>
      <hr />
      <StyledRow>
        <StyledColumn align="center">
          <StyledButton
            size='lg'
            variant='solid'
          >
            Save
          </StyledButton>
        </StyledColumn>
      </StyledRow>
    </BaseModal>
  );
};

const StyledButton = styled(Button)`
  background: #9e9e9e;
`;

const Pointer = styled.span`
  cursor: pointer;
`;

const StyledRowsContainer = styled.div`
  max-height: 350px;
  overflow-y: auto;
`;

const StyledColumn = styled.div<IStyleProps>`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 2 auto;
  padding: 0 5px;
  align-items: ${props => props.align || 'flex-start'};
  justify-content: center;
`;

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 6px;
`;

const StyledTitles = styled.p`
  text-align: center;
`;

export { WhiteList };
export default WhiteList;