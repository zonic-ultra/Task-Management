import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { classToPlain, TransformFnParams } from 'class-transformer';
import { EUserRole } from '../common/enums/enum.js';
import { ICustomRequest, IResponse } from './common.interface.js';
import { Response } from 'express';

export function transformDateToISOString({
  value,
}: TransformFnParams): unknown {
  const input = value as unknown;
  if (input == null) {
    return input;
  }

  let date: Date | null;
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'string' || typeof input === 'number') {
    date = new Date(input);
  } else {
    date = null;
  }

  if (date === null || Number.isNaN(date.getTime())) {
    return input;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function extractUser(
  req: ICustomRequest,
  dto?: { id?: unknown } | null,
) {
  const role = req?.claims?.role ?? req?.user?.role;
  const dtoId =
    dto && typeof dto === 'object' && 'id' in dto ? dto.id : undefined;
  const requestUserId = req?.claims?.id ?? req?.user?.id;
  const fallbackId = dtoId != null ? Number(dtoId) : requestUserId;

  if (role === EUserRole.ADMIN || role === EUserRole.PROJECT_MANAGER) {
    return { role, id: fallbackId != null ? Number(fallbackId) : null };
  } else if (role === EUserRole.MEMBER || role === EUserRole.VIEWER) {
    return { role, id: requestUserId != null ? Number(requestUserId) : null };
  }

  return { role, id: requestUserId != null ? Number(requestUserId) : null };
}

export function expressResponse(res: Response, data: IResponse) {
  const transformed = classToPlain(data.data);
  return res.status(data.code).json(transformed);
}

export function parseToDatabaseDate(input: string | null) {
  if (!input) return null;

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseToDatabaseTime(input: string | null) {
  if (!input) return null;

  const parts = input.split(':');

  if (parts.length !== 2) return null;

  const [hh, mm] = parts;

  const hours = Number(hh);

  const minutes = Number(mm);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  )
    return null;

  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:00`;
}

export function IsCustomTime(options?: ValidationOptions) {
  return function (object: object, name: string) {
    registerDecorator({
      name: 'isCustomTime',
      target: object.constructor,
      propertyName: name,
      options: options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
          const test = regex.test(value);

          return test;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time in HH:MM format`;
        },
      },
    });
  };
}

export function IsFutureDate(options?: ValidationOptions) {
  return function (object: object, name: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: name,
      options: options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const date = new Date(value);
          if (Number.isNaN(date.getTime())) {
            return false;
          }

          const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
          if (dateOnly) {
            const now = new Date();
            const todayUtc = Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
            );
            const valueUtc = Date.UTC(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
            );
            return valueUtc >= todayUtc;
          }

          return date.getTime() >= Date.now();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future or present date-time`;
        },
      },
    });
  };
}

export function IsCustomDate(options?: ValidationOptions) {
  return function (object: Object, name: string) {
    registerDecorator({
      name: 'isCustomDate',
      target: object.constructor,
      propertyName: name,
      options: options,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const regex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

          if (!regex.test(value)) {
            return false;
          }

          const [year, month, day] = value.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          const pass =
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day;

          return pass;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date in YYYY-MM-DD format`;
        },
      },
    });
  };
}

export function safeString(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function extractError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function safeParser<T>(value: unknown): T | null {
  if (typeof value !== 'string') {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
