import { Transaction as Tx } from 'ethereumjs-tx';
import { addHexPrefix, stripHexPrefix } from 'ethereumjs-util';
import { bigNumberify, formatEther } from 'ethers/utils';
import prop from 'ramda/src/prop';
import BigNumber from 'bignumber.js';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import { ITransaction, IHexStrTransaction } from '@types';
import { bigify } from '@utils';

import { gasPriceToBase, toTokenBase, fromWei, toWei, Wei } from './units';
import { hexEncodeQuantity } from './hexEncode';

export const makeTransaction = (
  t: Partial<Tx> | Partial<ITransaction> | Partial<IHexStrTransaction> | Buffer | string
) => {
  if (prop('chainId') !== undefined) {
    // @ts-ignore
    return new Tx(t, { chain: t.chainId });
  } else {
    return new Tx(t);
  }
};

/* region:start User Input to Hex */
export const inputGasPriceToHex = (gasPriceGwei: string): string /* Converts to wei from gwei */ =>
  addHexPrefix(gasPriceToBase(parseFloat(gasPriceGwei)).toString(16));

export const inputGasLimitToHex = (gasLimit: string): string =>
  bigNumberify(gasLimit).toHexString();

export const inputValueToHex = (valueEther: string): string =>
  hexEncodeQuantity(toTokenBase(valueEther, DEFAULT_ASSET_DECIMAL));

export const inputNonceToHex = (nonce: string): string =>
  addHexPrefix(parseInt(nonce, 10).toString(16));
/* region:end User Input to Hex */

/* region:start Hex to User Viewable */
export const hexValueToViewableWei = (valueWeiHex: string): string =>
  bigNumberify(valueWeiHex).toString();

export const hexValueToViewableEther = (valueWeiHex: string): string =>
  formatEther(hexValueToViewableWei(valueWeiHex));

export const hexNonceToViewable = (nonceHex: string): string => hexToString(nonceHex);

export const hexToString = (hexValue: string): string =>
  parseInt(stripHexPrefix(hexValue), 16).toString();

export const hexWeiToString = (hexWeiValue: string): string => Wei(hexWeiValue).toString();
/* region:end Hex to User Viewable */

/* region:start BigNum to User Viewable */
export const bigNumGasPriceToViewableWei = (
  gasPriceWeiBigNum: BigNumber
): string /* Converts to wei from gwei */ =>
  toWei(bigify(gasPriceWeiBigNum).toString(), 0).toString();

export const bigNumGasPriceToViewableGwei = (
  gasPriceWeiBigNum: BigNumber | string
): string /* Converts to wei from gwei */ =>
  fromWei(toWei(bigify(gasPriceWeiBigNum).toString(), 0), 'gwei');

export const bigNumGasLimitToViewable = (gasLimitBigNum: BigNumber | string): string =>
  bigify(gasLimitBigNum).toString();

export const bigNumValueToViewableEther = (valueWeiBigNum: BigNumber | string): string =>
  formatEther(bigNumberify(valueWeiBigNum.toString()));

export const bigNumValueToViewableWei = (valueWeiBigNum: BigNumber): string =>
  bigify(valueWeiBigNum).toString();
/* region:end BigNum to User Viewable */
