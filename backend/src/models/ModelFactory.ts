import { User } from './user';

export default class ModelFactory {
  static parse(type: string, dao: any): any {
    switch (type) {
      case 'User':
        return User.parse(dao);
    }
  }
}
