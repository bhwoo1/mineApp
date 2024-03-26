// import { signJwtAccessToken } from '@/app/lib/jwt';
// import prisma from '@/app/lib/prisma'
// import * as bcrypt from 'bcrypt'

// interface RequestBody {
//   username: string;
//   password: string;
// }

// export async function POST(request: Request) {
//   const body: RequestBody = await request.json()

//   const user = await prisma.user.findFirst({
//     where: {
//       email: body.username,
//     },
//   })

//   if (user && (await bcrypt.compare(body.password, user.password))) {
//     const { password, ...userWithoutPass } = user;

//     // 추가된 부분
//     const accessToken = signJwtAccessToken(userWithoutPass);
//     const result = {
//       ...userWithoutPass,
//       accessToken,
//     };
//     return new Response(JSON.stringify(userWithoutPass))
//   } else return new Response(JSON.stringify(null))
// }