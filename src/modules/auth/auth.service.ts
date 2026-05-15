import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './dto/auth-credentials.dto';
import { EUserRole } from 'src/common/types.common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(authCredentialsDto: RegisterUserDto): Promise<void> {
    const { username, password, role } = authCredentialsDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(salt);
    console.log(hashedPassword);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role: role ? (role as EUserRole) : EUserRole.USER,
    });

    await this.userRepository.save(user);
  }

  async login(authCredentialsDto: LoginUserDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('Success');
    } else {
      throw new UnauthorizedException('Please check your valid credentials!');
    }
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
