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
import { EActions } from '../../common/task-claims.enum';

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

    const userRole = role ? (role as EUserRole) : EUserRole.USER;
    const defaultClaims =
      userRole === EUserRole.ADMIN
        ? [EActions.CREATE, EActions.READ, EActions.UPDATE, EActions.DELETE]
        : [EActions.READ];

    const user = this.userRepository.create({
      name,
      username,
      password: hashedPassword,
      role: userRole,
      claims: defaultClaims,
    });

    await this.userRepository.save(user);
  }

  async login(
    authCredentialsDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Please check your valid credentials!');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Please check your valid credentials!');
    }

    let claims: EActions[];

    if (user.role === EUserRole.ADMIN) {
      claims = [
        EActions.CREATE,
        EActions.READ,
        EActions.UPDATE,
        EActions.DELETE,
      ];
    } else {
      claims = [EActions.READ];
    }

    const payload: JwtPayload = {
      username: user.username,
      role: user.role,
      sub: user.id,
      claims,
    };

    console.log('JWT Payload:', payload);

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
