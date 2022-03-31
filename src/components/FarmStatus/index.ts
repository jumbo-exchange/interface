import moment from 'moment';
import { IFarm } from 'store';

export const farmStatus = {
  created: 'Created',
  running: 'Running',
  ended: 'Ended',
  cleared: 'Cleared',
};

export enum FarmStatusEnum {
  'Active',
  'Pending',
  'Ended'
}

export const getFarmStatus = (
  status: string,
  dateStart: number,
) => {
  const toMilliseconds = dateStart * 1000;
  const currentDate = moment().valueOf();
  const startDate = moment(toMilliseconds).valueOf();

  if (status === farmStatus.ended) return FarmStatusEnum.Ended;

  if (startDate > currentDate) return FarmStatusEnum.Pending;
  if (currentDate > startDate && status === farmStatus.running) return FarmStatusEnum.Active;
  return FarmStatusEnum.Ended;
};

export const FarmStatusLocales = {
  [FarmStatusEnum.Active]: 'Active',
  [FarmStatusEnum.Pending]: 'Pending',
  [FarmStatusEnum.Ended]: 'Ended',
};

export const secondsToMilliseconds = (date: number) => date * 1000;

export const getFarmStartAndEnd = (farms: IFarm[]) => {
  const farmStart: number[] = [];
  const farmEnd: number[] = [];
  const timeToStart: number[] = [];
  const currentDate = moment().valueOf();

  if (farms.length !== 0) {
    farms.map((farm) => {
      if (farm.startAt === 0) return null;

      if (
        secondsToMilliseconds(farm.startAt) > currentDate
        && farm.status === FarmStatusEnum.Pending
      ) {
        timeToStart.push(farm.startAt);
        return null;
      }

      farmStart.push(farm.startAt);
      farmEnd.push(
        Number(farm.rewardPerSession) > 0
          ? moment(farm.startAt).valueOf()
          + (farm.sessionInterval * Number(farm.totalReward))
          / Number(farm.rewardPerSession)
          : 0,
      );
      return null;
    });
  }

  farmEnd.sort((a, b) => b - a);
  farmStart.sort((a, b) => b - a);
  timeToStart.sort((a, b) => b - a);

  return {
    farmStart: secondsToMilliseconds(farmStart[0]),
    farmEnd: secondsToMilliseconds(farmEnd[0]),
    timeToStart: secondsToMilliseconds(timeToStart[0]) - currentDate,
  };
};
