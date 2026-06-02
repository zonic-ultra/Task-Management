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
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: RegisterUserDto): Promise<void> {
    const { name, username, password, role } = authCredentialsDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(salt);
    console.log(hashedPassword);

    const user = this.userRepository.create({
      name,
      username,
      password: hashedPassword,
      role: role ? (role as EUserRole) : EUserRole.USER,
    });

    await this.userRepository.save(user);
  }

  async login(
    authCredentialsDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your valid credentials!');
    }
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
