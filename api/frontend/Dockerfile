FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN printf 'export default function Loading() { return null; }\n' > src/app/login/loading.tsx

RUN npm run build

EXPOSE 3002

CMD ["npm", "start"]
