import moment from 'moment';
import { IFarm } from 'store';
import i18n from 'i18n';
import Big from 'big.js';
import { secondsToMilliseconds } from 'utils/calculations';

export enum farmStatus {
  created = 'Created',
  running = 'Running',
  ended = 'Ended',
}

export enum FarmStatusEnum {
  'Active',
  'Pending',
  'Ended'
}

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
export const FarmStatusLocalesInPool = {
  [FarmStatusEnum.Active]: i18n.t('farm.status.available'),
  [FarmStatusEnum.Pending]: i18n.t('farm.status.pending'),
  [FarmStatusEnum.Ended]: '',
};
export const FarmStatusLocalesInYourPool = {
  [FarmStatusEnum.Active]: i18n.t('farm.status.started'),
  [FarmStatusEnum.Pending]: i18n.t('farm.status.soon'),
  [FarmStatusEnum.Ended]: '',
};

interface IGetAvailableTimestamp {
  farmStart: number,
  farmEnd: number,
  timeToStart: number,
  status: FarmStatusEnum,
}

// TODO: Refactor
export const getAvailableTimestamp = (farms: IFarm[]): IGetAvailableTimestamp => {
  const farmStarts: number[] = [];
  const farmEnds: number[] = [];
  const timeToStarts: number[] = [];
  let status: FarmStatusEnum = FarmStatusEnum.Ended;
  const currentDate = moment().valueOf();

  if (farms.length !== 0) {
    farms.forEach((farm) => {
      if (farm.startAt !== 0) {
        farmStarts.push(farm.startAt);
        farmEnds.push(
          Big(farm.rewardPerSession).gt(0)
            ? moment(farm.startAt).valueOf()
          + (farm.sessionInterval * Number(farm.totalReward))
          / Number(farm.rewardPerSession)
            : 0,
        );

        if (
          secondsToMilliseconds(farm.startAt) > currentDate
        && farm.status === FarmStatusEnum.Pending
        ) {
          timeToStarts.push(farm.startAt);
        }
      }
    });
  }

  farmEnds.sort((a, b) => b - a);
  farmStarts.sort((a, b) => b - a);
  timeToStarts.sort((a, b) => b - a);

  const farmStart = secondsToMilliseconds(farmStarts[0]);
  const farmEnd = secondsToMilliseconds(farmEnds[0]);
  const timeToStart = secondsToMilliseconds(timeToStarts[0]);

  if (farmStart > currentDate) status = FarmStatusEnum.Pending;
  if (currentDate > farmStart && currentDate < farmEnd) status = FarmStatusEnum.Active;
  return {
    farmStart,
    farmEnd,
    timeToStart,
    status,
  };
};
