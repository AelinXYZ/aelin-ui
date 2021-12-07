import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import BaseModal from "components/BaseModal";
import UploadCSV from 'components/UploadCSV';
import Input from "components/Input/Input";
import Button from "components/Button";

import { Privacy, initialWhitelistValues } from 'constants/pool';

import Trash from "assets/svg/trash.svg";

import { IWhitelistComponent, IWhitelist, IStyleProps } from './types';

const Whitelist: FC<IWhitelistComponent> = ({ isOpen, setOpen, formik }) => {
  const [hasAddreses, setHasAddreses] = useState<boolean>(false);

  useEffect(() => {
    setHasAddreses(() => 
      formik.values.whitelist.filter(({ address }: IWhitelist) => address.length).length
    );
  }, [formik.values.whitelist])

  const clearAddresses = () => {
    formik.setFieldValue("whitelist", initialWhitelistValues);
  };

  const handleAddRows = (): void => {
    const whitelist = [
      ...formik.values.whitelist,
      ...initialWhitelistValues,
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

  const handleClear = () => {
    clearAddresses();
    formik.setFieldValue("poolPrivacy", Privacy.PUBLIC);
    setOpen(!isOpen);
  };

  return (
    <>
      <BaseModal
        isModalOpen={isOpen}
        setIsModalOpen={(isOpen) => {
          setOpen(isOpen);
        }}
        title={`Whitelist Addresses`}
      >
        <hr />
        <Row>
          <Column align="center">
            <Button
              size='lg'
              variant='solid'
              onClick={handleAddRows}
            >
              +5 rows
            </Button>
          </Column>
          <Column align="center">
            <UploadCSV onUploadCSV={handleUploadCSV}/>
          </Column>
        </Row>
        <hr />
        <Row>
          <Column align="center">
            <Titles>Addresses</Titles>
          </Column>
          <Column align="center">
            <Titles>Amounts</Titles>
          </Column>
          <Column />
        </Row>
        <RowsContainer>
        {
          
          formik.values.whitelist.map((_: string, index: number) => {
            return (
              <Row key={`row-${index}`}>
                <Column>
                  <Input
                    type="text"
                    placeholder='0x...'
                    name={`whitelist.${index}.address`}
                    value={formik.values.whitelist[index].address}
                    onChange={formik.handleChange}
                  />
                </Column>
                <Column>
                  <Input
                    type="number"
                    name={`whitelist.${index}.amount`}
                    value={formik.values.whitelist[index].amount}
                    onChange={formik.handleChange}
                  />
                </Column>
                <Column>
                  <Pointer onClick={() => handleRemoveRow(index)}>
                    <Image src={Trash} alt="trash icon"/>
                  </Pointer>
                </Column>
              </Row>
            )
          })
        }
        </RowsContainer>
        <hr />
        <Row>
          <Column align="center">
            <StyledButton
              size='lg'
              variant='solid'
              onClick={handleClear}
            >
              Clear
            </StyledButton>
          </Column>
          <Column align="center">
            <StyledButton
              size='lg'
              variant='solid'
              onClick={() => setOpen(!isOpen)}
            >
              Save
            </StyledButton>
          </Column>
        </Row>
      </BaseModal>
      { !!hasAddreses && (
        <AllowedAddresses
        onClick={() => setOpen(true)}>
          Show allowed addresses
        </AllowedAddresses>
      )}
    </>
  );
};

const StyledButton = styled(Button)`
  background: #9e9e9e;
`;

const Pointer = styled.span`
  cursor: pointer;
`;

const AllowedAddresses = styled(Pointer)`
  margin-top: 8px;
  font-size: 12px;
`;

const RowsContainer = styled.div`
  max-height: 350px;
  overflow-y: auto;
`;

const Column = styled.div<IStyleProps>`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 2 auto;
  padding: 0 5px;
  align-items: ${props => props.align || 'flex-start'};
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 6px;
`;

const Titles = styled.p`
  text-align: center;
`;

export { Whitelist };
export default Whitelist;