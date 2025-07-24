FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install pnpm -g --ignore-scripts 

RUN pnpm install --ignore-scripts

COPY . .

ENV DATABASE_URL=${DATABASE_URL}

RUN npx prisma generate

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run" ,"start"]