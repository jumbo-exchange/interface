import moment from 'moment';
import { IFarm } from 'store';
import i18n from 'i18n';
import Big from 'big.js';

export const enum farmStatus {
  created = 'Created',
  running = 'Running',
  ended = 'Ended',
  cleared = 'Cleared',
}

export enum FarmStatusEnum {
  'Active',
  'Pending',
  'Ended'
}

export const secondsToMilliseconds = (date: number): number => date * 1000;

export const getFarmStatus = (
  status: string,
  dateStart: number,
): FarmStatusEnum => {
  const currentDate = moment().valueOf();
  const startDate = moment(secondsToMilliseconds(dateStart)).valueOf();

  if (status === farmStatus.ended) return FarmStatusEnum.Ended;

  if (startDate > currentDate) return FarmStatusEnum.Pending;
  if (currentDate > startDate && status === farmStatus.running) return FarmStatusEnum.Active;
  return FarmStatusEnum.Ended;
};

export const FarmStatusLocales = {
  [FarmStatusEnum.Active]: i18n.t('farm.status.active'),
  [FarmStatusEnum.Pending]: i18n.t('farm.status.pending'),
  [FarmStatusEnum.Ended]: i18n.t('farm.status.ended'),
};

// TODO: Refactor
export const getFarmStartAndEnd = (farms: IFarm[]): {[key: string]: number} => {
  const farmStarts: number[] = [];
  const farmEnds: number[] = [];
  const timeToStarts: number[] = [];
  const currentDate = moment().valueOf();

  if (farms.length !== 0) {
    farms.map((farm) => {
      if (farm.startAt === 0) return null;

      if (
        secondsToMilliseconds(farm.startAt) > currentDate
        && farm.status === FarmStatusEnum.Pending
      ) {
        timeToStarts.push(farm.startAt);
        return null;
      }

      farmStarts.push(farm.startAt);
      farmEnds.push(
        Big(farm.rewardPerSession).gt(0)
          ? moment(farm.startAt).valueOf()
          + (farm.sessionInterval * Number(farm.totalReward))
          / Number(farm.rewardPerSession)
          : 0,
      );
      return null;
    });
  }

  farmEnds.sort((a, b) => b - a);
  farmStarts.sort((a, b) => b - a);
  timeToStarts.sort((a, b) => b - a);

  return {
    farmStart: secondsToMilliseconds(farmStarts[0]),
    farmEnd: secondsToMilliseconds(farmEnds[0]),
    timeToStart: secondsToMilliseconds(timeToStarts[0]) - currentDate,
  };
};
