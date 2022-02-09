import { Contract } from 'ethers';

export type StakingContracts = {
	StakingContract: Contract;
	TokenContract: Contract;
};

export type vAelinConverterContracts = {
	VAelinTokenContract: Contract;
	VAelinConverterContract: Contract;
};
